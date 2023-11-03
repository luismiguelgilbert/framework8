<script setup lang="ts">
//import { security_roles_schema } from '@/typings/client/securityRoles'
//import Basic from './basic.vue'
//import Permissions from './permissions.vue'
//import Users from './users.vue'

const route = useRoute();
const { currentRoute } = useRouter();
// const state = useSecurityRoles();
const toast = useToast();
const myAxios = useAxios();
const recordID = route.params.id;
const currenTab = ref('basic');

const tabs = [
  { slot: 'basic', value: 'basic', label: 'Información del Perfil', icon: 'i-heroicons-identification', defaultOpen: true },
  { slot: 'links', value: 'links', label: 'Permisos', icon: 'i-heroicons-lock-closed', defaultOpen: false },
  { slot: 'users', value: 'users',label: 'Usuarios con este perfil', icon: 'i-heroicons-users', defaultOpen: false },
]
const uiCard = {
  rounded: 'rounded-none sm:rounded-lg',
  body: 'px-0',
  header: {
    padding: 'sm:px-2 px-2 py-3',
  },
  footer: {
    padding: 'px-0 py-0 sm:px-0'
  }
}

const goBack = () => { 
  const queryParams = currentRoute.value.query;
  const querystring = Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&');
  navigateTo(`/security/users/${querystring ? `?${querystring}` : ''}`);
}
// const validateAndSave = async () => {
//   try {
//     state.value.isLoading = true;
//     const res = security_roles_schema.safeParse(state.value);
//     if (!res.success) {
//       toast.add({ 
//         title: 'Error al guardar perfil',
//         description: res.error.issues.map((issue) => issue.message).join('\n'),
//         icon: 'i-heroicons-exclamation-triangle',
//         color: 'red',
//         timeout: 0,
//       });
//       console.error(res);
//       return;
//     } else {
//       const body = {
//         profile_data: state.value.profileData,
//         profile_links: state.value.profileLinks,
//       }
//       if (recordID === 'new') {
//         const { data } = await myAxios.post(`/api/roles/${recordID}`, body);
//         navigateTo(`/security/roles/${data.id}`);
//       } else {
//         await myAxios.patch(`/api/roles/${recordID}`, body);
//       }
//       toast.add({
//         title: 'Perfil guardado',
//         icon: 'i-heroicons-check-circle',
//         color: 'primary'
//       });
//     }
//   } catch(error) {
//     console.error(error);
//     toast.add({ 
//       title: 'Error al guardar perfil',
//       icon: 'i-heroicons-exclamation-triangle',
//       color: 'red'
//     });
//   } finally {
//     state.value.isLoading = false;
//   }
// }
// const resetData = () => {
//   state.value.usersData = [];
//   state.value.profileLinks = [];
//   state.value.allLinks = [];
// }
// onMounted(() => {
//   resetData();
//   if (!isNaN(Number(recordID))) {
//     state.value.isLoading = true;
//     const promise1 = myAxios.get(`/api/roles/${recordID}`);
//     const promise2 = myAxios.get(`/api/roles/${recordID}/users`);
//     const promise3 = myAxios.get(`/api/roles/${recordID}/sys_links`);
//     const promise4 = myAxios.get(`/api/lookups/sys_links`);
//     Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
//       state.value.profileData = values[0].data;
//       state.value.usersData = values[1].data;
//       state.value.profileLinks = values[2].data;
//       state.value.allLinks = values[3].data;
//       state.value.isLoading = false;
//     });
//   } else {
//     state.value.isLoading = true;
//     const promise1 = myAxios.get(`/api/lookups/sys_links`);
//     Promise.all([promise1]).then((values) => {
//       state.value.allLinks = values[0].data;
//       state.value.profileData.name_es = 'Nuevo Perfil';
//       state.value.isLoading = false;
//     });
//   }
// });
</script>

<template>
  <div class="max-w-3xl mx-auto"><!--Required to prevent hydration mismatch-->
    Pendiente
  </div>
</template>