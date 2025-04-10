import { EndpointT } from "@/types/endpoints";

/**
 * Admin role management endpoint keys.
 * Format: HTTP_METHOD_ACTION
 *
 * @property PATCH_ROLE - Endpoint for updating user roles
 */
type AdminRoleEndpointKeys = "PATCH_ROLE";

/**
 * Admin role management API endpoints configuration.
 * Uses EndpointT generic type for type-safe endpoint definitions.
 *
 * @example
 * ```typescript
 * // Using the role update endpoint
 * const roleUpdateUrl = ADMIN_ROLE_ENDPOINT.PATCH_ROLE; // "/admin/role"
 * ```
 */
export const ADMIN_ROLE_ENDPOINT: EndpointT<AdminRoleEndpointKeys> = {
  PATCH_ROLE: "/admin/role",
};
