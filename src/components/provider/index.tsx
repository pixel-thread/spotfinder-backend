import { AuthProvider } from './auth';
import { ThemeProvider } from 'next-themes';
import { TQueryProvider } from './query';
import { CookiesProvider } from 'react-cookie';
import { RoleBaseRoute } from '../protectedRoute/protectedRoute';
import { Toaster } from '../ui/sonner';
type MainProviderProps = {
  children: Readonly<Required<React.ReactNode>>;
};
export const MainProvider = ({ children }: MainProviderProps) => {
  return (
    <CookiesProvider>
      <TQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <RoleBaseRoute>
              {children}
              <Toaster />
            </RoleBaseRoute>
          </AuthProvider>
        </ThemeProvider>
      </TQueryProvider>
    </CookiesProvider>
  );
};
