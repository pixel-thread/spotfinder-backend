import { HeroUIProvider } from '@heroui/system';
import { AuthProvider } from './auth';
import { ThemeProvider } from 'next-themes';
type MainProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};
export const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
};
