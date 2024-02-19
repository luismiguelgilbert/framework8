<script setup lang="ts">
import Excel from 'exceljs';
import type { type_sys_profiles } from '@/typings/server/sys_profiles';
import type { type_sys_companies } from '@/typings/server/sys_companies';
import type { type_sys_users_ids } from '@/typings/server/sys_users_ids';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
})
const emits = defineEmits(['close']);

const columns = [
  { label: 'Correo', key: 'email' },
  { label: 'Nombre', key: 'user_name' },
  { label: 'Apellido', key: 'user_lastname' },
  { label: 'Rol', key: 'profile' },
  { label: 'Organización', key: 'organization' },
  { label: '', key: 'actions' },
];
const uiTableContainer = { 
  rounded: 'rounded-none',
  header: { padding: 'px-1 sm:px-4 py-2', background: 'bg-gray-100 dark:bg-gray-800 xl:rounded-t-lg' },
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
};
type templateRow = {
  email: string,
  user_name: string,
  user_lastname: string,
  profile: string,
  organization: string,
  isRowValid: templateRowValid,
};
type templateRowValid = {
  isEmailValid: boolean,
  isProfileValid: boolean,
  isCompanyValid: boolean,
  isNameValid: boolean,
  isLastnameValid: boolean,
  isValid: boolean,
};

const currentStep = ref(1);
const skipFirstRow = ref(true);
const hasError = ref(false);
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement>();
const selectedFile = ref(undefined);
const rowsWithErrorOnly = ref(false);
const rows = ref<Array<templateRow>>([]);
const sys_users = ref<Array<type_sys_users_ids>>([]);
const sys_companies = ref<Array<type_sys_companies>>([]);
const sys_profiles = ref<Array<type_sys_profiles>>([]);
const isDataValid = computed<boolean>(() => rows.value.some(x => !x.isRowValid.isValid) && rows.value.length <= 0);
const errorsCount = computed<number>(() => rows.value.filter(x => !x.isRowValid.isValid).length);

const readFileContent = (fileRes: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileRes)
    reader.onload = () => {
      resolve(reader.result)
    }
  })
};

const getSheetRows = async (buffer: ArrayBuffer) => {
  let sheetRows: any[] = [];
  try {
    const wb = new Excel.Workbook();
    const workbook = await wb.xlsx.load(buffer as ArrayBuffer);
    workbook.worksheets[0].rowCount;
    workbook.worksheets[0].eachRow((row, rowIndex) => {
      if (skipFirstRow.value && rowIndex === 1) return;
      sheetRows.push({
        email: row.getCell(1).text.trim(),
        user_name: row.getCell(2).text.trim(),
        user_lastname: row.getCell(3).text.trim(),
        profile: row.getCell(4).text.trim(),
        organization: row.getCell(5).text.trim(),
        isRowValid: {
          isEmailValid: false,
          isProfileValid: false,
          isCompanyValid: false,
          isNameValid: false,
          isLastnameValid: false,
          isValid: false,
        },
      });
    });
    hasError.value = false;
    return sheetRows;
  } catch(error) {
    console.error(error);
    hasError.value = true;
    return null;
  }
};

const readCSV = async (event: Event) => {
  try {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const buffer = await readFileContent(target.files[0]);
      const sheetRows = await getSheetRows(buffer);
      if (sheetRows) {
        rows.value = sheetRows;
        currentStep.value = 2;
        isLoading.value = true;
        await getActiveProfiles();
        await getActiveCompanies();
        await getUsersCompanies();
        await validateRows();
        isLoading.value = false;
      }
    }
    hasError.value = false;
  } catch(error) {
    hasError.value = true;
    console.error(error);
  }
};

const resetUploadForm = () => {
  currentStep.value = 1;
  hasError.value = false;
  isLoading.value = false;
  selectedFile.value = undefined;
  rows.value = [];
};

const getActiveProfiles = async () => {
  try {
    const { data, error } = await useFetch('/api/lookups/sys_profiles');
    if (!error.value && data.value) {
      sys_profiles.value = data.value.filter(profile => profile.is_active);
    }
  } catch(error) {
    console.error(error);
  }
};

const getActiveCompanies = async () => {
  try {
    const { data, error } = await useFetch('/api/lookups/sys_companies');
    if (!error.value && data.value) {
      sys_companies.value = data.value;
    }
  } catch(error) {
    console.error(error);
  }
};

const getUsersCompanies = async () => {
  try {
    const { data, error } = await useFetch('/api/lookups/sys_users_ids');
    if (!error.value && data.value) {
      sys_users.value = data.value;
    }
  } catch(error) {
    console.error(error);
  }
};

const isRowValid = (row: templateRow): templateRowValid => {
  const isEmailValid = !sys_users.value.some(user => user.email === row.email);
  const isProfileValid = sys_profiles.value.some(profile => profile.name_es === row.profile);
  const isCompanyValid = sys_companies.value.some(company => company.name_es_short === row.organization);
  const isNameValid = row.user_name?.length > 0;
  const isLastnameValid = row.user_lastname?.length > 0;
  
  return {
    isEmailValid,
    isProfileValid,
    isCompanyValid,
    isNameValid,
    isLastnameValid,
    isValid: isEmailValid && isProfileValid && isCompanyValid && isNameValid && isLastnameValid,
  };
};

const validateRows = () => {
  for (let i = 0; i < rows.value.length; i++) {
    rows.value[i].isRowValid = isRowValid(rows.value[i]);
  }
};

</script>

<template>
  <UModal
    v-model="props.isOpen"
    :ui="{
      padding: 'p-0 sm:p-0',
    }"
    :fullscreen="currentStep === 2"
    prevent-close>
    <UCard :ui="uiTableContainer">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Crear usuarios en lote
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="emits('close')" />
        </div>
      </template>
      <div 
        v-if="currentStep === 1"
        class="max-w-full xl:max-w-2xl mx-auto">
        <UCard :ui="{ rounded: 'rounded-none' }">
          <UCheckbox class="pl-2 pb-1" v-model="skipFirstRow" name="notifications" label="Mi Archivo contiene encabezados" />
          <UInput
            ref="fileInput"
            v-model="selectedFile"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            class="pt-1 pb-2"
            type="file"
            placeholder="Cargar plantilla CSV"
            size="xl"
            icon="i-heroicons-arrow-up-on-square-stack"
            @change="readCSV">
          </UInput>       
        </UCard>
      </div>
      <div v-if="currentStep === 2">
        <UCheckbox
          v-model="rowsWithErrorOnly"
          class="p-4"
          name="errors"
          :label="`Mostrar registros con errores únicamente: ${errorsCount} / ${rows.length}`" />
        <UDivider />
        <UTable
          class="h-[calc(100dvh-190px)] sm:h-[calc(100dvh-190px)] overflow-x-hidden"
          :loading="isLoading"
          :columns="columns"
          :rows="!rowsWithErrorOnly ? rows : rows.filter(row => !row.isRowValid.isValid)">
          <template #email-data="{ row }: { row: templateRow }">
            <span v-if="row.isRowValid.isEmailValid">{{ row.email }}</span>
            <span v-else class="text-red-500">{{ row.email }}<i class="fa-solid fa-triangle-exclamation pl-2"></i></span>
          </template>
          <template #user_name-data="{ row }: { row: templateRow }">
            <span v-if="row.isRowValid.isNameValid">{{ row.user_name }}</span>
            <span v-else class="text-red-500">{{ row.user_name }}<i class="fa-solid fa-triangle-exclamation pl-2"></i></span>
          </template>
          <template #user_lastname-data="{ row }: { row: templateRow }">
            <span v-if="row.isRowValid.isLastnameValid">{{ row.user_lastname }}</span>
            <span v-else class="text-red-500">{{ row.user_lastname }}<i class="fa-solid fa-triangle-exclamation pl-2"></i></span>
          </template>
          <template #profile-data="{ row }: { row: templateRow }">
            <span v-if="row.isRowValid.isProfileValid">{{ row.profile }}</span>
            <span v-else class="text-red-500">{{ row.profile }}<i class="fa-solid fa-triangle-exclamation pl-2"></i></span>
          </template>
          <template #organization-data="{ row }: { row: templateRow }">
            <span v-if="row.isRowValid.isCompanyValid">{{ row.organization }}</span>
            <span v-else class="text-red-500 items-end">{{ row.organization }}<i class="fa-solid fa-triangle-exclamation pl-2"></i></span>
          </template>
          <template #actions-data="{ row }: { row: templateRow }">
            <UButton
              :color="!row.isRowValid.isValid ? 'red' : undefined"
              :icon="!row.isRowValid.isValid ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'"
              variant="ghost" />
          </template>
        </UTable>
      </div>
      <template #footer>
        <div v-if="currentStep === 1">
          <span class="italic">
            <a
              class="text-primary-500 dark:text-primary-400"
              href="/templates/Batch_Upload_Users_Template.xlsx">
              Puede descargar la plantilla aquí.
            </a>
          </span>
        </div>
        <div v-if="currentStep === 2">
          <div class="flex gap-4 justify-center pt-3 mb-5">
            <UButton
              size="xl"
              label="Cancelar" 
              variant="solid"
              color="rose"
              @click="resetUploadForm">
              <template #leading>
                <i class="fa-solid fa-left-long fa-xl pr-2"></i>
              </template>
            </UButton>
            <UButton
              v-if="!isLoading && errorsCount === 0"
              variant="solid"
              :color="errorsCount === 0 ? 'primary' : 'rose'"
              :label="errorsCount === 0 ? 'Crear Usuarios' : 'Existen errores'"
              :loading="isLoading"
              :disabled="isLoading"
              @click="emits('close')">
              <template #leading>
                <i class="fa-solid fa-save fa-xl pr-2"></i>
              </template>
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped lang="scss">
.link-text {
  color: #005199;
}
.link-text:hover {
  color: #f04c25;
}
</style>