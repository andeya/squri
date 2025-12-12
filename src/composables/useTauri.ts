import { ref } from 'vue';
import { Notify, Dialog } from 'quasar';

/**
 * Check if running in Tauri environment
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/**
 * Tauri Dialog Hook
 */
export function useTauriDialog() {
  const loading = ref(false);

  // Show message dialog
  const showMessage = async (message: string, title?: string) => {
    if (!isTauri()) {
      Dialog.create({
        title: title || 'Message',
        message,
      });
      return;
    }

    try {
      const { message: showMessageDialog } = await import('@tauri-apps/plugin-dialog');
      const options = title ? { title, kind: 'info' as const } : { kind: 'info' as const };
      await showMessageDialog(message, options);
    } catch (error) {
      console.error('Dialog error:', error);
      Notify.create({
        message: 'Dialog feature requires Tauri environment',
        type: 'negative',
      });
    }
  };

  // Show confirm dialog
  const showConfirm = async (message: string, title?: string): Promise<boolean> => {
    if (!isTauri()) {
      return new Promise((resolve) => {
        Dialog.create({
          title: title || 'Confirm',
          message,
          cancel: true,
          persistent: true,
        })
          .onOk(() => resolve(true))
          .onCancel(() => resolve(false));
      });
    }

    try {
      const { ask } = await import('@tauri-apps/plugin-dialog');
      const options = title ? { title, kind: 'warning' as const } : { kind: 'warning' as const };
      return await ask(message, options);
    } catch (error) {
      console.error('Dialog error:', error);
      return false;
    }
  };

  // Open file picker
  const openFile = async (options?: {
    multiple?: boolean;
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => {
    if (!isTauri()) {
      Notify.create({
        message: 'File picker requires Tauri environment',
        type: 'warning',
      });
      return null;
    }

    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const dialogOptions: {
        multiple: boolean;
        filters?: Array<{ name: string; extensions: string[] }>;
      } = {
        multiple: options?.multiple || false,
      };
      if (options?.filters) {
        dialogOptions.filters = options.filters;
      }
      return await open(dialogOptions);
    } catch (error) {
      console.error('Dialog error:', error);
      return null;
    }
  };

  // Save file dialog
  const saveFile = async (options?: {
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => {
    if (!isTauri()) {
      Notify.create({
        message: 'Save dialog requires Tauri environment',
        type: 'warning',
      });
      return null;
    }

    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const dialogOptions: {
        defaultPath?: string;
        filters?: Array<{ name: string; extensions: string[] }>;
      } = {};
      if (options?.defaultPath) {
        dialogOptions.defaultPath = options.defaultPath;
      }
      if (options?.filters) {
        dialogOptions.filters = options.filters;
      }
      return await save(dialogOptions);
    } catch (error) {
      console.error('Dialog error:', error);
      return null;
    }
  };

  return {
    loading,
    showMessage,
    showConfirm,
    openFile,
    saveFile,
  };
}

/**
 * Tauri File System Hook
 */
export function useTauriFS() {
  // Read text file
  const readTextFile = async (path: string): Promise<string | null> => {
    if (!isTauri()) {
      Notify.create({
        message: 'File system requires Tauri environment',
        type: 'warning',
      });
      return null;
    }

    try {
      const { readTextFile: read } = await import('@tauri-apps/plugin-fs');
      return await read(path);
    } catch (error) {
      console.error('FS error:', error);
      return null;
    }
  };

  // Write text file
  const writeTextFile = async (path: string, content: string): Promise<boolean> => {
    if (!isTauri()) {
      Notify.create({
        message: 'File system requires Tauri environment',
        type: 'warning',
      });
      return false;
    }

    try {
      const { writeTextFile: write } = await import('@tauri-apps/plugin-fs');
      await write(path, content);
      return true;
    } catch (error) {
      console.error('FS error:', error);
      return false;
    }
  };

  // Check if file exists
  const exists = async (path: string): Promise<boolean> => {
    if (!isTauri()) return false;

    try {
      const { exists: checkExists } = await import('@tauri-apps/plugin-fs');
      return await checkExists(path);
    } catch (error) {
      console.error('FS error:', error);
      return false;
    }
  };

  return {
    readTextFile,
    writeTextFile,
    exists,
  };
}

/**
 * Tauri Notification Hook
 */
export function useTauriNotification() {
  const sendNotification = async (title: string, body: string) => {
    if (!isTauri()) {
      Notify.create({
        message: `${title}: ${body}`,
        type: 'info',
      });
      return;
    }

    try {
      const { sendNotification: send } = await import('@tauri-apps/plugin-notification');
      send({ title, body });
    } catch (error) {
      console.error('Notification error:', error);
      Notify.create({
        message: `${title}: ${body}`,
        type: 'info',
      });
    }
  };

  return {
    sendNotification,
  };
}

/**
 * Tauri System Info Hook
 */
export function useTauriSystem() {
  const systemInfo = ref<{
    platform: string;
    version: string;
    arch: string;
    hostname: string;
  } | null>(null);

  const loadSystemInfo = async () => {
    if (!isTauri()) {
      Notify.create({
        message: 'System info requires Tauri environment',
        type: 'warning',
      });
      return;
    }

    try {
      const { platform, version, arch, hostname } = await import('@tauri-apps/plugin-os');

      const hostnameResult = await hostname();
      systemInfo.value = {
        platform: platform(),
        version: version(),
        arch: arch(),
        hostname: hostnameResult ?? 'Unknown',
      };

      Notify.create({
        message: 'System info loaded successfully',
        type: 'positive',
      });
    } catch (error) {
      console.error('Failed to load system info:', error);
      Notify.create({
        message: 'Failed to load system info',
        type: 'negative',
      });
    }
  };

  return {
    systemInfo,
    loadSystemInfo,
  };
}
