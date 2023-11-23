<script setup lang="ts">
import { AuthError } from '@supabase/supabase-js';
useHead({ title: 'BITT - Ingreso' });
const supabase = useSupabaseClient();

definePageMeta({
  layout: "login",
});
//const route = useRoute();
//const myAxios = useAxios();
const items = [{
  key: 'account',
  label: 'Ingreso',
  icon: 'i-heroicons-arrow-top-right-on-square',
  slot: 'login',
}, {
  key: 'password',
  label: 'Registro',
  icon: 'i-heroicons-user-plus',
  slot: 'register',
}];
const loading = ref<boolean>(false);
const loginError = ref<AuthError>();
const credentials = ref({
  email: '',
  password: '',
});
//const error = String(route.query.error) ?? null;

// const refreshSessionFromCookies = async () => {
//   try {
//     await myAxios.post('/api/refresh-session');
//     navigateTo('/');
//   } catch(error) {
//     console.error(error);
//   }
// }
//HOOKS

const login = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signInWithPassword(credentials.value);
    error && (loginError.value = error);
    if (!error) {
      navigateTo('/');
    }
  } catch(error) {
    loading.value = false;
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try{
    const cat = localStorage.getItem("myCat");
    // await refreshSessionFromCookies();
  }catch(error){
    console.error(error);
  }
});
</script>

<template>
  <div class="sm:h-screen h-full flex items-center justify-center">
    <UCard 
      class="mt-0 sm:mt-2 w-full sm:w-2/6"
      :ui="{ 
        rounded: 'rounded-none sm:rounded-lg',
      }" >
      <!--<template #header>
        <h5 class="text-xl text-neutral-600 font-bold dark:text-white">Ingreso a BITT</h5>
      </template>-->

      <UTabs :items="items" class="w-full">
        <template #default="{ item, index, selected }">
          <div class="flex items-center gap-2 relative truncate">
            <span class="truncate">{{ item.label }}</span>
            <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
          </div>
        </template>
        <template #login>
          <UFormGroup class="px-2 py-4" label="Email" name="email" required>
            <UInput
              v-model:model-value="credentials.email"
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
          <UFormGroup class="px-2 py-4">
            <UButton
              size="xl"
              block
              label="Login"
              :disabled="credentials.email === '' || credentials.password === ''"
              :loading="loading"
              @click="login" />
          </UFormGroup>
          <UFormGroup class="px-2 py-1">
            <UAlert
              v-if="loginError?.message"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
              icon="i-heroicons-shield-exclamation"
              color="red"
              variant="soft"
              :title="loginError.message"
              @close="loginError = undefined" />
          </UFormGroup>
        </template>
        <template #register="{ item }">
          Register
        </template>
        <!--<template #item="{ item }">
          <UCard>
            <div v-if="item.key === 'account'" class="space-y-3">
              <UFormGroup label="Email" name="email" required>
                <UInput
                  v-model:model-value="credentials.email"
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
              <UFormGroup label="Contraseña" name="password" required>
                <UInput
                  v-model:model-value="credentials.password"
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
            </div>
            <div v-else-if="item.key === 'password'" class="space-y-3">
              <UFormGroup label="Current Password" name="current" required>
                <UInput v-model="credentials.email" />
              </UFormGroup>
              <UFormGroup label="New Password" name="new" required>
                <UInput v-model="credentials.password" type="password" required />
              </UFormGroup>
            </div>

            <template #footer>
              <UButton
                block
                size="xl"
                label="Login"
                :disabled="loading"
                :loading="loading"
                @click="login" >
              </UButton>
            </template>
          </UCard>
        </template>-->
      </UTabs>
      <!--<form
        class="space-y-6"
        method="POST"
        action="/api/login">-->
        <!--<UAlert
          v-if="props.error === 'invalid'"
          icon="fa-solid fa-building-lock"
          color="red"
          variant="solid"
          title="Login incorrecto"
          description="Intente nuevamente."
        />
        <UAlert
          v-if="props.error === 'expired'"
          icon="fa-solid fa-hourglass-end"
          color="red"
          variant="solid"
          title="Sesión expirada"
          description="Vuelva a ingresar."
        />-->
      <!--</form>-->
      <!--<template #footer>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
          Not registered? <a href="#" class="text-primary-700 hover:underline dark:text-primary-500">Create account</a>
        </div>
      </template>-->
    </UCard>
  </div>
</template>