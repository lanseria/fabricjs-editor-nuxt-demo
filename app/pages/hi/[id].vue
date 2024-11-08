<script lang="ts" setup>
const route = useRoute<'hi-id'>()
const id = computed(() => route.params.id)
const pageName = computed(() => {
  const item = storePageList.value.find(i => i.id === id.value)
  if (item)
    return item.name
  else
    return ''
})
function onLayerDelete(record: PolygonWithTextOptions) {
  onPolygonDelete(record.name)
  storeLayerList.value = storeLayerList.value.filter(item => item.name !== record.name)
}
function onLayerEdit(record: PolygonWithTextOptions) {
  currentPageId.value = record.pageId
  emitter.emit('polygon:updated', { name: record.name, id: record.riskAnalysisObjectId })
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
onMounted(() => {
  storeLayerList.value.forEach((item) => {
    onPolygonInitAdd(item)
  })
})
</script>

<template>
  <div class="h-full flex shrink grow basis-0 overflow-hidden">
    <div class="flex flex-col border-r-1px border-gray-1">
      <ToolBtn icon-name="i-carbon-area-custom" tooltip-name="多边形" :active="isDrawingMode" @click="toggleDrawMode()" />
      <PolygonLinkBindRiskAnalysisObjectModal />
    </div>
    <div class="w-300px flex-none border-r-1px border-gray-1">
      <div class="flex items-center gap-2 border-b-1px border-gray-1 px-4 py-2">
        <div class="text-14px font-bold">
          {{ pageName }}
        </div>
        <div>
          图层
        </div>
      </div>
      <div class="flex flex-col">
        <div v-for="item in storeLayerList" :key="item.name" class="flex items-center justify-between px-2 py-1 hover:bg-gray-50">
          <div class="flex items-center gap-2">
            <div>
              {{ item.text }}
            </div>
            <div
              v-if="item.riskAnalysisObjectLevel"
              class="inline-flex items-center justify-center rounded px-2 py-1 font-bold"
              :style="{
                backgroundColor: levelColorMap[item.riskAnalysisObjectLevel],
                color: levelTextColorMap[item.riskAnalysisObjectLevel],
              }"
            >
              {{ riskLevelStatusMap[item.riskAnalysisObjectLevel] }}
            </div>
          </div>
          <div class="flex">
            <ToolBtn icon-name="i-carbon-edit" tooltip-name="编辑" @click="onLayerEdit(item)" />
            <ToolBtn icon-name="i-carbon-trash-can" tooltip-name="删除" @click="onLayerDelete(item)" />
          </div>
        </div>
      </div>
    </div>
    <PolygonLink edit />
  </div>
</template>
