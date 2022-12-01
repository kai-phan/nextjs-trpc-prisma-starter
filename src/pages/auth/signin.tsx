import React from "react";

import {
	Avatar,
	Box,
	Button,
	Center,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { NextPage, NextPageContext } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import logger from "~/utils/logger";

interface Provider {
	id: string;
	name: string;
}

type Providers = Provider[];

interface SignInProps {
	providers: Providers;
	csrfToken: string;
}

export async function getServerSideProps(context: NextPageContext) {
	return {
		props: {
			providers: await getProviders(),
			csrfToken: await getCsrfToken(context),
		},
	};
}

function Signin({ providers, csrfToken }: SignInProps) {
	const { handleSubmit } = useForm();

	return (
		<Center width="100vw" height="100vh">
			<Box
				maxW={"320px"}
				w={"full"}
				bg={useColorModeValue("white", "gray.900")}
				boxShadow={"2xl"}
				rounded={"lg"}
				p={6}
				textAlign={"center"}
			>
				<Avatar
					size={"xl"}
					src={"/images/cosmicoctopus.jpeg"}
					mb={4}
					pos={"relative"}
					_after={{
						content: '""',
						w: 4,
						h: 4,
						bg: "green.300",
						border: "2px solid white",
						rounded: "full",
						pos: "absolute",
						bottom: 0,
						right: 3,
					}}
				/>
				<Heading fontSize={"2xl"} fontFamily={"body"}></Heading>
				<Text fontWeight={600} color={"gray.500"} mb={4}>
					Sign in or register
				</Text>
				<Stack mt={4} direction={"column"} spacing={4}>
					<form
						method="post"
						action="/api/auth/signin/email"
						// TODO Finish implementing email sign in
						onSubmit={handleSubmit(logger.info)}
					>
						<Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
						<FormLabel>
							Email address
							<Input type="email" id="email" name="email" />
						</FormLabel>
					</form>
					{providers &&
						Object.values(providers).map((provider) => (
							<Button key={provider.id} onClick={() => signIn(provider.id)}>
								Sign in with {provider.name}
							</Button>
						))}
				</Stack>
			</Box>
		</Center>
	);
}

Signin.getLayout = (page: NextPage) => <>{page}</>;
export default Signin;
