import type { ShallowRef } from 'vue'
import { fabric } from 'fabric'
import backgroundAsset from '~/assets/background.jpg'
// 创建背景网格图案
function createGridPattern() {
  const patternCanvas = document.createElement('canvas')
  const patternContext = patternCanvas.getContext('2d')
  const patternSize = 100
  const gridSize = 50 // 每个格子的大小

  patternCanvas.width = patternSize
  patternCanvas.height = patternSize

  if (patternContext) {
    // 绘制棋盘格
    for (let x = 0; x < patternSize; x += gridSize) {
      for (let y = 0; y < patternSize; y += gridSize) {
        patternContext.fillStyle = (x + y) % (gridSize * 2) === 0 ? '#FFFFFF' : '#D3D3D3'
        patternContext.fillRect(x, y, gridSize, gridSize)
      }
    }
  }

  return patternCanvas
}
/**
 * 更新画布尺寸
 */
export function updateCanvasSize(wrapWidth: number, wrapHeight: number) {
  const canvas = canvasFabric.value!
  if (wrapHeight === 0 || wrapWidth === 0 || canvas === undefined)
    return
  // 更新画布尺寸
  // canvas.setWidth(wrapWidth)
  // canvas.setHeight(wrapHeight)
  canvas.setDimensions({
    width: wrapWidth,
    height: wrapHeight,
  })

  // 计算缩放比例使画布适应容器
  const scaleX = (wrapWidth - 100) / WORKSPACE_WIDTH
  const scaleY = (wrapHeight - 100) / WORKSPACE_HEIGHT
  const scale = Math.min(scaleX, scaleY)

  // 设置画布缩放和中心位置
  canvas.setZoom(scale)
  canvas.setViewportTransform([
    scale,
    0,
    0,
    scale,
    (wrapWidth - WORKSPACE_WIDTH * scale) / 2,
    (wrapHeight - WORKSPACE_HEIGHT * scale) / 2,
  ])

  console.warn('[updateCanvasSize]', scale)
  console.warn('[updateCanvasSize]', wrapWidth)
  console.warn('[updateCanvasSize]', wrapHeight)
}
// 初始化画布
export function initCanvasBasicPlugin(canvasRef: ShallowRef<HTMLCanvasElement | null>, wrapRef: ShallowRef<HTMLDivElement | null>) {
  // 创建fabric画布
  if (!wrapRef.value)
    return
  const wrapWidth = wrapRef.value.clientWidth
  const wrapHeight = wrapRef.value.clientHeight
  const canvas = new fabric.Canvas(canvasRef.value, {
    width: wrapWidth,
    height: wrapHeight,
    backgroundColor: '#E5E5E5',
    selection: false,
  })
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'white',
    cornerStrokeColor: 'white',
    borderColor: 'white',
    cornerSize: 10,
    padding: 10,
    cornerStyle: 'circle',
    borderDashArray: [3, 3],
  })

  // 创建中央白色画布
  const centerRect = new fabric.Rect({
    width: WORKSPACE_WIDTH,
    height: WORKSPACE_HEIGHT,
    fill: 'white',
    selectable: false,
    hoverCursor: 'default',
    name: 'workspace',
  })

  // 将白色画布添加到canvas中
  canvas.add(centerRect)

  // 加载背景图片
  fabric.Image.fromURL(backgroundAsset, async (backgroundImage) => {
    // new fabric.Image(backgroundAsset, {
    //   left: centerRect.left,
    //   top: centerRect.top,
    //   width: WORKSPACE_WIDTH,
    //   height: WORKSPACE_HEIGHT,
    //   selectable: false,
    //   hoverCursor: 'default',
    //   name: 'background',
    // })
    backgroundImage.set({
      left: centerRect.left,
      top: centerRect.top,
      width: WORKSPACE_WIDTH,
      height: WORKSPACE_HEIGHT,
      selectable: false,
      hoverCursor: 'default',
      name: 'background',
    })
    canvas.add(backgroundImage)
    // 先放置在最底层
    canvas.sendToBack(backgroundImage)
    // 再向上移动一层
    canvas.bringForward(backgroundImage, false)
    canvas.renderAll()
  })

  // 创建网格背景
  const gridPattern = createGridPattern()
  canvas.setBackgroundColor({
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    source: gridPattern,
    repeat: 'repeat',
  }, canvas.renderAll.bind(canvas))
  // 保存画布
  console.warn('[basic.ts]', 'canvas 初始化')
  canvasFabric.value = canvas
  updateCanvasSize(wrapWidth, wrapHeight)
}

export function disposeCanvasBasicPlugin() {
  if (canvasFabric.value) {
    canvasFabric.value.dispose()
    console.warn('[basic.ts]', 'canvas 卸载')
    canvasFabric.value = undefined
  }
}
