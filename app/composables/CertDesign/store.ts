import type { fabric } from 'fabric'

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

// State for polygon drawing
export const isDrawingMode = ref(false)
export const points: fabric.Point[] = []
