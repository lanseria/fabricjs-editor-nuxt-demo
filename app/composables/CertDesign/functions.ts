import type { Transform } from 'fabric/fabric-impl'
import type { ShallowRef } from 'vue'
import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

export function initFabricCanvas(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    fabricCanvas.value = new fabric.Canvas(canvas, {
      selection: true,
      preserveObjectStacking: true,
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    })
    // initBackground()
  }
}
export function setFabricCanvasResize(immediately = false) {
  // 工作区自动缩放
  if (!fabricCanvasWorkspaceLoaded.value || immediately) {
    onFabricCanvasWorkspaceResize()
  }
  else {
    const debouncedFn = useDebounceFn(onFabricCanvasWorkspaceResize, 500, { maxWait: 1000 })
    debouncedFn()
  }
}
/**
 * 实时监听wrap大小变化
 * @param width
 * @param height
 */
export function onFabricCanvasResize(width: number, height: number) {
  fabricCanvasWrapSize.value = { width, height }
  // 设置画布大小
  setFabricCanvasResize()
}

// 控制器/编辑器
export function initFabricDeleteControl() {
  const delImg = document.createElement('img')
  delImg.src = DELETE_ICON_SVG_BASE64

  // 绘制删除图标
  function renderDelIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    _fabricObject: fabric.Object,
  ) {
    // console.warn('[util.ts]:', '绘制删除图标', left, top, fabricObject)
    const iconSize = 24 // 控制图标大小
    ctx.drawImage(delImg, left - iconSize / 2, top - iconSize / 2, iconSize, iconSize)
    ctx.restore() // 恢复画布状态
  }

  // 删除选中元素
  function deleteObject(_eventData: MouseEvent, _transformData: Transform, _x: number, _y: number) {
    const canvas = utilFabricGetCanvasInstance()
    const activeObjects = canvas.getActiveObjects()
    activeObjects.forEach((obj) => {
      canvas.remove(obj)
    })
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    triggerRef(fabricCanvas)
    return true
  }

  // 添加删除控件到 Fabric.js 控制对象
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderDelIcon,
  })
}

export function initFabricWorkspace() {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const { width, height } = fabricCanvasWorkspaceSize.value
  const workspace = new fabric.Rect({
    fill: 'rgba(255,255,255,1)',
    width,
    height,
    left: (canvas.width! - width) / 2,
    top: (canvas.height! - height) / 2,
    name: WORKSPACE_ID,
  })
  workspace.set('selectable', false)
  workspace.set('hasControls', false)
  workspace.hoverCursor = 'default'
  canvas.add(workspace)
}
/**
 * 画布自动缩放
 */
export function onFabricCanvasWorkspaceResize() {
  // 设置Canvas大小
  utilFabricSetCanvasSize()
  const scale = utilFabricGetWorkspaceScale()
  utilFabricSetWorkspaceZoom(scale)
}

export function onFabricSetBackground(url: string): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, async (img) => {
      if (img) {
        const { workspace, canvas } = utilFabricGetWorkspaceInstance()
        // 填充背景
        // 计算矩形和图片的宽高比
        const rectAspectRatio = workspace.width! / workspace.height!
        const imgAspectRatio = img.width! / img.height!

        // 根据宽高比调整图片尺寸和位置
        if (imgAspectRatio > rectAspectRatio) {
          // 图片的宽高比较大，以矩形的高度为基准进行缩放
          img.scaleToHeight(workspace.height!)
        }
        else {
          // 图片的宽高比较小，以矩形的宽度为基准进行缩放
          img.scaleToWidth(workspace.width!)
        }

        img.set({
          name: BACKGROUND_ID,
          left: workspace.left,
          top: workspace.top,
        })
        // 移除之前的背景图片
        const previousBackground = canvas.getObjects().find(obj => obj.name === BACKGROUND_ID)
        if (previousBackground) {
          canvas.remove(previousBackground)
        }

        canvas.add(img)
        // 先放置在最底层
        canvas.sendToBack(img)
        // 再向上移动一层
        canvas.bringForward(img, false)
        canvas.renderAll()
        triggerRef(fabricCanvas)
        resolve(img)
      }
      else {
        reject(new Error('img is null'))
      }
    })
  })
}
// 已知 我写了 添加背景图片功能，根据我下面的代码，添加绘制多边形的功能，我用的是vue3
// 用fabric.js@5 实现一个绘制多边形功能，具体：点击绘制按钮后，将在画布上绘制多边形，双击结束绘制，并创建完成一个多边形并触发一个事件

let lineObjects: fabric.Line[] = []
let activePolygon: fabric.Polygon | null = null

export function initPolygonDrawing() {
  const canvas = utilFabricGetCanvasInstance()

  // Initialize canvas event handlers for polygon drawing
  canvas.on('mouse:down', onMouseDown)
  canvas.on('mouse:move', onMouseMove)
  canvas.on('mouse:dblclick', onDoubleClick)
}

export function startPolygonDrawing() {
  const canvas = utilFabricGetCanvasInstance()
  isDrawingMode.value = true
  canvas.selection = false
  canvas.defaultCursor = 'crosshair'
  points.length = 0
  lineObjects.forEach(line => canvas.remove(line))
  lineObjects = []
  if (activePolygon) {
    canvas.remove(activePolygon)
    activePolygon = null
  }
}

export function stopPolygonDrawing() {
  const canvas = utilFabricGetCanvasInstance()
  isDrawingMode.value = false
  canvas.selection = true
  canvas.defaultCursor = 'default'
  points.length = 0
  lineObjects.forEach(line => canvas.remove(line))
  lineObjects = []
  if (activePolygon) {
    canvas.remove(activePolygon)
    activePolygon = null
  }
  canvas.renderAll()
}

function onMouseDown(event: fabric.IEvent) {
  if (!isDrawingMode.value || !event.pointer)
    return

  const canvas = utilFabricGetCanvasInstance()
  const pointer = canvas.getPointer(event.e)
  const { x, y } = pointer

  // Add point to array
  points.push(new fabric.Point(x, y))

  // Draw point marker
  const point = new fabric.Circle({
    left: x - 2,
    top: y - 2,
    radius: 2,
    fill: '#ff0000',
    selectable: false,
    evented: false,
    name: 'point',
  })

  canvas.add(point)

  // If we have more than one point, draw line
  if (points.length > 1) {
    const p1 = points[points.length - 2]
    const p2 = points[points.length - 1]

    const line = new fabric.Line([p1!.x, p1!.y, p2!.x, p2!.y], {
      stroke: '#999999',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    })

    lineObjects.push(line)
    canvas.add(line)
  }

  canvas.renderAll()
}

function onMouseMove(event: fabric.IEvent) {
  if (!isDrawingMode.value || points.length === 0 || !event.pointer)
    return

  const canvas = utilFabricGetCanvasInstance()
  const pointer = canvas.getPointer(event.e)

  // Remove the last temporary line if it exists
  if (activePolygon) {
    canvas.remove(activePolygon)
  }

  // Create temporary polygon
  const tempPoints = [...points, new fabric.Point(pointer.x, pointer.y)]
  activePolygon = new fabric.Polygon(tempPoints, {
    fill: 'rgba(0,0,0,0.1)',
    stroke: '#999999',
    strokeWidth: 2,
    selectable: false,
    evented: false,
  })

  canvas.add(activePolygon)
  canvas.renderAll()
}

function onDoubleClick(_event: fabric.IEvent) {
  if (!isDrawingMode.value || points.length < 3)
    return

  const canvas = utilFabricGetCanvasInstance()

  // Remove all temporary drawing objects
  lineObjects.forEach(line => canvas.remove(line))
  if (activePolygon) {
    canvas.remove(activePolygon)
  }

  // Create final polygon
  const polygon = new fabric.Polygon(points, {
    fill: 'rgba(0,0,0,0.1)',
    stroke: '#000000',
    strokeWidth: 2,
    name: `polygon-${nanoid()}`,
    lockScalingX: true,
    lockScalingY: true,
  })

  canvas.add(polygon)
  // 移除所有点
  canvas.getObjects().filter(obj => obj.name === 'point').forEach(obj => canvas.remove(obj))

  canvas.renderAll()
  console.warn('[functions.ts]:', '创建多边形', polygon)
  // Convert points to simple objects for event
  const pointObjects = points.map(p => ({ x: p.x, y: p.y }))

  // Emit custom event
  canvas.fire('polygon:created', {
    polygon,
    points: pointObjects,
  } as PolygonDrawnEvent)

  // Reset drawing state
  stopPolygonDrawing()
}

// Clean up function
export function destroyPolygonDrawing() {
  const canvas = utilFabricGetCanvasInstance()
  canvas.off('mouse:down', onMouseDown)
  canvas.off('mouse:move', onMouseMove)
  canvas.off('mouse:dblclick', onDoubleClick)
}
