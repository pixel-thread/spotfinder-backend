import { HeroUIProvider } from '@heroui/system';
import { AuthProvider } from './auth';
import { ThemeProvider } from 'next-themes';
import { TQueryProvider } from './query';
import { CookiesProvider } from 'react-cookie';
type MainProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};
export const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <CookiesProvider>
      <TQueryProvider>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </HeroUIProvider>
      </TQueryProvider>
    </CookiesProvider>
  );
};
