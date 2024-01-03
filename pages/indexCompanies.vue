<script setup lang="ts">
const state = useUser();
const myAxios = useAxios();

const setPreferedCompany = async (company: string) => {
  try {
    await myAxios.patch(`/api/users/${state.value.userData.id}/preferences`, { prefered_company: company });
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="mx-5 py-1 sm:py-3">
    <div class="ml-2 mb-2">
      <span class="font-semibold text-lg">Seleccione su Compañía Predeterminada</span>
    </div>
    <URadioGroup
      class="px-5 py-2"
      v-model="state.userCompany"
      optionAttribute="name_es_short"
      valueAttribute="id"
      :options="state.userCompanies"
      @update:modelValue="setPreferedCompany" />
    <br /><br />
  </div>
</template>