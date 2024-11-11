import type { fabric } from 'fabric'
import type { WatchHandle } from 'vue'

let lastPosX = 0
let lastPosY = 0
let watchEffectOfSpace: WatchHandle | null = null

function isBreak(canvas: fabric.Canvas | undefined) {
  if (!canvas && !isSpacePressed) {
    return true
  }
  else {
    return false
  }
}

// 添加鼠标按下事件
function onMouseDown(opt: fabric.IEvent<MouseEvent>) {
  const canvas = canvasFabric.value!
  if (isDrawingMode.value) {
    return
  }
  if (isBreak(canvas))
    return
  if (isSpacePressed!.value || isPanMode.value) {
    isPanning.value = true
    canvas.selection = false
    lastPosX = opt.e.clientX
    lastPosY = opt.e.clientY
    canvas.setCursor('grabbing') // Set to 'grabbing' on mouse down
  }
}

// 添加鼠标移动事件
function onMouseMove(opt: fabric.IEvent<MouseEvent>) {
  const canvas = canvasFabric.value!
  if (isDrawingMode.value) {
    return
  }
  if (isBreak(canvas))
    return
  if (isPanning.value) {
    const vpt = canvas.viewportTransform!
    vpt[4]! += opt.e.clientX - lastPosX
    vpt[5]! += opt.e.clientY - lastPosY
    canvas.requestRenderAll()
    lastPosX = opt.e.clientX
    lastPosY = opt.e.clientY
  }
  else {
    if (isSpacePressed?.value) {
      canvas.setCursor('grab')
    }
    if (isPanMode.value) {
      canvas.setCursor('grab')
    }
  }
}

// 添加鼠标松开事件
function onMouseUp() {
  const canvas = canvasFabric.value!
  if (isDrawingMode.value) {
    return
  }
  if (isBreak(canvas))
    return
  isPanning.value = false
  canvas.selection = true
  // Only reset cursor to 'grab' or 'default' after releasing the mouse
  canvas.setCursor(isSpacePressed!.value ? 'grab' : 'default')
}

export function bindGrabPlugin() {
  const canvas = canvasFabric.value!
  // 添加鼠标按下事件
  canvas.on('mouse:down', onMouseDown)

  // 添加鼠标移动事件
  canvas.on('mouse:move', onMouseMove)

  // 添加鼠标松开事件
  canvas.on('mouse:up', onMouseUp)
  watchEffectOfSpace = watchEffect(() => {
    if (isDrawingMode.value) {
      return
    }
    if (isSpacePressed!.value) {
      canvas.setCursor('grab')
    }
  })
}

export function unbindGrabPlugin() {
  const canvas = canvasFabric.value!
  canvas.off('mouse:down')
  canvas.off('mouse:move')
  canvas.off('mouse:up')
  watchEffectOfSpace?.stop()
}
