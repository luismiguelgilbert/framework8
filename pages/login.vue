<script setup lang="ts">
import { AuthError } from '@supabase/supabase-js';
useHead({ title: 'BITT - Ingreso' });

definePageMeta({
  layout: "login",
});
const supabase = useSupabaseClient();
const loading = ref<boolean>(false);
const loginError = ref<AuthError>(new AuthError('', 0))
const credentials = ref({
  email: '',
  password: '',
});
const uiCard = { 
  rounded: 'rounded-none sm:rounded-lg',
  shadow: 'shadow-none sm:shadow',
  ring: 'ring-0 sm:ring-1 ring-gray-200 dark:ring-gray-800',
};

const login = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signInWithPassword(credentials.value);
    error && (loginError.value = error);
    if (!error) {
      generateSBcookies();
      navigateTo('/');
    } else {
      loading.value = false;
    }
  } catch(error) {
    loading.value = false;
    console.error(error);
  }
}

const loginFromCookiesOrLocalStorage = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.refreshSession();
    if (!error) {
      generateSBcookies();
      navigateTo('/');
    } else{
      loading.value = false;
    }
  } catch(error) {
    loading.value = false;
    console.error(error);
  }
}

const generateSBcookies = () => {
  try {
    //Generate sb-access-token cookie from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('sb-') && key.includes('token')) {
        const supabaseStorageData = JSON.parse(localStorage[key]);
        const supabaseAccessToken = supabaseStorageData.access_token;
        createCookie('sb-access-token', supabaseAccessToken, 1);
      }
    });
    //Generate sb-refresh-token cookie from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('sb-') && key.includes('token')) {
        const supabaseStorageData = JSON.parse(localStorage[key]);
        const supabaseRefreshToken = supabaseStorageData.refresh_token;
        createCookie('sb-refresh-token', supabaseRefreshToken, 1);
      }
    });
  } catch(error) {
    loading.value = false;
    console.error(error);
  }
}

const createCookie = (name: string, value: string, days: number) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; samesite=strict;`; //";secure" breaks local development
}

const resetLoginError = () => {
  loginError.value = new AuthError('', 0);
}

onMounted(async () => {
  resetLoginError();
  await loginFromCookiesOrLocalStorage();
});
</script>

<template>
  <div class="sm:h-screen h-full flex items-center justify-center">
    <UCard 
      class="mt-0 sm:mt-2 w-full sm:w-2/6"
      :ui="uiCard" >
      <template #header>
        <h5 class="text-xl text-neutral-600 font-bold dark:text-white">Ingreso a BITT</h5>
      </template>
      <UFormGroup class="px-2 py-0" label="Email" name="email" required>
        <UInput
          v-model:model-value="credentials.email"
          :disabled="loading"
          required
          label="Correo electrónico"
          size="xl"
          autocomplete="username"
          type="email"
          name="email"
          icon="i-heroicons-user-circle"
          placeholder="Ingrese su correo">
        </UInput>
      </UFormGroup>
      <UFormGroup class="px-2 py-2" label="Contraseña" name="password" required>
        <UInput
          v-model:model-value="credentials.password"
          :disabled="loading"
          required
          label="Correo electrónico"
          size="xl"
          autocomplete="current-password"
          type="password"
          name="password"
          icon="i-heroicons-key"
          placeholder="Ingrese su contraseña">
        </UInput>
      </UFormGroup>
      <UFormGroup class="px-2 pt-4">
        <UButton
          size="xl"
          block
          label="Login"
          :loading="loading"
          @click="login" />
      </UFormGroup>
      <UFormGroup class="px-2 py-1">
        <UAlert
          v-if="loginError.status !== 0"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
          :title="loginError.message"
          icon="i-heroicons-shield-exclamation"
          color="red"
          variant="soft"
          @close="resetLoginError" />
      </UFormGroup>
    </UCard>
  </div>
</template>