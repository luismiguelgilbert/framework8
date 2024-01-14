<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineProps({
  requiresCompany: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  isLoading: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  isSideOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  selectedFilter: {
    type: String as PropType<string>,
    required: true,
    default: '?',
  },
  selectedSort: {
    type: String as PropType<string>,
    required: true,
    default: '?',
  },
  rowsNumber: {
    type: String as PropType<number>,
    required: true,
    default: 0,
  },
});
const emits = defineEmits(['table-scroll']);

const uiTableContainer = { 
  rounded: 'rounded-none xl:rounded-lg',
  header: { padding: 'px-1 sm:px-4 py-2', background: 'bg-gray-100 dark:bg-gray-800 xl:rounded-t-lg' },
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' } ,
};
const uiSlide = {width: 'w-screen max-w-lg'};
const mainState = useUser();
const userCompanyName = computed<string>(() => mainState.value.userCompanies.find(x=>x.id === mainState.value.userCompany)?.name_es_short ?? '');

const breakpoints = useBreakpoints(breakpointsTailwind);
const lgAndLarger = breakpoints.greaterOrEqual('lg');

const onScroll = (event: UIEvent) => {
  emits('table-scroll', event);
}

</script>

<template>
  <div class="max-w-full xl:max-w-3xl mx-auto mt-0 xl:mt-3">
    <UCard :ui="uiTableContainer">
      <!--HEADER-->
      <template #header>
        <UBreadcrumb
          v-if="requiresCompany"
          class="pl-1"
          :links="[{ label: userCompanyName, icon: 'i-heroicons-building-office', },]"
        />
        <div class="flex items-center justify-between gap-3">
          <span>
            <UIcon name="pl-1 fas fa-filter text-gray-400" />
            <span class="pl-2 font-bold">{{ selectedFilter }}</span>
            <UIcon v-if="lgAndLarger" name="pl-6 fas fa-arrow-up-short-wide text-gray-500" />
            <span v-if="lgAndLarger" class="pl-2 font-bold">{{ selectedSort }}</span>
          </span>
          <span v-if="!isLoading" class="font-semibold pr-1">{{ rowsNumber }} registros</span>
          <USkeleton
            v-else class="h-4 w-[100px]"
            :ui="{ background: 'bg-primary-400 dark:bg-primary-800'}" />
        </div>
      </template>
      <!--BODY-->
      <div 
        class="h-[calc(100dvh-95px)] sm:h-[calc(100dvh-120px)] overflow-x-hidden"
        :class="requiresCompany ? 'xl:h-[calc(100dvh-190px)]' : 'xl:h-[calc(100dvh-170px)]'"
        @scroll="onScroll">
        <UProgress v-if="isLoading" animation="carousel" class="max-w-3xl absolute z-50" />
        <slot name="table"></slot>
        <br /><br />
      </div>
    </UCard>
    <USlideover
      :ui="uiSlide"
      :model-value="isSideOpen"
      prevent-close>
      <slot name="editForm"></slot>
    </USlideover>
  </div>
</template>