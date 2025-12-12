<template>
  <q-page class="user-detail-page q-pa-lg">
    <!-- Page Header -->
    <q-btn flat icon="arrow_back" label="Back" class="q-mb-lg" @click="router.back()" />

    <h4 class="text-h4 text-weight-bold q-mb-lg">User Details</h4>

    <!-- User Info Card -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row justify-between items-center">
          <span class="text-h6">User Info #{{ userId }}</span>
          <q-badge :color="userStatus.color">{{ userStatus.label }}</q-badge>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-inner-loading :showing="loading" />
        <q-list v-if="userInfo">
          <q-item>
            <q-item-section>
              <q-item-label overline>User ID</q-item-label>
              <q-item-label>{{ userInfo.id }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Username</q-item-label>
              <q-item-label>{{ userInfo.username }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Email</q-item-label>
              <q-item-label>{{ userInfo.email }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Phone</q-item-label>
              <q-item-label>{{ userInfo.phone }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Role</q-item-label>
              <q-item-label>
                <q-badge color="primary">{{ userInfo.role }}</q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Status</q-item-label>
              <q-item-label>
                <q-badge :color="userInfo.active ? 'positive' : 'grey'">
                  {{ userInfo.active ? 'Active' : 'Inactive' }}
                </q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Created At</q-item-label>
              <q-item-label>{{ formatDate(userInfo.createdAt) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="!loading" class="column items-center q-pa-lg">
          <q-icon name="person_off" size="60px" color="grey-5" />
          <div class="text-subtitle1 text-grey-6 q-mt-md">User not found</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- User Actions -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <span class="text-h6">User Actions</span>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-sm">
          <q-btn color="primary" label="Edit User" icon="edit" @click="handleEdit" />
          <q-btn color="secondary" label="Send Message" icon="message" @click="handleSendMessage" />
          <q-btn
            color="warning"
            label="Reset Password"
            icon="lock_reset"
            @click="handleResetPassword"
          />
          <q-btn color="negative" label="Delete User" icon="delete" @click="handleDelete" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Dynamic Route Demo -->
    <q-card flat bordered>
      <q-card-section>
        <span class="text-h6">Dynamic Route Demo</span>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p class="text-body1 text-grey-7 q-mb-md">
          Current page uses dynamic route:
          <code class="bg-grey-2 q-pa-xs rounded-borders">/user/:id</code>
        </p>
        <div class="row items-center q-gutter-sm">
          <span class="text-subtitle2 text-grey-7">Quick switch:</span>
          <q-btn
            v-for="id in [1, 2, 3, 4, 5]"
            :key="id"
            flat
            dense
            color="primary"
            :label="`User ${id}`"
            @click="navigateToUser(id)"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  createdAt: string;
}

// Use type-safe route with route name for correct params type
const route = useRoute('/user/[id]');
const router = useRouter();
const $q = useQuasar();

// State
const loading = ref(false);
const userInfo = ref<UserInfo | null>(null);

// Computed properties - ensure userId is always a string
const userId = computed(() => String(route.params.id));

const userStatus = computed(() => {
  if (!userInfo.value) return { color: 'grey', label: 'Unknown' };
  return userInfo.value.active
    ? { color: 'positive', label: 'Active' }
    : { color: 'grey', label: 'Inactive' };
});

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US');
};

const fetchUserInfo = async () => {
  loading.value = true;

  try {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock user data
    userInfo.value = {
      id: Number(userId.value),
      username: `user_${userId.value}`,
      email: `user${userId.value}@example.com`,
      phone: `138****${String(userId.value).padStart(4, '0')}`,
      role: Number(userId.value) === 1 ? 'Admin' : 'User',
      active: Number(userId.value) % 2 === 1,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    $q.notify({
      message: 'User info loaded successfully',
      type: 'positive',
    });
  } catch {
    $q.notify({
      message: 'Failed to load user info',
      type: 'negative',
    });
  } finally {
    loading.value = false;
  }
};

const navigateToUser = (id: number) => {
  void router.push(`/user/${id}`);
};

const handleEdit = () => {
  $q.notify({
    message: 'Edit feature coming soon...',
    type: 'info',
  });
};

const handleSendMessage = () => {
  $q.dialog({
    title: 'Send Message',
    message: 'Enter message content',
    prompt: {
      model: '',
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    $q.notify({
      message: `Message sent: ${data}`,
      type: 'positive',
    });
  });
};

const handleResetPassword = () => {
  $q.dialog({
    title: 'Reset Password',
    message: `Are you sure you want to reset password for user ${userInfo.value?.username}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      message: 'Password reset',
      type: 'positive',
    });
  });
};

const handleDelete = () => {
  $q.dialog({
    title: 'Delete User',
    message: `This will permanently delete user ${userInfo.value?.username}, continue?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      message: 'User deleted',
      type: 'positive',
    });
    void router.push('/');
  });
};

// Lifecycle
onMounted(() => {
  void fetchUserInfo();
});

// Watch route id changes
watch(
  () => route.params.id,
  () => {
    void fetchUserInfo();
  },
);
</script>

<style lang="scss" scoped>
.user-detail-page {
  max-width: 900px;
  margin: 0 auto;
}

code {
  font-family: 'Courier New', monospace;
  color: $primary;
}
</style>
