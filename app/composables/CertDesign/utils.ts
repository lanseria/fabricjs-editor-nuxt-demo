import { fabric } from 'fabric'

export function utilFabricGetCanvasInstance() {
  if (!fabricCanvas.value) {
    throw new Error('fabricCanvas.value is null')
  }
  const canvas = fabricCanvas.value
  return canvas
}

export function utilFabricGetWorkspaceInstance() {
  const canvas = utilFabricGetCanvasInstance()
  const workspace = canvas.getObjects().find(item => item.name === WORKSPACE_ID)
  if (!workspace)
    throw new Error('workspace is null')
  return {
    canvas,
    workspace,
  }
}

// export function utilFabricImageDraw(
//   ctx: CanvasRenderingContext2D,
//   left: number,
//   top: number,
//   img: HTMLImageElement,
//   wSize: number,
//   hSize: number,
//   angle: number | undefined,
// ) {
//   if (angle === undefined)
//     return
//   ctx.save()
//   ctx.translate(left, top)
//   ctx.rotate(fabric.util.degreesToRadians(angle))
//   ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize)
//   ctx.restore()
// }

export function utilFabricGetWorkspaceScale() {
  // 容器宽度
  const wrapWidth = fabricCanvasWrapSize.value.width
  const wrapHeight = fabricCanvasWrapSize.value.height
  const { width, height } = fabricCanvasWorkspaceSize.value
  if (wrapWidth / wrapHeight < width / height) {
    console.warn('[util.ts]:', '按照宽度缩放', wrapWidth, width)
    const scale = wrapWidth / width
    console.warn('[util.ts]:', 'scale', scale)
    const subScale = 0.1 / (width / 1000)
    return scale - subScale
  }
  else {
    // 按照高度缩放
    const scale = wrapHeight / height
    const subScale = 0.1 / (height / 1000)
    return scale - subScale
  }
}
/**
 * 设置Canvas大小，根据wrap
 */
export function utilFabricSetCanvasSize() {
  const canvas = utilFabricGetCanvasInstance()
  const wrapWidth = fabricCanvasWrapSize.value.width
  const wrapHeight = fabricCanvasWrapSize.value.height
  canvas.setWidth(wrapWidth)
  canvas.setHeight(wrapHeight)
  console.warn('[util.ts]:', '设置Canvas大小', wrapWidth, wrapHeight)
}
/**
 * 设置Canvas缩放
 */
export function utilFabricSetCanvasZoom(scale: number) {
  const canvas = utilFabricGetCanvasInstance()
  const center = canvas.getCenter()
  canvas.setViewportTransform(fabric.iMatrix.concat())
  canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
  console.warn('[util.ts]:', '设置Canvas缩放', scale)
}
/**
 * 设置画布大小
 */
function utilFabricSetWorkspaceSize() {
  const { workspace } = utilFabricGetWorkspaceInstance()
  const { height, width } = fabricCanvasWorkspaceSize.value
  workspace.set('width', width)
  workspace.set('height', height)
  console.warn('[util.ts]:', '设置画布大小', width, height)
}
/**
 * 设置画布中心到指定对象中心点上
 */
function utilFabricSetWorkspaceCenter() {
  const { workspace, canvas } = utilFabricGetWorkspaceInstance()
  const objCenter = workspace.getCenterPoint()
  const viewportTransform = canvas.viewportTransform
  if (canvas.width === undefined || canvas.height === undefined || !viewportTransform)
    return
  viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]!
  viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]!
  canvas.setViewportTransform(viewportTransform)
  canvas.renderAll()
  console.warn('[util.ts]:', '设置画布中心到指定对象中心点上')
}
/**
 * 超出workspace画布不展示
 */
function utilFabricFlipWorkspace() {
  const { workspace, canvas } = utilFabricGetWorkspaceInstance()
  workspace.clone((cloned: fabric.Rect) => {
    canvas.clipPath = cloned
    canvas.requestRenderAll()
  })
  console.warn('[util.ts]:', '超出workspace画布不展示')
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
