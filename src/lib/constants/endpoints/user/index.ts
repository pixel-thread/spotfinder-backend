import { EndpointT } from '@/types/endpoints';

/**
 * Admin users management endpoint keys.
 * Format: HTTP_METHOD_RESOURCE
 *
 * @property GET_USERS - Endpoint for retrieving users list
 */
type UsersEndpointKeys = 'GET_USER' | 'PUT_USER_PROFILE_PIC';

/**
 * Admin users management API endpoints configuration.
 * Uses EndpointT generic type for type-safe endpoint definitions.
 *
 * @example
 * ```typescript
 * // Using the users list endpoint
 * const getUsersUrl = ADMIN_USERS_ENDPOINT.GET_USERS; // "/admin/users"
 * ```
 */
export const ADMIN_USERS_ENDPOINT: EndpointT<UsersEndpointKeys> = {
  GET_USER: '/user/:id',
  PUT_USER_PROFILE_PIC: '/user/:id/profile-pic',
};
