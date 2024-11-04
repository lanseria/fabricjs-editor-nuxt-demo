import type { fabric } from 'fabric'

export const fabricLoadedFonts = new Set<string>()

export const fabricCanvas = shallowRef<fabric.Canvas>()
watchEffect(() => {
  const objectList = fabricCanvas.value?.getObjects()
  if (objectList?.length !== 0) {
    const objectNameList = objectList?.map(item => item.name)
    console.warn('[store.ts]:', 'fabricCanvas objectList', objectNameList)
  }
})
// 是否初始化工作区
export const fabricCanvasWorkspaceLoaded = ref(false)
// wrap size
export const fabricCanvasWrapSize = useLocalStorage('fabricCanvasWrapSize', { width: 0, height: 0 })
// workspace size
export const fabricCanvasWorkspaceSize = ref({ width: WORKSPACE_WIDTH, height: WORKSPACE_HEIGHT })

export const fabricCanvasActiveObj = ref<fabric.Object>()

export const fabricCanvasActiveObjProps = ref<CanvasElementObjectProps>(initCanvasElementObjectProps())

// dynamic text element with disabled field
export const dynamicTextElementList = computed(() => {
  const elementIds = ELEMENT_LIST.map(m => m.id)

  if (!fabricCanvas.value) {
    return ELEMENT_LIST.map(item => ({ ...item, disabled: false }))
  }

  const activeIds = fabricCanvas.value.getObjects()
    .filter(item => elementIds.includes(item.id!))
    .map(item => item.id)

  return ELEMENT_LIST.map(item => ({
    ...item,
    disabled: activeIds.includes(item.id),
  }))
})
