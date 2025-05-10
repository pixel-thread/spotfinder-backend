'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import http from '@/utils/http';
import { toast } from 'sonner';
import { Cookies } from 'react-cookie';
import { AUTH_TOKEN_KEY } from '@/lib/constants/token';
import { useAuth } from '@/hooks/auth/useAuth';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '@/utils/validation/auth';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_ENDPOINT } from '@/lib/constants/endpoints/auth';
type LoginStatus = 'phone' | 'otp';
type InitLoginFormValue = { phone: string };
type LoginFormValue = { phone: string; otp: string };
const cookies = new Cookies();
export const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const { refresh } = useAuth();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('phone');
  const router = useRouter();
  const search = useSearchParams();
  const phone = search.get('phone') || '';

  const initForm = useForm<InitLoginFormValue>({
    resolver: zodResolver(authSchema.pick({ phone: true })),
    defaultValues: { phone: '' },
  });

  const watchPhoneNo = useWatch({ control: initForm.control, name: 'phone' });

  const loginForm = useForm<LoginFormValue>({
    resolver: zodResolver(authSchema),
    defaultValues: { phone: phone, otp: '' },
  });

  const { mutate: sendOtp, isPending: sendingOtp } = useMutation({
    mutationFn: (data: InitLoginFormValue) => http.post(AUTH_ENDPOINT.POST_LOGIN_INIT, data),
    onSuccess: (data) => {
      if (data.success) {
        toast(data.message);
        setLoginStatus('otp');
        loginForm.setValue('phone', initForm.getValues('phone'));
        router.push(`?phone=${loginForm.getValues('phone')}`);
      }
      toast(data.message);
      return data;
    },
  });

  const { mutate: verifyOtp, isPending: verifyingOtp } = useMutation({
    mutationFn: (data: LoginFormValue) => http.post(AUTH_ENDPOINT.POST_LOGIN, data),
    onSuccess: (data) => {
      if (data.success) {
        toast(data.message);
        cookies.set(AUTH_TOKEN_KEY, data.token, { path: '/' });
        refresh();
      }
      toast(data.message);
    },
  });

  const onSubmit: SubmitHandler<LoginFormValue> = (data) => verifyOtp(data);

  const onSubmitInit: SubmitHandler<InitLoginFormValue> = (data) => sendOtp(data);

  useEffect(() => {
    if (watchPhoneNo !== phone && loginStatus === 'otp') {
      setLoginStatus('phone');
    }
  }, [watchPhoneNo, phone, loginStatus]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {loginStatus === 'phone'
            ? 'Enter your phone number to receive an OTP'
            : 'Enter the OTP sent to your phone'}
        </p>
      </div>
      <div className="grid gap-6">
        {loginStatus === 'phone' && (
          <Form {...initForm}>
            <form className="grid gap-4" onSubmit={initForm.handleSubmit(onSubmitInit)}>
              <FormField
                control={initForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g. 1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={sendingOtp}>
                {sendingOtp ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          </Form>
        )}
        {loginStatus === 'otp' && (
          <Form {...loginForm}>
            <form className="grid gap-4" onSubmit={loginForm.handleSubmit(onSubmit)}>
              <FormField
                control={loginForm.control}
                name="phone"
                defaultValue={phone}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="text" maxLength={10} placeholder="e.g. 1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input type="text" maxLength={5} placeholder="Enter OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={verifyingOtp}>
                {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
