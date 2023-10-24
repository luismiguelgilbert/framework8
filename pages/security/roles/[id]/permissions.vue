<script setup lang="ts">
const state = useSecurityRoles();

const allLinksRoot = computed(() => state.value.allLinks.filter(object => object.parent === null));

</script>

<template>
  <div class="mx-5">
    <UFormGroup
      name="profileLinks">
      <div
        v-for="(rootMenu, index) in allLinksRoot"
        :key="index">
        <h5 class="pt-2 text-md text-neutral-600 font-bold dark:text-white">
          {{ rootMenu.name_es }}
        </h5>
        <div
          v-for="(menu, index) in state.allLinks.filter(object => object.parent === rootMenu.id)"
          :key="index"
          class="py-2">
          <UCheckbox
            :label="menu.name_es!"
            :help="menu.comment_es!"
            v-model="state.profileLinks"
            :value="menu" />
        </div>
      </div>
    </UFormGroup>
  </div>
</template>