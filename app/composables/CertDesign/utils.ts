import type { Rect } from 'fabric'
import { iMatrix, Point } from 'fabric'
import FontFaceObserver from 'fontfaceobserver'

export function utilFabricGetCanvasInstance() {
  if (!fabricCanvas.value) {
    throw new Error('fabricCanvas.value is null')
  }
  const canvas = fabricCanvas.value
  return canvas
}

export function utilFabricGetWorkspaceInstance() {
  const canvas = utilFabricGetCanvasInstance()
  const workspace = canvas.getObjects().find((item: any) => item.name === WORKSPACE_ID)
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
  canvas.setViewportTransform(iMatrix.concat())
  canvas.zoomToPoint(new Point(center.left, center.top), scale)
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
  workspace.clone((cloned: Rect) => {
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
/**
 * 加载字体
 */
export async function utilFabricLoadFont(fontName: string): Promise<boolean> {
  if (!fontName)
    return false
    // 如果字体已经加载过，直接返回 true
  if (fabricLoadedFonts.has(fontName))
    return true
  const font = new FontFaceObserver(fontName)
  try {
    await font.load(null, 150000)
    fabricLoadedFonts.add(fontName) // 加载成功后，将字体添加到已加载字体集合
    return true
  }
  catch (error: any) {
    console.error('字体加载失败')
    throw new Error(error)
  }
}

function base64ToFile(base64: string, fileName: string): File {
  const arr = base64.split(',')
  const mime = arr[0]!.match(/:(.*?);/)?.[1] || ''
  const bstr = atob(arr[1]!)
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], fileName, { type: mime })
}
/**
 * 获取Canvas截图
 */
export function utilFabricCanvasToImageOption() {
  const { workspace, canvas } = utilFabricGetWorkspaceInstance()
  const { width, height, left, top } = workspace
  const options = {
    ...PREVIEW_URL_OPTIONS,
    width,
    height,
    left,
    top,
  }
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.renderAll()
  const url = canvas.toDataURL(options)
  const file = base64ToFile(url, 'image.png')
  return {
    url,
    file,
  }
}
/**
 * 获取Canvas导出配置
 */
export async function utilFabricGetCanvasExportOption() {
  const { workspace, canvas } = utilFabricGetWorkspaceInstance()
  const workspaceLeft = workspace.left!
  const workspaceTop = workspace.top!
  const elementList: CanvasElementObjectProps[] = []
  canvas.getObjects().forEach((item: any) => {
    if (item.id !== WORKSPACE_ID && item.id !== BACKGROUND_ID) {
      item.visible = false
      // 如果为自定义字符串，则使用text字段
      const value = item.type === 'i-text' ? item.text ?? '' : item.name ?? ''
      elementList.push({
        url: item.url || '',
        id: item.id!,
        value,
        left: item.left! - workspaceLeft,
        top: item.top! - workspaceTop,
        scaleX: item.scaleX!,
        scaleY: item.scaleY!,
        type: item.type!,
        fill: item.fill as string,
        fontSize: item.fontSize as number,
        fontFamily: item.fontFamily as string,
      })
    }
  })
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
  canvas.renderAll()
  const { url } = await utilFabricCanvasToImageOption()
  const backgroundImageBase64 = url

  canvas.getObjects().forEach((item: any) => {
    if (item.id !== WORKSPACE_ID && item.id !== BACKGROUND_ID)
      item.visible = true
  })
  return {
    elementList,
    backgroundImageBase64,
    width: fabricCanvasWorkspaceSize.value.width,
    height: fabricCanvasWorkspaceSize.value.height,
  }
}
