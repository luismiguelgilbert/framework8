<script setup lang="ts">
export interface LoginSSRProps {
  error?: string | undefined,
}
const props = withDefaults(defineProps<LoginSSRProps>(), {
  error: '',
})
</script>
<template>
  <div class="sm:h-screen h-full flex items-center justify-center">
    <UCard class="mt-0 sm:mt-2 w-full sm:w-2/6">
      <template #header>
        <h5 class="text-xl text-neutral-600 font-bold dark:text-white">Ingreso a BITT</h5>
      </template>
      <form
        class="space-y-6"
        method="POST"
        action="/api/login">
        <UFormGroup label="Email" name="email">
          <UInput
            required
            label="Correo electrónico"
            size="xl"
            autocomplete="username"
            type="email"
            name="email"
            placeholder="Ingrese su correo">
            <template #leading>
              <i class="far fa-envelope fa-xl text-gray-500"></i>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup label="Contraseña" name="password">
          <UInput
            required
            label="Correo electrónico"
            size="xl"
            autocomplete="current-password"
            type="password"
            name="password"
            placeholder="Ingrese su contraseña">
            <template #leading>
              <i class="fas fa-key fa-xl text-gray-500"></i>
            </template>
          </UInput>
        </UFormGroup>
        <UButton
          block
          size="xl"
          type="submit"
          label="Login">
          <template #leading>
            <i class="fas fa-square-up-right fa-xl"></i>
          </template>
        </UButton>
      </form>
      <template #footer>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
          Not registered? <a href="#" class="text-primary-700 hover:underline dark:text-primary-500">Create account</a>
        </div>
      </template>
    </UCard>
  </div>
</template>