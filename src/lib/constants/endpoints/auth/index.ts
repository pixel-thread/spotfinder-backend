import { EndpointT } from '@/types/endpoints';

/**
 * Available authentication endpoint keys.
 * Format: HTTP_METHOD_ACTION
 *
 * @property POST_LOGIN - Login endpoint
 *
 * @property POST_REGISTER - User registration endpoint
 * @property POST_LOGOUT - Logout endpoint
 * @property GET_ME - Get current user information endpoint
 */
type AuthEndpointKeys =
  | 'POST_LOGIN'
  | 'POST_REGISTER'
  | 'POST_LOGOUT'
  | 'GET_ME'
  | 'POST_LOGIN_INIT';

/**
 * Authentication API endpoints configuration.
 * Uses EndpointT generic type for type-safe endpoint definitions.
 *
 * @example
 * ```typescript
 * // Using an endpoint
 * const loginUrl = AUTH_ENDPOINT.POST_LOGIN; // "/auth"
 * ```
 */

export const AUTH_ENDPOINT: EndpointT<AuthEndpointKeys> = {
  POST_LOGIN_INIT: '/auth/init',
  POST_LOGIN: '/auth',
  POST_REGISTER: '/auth/register',
  POST_LOGOUT: '/auth/logout',
  GET_ME: '/auth',
};
