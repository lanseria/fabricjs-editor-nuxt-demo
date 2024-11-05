export function onWheelPlugin() {
  const canvas = canvasFabric.value!
  // 添加滚轮缩放事件
  canvas.on('mouse:wheel', (opt) => {
    const delta = opt.e.deltaY
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 20)
      zoom = 20
    if (zoom < 0.01)
      zoom = 0.01

    // 计算鼠标位置的画布坐标
    const point = {
      x: opt.e.offsetX,
      y: opt.e.offsetY,
    }

    canvas.zoomToPoint(point, zoom)
    opt.e.preventDefault()
    opt.e.stopPropagation()
  })
}
