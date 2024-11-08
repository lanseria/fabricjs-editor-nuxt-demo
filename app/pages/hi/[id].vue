<script lang="ts" setup>
const route = useRoute<'hi-id'>()
const id = route.params.id

const layerList = computed(() => {
  return storePageList.value.find(i => i.id === id)?.children || []
})

function onDeleteLayer(item: PolygonWithTextOptions) {
  onPolygonDelete(item.name)
  storePageList.value = storePageList.value.map((i) => {
    if (i.id === id) {
      return {
        ...i,
        children: i.children.filter(i => i.name !== item.name),
      }
    }
    else {
      return i
    }
  })
}
function toggleDrawMode() {
  if (!id) {
    Message.warning('请先选择页面ID')
    return
  }
  currentPageId.value = id
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
  layerList.value.forEach((item) => {
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
      <div class="flex items-center border-b-1px border-gray-1 px-2 py-1">
        <div class="text-14px font-bold">
          图层
        </div>
      </div>
      <div class="flex flex-col">
        <div v-for="item in layerList" :key="item.name" class="flex items-center justify-between px-2 py-1 hover:bg-gray-50">
          <div class="flex items-center">
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
            <ToolBtn icon-name="i-carbon-edit" tooltip-name="编辑" />
            <ToolBtn icon-name="i-carbon-trash-can" tooltip-name="删除" @click="onDeleteLayer(item)" />
          </div>
        </div>
      </div>
    </div>
    <PolygonLink />
  </div>
</template>
