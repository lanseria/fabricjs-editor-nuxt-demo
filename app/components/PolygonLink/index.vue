<script lang="ts" setup>
const canvasRef = useTemplateRef('canvasRef')
const wrapRef = useTemplateRef('wrapRef')
onMounted(() => {
  initCanvasBasicPlugin(canvasRef, wrapRef)
  bindGrabPlugin()
  window.addEventListener('resize', handleResizeWindowPlugin(wrapRef))
  window.addEventListener('keydown', handleKeyDownWindowPlugin)
  window.addEventListener('keyup', handleKeyUpWindowPlugin)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResizeWindowPlugin(wrapRef))
  window.removeEventListener('keydown', handleKeyDownWindowPlugin)
  window.removeEventListener('keyup', handleKeyUpWindowPlugin)
  disposeCanvasBasicPlugin()
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex flex-none items-center justify-between border-b-1px px-4 py-2">
      <div class="text-20px text-dark font-bold">
        Polygon Link
      </div>
      <div class="flex gap-2">
        <button class="btn">
          重置
        </button>
        <button class="btn">
          预览
        </button>
        <button class="btn">
          导出
        </button>
      </div>
    </div>
    <div class="flex flex-1">
      <div class="w-300px flex-none overflow-y-auto px-10px py-20px">
        <div>
          <div class="text-14px text-dark font-bold">
            页面
          </div>
          <div class="h-10px w-full" />
        </div>
      </div>
      <div class="shrink grow basis-0 overflow-hidden bg-[#f1f1f1]">
        <div ref="wrapRef" class="relative h-full w-full">
          <div class="pointer-events-none absolute z-10 h-full w-full shadow-[inset_0_0_9px_2px_#0000001f]" />
          <canvas ref="canvasRef" />
        </div>
      </div>
      <div class="w-400px flex-none overflow-y-auto px-10px py-20px">
        TODO
      </div>
    </div>
  </div>
</template>
