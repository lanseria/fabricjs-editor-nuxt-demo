<script lang="ts" setup>
import { vElementSize } from '@vueuse/components'
import { canvasIsReady } from '~/composables/store'

// const props = defineProps({
//   edit: {
//     type: Boolean,
//     default: false,
//   },
// })
const canvasRef = useTemplateRef('canvasRef')
const wrapRef = useTemplateRef('wrapRef')

function onResize({ width, height }: { width: number, height: number }) {
  updateCanvasSize(width, height)
}
const debouncedOnResize = useDebounceFn(onResize, 300)

onMounted(async () => {
  await until(canvasFabric).toBe(undefined)
  console.warn('[PolygonLink.vue]:', 'onMounted')
  await initCanvasBasicPlugin(canvasRef, wrapRef)
  canvasIsReady.value = true
  // 添加滚轮缩放事件
  onWheelPlugin()
  // 添加鼠标拖拽事件
  bindGrabPlugin()
  // if (props.edit) {
  // 监听所有对象变化
  // onObjectChange()
  // }
})

onUnmounted(() => {
  console.warn('[PolygonLink.vue]:', 'onUnmounted')
  // 解绑滚轮缩放事件
  unbindGrabPlugin()
  // if (props.edit) {
  // 卸载监听所有对象变化
  // offObjectChange()
  // }
  // 卸载fabric画布
  disposeCanvasBasicPlugin()
  canvasIsReady.value = false
})
</script>

<template>
  <div class="shrink grow basis-0 overflow-hidden bg-[#f1f1f1]">
    <div ref="wrapRef" v-element-size="debouncedOnResize" class="relative h-full w-full">
      <div class="pointer-events-none absolute z-10 h-full w-full shadow-[inset_0_0_9px_2px_#0000001f]" />
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>
