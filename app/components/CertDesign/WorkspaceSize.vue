<script lang="ts" setup>
import { fabricCanvasWorkspaceSize, setFabricCanvasResize } from '#imports'
</script>

<template>
  <div class="flex gap-4">
    <div class="flex items-center gap-2">
      <div class="text-14px text-dark">
        宽度
      </div>
      <input
        v-model="fabricCanvasWorkspaceSize.width"
        type="number"
        class="ipt w-100px"
        placeholder="输入宽度"
      >
    </div>
    <div class="flex items-center gap-2">
      <div class="text-14px text-dark">
        高度
      </div>
      <input
        v-model="fabricCanvasWorkspaceSize.height"
        type="number"
        class="ipt w-100px"
        placeholder="输入高度"
      >
    </div>
    <button class="btn" @click="setFabricCanvasResize(true)">
      应用
    </button>
  </div>
</template>
