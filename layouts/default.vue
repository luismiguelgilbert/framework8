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

<style scoped lang="scss">
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>