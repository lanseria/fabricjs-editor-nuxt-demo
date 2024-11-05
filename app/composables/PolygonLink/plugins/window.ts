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

// 处理按键事件
export function handleKeyDownWindowPlugin(e: KeyboardEvent) {
  const canvas = canvasFabric.value!
  if (space!.value) {
    e.preventDefault() // 防止页面滚动
    isSpacePressed.value = true
    if (canvas) {
      canvas.setCursor('grab')
    }
  }
}

export function handleKeyUpWindowPlugin(e: KeyboardEvent) {
  const canvas = canvasFabric.value!
  if (e.code === 'Space') {
    isSpacePressed.value = false
    if (canvas) {
      canvas.setCursor('default')
    }
  }
}
