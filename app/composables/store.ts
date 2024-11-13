import type { PolygonWithText } from './PolygonLink/entity/PolygonWithText'

export const globalObjList = ref<ObjUnitRecord[]>([])
export const globalUnitList = ref<ObjUnitRecord[]>([])
export const globalPageList = ref<PageRecord[]>([])
export const globalPageDetail = ref<PageRecord | null>(null)

export const globalLayerList = computed(() => {
  if (globalPageDetail.value)
    return globalPageDetail.value.children
  else
    return []
})

export const currentPageId = ref('')
export const polygonWithTextList = shallowRef<PolygonWithText[]>([])

export const canvasIsReady = ref(false)
export const canvasFabric = shallowRef<fabric.Canvas>()
watchEffect(() => {
  console.warn('[store.ts]:', 'canvasFabric', canvasFabric.value)
  const objectList = canvasFabric.value?.getObjects()
  if (objectList?.length !== 0) {
    const objectNameList = objectList?.map(item => item.name)
    console.warn('[store.ts]:', 'canvasFabric objectList', objectNameList)
    // 更新对象列表
    // if (globalPageDetail.value) {
    //   console.warn('[store.ts]:', '更新globalPageDetail.children对象列表', globalPageDetail.value.children.length)
    //   globalPageDetail.value.children = polygonWithTextList.value.map(item => item.options)
    // }
  }
})
export const canvasFabricSelectableObjectList = computed(() => {
  const objectList = canvasFabric.value?.getObjects()
  return objectList?.filter(item => item.selectable)
})

export const isPanning = ref(false)
export const { space: isSpacePressed, escape: isEscPressed } = useMagicKeys()

export const toolActive = ref<ToolActive>('select')

export const isSelectMode = computed(() => {
  return toolActive.value === 'select'
})

export const isDrawingMode = computed(() => {
  return toolActive.value === 'polygon'
})

export const isPanMode = computed(() => {
  return toolActive.value === 'pan'
})

export const workspaceSize = ref({ width: WORKSPACE_WIDTH, height: WORKSPACE_HEIGHT })
export const wrapSize = ref({ width: 0, height: 0 })

export const backgroundImageBlobUrl = ref<string>('')
