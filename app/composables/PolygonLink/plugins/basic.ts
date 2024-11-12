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
export function updateCanvasSize(wrapWidth?: number, wrapHeight?: number) {
  const canvas = canvasFabric.value!
  if (wrapHeight === undefined || wrapWidth === undefined) {
    wrapWidth = wrapSize.value.width
    wrapHeight = wrapSize.value.height
  }
  if (wrapHeight === 0 || wrapWidth === 0 || canvas === undefined)
    return
  // 更新画布尺寸
  wrapSize.value = { width: wrapWidth, height: wrapHeight }
  const { width: workspaceWidth, height: workspaceHeight } = workspaceSize.value
  // canvas.setWidth(wrapWidth)
  // canvas.setHeight(wrapHeight)
  canvas.setDimensions({
    width: wrapWidth,
    height: wrapHeight,
  })

  // 计算缩放比例使画布适应容器
  const scaleX = (wrapWidth - 100) / workspaceWidth
  const scaleY = (wrapHeight - 100) / workspaceHeight
  const scale = Math.min(scaleX, scaleY)

  // 设置画布缩放和中心位置
  canvas.setZoom(scale)
  canvas.setViewportTransform([
    scale,
    0,
    0,
    scale,
    (wrapWidth - workspaceWidth * scale) / 2,
    (wrapHeight - workspaceHeight * scale) / 2,
  ])

  console.warn('[updateCanvasSize]', scale)
  console.warn('[updateCanvasSize]', wrapWidth)
  console.warn('[updateCanvasSize]', wrapHeight)
}

export function setBackgroundImage() {
  const canvas = canvasFabric.value!
  if (canvas === undefined) {
    console.error('canvasFabric.value is undefined')
    return
  }
  const centerRect = canvas.getObjects().find(item => item.get('name') === WORKSPACE_NAME)
  if (centerRect === undefined) {
    return
  }
  const imageUrl = backgroundImageBlobUrl.value
  // 加载背景图片
  fabric.Image.fromURL(imageUrl, async (backgroundImage) => {
    // 先设置 workspace 的尺寸
    workspaceSize.value = {
      width: backgroundImage.width || WORKSPACE_WIDTH,
      height: backgroundImage.height || WORKSPACE_HEIGHT,
    }
    const { width: workspaceWidth, height: workspaceHeight } = workspaceSize.value
    // 移除之前的背景图片
    const previousBackground = canvas.getObjects().find(obj => obj.name === BACKGROUND_NAME)
    if (previousBackground) {
      canvas.remove(previousBackground)
    }
    centerRect.set({
      width: workspaceWidth,
      height: workspaceHeight,
    })
    // 设置新的背景图片
    backgroundImage.set({
      left: centerRect.left,
      top: centerRect.top,
      width: workspaceWidth,
      height: workspaceHeight,
      selectable: false,
      hoverCursor: 'default',
      name: BACKGROUND_NAME,
    })
    canvas.add(backgroundImage)
    // 先放置在最底层
    canvas.sendToBack(backgroundImage)
    // 再向上移动一层
    canvas.bringForward(backgroundImage, false)
    canvas.renderAll()
    triggerRef(canvasFabric)
    updateCanvasSize()
  })
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
  // 设置全局变量
  canvasFabric.value = canvas
  // 设置控制器样式
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'blue',
    cornerStrokeColor: 'blue',
    borderColor: 'blue',
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
    name: WORKSPACE_NAME,
  })

  // 将白色画布添加到canvas中
  canvas.add(centerRect)
  // 初始化默认背景图片
  initBackgroundImageBlobUrl()
  // 加载背景图片
  // setBackgroundImage()

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
  updateCanvasSize(wrapWidth, wrapHeight)
}

export function disposeCanvasBasicPlugin() {
  if (canvasFabric.value) {
    canvasFabric.value.dispose()
    console.warn('[basic.ts]', 'canvas 卸载')
    canvasFabric.value = undefined
  }
}
