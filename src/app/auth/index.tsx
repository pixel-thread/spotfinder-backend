// import { useAuth } from '@/hooks/auth/useAuth';
// import { AUTH_ENDPOINT } from '@/lib/constants/endpoints/auth';
// import { AUTH_TOKEN_KEY } from '@/lib/constants/token';
// import http from '@/utils/http';
// import { useMutation } from '@tanstack/react-query';
// import { useCookies } from 'react-cookie';
// type InitLogin = {
//   data: {
//     phone: string;
//   };
// };

// type VerifyOtp = {
//   data: {
//     phone: string;
//     otp: string;
//   };
// };
const LoginPage = () => {
  // const { refresh } = useAuth();
  // const [cookies, setCookie, removeCookie] = useCookies([AUTH_TOKEN_KEY]);

  // const { mutate: initLogin, isPending: isLoadingInitLogin } = useMutation({
  //   mutationFn: ({ data }: InitLogin) => http.post(AUTH_ENDPOINT.POST_LOGIN_INIT, data),
  // });

  // // eslint-ignore-nextline
  // const { mutate: verifyOtp, isPending: isLoadingOtp } = useMutation({
  //   mutationFn: ({ data }: VerifyOtp) => http.post(AUTH_ENDPOINT.POST_LOGIN, data),
  //   onSuccess: (data) => {
  //     if (data.success) {
  //       if (cookies.AuthToken) {
  //         removeCookie(AUTH_TOKEN_KEY);
  //         setCookie(AUTH_TOKEN_KEY, data.token, { path: '/' });
  //         refresh();
  //         return data;
  //       }
  //       setCookie(AUTH_TOKEN_KEY, data.token, { path: '/' });
  //       return data;
  //     }
  //   },
  // });

  return (
    <div className={''}>
      <h1>Auth</h1>
    </div>
  );
};
export default LoginPage;
