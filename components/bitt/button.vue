<script setup lang="ts">
export interface buttonProps {
  name: string,
  type: 'submit' | 'button' | 'reset',
  size: 'small' | 'medium' | 'large',
  color: 'primary' | 'indigo' | 'emerald' | 'sky',
  icon?: string,
  label?: string,
  fullWidth?: boolean,
  square: boolean,
  flat: boolean,
}
const props = withDefaults(defineProps<buttonProps>(), {
  type: 'button',
  size: 'medium',
  color: 'primary',
  square: false,
  flat: false,
})

const hasIcon = computed<boolean>(() => props.icon ? true : false );
const isFlat = computed<boolean>(() => props.flat ? true : false );

</script>

<template>
  <!--bg-primary-700-->
  <button
    class="h-14 hover:bg-primary-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium  text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
    :class="{
      'w-full': props.fullWidth,
      'rounded-lg' : !props.square,
      'bg-transparent' : isFlat,
      'text-gray-600' : isFlat,
      'dark:text-white' : isFlat,
      'bg-primary-500' : (!isFlat && props.color === 'primary'),
      'bg-indigo-500' : (!isFlat && props.color === 'indigo'),
      'bg-emerald-500' : (!isFlat && props.color === 'emerald'),
      'bg-sky-500' : (!isFlat && props.color === 'sky'),
      'text-white' : !isFlat,
    }">
    <i v-if="hasIcon"
      class="pr-2"
      :class="`${props.icon} `">
    </i>
    {{ props.label }}
  </button>
</template>