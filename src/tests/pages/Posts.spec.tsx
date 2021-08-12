import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'new-post',
    title: 'New Post',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updateAt: 'July, 10',
  },
];

describe('Posts page', () => {
  it('RENDERS CORRECTLY', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      )
    ).toBeInTheDocument();
  });

  it('LOADS INITIAL DATA', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'new-post',
            data: {
              title: [{ type: 'heading', text: 'New Post' }],
              content: [
                {
                  type: 'paragraph',
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
              ],
            },
            last_publication_date: '07-10-2021',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'new-post',
              title: 'New Post',
              excerpt:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              updateAt: '10 de julho de 2021',
            },
          ],
        },
      })
    );
  });
});
