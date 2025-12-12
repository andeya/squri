import 'vue-router';

/**
 * Route meta information for menu and navigation
 */
export interface RouteMeta {
  /** Display title in menu and page header */
  title?: string;
  /** Material icon name for menu item */
  icon?: string;
  /** Menu display order (lower = higher priority) */
  order?: number;
  /** Whether to show in navigation menu */
  showInMenu?: boolean;
  /** Whether route requires authentication */
  requiresAuth?: boolean;
  /** Badge text to display on menu item */
  badge?: string;
  /** Badge color */
  badgeColor?: string;
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    order?: number;
    showInMenu?: boolean;
    requiresAuth?: boolean;
    badge?: string;
    badgeColor?: string;
  }
}
