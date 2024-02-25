<script setup lang="ts">
export interface textProps {
  name: string,
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url',
  required: boolean,
  icon?: string,
  label?: string,
  placeholder?: string,
}
const props = withDefaults(defineProps<textProps>(), {
  type: 'text',
  required: false,
})
const hasIcon = computed<boolean>(() => props.icon ? true : false );

</script>

<template>
  <div class="relative mb-6">
    <!--Label-->
    <label
      v-if="props.label"
      :for="props.name"
      class="mb-2 ml-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ props.label }}
    </label>
    <!--Icon-->
    <div
      v-if="hasIcon"
      class="relative inset-y-7 left-0 flex items-center pl-3.5 pointer-events-none"
      >
      <i
        class="text-gray-500 dark:text-gray-300"
        :class="`${props.icon} `">
      </i>
    </div>
    <!--Input-->
    <input 
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      :required="props.required"
      class="text-2xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      :class="{
        'pl-12': hasIcon,
      }">
  </div>
</template>