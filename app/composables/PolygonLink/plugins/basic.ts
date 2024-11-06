import type { ShallowRef } from 'vue'
import { fabric } from 'fabric'
// 创建背景网格图案
function createGridPattern() {
  const patternCanvas = document.createElement('canvas')
  const patternContext = patternCanvas.getContext('2d')

  patternCanvas.width = 20
  patternCanvas.height = 20
  if (patternContext) {
    patternContext.strokeStyle = '#CCCCCC'
    patternContext.lineWidth = 1

    // 绘制网格
    patternContext.beginPath()
    patternContext.moveTo(0, 0)
    patternContext.lineTo(20, 0)
    patternContext.moveTo(0, 0)
    patternContext.lineTo(0, 20)
    patternContext.stroke()
  }

  return patternCanvas
}

// 初始化画布
export function initCanvasBasicPlugin(canvasRef: ShallowRef<HTMLCanvasElement | null>, wrapRef: ShallowRef<HTMLDivElement | null>) {
  // 创建fabric画布
  if (!wrapRef.value)
    return
  const canvas = new fabric.Canvas(canvasRef.value, {
    width: wrapRef.value.clientWidth,
    height: wrapRef.value.clientHeight,
    backgroundColor: '#E5E5E5',
    selection: false,
  })

  // 创建中央白色画布
  const centerRect = new fabric.Rect({
    width: 2000,
    height: 2000,
    fill: 'white',
    selectable: false,
    hoverCursor: 'default',
    name: 'workspace',
  })

  // 将白色画布添加到canvas中
  canvas.add(centerRect)

  // 创建网格背景
  const gridPattern = createGridPattern()
  canvas.setBackgroundColor({
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    source: gridPattern,
    repeat: 'repeat',
  }, canvas.renderAll.bind(canvas))

  // 计算缩放比例使画布适应容器
  const scaleX = (wrapRef.value.clientWidth - 100) / 2000
  const scaleY = (wrapRef.value.clientHeight - 100) / 2000
  const scale = Math.min(scaleX, scaleY)

  // 设置画布缩放和中心位置
  canvas.setZoom(scale)
  canvas.setViewportTransform([
    scale,
    0,
    0,
    scale,
    (wrapRef.value.clientWidth - 2000 * scale) / 2,
    (wrapRef.value.clientHeight - 2000 * scale) / 2,
  ])
  // 保存画布
  canvasFabric.value = canvas
  // 添加滚轮缩放事件
  onWheelPlugin()
}

export function disposeCanvasBasicPlugin() {
  if (canvasFabric.value) {
    canvasFabric.value.dispose()
  }
}
