<template>
  <q-page class="index-page">
    <!-- Hero Section -->
    <div class="hero-section column items-center q-pa-lg">
      <q-avatar size="120px" class="q-mb-md">
        <img src="~assets/logo.svg" alt="Squri Logo" />
      </q-avatar>
      <h1 class="hero-title text-h3 text-weight-bold q-mb-md">Squri Framework</h1>
      <p class="hero-subtitle text-subtitle1 text-grey-7 text-center q-mb-xl">
        A unified codebase framework for building desktop and mobile apps
      </p>

      <!-- Feature Grid -->
      <div class="feature-grid row q-gutter-md justify-center q-mb-xl">
        <q-card
          v-for="feature in features"
          :key="feature.title"
          flat
          bordered
          class="feature-card col-12 col-sm-5 col-md-3"
        >
          <q-card-section class="text-center">
            <q-icon :name="feature.icon" size="48px" color="primary" />
            <div class="text-h6 q-mt-sm">{{ feature.title }}</div>
            <div class="text-body2 text-grey-7 q-mt-xs">
              {{ feature.description }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Action Buttons -->
      <div class="row q-gutter-md">
        <q-btn color="primary" size="lg" label="Get Started" no-caps @click="handleGetStarted" />
        <q-btn outline color="primary" size="lg" label="Learn More" no-caps to="/about" />
      </div>
    </div>

    <!-- Demo Section -->
    <div class="demo-section q-pa-lg">
      <div class="row q-gutter-lg justify-center">
        <!-- Counter Demo -->
        <q-card flat bordered class="demo-card col-12 col-md-5">
          <q-card-section>
            <div class="row justify-between items-center">
              <span class="text-h6">Counter Demo</span>
              <q-btn flat dense color="primary" label="Reset" @click="resetCount" />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="column items-center q-gutter-md">
            <q-avatar size="100px" color="primary" text-color="white">
              <span class="text-h4">{{ count }}</span>
            </q-avatar>
            <div class="row q-gutter-sm">
              <q-btn round color="grey" icon="remove" @click="decrement" />
              <q-btn round color="primary" icon="add" @click="increment" />
            </div>
            <q-badge :color="count > 5 ? 'positive' : 'info'">
              {{ count > 5 ? 'Large value' : 'Small value' }}
            </q-badge>
          </q-card-section>
        </q-card>

        <!-- App Store Info -->
        <q-card flat bordered class="demo-card col-12 col-md-5">
          <q-card-section>
            <div class="row justify-between items-center">
              <span class="text-h6">App Store Info</span>
              <q-badge color="info">{{ appStore.appTitle }}</q-badge>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label overline>App Name</q-item-label>
                  <q-item-label>{{ appStore.appName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Version</q-item-label>
                  <q-item-label>{{ appStore.version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Description</q-item-label>
                  <q-item-label class="text-caption">
                    Unified codebase for desktop & mobile
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- User Store Info -->
        <q-card v-if="userStore.isLogin" flat bordered class="demo-card col-12 col-md-5">
          <q-card-section>
            <div class="row justify-between items-center">
              <span class="text-h6">User Info</span>
              <q-badge color="positive">Logged In</q-badge>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Username</q-item-label>
                  <q-item-label>{{ userStore.userName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Email</q-item-label>
                  <q-item-label>{{ userStore.user?.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Status</q-item-label>
                  <q-item-label>
                    <q-badge color="positive">Active</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAppStore } from 'stores/app';
import { useUserStore } from 'stores/user';

const $q = useQuasar();
const appStore = useAppStore();
const userStore = useUserStore();

// Counter state
const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};

const resetCount = () => {
  count.value = 0;
  $q.notify({
    message: 'Counter reset',
    type: 'positive',
  });
};

// Feature list
const features = [
  {
    icon: 'description',
    title: 'Quasar UI',
    description: 'Enterprise-grade Vue.js component library',
  },
  {
    icon: 'devices',
    title: 'Cross-Platform',
    description: 'Desktop (Win/Mac/Linux) & Mobile (iOS/Android)',
  },
  {
    icon: 'speed',
    title: 'Native Performance',
    description: 'Powered by Tauri with Rust backend',
  },
  {
    icon: 'extension',
    title: 'Plugin System',
    description: 'Dialog, FS, HTTP, Notification, OS, Shell',
  },
  {
    icon: 'menu',
    title: 'Native Menu',
    description: 'System menu with keyboard shortcuts',
  },
  {
    icon: 'palette',
    title: 'Theme Support',
    description: 'Light/Dark mode with instant switching',
  },
];

const handleGetStarted = () => {
  $q.notify({
    message: 'Welcome to Squri!',
    type: 'positive',
    timeout: 2000,
  });
};
</script>

<style lang="scss" scoped>
.index-page {
  padding-bottom: 40px;
}

.hero-section {
  padding-top: 60px;
  padding-bottom: 60px;
  text-align: center;
}

.hero-title {
  background: linear-gradient(135deg, #1976d2 0%, #9c27b0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature-grid {
  max-width: 1000px;
}

.feature-card {
  min-width: 200px;
  max-width: 280px;
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.demo-section {
  max-width: 1000px;
  margin: 0 auto;
}

.demo-card {
  min-width: 280px;
}
</style>
