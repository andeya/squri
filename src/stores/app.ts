import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  // State
  const appName = ref('Squri');
  const version = ref('0.1.0');
  const loading = ref(false);
  const sidebarCollapsed = ref(false);

  // Computed properties
  const appTitle = computed(() => `${appName.value} v${version.value}`);

  // Methods
  function setLoading(value: boolean) {
    loading.value = value;
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setAppName(name: string) {
    appName.value = name;
  }

  return {
    // State
    appName,
    version,
    loading,
    sidebarCollapsed,
    // Computed properties
    appTitle,
    // Methods
    setLoading,
    toggleSidebar,
    setAppName,
  };
});

