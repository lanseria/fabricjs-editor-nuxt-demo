import type { PolygonWithText } from './PolygonLink/entity/PolygonWithText'

export const storePageList = useLocalStorage<PageRecord[]>('storePageList', [])

export const storeLayerList = useLocalStorage<PolygonWithTextOptions[]>('storeLayerList', [])

export const globalObjList = ref<ObjUnitRecord[]>([])
export const globalUnitList = ref<ObjUnitRecord[]>([])
export const globalPageList = ref<PageRecord[]>([])
export const globalLayerList = ref<PolygonWithTextOptions[]>([])

export const currentPageId = ref('')

export const canvasIsReady = ref(false)
export const canvasFabric = shallowRef<fabric.Canvas | fabric.StaticCanvas>()
watchEffect(() => {
  console.warn('[store.ts]:', 'canvasFabric', canvasFabric.value)
  const objectList = canvasFabric.value?.getObjects()
  if (objectList?.length !== 0) {
    const objectNameList = objectList?.map(item => item.name)
    console.warn('[store.ts]:', 'canvasFabric objectList', objectNameList)
  }
})
export const canvasFabricSelectableObjectList = computed(() => {
  const objectList = canvasFabric.value?.getObjects()
  return objectList?.filter(item => item.selectable)
})
export const polygonWithTextList = shallowRef<PolygonWithText[]>([])

// export const isSpacePressed = ref(false)
export const isPanning = ref(false)
export const { space: isSpacePressed } = useMagicKeys()
export const isDrawingMode = ref(false)
