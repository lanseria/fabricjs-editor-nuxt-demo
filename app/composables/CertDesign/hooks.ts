import type { ShallowRef } from 'vue'
import FontFaceObserver from 'fontfaceobserver'

export function useFabricCanvas(canvasRef: ShallowRef<HTMLCanvasElement | null>, wrapRef: ShallowRef<HTMLDivElement | null>) {
  const { width, height } = useElementSize(wrapRef)

  onMounted(() => {
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
    // 工作区自动缩放
    // onFabricCanvasWorkspaceResize()
  })

  onBeforeUnmount(() => {
  // 移除所有元素和背景图，释放资源
    fabricCanvasWorkspaceLoaded.value = false
    if (fabricCanvas.value) {
      fabricCanvas.value.dispose()
    }
  })
}

export function useFont() {
  const loadFont = (fontName: string) => {
    if (!fontName)
      return false
    return new Promise((resolve: any) => {
      // loading
      const font = new FontFaceObserver(fontName)
      font
        .load(null, 150000)
        .then(() => {
          console.warn('字体加载成功')
          // loading hide
          resolve(true)
        })
        .catch(() => {
          console.error('字体加载失败')
          // loading hide
          resolve(false)
        })
    })
  }

  return {
    loadFont,
  }
}
