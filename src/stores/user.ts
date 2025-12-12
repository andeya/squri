import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string>('');

  // Computed properties
  const isLogin = computed(() => !!token.value && !!user.value);
  const userName = computed(() => user.value?.username || 'Guest');

  // Methods
  function setUser(userData: User) {
    user.value = userData;
  }

  function setToken(tokenValue: string) {
    token.value = tokenValue;
  }

  function login(userData: User, tokenValue: string) {
    user.value = userData;
    token.value = tokenValue;
    // Persist to local storage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenValue);
  }

  function logout() {
    user.value = null;
    token.value = '';
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  function initFromStorage() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
    }
  }

  return {
    // State
    user,
    token,
    // Computed properties
    isLogin,
    userName,
    // Methods
    setUser,
    setToken,
    login,
    logout,
    initFromStorage,
  };
});

