<script setup lang="ts">
const selectPageId = ref('')

const pageListWithLayer = computed (() => {
  return storePageList.value.map((item) => {
    return {
      ...item,
      layerList: storeLayerList.value.filter(layer => layer.pageId === item.id),
    }
  })
})
function onDesignPage(record: PageRecord) {
  navigateTo(`/hi/${record.id}`)
}
async function onSelect(record: PageRecord) {
  selectPageId.value = record.id
  const layerList = storeLayerList.value.filter(layer => layer.pageId === record.id)
  layerList.forEach((item) => {
    onPolygonInitAdd(item)
  })
}
onMounted(() => {
  console.warn('[index.vue]:', 'onMounted')
})
onUnmounted(() => {
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
        <div
          v-for="item in pageListWithLayer"
          :key="item.id"
          class="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
          :class="{ 'text-blue-5 font-bold': item.id === selectPageId }"
          @click="onSelect(item)"
        >
          <div>{{ item.name }}<span>({{ item.layerList.length }})</span></div>
          <div class="flex">
            <ToolBtn icon-name="i-carbon-area-custom" tooltip-name="设计" @click.stop="onDesignPage(item)" />
            <ToolBtn icon-name="i-carbon-edit" tooltip-name="编辑" @click.stop />
            <ToolBtn icon-name="i-carbon-trash-can" tooltip-name="删除" @click.stop="onPageDelete(item)" />
          </div>
        </div>
      </div>
    </div>
    <PolygonLink />
  </div>
</template>
