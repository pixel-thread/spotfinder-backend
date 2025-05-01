import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
const queryOptions: QueryClientConfig = {
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
};
export const TQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient(queryOptions);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
