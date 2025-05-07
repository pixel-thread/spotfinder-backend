import * as sdk from 'node-appwrite';
import { env } from '@/env';

export { ID } from 'node-appwrite';

export const appWriteClient = new sdk.Client()
  .setEndpoint(env.APPWRITE_ENDPOINT)
  .setProject(env.APPWRITE_PROJECT_ID)
  .setKey(env.APPWRITE_API_KEY);

export const appWriteStorage = new sdk.Storage(appWriteClient);
