import { Role } from '@prisma/client';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React from 'react';
import { DefaultPage } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const PostViewPage: DefaultPage = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(['post.byId', { id }]);

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return (
    <div style={{ overflow: 'scroll' }}>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
};

PostViewPage.auth = true;
PostViewPage.roles = [Role.USER];
export default PostViewPage;
