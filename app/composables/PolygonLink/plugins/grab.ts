import type { fabric } from 'fabric'

let lastPosX = 0
let lastPosY = 0

// 添加鼠标按下事件
function onMouseDown(opt: fabric.IEvent<MouseEvent>) {
  const canvas = canvasFabric.value!
  if (!isSpacePressed && !canvas)
    return
  console.warn('[onMouseDown]')
  if (isSpacePressed!.value) {
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
  if (!isSpacePressed && !canvas)
    return
  if (isPanning.value) {
    console.warn('[onMouseMove]')
    const vpt = canvas.viewportTransform!
    vpt[4]! += opt.e.clientX - lastPosX
    vpt[5]! += opt.e.clientY - lastPosY
    canvas.requestRenderAll()
    lastPosX = opt.e.clientX
    lastPosY = opt.e.clientY
  }
}

// 添加鼠标松开事件
function onMouseUp() {
  const canvas = canvasFabric.value!
  if (!isSpacePressed && !canvas)
    return
  console.warn('[onMouseUp]')
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
}

export function unbindGrabPlugin() {
  const canvas = canvasFabric.value!
  canvas.off('mouse:down')
  canvas.off('mouse:move')
  canvas.off('mouse:up')
}
