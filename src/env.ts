// import { createEnv } from '@t3-oss/env-nextjs';
// import { z } from 'zod';

// export const env = createEnv({
//   server: {
//     DATABASE_URL: z.string(),
//     JWT_SECRET: z.string().min(1),
//     INTERNAL_CODE: z.string().min(6, 'Invalid OTP').max(6, 'Invalid OTP'),
//     APPWRITE_ENDPOINT: z.string(),
//     APPWRITE_PROJECT_ID: z.string(),
//     APPWRITE_BUCKET_ID: z.string(),
//     APPWRITE_API_KEY: z.string(),
//   },
//   client: {
//     NEXT_PUBLIC_API_URL: z.string().url(),
//   },
//   // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
//   runtimeEnv: {
//     DATABASE_URL: process.env.DATABASE_URL,
//     JWT_SECRET: process.env.JWT_SECRET,
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//     INTERNAL_CODE: process.env.INTERNAL_CODE,
//     APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
//     APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
//     APPWRITE_BUCKET_ID: process.env.APPWRITE_BUCKET_ID,
//     APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
//   },
// });
