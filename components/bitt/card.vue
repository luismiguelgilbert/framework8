<script setup lang="ts">
export interface cardProps {
  hideBorderOnSmall: boolean,
}
const props = withDefaults(defineProps<cardProps>(), {
  hideBorderOnSmall: true,
})
</script>
<template>
  <div
    class="border-gray-200 rounded-lg p-2 sm:p-8 md:p-8 dark:bg-neutral-900 dark:border-neutral-700"
    :class="{
      'md:border': props.hideBorderOnSmall,
      'border': !props.hideBorderOnSmall,
      'md:shadow': props.hideBorderOnSmall,
      'shadow': !props.hideBorderOnSmall,
    }">
      <slot name="default"></slot>
  </div>
</template>