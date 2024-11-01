import type { fabric } from 'fabric'

export const fabricCanvas = ref<fabric.Canvas>()
// 是否初始化工作区
export const fabricCanvasWorkspaceLoaded = ref(false)
// wrap size
export const fabricCanvasWrapSize = ref({ width: 0, height: 0 })
