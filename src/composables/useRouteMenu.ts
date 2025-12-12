import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

/**
 * Menu item derived from route meta
 */
export interface MenuItem {
  /** Route path */
  path: string;
  /** Route name */
  name: string;
  /** Display title */
  title: string;
  /** Material icon name */
  icon: string;
  /** Sort order */
  order: number;
  /** Whether requires authentication */
  requiresAuth: boolean;
  /** Optional badge text */
  badge?: string;
  /** Badge color */
  badgeColor?: string;
}

/**
 * Recursively extract menu items from route tree
 */
function extractMenuItems(routeList: readonly RouteRecordRaw[], parentPath = ''): MenuItem[] {
  const items: MenuItem[] = [];

  for (const route of routeList) {
    // Build full path
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    // Only include routes with showInMenu: true
    if (route.meta?.showInMenu) {
      // Skip catch-all routes
      if (!fullPath.includes(':all')) {
        const item: MenuItem = {
          path: fullPath,
          name: String(route.name ?? fullPath),
          title: String(route.meta.title ?? 'Untitled'),
          icon: String(route.meta.icon ?? 'circle'),
          order: Number(route.meta.order ?? 99),
          requiresAuth: Boolean(route.meta.requiresAuth),
        };

        // Only set badge properties if they exist
        if (route.meta.badge) {
          item.badge = String(route.meta.badge);
        }
        if (route.meta.badgeColor) {
          item.badgeColor = String(route.meta.badgeColor);
        }

        items.push(item);
      }
    }

    // Recursively process children
    if (route.children?.length) {
      items.push(...extractMenuItems(route.children, fullPath));
    }
  }

  return items;
}

/**
 * Extract menu items from routes based on meta.showInMenu
 */
export function useRouteMenu() {
  /**
   * Get all menu items from routes
   */
  const menuItems = computed<MenuItem[]>(() => {
    const items = extractMenuItems(routes);
    // Sort by order
    return items.sort((a, b) => a.order - b.order);
  });

  /**
   * Get menu items that don't require authentication
   */
  const publicMenuItems = computed<MenuItem[]>(() => {
    return menuItems.value.filter((item) => !item.requiresAuth);
  });

  /**
   * Get menu items that require authentication
   */
  const authMenuItems = computed<MenuItem[]>(() => {
    return menuItems.value.filter((item) => item.requiresAuth);
  });

  return {
    menuItems,
    publicMenuItems,
    authMenuItems,
  };
}
