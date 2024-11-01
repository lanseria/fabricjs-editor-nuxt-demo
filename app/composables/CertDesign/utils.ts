import { fabric } from 'fabric'

export function utilFabricImageDraw(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined,
) {
  if (angle === undefined)
    return
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(angle))
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize)
  ctx.restore()
}

export function utilFabricGetWorkspaceScale() {
  // 按照宽度
  const wrapWidth = fabricCanvasWrapSize.value.width
  const wrapHeight = fabricCanvasWrapSize.value.height
  if (wrapWidth / wrapHeight < WORKSPACE_WIDTH / WORKSPACE_HEIGHT) {
    // console.warn('[canvas.ts]:', '按照宽度缩放', wrapWidth, WORKSPACE_WIDTH)
    const scale = wrapWidth / WORKSPACE_WIDTH
    // console.warn('[canvas.ts]:', 'scale', scale)
    // 1000 50 0.1
    // 4000 200 0.1
    // 4000 50 0.025
    const subScale = 0.1 / (WORKSPACE_WIDTH / 1000)
    return scale - subScale
  }
  else {
    // 按照高度缩放
    const scale = wrapHeight / WORKSPACE_HEIGHT
    const subScale = 0.1 / (WORKSPACE_HEIGHT / 1000)
    return scale - subScale
  }
}
/**
 * 设置Canvas大小，根据wrap
 */
export function utilFabricSetCanvasSize() {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const wrapWidth = fabricCanvasWrapSize.value.width
  const wrapHeight = fabricCanvasWrapSize.value.height
  canvas.setWidth(wrapWidth)
  canvas.setHeight(wrapHeight)
}
/**
 * 设置Canvas缩放
 */
export function utilFabricSetCanvasZoom(scale: number) {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const center = canvas.getCenter()
  canvas.setViewportTransform(fabric.iMatrix.concat())
  canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
}
/**
 * 设置画布大小
 */
function utilFabricSetWorkspaceSize() {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const workspace = canvas.getObjects().find(item => item.id === WORKSPACE_ID)
  if (!workspace)
    return
  workspace.set('width', WORKSPACE_WIDTH)
  workspace.set('height', WORKSPACE_HEIGHT)
}
/**
 * 设置画布中心到指定对象中心点上
 */
function utilFabricSetWorkspaceCenter() {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const workspace = canvas.getObjects().find(item => item.id === WORKSPACE_ID)
  if (!workspace)
    return
  const objCenter = workspace.getCenterPoint()
  const viewportTransform = canvas.viewportTransform
  if (canvas.width === undefined || canvas.height === undefined || !viewportTransform)
    return
  viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]!
  viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]!
  canvas.setViewportTransform(viewportTransform)
  canvas.renderAll()
}
/**
 * 超出workspace画布不展示
 */
function utilFabricFlipWorkspace() {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const workspace = canvas.getObjects().find(item => item.id === WORKSPACE_ID)
  if (!workspace)
    return
  workspace.clone((cloned: fabric.Rect) => {
    canvas.clipPath = cloned
    canvas.requestRenderAll()
  })
}
/**
 * 整体设置缩放
 */
export function utilFabricSetWorkspaceZoom(scale: number) {
  // 设置canvas大小
  utilFabricSetCanvasSize()
  // 设置canvas缩放
  utilFabricSetCanvasZoom(scale)
  // 设置workspace大小
  utilFabricSetWorkspaceSize()
  // 设置workspace缩放并居中
  utilFabricSetWorkspaceCenter()
  // 超出workspace画布不展示
  utilFabricFlipWorkspace()
}
