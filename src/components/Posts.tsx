import { Form } from './Form';
import { DeleteIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  ButtonGroup,
  Modal as ChakraModal,
  Flex,
  Heading,
  Icon,
  IconButton,
  IconButtonProps,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { MdArchive, MdPerson } from 'react-icons/md';
import { FormattedDate } from 'react-intl';
import logger from '~/utils/logger';
import { trpc } from '~/utils/trpc';

const postsByUser = 'post.byUser';

export type Post = {
  id: string;
  userId: string;
  title: string;
  text: string;
  user: {
    image: string | null;
    name: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
};

interface PostsFormProps extends Pick<IconButtonProps, 'icon'> {
  post?: Post;
  mode: 'edit' | 'add' | 'delete' | 'archive' | 'unarchive';
  label?: string;
}

export const PostsForm = ({ post, mode, icon, label }: PostsFormProps) => {
  const utils = trpc.useContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries([postsByUser]);
    },
  });

  const editPost = trpc.useMutation('post.edit', {
    async onSuccess() {
      // refetches posts after a post is edited
      await utils.invalidateQueries([postsByUser]);
    },
  });

  const deletePost = trpc.useMutation('post.delete', {
    async onSuccess() {
      // refetches posts after a post is deleted
      await utils.invalidateQueries([postsByUser]);
    },
  });

  const archivePost = trpc.useMutation('post.archive', {
    async onSuccess() {
      // refetches posts after a post is archived
      await utils.invalidateQueries([postsByUser]);
    },
  });

  const unarchivePost = trpc.useMutation('post.unarchive', {
    async onSuccess() {
      // refetches posts after a post is unarchived
      await utils.invalidateQueries([postsByUser]);
    },
  });

  const session = useSession();

  const userId = session.data?.userId;

  const toast = useToast();

  const middlebit = () => {
    switch (mode) {
      case 'add':
        return (
          userId && (
            <Form
              onSubmit={async (submitValues) => {
                addPost
                  .mutateAsync({
                    ...submitValues,
                    userId: userId,
                  })
                  .then(() => {
                    onClose();
                    toast({
                      title: 'Posted!',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error);
              }}
            />
          )
        );
      case 'edit':
        return (
          userId &&
          post &&
          post.id && (
            <Form
              formData={post}
              onSubmit={async (submitValues) => {
                editPost
                  .mutateAsync({
                    userId: userId,
                    id: post.id,
                    data: submitValues,
                  })
                  .then(() => {
                    onClose();
                    toast({
                      title: 'Updated!',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error);
              }}
            />
          )
        );
      case 'delete':
        return (
          post && (
            <Button
              onClick={() =>
                deletePost.mutateAsync({ id: post.id }).then(() => {
                  onClose();
                  toast({
                    title: 'Deleted!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                })
              }
            >
              Delete post titled: {post?.title} ?
            </Button>
          )
        );
      case 'archive':
        return (
          post && (
            <Button
              onClick={() =>
                archivePost
                  .mutateAsync({ id: post.id })
                  .then(() => {
                    onClose();
                    toast({
                      title: 'Archived!',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error)
              }
            >
              Archive post titled: {post?.title} ?
            </Button>
          )
        );
      case 'unarchive':
        return (
          post && (
            <Button
              onClick={() =>
                unarchivePost
                  .mutateAsync({ id: post.id })
                  .then(() => {
                    onClose();
                    toast({
                      title: 'Unarchived!',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  })
                  .catch(logger.error)
              }
            >
              Unarchive post titled: {post?.title} ?
            </Button>
          )
        );
      default:
        return <Text>Something went wrong...</Text>;
    }
  };

  return (
    <>
      {label && (
        <Button maxWidth="max-content" onClick={onOpen} size="sm">
          {label}
        </Button>
      )}
      {icon && (
        <IconButton
          aria-label=""
          maxWidth="max-content"
          icon={icon}
          onClick={onOpen}
          size="sm"
        />
      )}
      <ChakraModal isOpen={isOpen} onClose={onClose} isCentered variant="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {label}
            {icon}
          </ModalHeader>
          <ModalCloseButton mt="8px" />
          {middlebit()}
        </ModalContent>
      </ChakraModal>
    </>
  );
};

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Stack
      maxWidth="max-content"
      boxShadow="2xl"
      border="1px solid rgba(0, 0, 0,0.1)"
      rounded="md"
      p="8px"
      opacity={post.archived ? 0.1 : 1}
    >
      <Heading fontSize={'2xl'} fontFamily={'body'}>
        {post.title}
      </Heading>
      <Suspense fallback={<Skeleton height={300} isLoaded={!!post} />}>
        <Text padding="16px 8px">{post.text}</Text>
      </Suspense>
      <Flex
        mt={2}
        direction={['column', 'row']}
        gap={2}
        width="100%"
        align={'center'}
        justifyContent="space-between"
      >
        <Stack direction={'row'} alignItems={'center'} width="100%">
          <Avatar
            size="sm"
            src={post.user.image || undefined}
            icon={<Icon as={MdPerson} w={8} h={8} />}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>{post.user.name}</Text>
            <Text color={'gray.500'}>
              <FormattedDate value={post.createdAt} />
            </Text>
          </Stack>
        </Stack>
        <ButtonGroup width="100%" gap="4px">
          <Link href={`/post/${post.id}`}>
            <IconButton
              aria-label={'Go to post'}
              icon={<ExternalLinkIcon />}
              size="sm"
            />
          </Link>
          {post.archived ? (
            <PostsForm mode="unarchive" post={post} icon={<MdArchive />} />
          ) : (
            <PostsForm mode="archive" post={post} icon={<MdArchive />} />
          )}
          <PostsForm mode="delete" post={post} icon={<DeleteIcon />} />
          <PostsForm mode="edit" post={post} icon={<EditIcon />} />
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};
