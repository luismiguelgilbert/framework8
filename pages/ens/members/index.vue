<script setup lang="ts">
useHead({ title: 'ENS - Equipistas' });
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const state = useUser();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');
const rows = ref([]);
</script>

<template>
  <div><!--Required to prevent hydration mismatch-->
    <UTable
      :rows="rows" />
  </div>
</template>