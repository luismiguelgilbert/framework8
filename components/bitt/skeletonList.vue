<script setup lang="ts">
export interface skeletonListProps {
  items: number,
}

const props = withDefaults(defineProps<skeletonListProps>(), {
  items: 1,
})

</script>
<template>
  <div class="columns-1 items-center space-x-0 space-y-2">
    <div
      v-for="(item, index) in props.items"
      :key="index"
      class="space-y-2">
      <USkeleton class="h-4 w-[250px] " />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>