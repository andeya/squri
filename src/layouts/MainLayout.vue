<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="cursor-pointer" @click="void router.push('/')">
          <q-avatar size="32px" class="q-mr-sm">
            <img src="~assets/logo.svg" alt="Squri Logo" />
          </q-avatar>
          {{ appStore.appName }}
        </q-toolbar-title>

        <q-space />

        <!-- Theme Toggle -->
        <q-btn flat round :icon="isDark ? 'light_mode' : 'dark_mode'" @click="toggleDark">
          <q-tooltip>{{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</q-tooltip>
        </q-btn>

        <!-- User Actions -->
        <q-btn v-if="userStore.isLogin" flat round icon="logout" @click="handleLogout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
        <q-btn v-else flat round icon="login" @click="handleLogin">
          <q-tooltip>Login</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Navigation</q-item-label>

        <!-- Public menu items (auto-generated from route meta) -->
        <template v-for="item in publicMenuItems" :key="item.path">
          <q-item clickable v-ripple :to="item.path" :exact="item.path === '/'">
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.title }}</q-item-section>
            <q-item-section v-if="item.badge" side>
              <q-badge :color="item.badgeColor ?? 'primary'" :label="item.badge" />
            </q-item-section>
          </q-item>
        </template>

        <!-- Auth-required menu items -->
        <template v-if="userStore.isLogin">
          <template v-for="item in authMenuItems" :key="item.path">
            <q-item clickable v-ripple :to="item.path">
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>{{ item.title }}</q-item-section>
              <q-item-section v-if="item.badge" side>
                <q-badge :color="item.badgeColor ?? 'primary'" :label="item.badge" />
              </q-item-section>
            </q-item>
          </template>
        </template>

        <q-separator class="q-my-md" />

        <q-item-label header>User Info</q-item-label>

        <q-item v-if="userStore.isLogin">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ userStore.userName.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ userStore.userName }}</q-item-label>
            <q-item-label caption>{{ userStore.user?.email }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-else>
          <q-item-section avatar>
            <q-avatar color="grey" text-color="white" icon="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Guest</q-item-label>
            <q-item-label caption>Not logged in</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Drawer Footer -->
      <div class="absolute-bottom q-pa-md text-caption text-grey">
        {{ appStore.appTitle }}
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer bordered>
      <q-toolbar class="justify-between">
        <div class="text-caption text-grey">© 2025 Squri Framework</div>
        <div class="text-caption text-grey gt-xs">Powered by Quasar + Tauri</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, Dark } from 'quasar';
import { useAppStore } from 'stores/app';
import { useUserStore } from 'stores/user';
import { useTauriMenu } from 'src/composables/useMenu';
import { useRouteMenu } from 'src/composables/useRouteMenu';

const router = useRouter();
const $q = useQuasar();
const appStore = useAppStore();
const userStore = useUserStore();

// Initialize Tauri menu
useTauriMenu();

// Get menu items from route meta
const { publicMenuItems, authMenuItems } = useRouteMenu();

// Initialize user from storage
onMounted(() => {
  userStore.initFromStorage();
});

// Drawer state
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Dark mode with persistence
const isDark = ref(Dark.isActive);
const DARK_MODE_KEY = 'squri-dark-mode';

// Initialize dark mode from localStorage
onMounted(() => {
  const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
  if (savedDarkMode !== null) {
    const shouldBeDark = savedDarkMode === 'true';
    Dark.set(shouldBeDark);
    isDark.value = shouldBeDark;
  }
});

function toggleDark() {
  Dark.toggle();
  isDark.value = Dark.isActive;
  localStorage.setItem(DARK_MODE_KEY, String(isDark.value));
}

// Listen to menu theme toggle
let themeHandler: ((e: Event) => void) | null = null;

onMounted(() => {
  themeHandler = () => {
    toggleDark();
  };
  window.addEventListener('tauri-menu-toggle-theme', themeHandler);
});

onUnmounted(() => {
  if (themeHandler) {
    window.removeEventListener('tauri-menu-toggle-theme', themeHandler);
  }
});

// Auth handlers
function handleLogin() {
  userStore.login(
    {
      id: '1',
      username: 'demo_user',
      email: 'demo@example.com',
      avatar: 'https://via.placeholder.com/150',
    },
    'demo_token_12345',
  );
  $q.notify({
    message: 'Logged in successfully',
    type: 'positive',
  });
}

function handleLogout() {
  userStore.logout();
  $q.notify({
    message: 'Logged out successfully',
    type: 'positive',
  });
  void router.push('/');
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
