<script lang="ts" setup>
import { globalCanvas } from '#imports'
import { fabric } from 'fabric'

const CanvasRef = useTemplateRef('CanvasRef')

onMounted(() => {
  const value = new fabric.Canvas(CanvasRef.value, {
    // 禁用多选
    selection: false,
    preserveObjectStacking: true,
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
  })
  globalCanvas.value = value
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex flex-none items-center justify-between border-b-1px px-4 py-2">
      <div class="text-20px text-dark font-bold">
        证书设计
      </div>
      <div class="flex gap-2">
        <div class="btn">
          预览
        </div>
        <div class="btn">
          导出
        </div>
      </div>
    </div>
    <div class="flex flex-1">
      <div class="flex-1 bg-[#f1f1f1]">
        <div class="relative h-full w-full">
          <div class="pointer-events-none absolute z-10 h-full w-full shadow-[inset_0_0_9px_2px_#0000001f]" />
          <canvas ref="CanvasRef" />
        </div>
      </div>
      <div class="w-400px overflow-y-auto px-10px py-20px">
        2
      </div>
    </div>
  </div>
</template>
