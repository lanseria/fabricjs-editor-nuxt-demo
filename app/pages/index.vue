<script setup lang="ts">
const selectPageId = ref('')
const PageFormModalRef = useTemplateRef('PageFormModalRef')

const pageListWithLayer = computed (() => {
  return globalPageList.value.map((item) => {
    return {
      ...item,
      layerList: globalLayerList.value.filter(layer => layer.pageId === item.id),
    }
  })
})

function onDesignPage(record: PageRecord) {
  navigateTo(`/hi/${record.id}`)
}

function onPageEdit(record: PageRecord) {
  PageFormModalRef.value?.open(record)
}

async function onSelect(record: PageRecord) {
  selectPageId.value = record.id
  const layerList = globalLayerList.value.filter(layer => layer.pageId === record.id)
  layerList.forEach((item) => {
    onPolygonInitAdd(item, false)
  })
}
onMounted(async () => {
  console.warn('[index.vue]:', 'onMounted')
  await fetchLayerList()
  await fetchPageList()
  await until(canvasIsReady).toBe(true)
  await until(canvasFabric).not.toBe(undefined)
  if (globalPageList.value.length > 0) {
    onSelect(globalPageList.value[0]!)
  }
})
onUnmounted(() => {
  globalLayerList.value = []
  globalPageList.value = []
  console.warn('[index.vue]:', 'onUnmounted')
})
</script>

<template>
  <div class="h-full flex flex-1">
    <div class="w-300px flex-none border-r-1px border-gray-1">
      <div class="flex items-center justify-between border-b-1px border-gray-1 px-2 py-1">
        <div class="text-14px font-bold">
          页面
        </div>
        <ToolBtn icon-name="i-carbon-add" tooltip-name="添加页面" @click="onPageAdd()" />
      </div>
      <div class="flex flex-col">
        <AEmpty v-if="pageListWithLayer.length === 0" />
        <div
          v-for="item in pageListWithLayer"
          :key="item.id"
          class="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
          @click="onSelect(item)"
        >
          <div
            :class="{ 'text-blue-5 font-bold': item.id === selectPageId }"
          >
            {{ item.name }}<span>({{ item.layerList.length }})</span>
          </div>
          <div class="flex">
            <ToolBtn icon-name="i-carbon-area-custom text-orange-6" tooltip-name="设计" @click.stop="onDesignPage(item)" />
            <ToolBtn icon-name="i-carbon-edit text-blue-6" tooltip-name="编辑" @click.stop="onPageEdit(item)" />
            <ToolBtn icon-name="i-carbon-trash-can text-red-6" tooltip-name="删除" @click.stop="onPageDelete(item)" />
          </div>
        </div>
      </div>
      <PageFormModal ref="PageFormModalRef" />
    </div>
    <PolygonLink />
  </div>
</template>
