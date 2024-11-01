<script lang="ts" setup>
import { vElementSize } from '@vueuse/components'
import Setting from './Setting.vue'
import WorkspaceSize from './WorkspaceSize.vue'

const canvasRef = useTemplateRef('canvasRef')
const wrapRef = useTemplateRef('wrapRef')

function onResize({ width, height }: { width: number, height: number }) {
  onFabricCanvasResize(width, height)
}

useFabricCanvas(canvasRef, wrapRef)
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex flex-none items-center justify-between border-b-1px px-4 py-2">
      <div class="text-20px text-dark font-bold">
        证书设计
      </div>
      <div class="flex gap-2">
        <button class="btn">
          预览
        </button>
        <button class="btn">
          导出
        </button>
      </div>
    </div>
    <div class="flex flex-1">
      <div class="shrink grow basis-0 overflow-hidden bg-[#f1f1f1]">
        <div ref="wrapRef" v-element-size="onResize" class="relative h-full w-full">
          <div class="pointer-events-none absolute z-10 h-full w-full shadow-[inset_0_0_9px_2px_#0000001f]" />
          <canvas ref="canvasRef" />
        </div>
      </div>
      <div class="w-400px flex-none overflow-y-auto px-10px py-20px">
        <div>
          <div class="text-14px text-dark font-bold">
            画布大小
          </div>
          <div class="h-10px w-full" />
          <WorkspaceSize />
        </div>
        <div class="my-20px h-1px w-full bg-[#f1f1f1]" />
        <div>
          <div class="text-14px text-dark font-bold">
            设置证书
          </div>
          <div class="h-10px w-full" />
          <Setting />
        </div>
      </div>
    </div>
  </div>
</template>
