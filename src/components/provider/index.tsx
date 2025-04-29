import { HeroUIProvider } from '@heroui/system';
import { AuthProvider } from './auth';
type MainProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};
export const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <HeroUIProvider>
      <AuthProvider>{children}</AuthProvider>
    </HeroUIProvider>
  );
};
