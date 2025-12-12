import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { listen } from '@tauri-apps/api/event';

/**
 * Tauri Menu Hook
 * Handles native menu events from Tauri
 */
export function useTauriMenu() {
  const router = useRouter();
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  let unlistenFunctions: Array<() => void> = [];

  const handleOpenFile = () => {
    import('@tauri-apps/plugin-dialog')
      .then(({ open }) => {
        return open({
          filters: [{ name: 'All Files', extensions: ['*'] }],
        });
      })
      .then((file) => {
        if (file) {
          Notify.create({
            message: `Opened: ${String(file)}`,
            type: 'positive',
          });
        }
      })
      .catch((error: unknown) => {
        console.error('Open file error:', error);
      });
  };

  const handleSaveFile = () => {
    import('@tauri-apps/plugin-dialog')
      .then(({ save }) => {
        return save({
          filters: [{ name: 'All Files', extensions: ['*'] }],
        });
      })
      .then((file) => {
        if (file) {
          Notify.create({
            message: `Saved to: ${file}`,
            type: 'positive',
          });
        }
      })
      .catch((error: unknown) => {
        console.error('Save file error:', error);
      });
  };

  onMounted(() => {
    if (!isTauri) return;

    const setupListeners = async () => {
      try {
        // Listen to menu navigation events
        const unlistenNavigate = await listen<string>('menu-navigate', (event) => {
          const route = event.payload;
          switch (route) {
            case 'home':
              void router.push('/');
              break;
            case 'about':
              void router.push('/about');
              break;
            case 'settings':
              void router.push('/settings');
              break;
            case 'profile':
              void router.push('/profile');
              break;
          }
        });
        unlistenFunctions.push(unlistenNavigate);

        // Listen to menu toggle theme event
        const unlistenTheme = await listen('menu-toggle-theme', () => {
          window.dispatchEvent(new CustomEvent('tauri-menu-toggle-theme'));
        });
        unlistenFunctions.push(unlistenTheme);

        // Listen to menu new event
        const unlistenNew = await listen('menu-new', () => {
          Notify.create({
            message: 'New file feature coming soon...',
            type: 'info',
          });
        });
        unlistenFunctions.push(unlistenNew);

        // Listen to menu open event
        const unlistenOpen = await listen('menu-open', () => {
          handleOpenFile();
        });
        unlistenFunctions.push(unlistenOpen);

        // Listen to menu save event
        const unlistenSave = await listen('menu-save', () => {
          handleSaveFile();
        });
        unlistenFunctions.push(unlistenSave);

        // Listen to menu about app event
        const unlistenAbout = await listen('menu-about-app', () => {
          void router.push('/about');
        });
        unlistenFunctions.push(unlistenAbout);

        // Listen to menu documentation event
        const unlistenDoc = await listen('menu-documentation', () => {
          window.open('https://github.com/andeya/squri', '_blank');
        });
        unlistenFunctions.push(unlistenDoc);

        // Listen to menu toggle devtools event
        const unlistenDevtools = await listen('menu-toggle-devtools', () => {
          Notify.create({
            message:
              'Use F12 or Cmd+Option+I (macOS) / Ctrl+Shift+I (Windows/Linux) to open DevTools',
            type: 'info',
          });
        });
        unlistenFunctions.push(unlistenDevtools);
      } catch (error) {
        console.error('Failed to setup menu listeners:', error);
      }
    };

    void setupListeners();
  });

  onUnmounted(() => {
    unlistenFunctions.forEach((fn) => fn());
    unlistenFunctions = [];
  });

  return {};
}
