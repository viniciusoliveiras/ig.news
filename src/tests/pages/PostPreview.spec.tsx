import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const posts = {
  slug: 'new-post',
  title: 'New Post',
  content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
  updateAt: 'July, 10',
};

describe('Post preview page', () => {
  it('RENDERS CORRECTLY', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={posts} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('REDIRECTS USER TO FULL POST WHEN USER IS SUBSCRIBED', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={posts} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/new-post');
  });

  it('LOADS INITIAL DATA', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
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
      }),
    } as any);

    const response = await getStaticProps({ params: { slug: 'new-post' } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'new-post',
            title: 'New Post',
            content:
              '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
            updateAt: '10 de julho de 2021',
          },
        },
      })
    );
  });
});
