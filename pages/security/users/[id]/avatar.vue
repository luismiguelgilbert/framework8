<script setup lang="ts">
const state = useSecurityUsers();
const myAxios = useAxios();
const toast = useToast()


const uploadFile = async (file: Event) => {
  try {
    if (file.target === null) return;
    const htmlInputElement = file.target as HTMLInputElement;
    if (htmlInputElement?.files && htmlInputElement.files.length > 0) {
      state.value.isLoading = true;
      const avatar = htmlInputElement.files[0];
      const recordID = state.value.userData.id;
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${recordID}.${fileExt}`;
      const supabaseBucket = useSupabaseClient();

      //Remove file
      if(state.value.userData.avatar_url) {
        const fileNameToRemove = state.value.userData.avatar_url.split('/avatars/')[1];
        await supabaseBucket.storage.from('avatars').remove([fileNameToRemove]);
      }

      //Updload file to avatars bucket
      const { data: updloadedFileData, error: uploadError } = await supabaseBucket.storage
        .from('avatars')
        .upload(fileName, avatar, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        state.value.isLoading = false;
        console.error(uploadError);
        return null;
      }

      //Update avatar_url field on database
      const { data: avatarPathData } = supabaseBucket.storage
        .from('avatars')
        .getPublicUrl(updloadedFileData.path);
      
      await myAxios.patch(`/api/users/${state.value.userData.id}/preferences`, { avatar_url: avatarPathData.publicUrl });
      state.value.userData.avatar_url = avatarPathData.publicUrl;
      state.value.isLoading = false;
      
      //Notify success
      toast.add({
        id: 'success_update_avatar',
        title: 'Avatar guardado',
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 1500,
      })
    }
  } catch (error) {
    state.value.isLoading = false;
    console.error(error);
    toast.add({
      id: 'error_update_avatar',
      title: 'No se pudo cargar Avatar',
      color: 'rose',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 1500,
    })
  }
}
</script>

<template>
  <div class="mx-2">
    <div class="ml-2 mb-2"><span class="font-semibold text-lg">Reemplazar avatar</span></div>
      <UCard>
        <NuxtPicture
          class="center"
          v-if="state.userData.avatar_url"
          :src="state.userData.avatar_url"
          width="150"
          height="150"
        />
        <template #footer>
          <input
            type="file"
            accept="image/*"
            @change="uploadFile" />
        </template>
      </UCard>
  </div>
  
</template>

<style scoped lang="scss">
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
</style>