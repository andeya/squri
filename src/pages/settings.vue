<template>
  <q-page class="settings-page q-pa-lg">
    <!-- Page Header -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold">Settings</h4>
      <p class="text-subtitle1 text-grey-7">Configure your application preferences</p>
    </div>

    <div class="row q-gutter-lg">
      <!-- Left Menu -->
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-list>
            <q-item
              v-for="menu in menus"
              :key="menu.id"
              clickable
              v-ripple
              :active="activeMenu === menu.id"
              active-class="bg-primary text-white"
              @click="activeMenu = menu.id"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" />
              </q-item-section>
              <q-item-section>{{ menu.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Right Content -->
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <!-- General Settings -->
            <div v-show="activeMenu === 'general'">
              <h5 class="text-h5 q-mb-lg">General Settings</h5>
              <q-form class="q-gutter-md">
                <q-input
                  v-model="settings.appName"
                  outlined
                  label="App Name"
                  @blur="handleAppNameChange"
                />
                <q-select
                  v-model="settings.language"
                  outlined
                  label="Language"
                  :options="languageOptions"
                  emit-value
                  map-options
                />
                <q-toggle v-model="settings.autoStart" label="Auto Start" />
              </q-form>
            </div>

            <!-- Appearance Settings -->
            <div v-show="activeMenu === 'appearance'">
              <h5 class="text-h5 q-mb-lg">Appearance Settings</h5>
              <q-form class="q-gutter-md">
                <div>
                  <div class="text-subtitle2 q-mb-sm">Theme Mode</div>
                  <q-btn-toggle
                    v-model="settings.theme"
                    toggle-color="primary"
                    :options="[
                      { label: 'Light', value: 'light' },
                      { label: 'Dark', value: 'dark' },
                      { label: 'System', value: 'auto' },
                    ]"
                    @update:model-value="handleThemeChange"
                  />
                </div>
                <q-input
                  v-model="settings.primaryColor"
                  outlined
                  label="Primary Color"
                >
                  <template v-slot:append>
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-color v-model="settings.primaryColor" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div>
                  <div class="text-subtitle2 q-mb-sm">Font Size: {{ settings.fontSize }}px</div>
                  <q-slider
                    v-model="settings.fontSize"
                    :min="12"
                    :max="20"
                    :step="1"
                    markers
                    label
                  />
                </div>
              </q-form>
            </div>

            <!-- Notification Settings -->
            <div v-show="activeMenu === 'notification'">
              <h5 class="text-h5 q-mb-lg">Notification Settings</h5>
              <q-form class="q-gutter-md">
                <q-toggle v-model="settings.desktopNotification" label="Desktop Notification" />
                <q-toggle v-model="settings.soundNotification" label="Sound Notification" />
                <div>
                  <div class="text-subtitle2 q-mb-sm">Notification Frequency</div>
                  <q-option-group
                    v-model="settings.notificationFrequency"
                    :options="[
                      { label: 'All Notifications', value: 'all' },
                      { label: 'Important Only', value: 'important' },
                      { label: 'Disable', value: 'none' },
                    ]"
                  />
                </div>
              </q-form>
            </div>

            <!-- Advanced Settings -->
            <div v-show="activeMenu === 'advanced'">
              <h5 class="text-h5 q-mb-lg">Advanced Settings</h5>
              <q-form class="q-gutter-md">
                <q-toggle v-model="settings.developerMode" label="Developer Mode" />
                <q-toggle v-model="settings.hardwareAcceleration" label="Hardware Acceleration" />
                <div class="row items-center q-gutter-sm">
                  <q-input
                    v-model.number="settings.cacheSize"
                    outlined
                    dense
                    type="number"
                    label="Cache Size"
                    style="width: 150px"
                  />
                  <span class="text-grey-7">MB</span>
                </div>
                <q-btn color="negative" label="Clear Cache" @click="handleClearCache" />
              </q-form>
            </div>

            <!-- Action Buttons -->
            <q-separator class="q-my-lg" />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Reset" @click="handleReset" />
              <q-btn color="primary" label="Save Settings" @click="handleSave" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useQuasar, Dark } from 'quasar';
import { useAppStore } from 'stores/app';

const $q = useQuasar();
const appStore = useAppStore();

const activeMenu = ref('general');

const menus = [
  { id: 'general', label: 'General', icon: 'settings' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'notification', label: 'Notification', icon: 'notifications' },
  { id: 'advanced', label: 'Advanced', icon: 'build' },
];

const languageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
];

const settings = reactive({
  appName: 'Squri App',
  language: 'en-US',
  autoStart: false,
  theme: 'auto',
  primaryColor: '#1976D2',
  fontSize: 14,
  desktopNotification: true,
  soundNotification: true,
  notificationFrequency: 'all',
  developerMode: false,
  hardwareAcceleration: true,
  cacheSize: 500,
});

onMounted(() => {
  settings.appName = appStore.appName;
  settings.theme = Dark.isActive ? 'dark' : 'light';
});

const handleThemeChange = (val: string) => {
  if (val === 'dark') {
    Dark.set(true);
  } else if (val === 'light') {
    Dark.set(false);
  } else {
    Dark.set('auto');
  }
  const themeText = val === 'dark' ? 'Dark' : val === 'light' ? 'Light' : 'Follow System';
  $q.notify({
    message: `Switched to ${themeText} theme`,
    type: 'positive',
  });
};

const handleAppNameChange = () => {
  appStore.setAppName(settings.appName);
  $q.notify({
    message: 'App name updated',
    type: 'positive',
  });
};

const handleSave = () => {
  appStore.setAppName(settings.appName);
  $q.notify({
    message: 'Settings saved',
    type: 'positive',
  });
};

const handleReset = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to reset all settings?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    settings.appName = 'Squri App';
    settings.language = 'en-US';
    settings.autoStart = false;
    settings.theme = 'auto';
    settings.primaryColor = '#1976D2';
    settings.fontSize = 14;
    settings.desktopNotification = true;
    settings.soundNotification = true;
    settings.notificationFrequency = 'all';
    settings.developerMode = false;
    settings.hardwareAcceleration = true;
    settings.cacheSize = 500;
    appStore.setAppName(settings.appName);
    $q.notify({
      message: 'Settings reset',
      type: 'positive',
    });
  });
};

const handleClearCache = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to clear cache?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      message: 'Cache cleared',
      type: 'positive',
    });
  });
};
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 1000px;
  margin: 0 auto;
}
</style>

