<script lang="ts" setup>
import { canvasIsReady } from '~/composables/store'

const route = useRoute<'hi-id'>()
const router = useRouter()
const id = computed(() => route.params.id)

function onLayerDelete(record: PolygonWithTextOptions) {
  if (globalPageDetail.value === null) {
    console.error('globalPageDetail.value is null')
    return
  }
  onPolygonDelete(record.name)
  globalPageDetail.value!.children = globalLayerList.value.filter(item => item.name !== record.name)
}
function onLayerEdit(record: PolygonWithTextOptions) {
  currentPageId.value = record.pageId
  emitter.emit('polygon:updated', { name: record.name, id: record.riskAnalysisObjectId })
}
async function onPageLayerSave() {
  let backgroundImageUrl = null
  if (backgroundImageBlobUrl.value) {
    const uploadFileFormData = new FormData()
    const file = await blobUrlToFile(backgroundImageBlobUrl.value)
    uploadFileFormData.append('file', file)
    const { code, data, msg } = await uploadImage(uploadFileFormData)
    if (code) {
      Message.warning(msg)
      return
    }
    else {
      backgroundImageUrl = data
    }
  }
  const formData: PageRecord = {
    id: id.value,
    name: globalPageDetail.value!.name,
    backgroundImageUrl,
    children: globalLayerList.value,
  }
  await putPage(formData)
  await fetchPageDetail(id.value)
  router.back()
}
function toggleDrawMode() {
  if (!id.value) {
    console.error('请先选择页面ID', id.value)
    Message.warning('请先选择页面ID')
    return
  }
  currentPageId.value = id.value
  // if (isDrawingMode.value) {
  //   console.warn('[PolygonBtn.vue]:', 'stopPolygonDrawing')
  //   stopPolygonDrawing()
  // }
  // else {
  console.warn('[PolygonBtn.vue]:', 'startPolygonDrawing')
  startPolygonDrawing()
  // }
}
onMounted(async () => {
  console.warn('[id.vue]:', 'onMounted', canvasIsReady.value)
  await until(canvasIsReady).toBe(true)
  await until(canvasFabric).not.toBe(undefined)
  console.warn('[id.vue]:', 'onPolygonInitAdd')
  await fetchPageDetail(id.value)
  if (globalPageDetail.value === null) {
    return
  }
  if (globalPageDetail.value!.backgroundImageUrl) {
    const blobUrl = await urlToBlobUrl(globalPageDetail.value!.backgroundImageUrl!)
    setBackgroundImageBlobUrl(blobUrl)
    setBackgroundImage()
  }
  globalLayerList.value.forEach((item) => {
    onPolygonInitAdd(item)
  })
})

onUnmounted(() => {
  globalPageDetail.value = null
  console.warn('[id.vue]:', 'onUnmounted')
})
</script>

<template>
  <div class="h-full flex shrink grow basis-0 overflow-hidden">
    <div class="flex flex-col justify-between border-r-1px border-gray-1">
      <div class="flex flex-col items-center">
        <ToolBtn icon-name="i-carbon-cursor-1" tooltip-name="移动" :active="isSelectMode" @click="setToolActive('select')" />
        <ToolBtn icon-name="i-carbon-area-custom" tooltip-name="多边形" :active="isDrawingMode" @click="toggleDrawMode()" />
        <BackgroundBtn />
        <ToolBtn icon-name="i-carbon-zoom-pan" tooltip-name="平移" :active="isPanMode" @click="setToolActive('pan')" />
        <PolygonLinkBindRiskAnalysisObjectModal />
      </div>
      <div class="flex flex-col items-center" />
    </div>
    <div class="w-300px flex-none border-r-1px border-gray-1">
      <div class="flex items-center justify-between gap-2 border-b-1px border-gray-1 px-4 py-2">
        <div class="flex items-center">
          <div class="text-14px font-bold">
            {{ globalPageDetail?.name }}
          </div>
          <div>
            图层
          </div>
        </div>
        <ToolBtn icon-name="i-carbon-save text-blue-6" tooltip-name="保存" @click="onPageLayerSave()" />
      </div>
      <div class="flex flex-col">
        <AEmpty v-if="globalLayerList.length === 0" />
        <div v-for="item in globalLayerList" :key="item.name" class="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
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
