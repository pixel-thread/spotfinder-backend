import { EndpointT } from '@/types/endpoints';

/**
 * Dashboard endpoint keys.
 * Format: HTTP_METHOD_RESOURCE
 *
 * @property GET_DASHBOARD - Main dashboard data endpoint
 */
type DashboardEndpointsKey = 'GET_DASHBOARD';

/**
 * Dashboard API endpoints configuration.
 * Uses EndpointT generic type for type-safe endpoint definitions.
 *
 * @example
 * ```typescript
 * // Using the dashboard endpoint
 * const dashboardUrl = DASHBOARD_ENDPOINT.GET_DASHBOARD; // "/dashboard"
 * ```
 */
export const DASHBOARD_ENDPOINT: EndpointT<DashboardEndpointsKey> = {
  GET_DASHBOARD: '/dashboard',
};
