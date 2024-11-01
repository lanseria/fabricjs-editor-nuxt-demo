import type { ShallowRef } from 'vue'

export function useFabricCanvas(canvasRef: ShallowRef<HTMLCanvasElement | null>, wrapRef: ShallowRef<HTMLDivElement | null>) {
  const { width, height } = useElementSize(wrapRef)

  onMounted(() => {
    // 初始化Canvas
    initFabricCanvas(canvasRef)
    // 根据 Wrap 大小设置 Canvas 大小
    onFabricCanvasResize(width.value, height.value)
    // 添加控件
    initFabricDeleteControl()
    // 初始化工作区
    initFabricWorkspace()
    // 设置初始化成功标识
    fabricCanvasWorkspaceLoaded.value = true
    // 工作区自动缩放
    // onFabricCanvasWorkspaceResize()
  })

  onBeforeUnmount(() => {
  // 移除所有元素和背景图，释放资源
    if (fabricCanvas.value) {
      fabricCanvas.value.dispose()
    }
  })
}
