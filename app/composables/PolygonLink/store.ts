import type { PolygonWithText } from './entity/PolygonWithText'

export const canvasFabric = shallowRef<fabric.Canvas>()
watchEffect(() => {
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

export const isSpacePressed = ref(false)
export const isPanning = ref(false)
export const { space } = useMagicKeys()
export const isDrawingMode = ref(false)
