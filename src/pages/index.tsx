/**
 *
 * Index page
 *
 */
import React from "react";

import { DefaultPage } from "./_app";
import { Stack, Text } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";

const Index: DefaultPage = () => {
	return (
		<Stack gap={2}>
			<Head>
				<title>Home</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Text fontSize="4xl">Home</Text>
			<Link href="/" passHref>
				Home
			</Link>
			<Link href="/posts" passHref>
				Posts
			</Link>
		</Stack>
	);
};

Index.auth = true;
Index.roles = [Role.USER];
export default Index;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
