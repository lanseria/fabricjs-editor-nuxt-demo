<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})

onMounted(() => {
  queryAllData()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
