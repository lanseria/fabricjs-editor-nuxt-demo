import type { ShallowRef } from 'vue'

export function useFabricCanvas(canvasRef: ShallowRef<HTMLCanvasElement | null>, wrapRef: ShallowRef<HTMLDivElement | null>) {
  const { width, height } = useElementSize(wrapRef)
  function onFabricCanvasDispose() {
    // 移除所有元素和背景图，释放资源
    if (fabricCanvas.value && fabricCanvasWorkspaceLoaded.value) {
      fabricCanvasWorkspaceLoaded.value = false
      fabricCanvas.value.dispose()
    }
  }
  function onFabricCanvasReset() {
    // 释放资源
    onFabricCanvasDispose()
    // 初始化Canvas
    initFabricCanvas(canvasRef)
    // 初始化工作区
    initFabricWorkspace()
    // 根据 Wrap 大小设置 Canvas 大小
    onFabricCanvasResize(width.value, height.value)
    // 添加控件
    initFabricDeleteControl()
    // 设置初始化成功标识
    fabricCanvasWorkspaceLoaded.value = true
    // 初始化多边形
    initPolygonDrawing()
  }
  onMounted(() => {
    console.warn('[hooks.ts]:', 'useFabricCanvas onMounted')
    onFabricCanvasReset()
  })

  onBeforeUnmount(() => {
    console.warn('[hooks.ts]:', 'useFabricCanvas onBeforeUnmount')
    onFabricCanvasDispose()
  })
  return {
    onFabricCanvasReset,
  }
}
