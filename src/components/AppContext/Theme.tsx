import { GlobalStyle, ChakraProvider as Provider } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { theme } from '~/theme';

export default function ChakraProvider({ children }: PropsWithChildren) {
  return (
    <Provider theme={theme}>
      <GlobalStyle />
      {children}
    </Provider>
  );
}
