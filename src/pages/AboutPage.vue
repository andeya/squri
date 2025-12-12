<template>
  <q-page class="about-page q-pa-lg">
    <!-- Page Header -->
    <q-btn flat icon="arrow_back" label="Back" class="q-mb-lg" @click="router.back()" />

    <h4 class="text-h4 text-weight-bold q-mb-lg">About Squri</h4>

    <!-- Framework Info Card -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row justify-between items-center">
          <span class="text-h6">Framework Information</span>
          <div class="row items-center q-gutter-sm">
            <q-badge color="positive">v{{ appStore.version }}</q-badge>
            <q-btn flat dense color="primary" label="Refresh App Info" @click="loadAppInfo" />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label overline>Framework Name</q-item-label>
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
              <q-item-label overline>Vue Version</q-item-label>
              <q-item-label>{{ vueVersion }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Tauri Version</q-item-label>
              <q-item-label>2.9.6</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Description</q-item-label>
              <q-item-label lines="2">
                A unified codebase framework for building desktop and mobile apps, powered by Quasar
                (UI layer) and Tauri (system layer)
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- App Info from Backend -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row justify-between items-center">
          <span class="text-h6">App Info (from backend command)</span>
          <q-badge v-if="appInfo" color="info">{{ appInfo.name }}</q-badge>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list v-if="appInfo">
          <q-item>
            <q-item-section>
              <q-item-label overline>Name</q-item-label>
              <q-item-label>{{ appInfo.name }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Version</q-item-label>
              <q-item-label>{{ appInfo.version }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Description</q-item-label>
              <q-item-label>{{ appInfo.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-center q-pa-lg text-grey-6">
          Click the button above to refresh app info
        </div>
      </q-card-section>
    </q-card>

    <!-- Tech Stack -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <span class="text-h6">Tech Stack</span>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-sm">
          <q-badge v-for="tech in techStack" :key="tech.name" :color="tech.color" class="q-pa-sm">
            {{ tech.name }} {{ tech.version }}
          </q-badge>
        </div>
      </q-card-section>
    </q-card>

    <!-- System Info -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <span class="text-h6">System Information</span>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list v-if="systemInfo">
          <q-item>
            <q-item-section>
              <q-item-label overline>Operating System</q-item-label>
              <q-item-label>{{ systemInfo.platform }} {{ systemInfo.version }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Architecture</q-item-label>
              <q-item-label>{{ systemInfo.arch }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Hostname</q-item-label>
              <q-item-label>{{ systemInfo.hostname }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="column items-center q-pa-lg">
          <q-btn color="primary" label="Load System Info" @click="loadSystemInfo" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Greet Command Demo -->
    <q-card flat bordered>
      <q-card-section>
        <div class="row justify-between items-center">
          <span class="text-h6">Greet Command Demo</span>
          <q-badge color="info">tauri invoke</q-badge>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <q-input
            v-model="greetingName"
            outlined
            dense
            label="Enter your name"
            style="min-width: 200px"
          />
          <q-btn color="primary" label="Send Greeting" @click="sendGreet" />
        </div>
        <div v-if="greetingMessage" class="q-mt-md text-body1">
          {{ greetingMessage }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, version as vueVersion, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from 'stores/app';
import { useTauriSystem, isTauri } from 'src/composables/useTauri';

const router = useRouter();
const $q = useQuasar();
const appStore = useAppStore();
const { systemInfo, loadSystemInfo } = useTauriSystem();

// App info & greeting
const appInfo = ref<{ name: string; version: string; description: string } | null>(null);
const greetingName = ref('Tauri User');
const greetingMessage = ref('');

const loadAppInfo = async () => {
  if (!isTauri()) {
    $q.notify({
      message: 'Please view app info in Tauri window',
      type: 'warning',
    });
    return;
  }
  try {
    const res = await invoke<{ name: string; version: string; description: string }>(
      'get_app_info',
    );
    appInfo.value = res;
    $q.notify({
      message: 'App info loaded successfully',
      type: 'positive',
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      message: 'Failed to get app info',
      type: 'negative',
    });
  }
};

const sendGreet = async () => {
  if (!isTauri()) {
    $q.notify({
      message: 'Please experience greeting in Tauri window',
      type: 'warning',
    });
    return;
  }
  try {
    const msg = await invoke<string>('greet', { name: greetingName.value || 'Tauri User' });
    greetingMessage.value = msg;
    $q.notify({
      message: 'Greeting sent',
      type: 'positive',
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      message: 'Failed to send greeting',
      type: 'negative',
    });
  }
};

onMounted(() => {
  if (isTauri()) {
    void loadAppInfo();
  }
});

const techStack = [
  { name: 'Vue', version: '3.5.25', color: 'positive' },
  { name: 'Quasar', version: '2.18.6', color: 'primary' },
  { name: 'Vite', version: '7.2.7', color: 'warning' },
  { name: 'Tauri', version: '2.9.6', color: 'accent' },
  { name: 'TypeScript', version: '5.9.3', color: 'info' },
  { name: 'Pinia', version: '3.0.4', color: 'secondary' },
];
</script>

<style lang="scss" scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
