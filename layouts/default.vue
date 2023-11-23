<template>
  <div>
    <HomeSide />
    <div class="sm:ml-64">
      <!--<div class="p-0 sm:p-4 h-[calc(100dvh-67px)] sm:h-[calc(100dvh)] overflow-hidden bg-gray-50 dark:bg-gray-800" >-->
      <div class="p-0 h-[calc(100dvh)] sm:h-[calc(100dvh)] overflow-hidden bg-gray-50 dark:bg-gray-900" >
        <slot />
      </div>
    </div>
  </div>
</template>