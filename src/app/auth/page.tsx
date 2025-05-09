'use client';
import { authSchema } from '@/utils/validation/auth';
import React, { useState } from 'react';
import { Controller, SubmitErrorHandler, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import http from '@/utils/http';
import { AUTH_ENDPOINT } from '@/lib/constants/endpoints/auth';

type LoginFormInputs = {
  phone: string;
};

type OtpFormInputs = {
  otp: string;
  phone: string;
};

const LoginPage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  // Phone form
  const {
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
    control: registerPhoneController,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(authSchema.pick({ phone: true })),
    mode: 'onChange',
    defaultValues: {
      phone: '',
    },
  });

  const phoneNoWatch = useWatch({ control: registerPhoneController, name: 'phone' });

  // OTP form
  const {
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    setValue: setOtpValue,
  } = useForm<OtpFormInputs>({
    resolver: zodResolver(authSchema),
    mode: 'onChange',
    defaultValues: {
      otp: '',
      phone: phoneNoWatch,
    },
  });

  // Send OTP mutation
  const { mutate: onMutatePhone, isPending: isSendingOtp } = useMutation({
    mutationFn: (data: LoginFormInputs) => http.post<null>(AUTH_ENDPOINT.POST_LOGIN_INIT, data),
    onSuccess: (data) => {
      if (data.success) {
        setStep('otp');
        setOtpValue('phone', phoneNoWatch);
        return data.data;
      }
      return data;
    },
  });

  // Verify OTP mutation
  const { mutate: onMutateOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: ({ data }: { data: OtpFormInputs }) =>
      http.post<null>(AUTH_ENDPOINT.POST_LOGIN, data),
    onSuccess: (data) => {
      if (data.success) {
        // TODO: Redirect or update auth state here
        return data.data;
      }

      return data;
    },
  });

  const onSubmitPhone: SubmitErrorHandler<LoginFormInputs> = async (data) => {
    setLoading(true);

    onMutatePhone(data);
    setLoading(false);
  };

  const onSubmitOtp: SubmitErrorHandler<OtpFormInputs> = async (data) => {
    setLoading(true);

    onMutateOtp({ data });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <h1 className="mb-2 text-3xl font-extrabold text-indigo-700 tracking-tight text-center">
          Welcome Back
        </h1>
        <p className="mb-6 text-gray-500 text-center text-base">
          Sign in to your Super Admin account to manage parking lots, users, and more.
        </p>
        <div className="w-full flex items-center mb-8">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-xs uppercase tracking-widest">Login</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        {step === 'phone' && (
          <form onSubmit={handleSubmitPhone(onSubmitPhone)} className="w-full space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                {/* <PhoneIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                <Controller
                  control={registerPhoneController}
                  name="phone"
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className={`pl-4 pr-3 py-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg transition ${phoneErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your phone"
                      disabled={loading || isSendingOtp}
                    />
                  )}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                We’ll send a one-time password (OTP) to your phone number.
              </p>
              {phoneErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{phoneErrors.phone.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-3 px-4 text-white font-semibold hover:bg-indigo-700 transition text-lg shadow"
              disabled={loading || isSendingOtp}
            >
              {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="w-full space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <div className="relative">
                {/* <KeyIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                <input
                  type="text"
                  className={`pl-4 pr-3 py-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg transition ${otpErrors.otp ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter OTP"
                  disabled={loading || isVerifyingOtp}
                  {...registerOtp('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: 'Enter a valid 5-digit OTP',
                    },
                  })}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Enter the 5-digit code sent to <span className="font-semibold">{phoneNoWatch}</span>
                .
              </p>
              {otpErrors.otp && (
                <p className="mt-1 text-xs text-red-600">{otpErrors.otp.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-3 px-4 text-white font-semibold hover:bg-indigo-700 transition text-lg shadow"
              disabled={loading || isVerifyingOtp}
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              className="w-full mt-2 rounded-lg bg-gray-100 py-3 px-4 text-gray-700 font-semibold hover:bg-gray-200 transition text-lg"
              onClick={() => {
                setStep('phone');
                setError('');
                setSuccessMsg('');
              }}
              disabled={loading || isVerifyingOtp}
            >
              Back
            </button>
          </form>
        )}
        {successMsg && (
          <div className="mt-6 text-center text-green-600 font-medium">{successMsg}</div>
        )}
        {error && <div className="mt-6 text-center text-red-600 font-medium">{error}</div>}
        <div className="mt-8 text-gray-400 text-xs text-center">
          &copy; {new Date().getFullYear()} Super Admin. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
