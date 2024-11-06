<script setup lang="ts">
import { addStar } from '~/composables/PolygonLink/plugins/demo'

function drawPolygon() {
  addStar()
}
</script>

<template>
  <button class="inline-flex items-center gap-1 btn" @click="drawPolygon()">
    <div class="i-carbon-pentagon-down-outline text-14px" />
    <slot />
  </button>
</template>
