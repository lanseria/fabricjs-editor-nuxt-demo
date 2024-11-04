<script setup lang="ts">
function toggleDrawMode() {
  if (isDrawingMode.value) {
    stopPolygonDrawing()
  }
  else {
    startPolygonDrawing()
  }
}
</script>

<template>
  <button class="inline-flex items-center gap-1 btn" :disabled="isDrawingMode" @click="toggleDrawMode()">
    <div class="i-carbon-pentagon-down-outline text-14px" />
    <slot />
  </button>
</template>
