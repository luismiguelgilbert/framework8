<script setup lang="ts">
const state = useSecurityRoles();

const columns = [
  { key: 'avatar_url', name: 'avatar_url', field: 'avatar_url', label: 'Foto' },
  { key: 'user_name', name: 'user_name', field: 'user_name', label: 'Nombres' },
  { key: 'last_sign_in_at', name: 'last_sign_in_at', field: 'last_sign_in_at', label: 'Último Ingreso' },
]
const uiCard = {
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Usuarios con este Perfil</span></div>
    <UCard
      class="w-full"
      :ui="uiCard">
      <UTable
        :columns="columns"
        :rows="state.usersData">
        <!--Avatar-->
        <template #avatar_url-data="{ row }">
          <UAvatar
            :src="row.avatar_url"
            :alt="row.email" />
        </template>
        <!--Nombre-->
        <template #user_name-data="{ row }">
          <div class="flex flex-col py-0">
            <dd class="font-semibold">{{ row.user_name }} {{ row.user_lastname }}</dd>
            <dt>
              <i class="fa-solid fa-envelope fa-sm text-gray-400"></i> {{ row.email }}
            </dt>
          </div>
        </template>
        <!--Estado-->
        <template #last_sign_in_at-header>
          <span class="hidden sm:block">Fecha Creación</span>
        </template>
        <template #last_sign_in_at-data="{ row }">
          <span class="hidden sm:block">
            {{ new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(row.last_sign_in_at)) }}
          </span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>