<template>
  <q-page class="profile-page q-pa-lg">
    <!-- Page Header -->
    <q-btn flat icon="arrow_back" label="Back" class="q-mb-lg" @click="router.back()" />

    <h4 class="text-h4 text-weight-bold q-mb-lg">Profile</h4>

    <template v-if="userStore.isLogin">
      <!-- User Avatar & Basic Info -->
      <q-card flat bordered class="q-mb-lg">
        <q-card-section class="row items-center q-gutter-lg">
          <q-avatar size="100px" color="primary" text-color="white">
            <span class="text-h3">{{ userStore.userName.charAt(0).toUpperCase() }}</span>
          </q-avatar>
          <div>
            <div class="text-h5 text-weight-bold">{{ userStore.userName }}</div>
            <div class="text-subtitle1 text-grey-7">{{ userStore.user?.email }}</div>
            <q-badge color="positive" class="q-mt-sm">Active Account</q-badge>
          </div>
        </q-card-section>
      </q-card>

      <!-- Account Details -->
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <span class="text-h6">Account Details</span>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label overline>User ID</q-item-label>
                <q-item-label>{{ userStore.user?.id }}</q-item-label>
              </q-item-section>
            </q-item>
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
                <q-item-label overline>Token</q-item-label>
                <q-item-label class="text-grey-7">
                  {{ maskToken(userStore.token) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Actions -->
      <q-card flat bordered>
        <q-card-section>
          <span class="text-h6">Account Actions</span>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-gutter-md">
            <q-btn color="primary" label="Edit Profile" icon="edit" @click="handleEditProfile" />
            <q-btn color="secondary" label="Change Password" icon="lock" @click="handleChangePassword" />
            <q-btn color="negative" label="Logout" icon="logout" @click="handleLogout" />
          </div>
        </q-card-section>
      </q-card>
    </template>

    <!-- Not Logged In -->
    <template v-else>
      <q-card flat bordered>
        <q-card-section class="column items-center q-pa-xl">
          <q-icon name="person_off" size="80px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">Not logged in</div>
          <div class="text-body2 text-grey-6 q-mb-lg">Please login to view your profile</div>
          <q-btn color="primary" label="Login" icon="login" @click="handleLogin" />
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user';

// Define route meta for menu generation
definePage({
  meta: {
    title: 'Profile',
    icon: 'person',
    order: 4,
    showInMenu: true,
    requiresAuth: true,
  },
});

const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();

const maskToken = (token: string) => {
  if (!token) return '';
  if (token.length <= 10) return '***';
  return token.slice(0, 5) + '***' + token.slice(-5);
};

const handleLogin = () => {
  userStore.login(
    {
      id: '1',
      username: 'demo_user',
      email: 'demo@example.com',
      avatar: 'https://via.placeholder.com/150',
    },
    'demo_token_12345'
  );
  $q.notify({
    message: 'Logged in successfully',
    type: 'positive',
  });
};

const handleLogout = () => {
  $q.dialog({
    title: 'Confirm Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    userStore.logout();
    $q.notify({
      message: 'Logged out successfully',
      type: 'positive',
    });
    void router.push('/');
  });
};

const handleEditProfile = () => {
  $q.notify({
    message: 'Edit profile feature coming soon...',
    type: 'info',
  });
};

const handleChangePassword = () => {
  $q.notify({
    message: 'Change password feature coming soon...',
    type: 'info',
  });
};
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>

