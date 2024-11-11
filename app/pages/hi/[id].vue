<script lang="ts" setup>
import { canvasIsReady } from '~/composables/store'

const route = useRoute<'hi-id'>()
const router = useRouter()
const id = computed(() => route.params.id)
const pageName = computed(() => {
  const item = globalPageList.value.find(i => i.id === id.value)
  if (item)
    return item.name
  else
    return ''
})
const currentPageLayerList = computed(() => {
  return globalLayerList.value.filter(item => item.pageId === id.value)
})
function onLayerDelete(record: PolygonWithTextOptions) {
  onPolygonDelete(record.name)
  globalLayerList.value = globalLayerList.value.filter(item => item.name !== record.name)
}
function onLayerEdit(record: PolygonWithTextOptions) {
  currentPageId.value = record.pageId
  emitter.emit('polygon:updated', { name: record.name, id: record.riskAnalysisObjectId })
}
async function onPageLayerSave() {
  const formData: PostPageLayerList = {
    pageId: id.value,
    children: currentPageLayerList.value,
  }
  await postPageLayerList(formData)
  await fetchLayerList()
  router.back()
}
function toggleDrawMode() {
  if (!id.value) {
    console.error('请先选择页面ID', id.value)
    Message.warning('请先选择页面ID')
    return
  }
  currentPageId.value = id.value
  if (isDrawingMode.value) {
    console.warn('[PolygonBtn.vue]:', 'stopPolygonDrawing')
    stopPolygonDrawing()
  }
  else {
    console.warn('[PolygonBtn.vue]:', 'startPolygonDrawing')
    startPolygonDrawing()
  }
}
onMounted(async () => {
  console.warn('[id.vue]:', 'onMounted', canvasIsReady.value)
  await until(canvasIsReady).toBe(true)
  await until(canvasFabric).not.toBe(undefined)
  console.warn('[id.vue]:', 'onPolygonInitAdd')
  await fetchLayerList()
  currentPageLayerList.value.forEach((item) => {
    onPolygonInitAdd(item)
  })
})

onUnmounted(() => {
  globalLayerList.value = []
  console.warn('[id.vue]:', 'onUnmounted')
})
</script>

<template>
  <div class="h-full flex shrink grow basis-0 overflow-hidden">
    <div class="flex flex-col border-r-1px border-gray-1">
      <ToolBtn icon-name="i-carbon-area-custom" tooltip-name="多边形" :active="isDrawingMode" @click="toggleDrawMode()" />
      <PolygonLinkBindRiskAnalysisObjectModal />
    </div>
    <div class="w-300px flex-none border-r-1px border-gray-1">
      <div class="flex items-center justify-between gap-2 border-b-1px border-gray-1 px-4 py-2">
        <div class="flex items-center">
          <div class="text-14px font-bold">
            {{ pageName }}
          </div>
          <div>
            图层
          </div>
        </div>
        <ToolBtn icon-name="i-carbon-save text-blue-6" tooltip-name="报错" @click="onPageLayerSave()" />
      </div>
      <div class="flex flex-col">
        <AEmpty v-if="currentPageLayerList.length === 0" />
        <div v-for="item in currentPageLayerList" :key="item.name" class="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
          <div class="flex flex-col items-start gap-1">
            <div>
              {{ item.text }}
            </div>
            <div
              v-if="item.riskAnalysisObjectLevel"
              class="inline-flex items-center justify-center rounded px-2 py-1 text-12px font-bold"
              :style="{
                backgroundColor: levelColorMap[item.riskAnalysisObjectLevel],
                color: levelTextColorMap[item.riskAnalysisObjectLevel],
              }"
            >
              {{ riskLevelStatusMap[item.riskAnalysisObjectLevel] }}
            </div>
          </div>
          <div class="flex">
            <ToolBtn icon-name="i-carbon-edit text-blue-6" tooltip-name="编辑" @click="onLayerEdit(item)" />
            <ToolBtn icon-name="i-carbon-trash-can text-red-6" tooltip-name="删除" @click="onLayerDelete(item)" />
          </div>
        </div>
      </div>
    </div>
    <PolygonLink />
  </div>
</template>
