import type { ShallowRef } from 'vue'

// 处理窗口大小变化
export function handleResizeWindowPlugin(wrapRef: ShallowRef<HTMLDivElement | null>) {
  return function () {
    const canvas = canvasFabric.value!
    if (canvas && wrapRef.value) {
      canvas.setDimensions({
        width: wrapRef.value.clientWidth,
        height: wrapRef.value.clientHeight,
      })
      canvas.renderAll()
    }
  }
}
