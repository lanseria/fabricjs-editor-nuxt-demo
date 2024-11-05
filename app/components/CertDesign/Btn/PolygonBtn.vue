<script setup lang="ts">
function toggleDrawMode() {
  if (isDrawingMode.value) {
    console.warn('[PolygonBtn.vue]:', 'stopPolygonDrawing')
    stopPolygonDrawing()
  }
  else {
    console.warn('[PolygonBtn.vue]:', 'startPolygonDrawing')
    startPolygonDrawing()
  }
}
</script>

<template>
  <button class="inline-flex items-center gap-1 btn" :class="{ 'bg-amber-5 hover:bg-amber-7': isDrawingMode }" @click="toggleDrawMode()">
    <div class="i-carbon-pentagon-down-outline text-14px" />
    <slot />
  </button>
</template>
