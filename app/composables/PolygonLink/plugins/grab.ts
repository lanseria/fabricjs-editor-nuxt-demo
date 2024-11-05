let lastPosX = 0
let lastPosY = 0

export function bindGrabPlugin() {
  const canvas = canvasFabric.value!

  // 添加鼠标按下事件
  canvas.on('mouse:down', (opt) => {
    if (isSpacePressed.value) {
      isPanning.value = true
      canvas.selection = false
      lastPosX = opt.e.clientX
      lastPosY = opt.e.clientY
      canvas.setCursor('grabbing')
    }
  })

  // 添加鼠标移动事件
  canvas.on('mouse:move', (opt) => {
    if (isPanning.value) {
      const vpt = canvas.viewportTransform!
      vpt[4]! += opt.e.clientX - lastPosX
      vpt[5]! += opt.e.clientY - lastPosY
      canvas.requestRenderAll()
      lastPosX = opt.e.clientX
      lastPosY = opt.e.clientY
    }
  })

  // 添加鼠标松开事件
  canvas.on('mouse:up', () => {
    isPanning.value = false
    canvas.selection = true
    canvas.setCursor(isSpacePressed.value ? 'grab' : 'default')
  })
}
