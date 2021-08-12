import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const posts = {
  slug: 'new-post',
  title: 'New Post',
  content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
  updateAt: 'July, 10',
};

describe('Posts page', () => {
  it('RENDERS CORRECTLY', () => {
    render(<Post post={posts} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      )
    ).toBeInTheDocument();
  });

  it('REDIRECTS USER IF DOES NOT HAVE AN ACTIVE SUBSCRIPTION', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: {
        slug: 'new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      })
    );
  });

  it('LOADS INITIAL DATA', async () => {
    const getSessionMocked = mocked(getSession);
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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: 'new-post',
      },
    } as any);

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
