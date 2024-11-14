<script setup lang="ts">
import { globalPageList } from '#imports'

const selectPageId = ref('')
const PageFormModalRef = useTemplateRef('PageFormModalRef')

function onDesignPage(record: PageRecord) {
  navigateTo(`/hi/${record.id}`)
}

async function onPageAdd() {
  await postPage(initPageRecord())
  await fetchPageList()
}

async function onPageDelete(item: PageRecord) {
  const { code, msg } = await deletePage(item.id)
  if (code) {
    Message.warning(msg)
    return
  }
  if (item.id === selectPageId.value) {
    initBackgroundImageBlobUrl()
    setBackgroundImage()
    onPolygonClear()
  }
  await fetchPageList()
}
function onPageEdit(record: PageRecord) {
  PageFormModalRef.value?.open(record)
}

async function onSelect(record: PageRecord) {
  selectPageId.value = record.id
  if (record.backgroundImageUrl) {
    const blobUrl = await urlToBlobUrl(record.backgroundImageUrl)
    setBackgroundImageBlobUrl(blobUrl)
  }
  else {
    initBackgroundImageBlobUrl()
  }
  setBackgroundImage()
  onPolygonClear()
  record.children.forEach((item) => {
    onPolygonInitAdd(item, false)
  })
}
onMounted(async () => {
  console.warn('[index.vue]:', 'onMounted')
  await until(canvasIsReady).toBe(true)
  await until(canvasFabric).not.toBe(undefined)
  setToolActive('pan')
  await fetchPageList()
  if (globalPageList.value.length > 0) {
    onSelect(globalPageList.value[0]!)
  }
})
onUnmounted(() => {
  polygonWithTextList.value = []
  console.warn('[index.vue]:', 'onUnmounted')
})
</script>

<template>
  <div class="h-full flex shrink grow basis-0 overflow-hidden">
    <div class="w-300px flex-none border-r-1px border-gray-1">
      <div class="flex items-center justify-between border-b-1px border-gray-1 px-2 py-1">
        <div class="text-14px font-bold">
          页面
        </div>
        <ToolBtn icon-name="i-carbon-add" tooltip-name="添加页面" @click="onPageAdd()" />
      </div>
      <div class="flex flex-col">
        <AEmpty v-if="globalPageList.length === 0" />
        <div
          v-for="item in globalPageList"
          :key="item.id"
          class="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
          @click="onSelect(item)"
        >
          <div
            :class="{ 'text-blue-5 font-bold': item.id === selectPageId }"
          >
            {{ item.name }}<span>({{ item.children.length }})</span>
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
