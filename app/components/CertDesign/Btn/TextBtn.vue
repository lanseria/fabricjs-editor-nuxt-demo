<script setup lang="ts">
</script>

<template>
  <button class="inline-flex items-center gap-1 btn" @click="onFabricCanvasAddText('文字')">
    <div class="i-carbon-pentagon-down-outline text-14px" />
    <slot />
  </button>
</template>
