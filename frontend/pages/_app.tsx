import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.styles.css";

const queryClient = new QueryClient();

const theme = extendTheme({
  components: {
    Steps,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />;
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
