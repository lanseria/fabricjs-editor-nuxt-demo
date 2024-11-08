import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

let lineObjects: fabric.Line[] = []
let activePolygon: fabric.Polygon | null = null
const points: fabric.Point[] = []

function convertPoints(points: fabric.Point[]): { x: number, y: number }[] {
  return points.map(point => ({
    x: point.x,
    y: point.y,
  }))
}
function getBoundingBox(points: fabric.Point[]): { left: number, top: number, width: number, height: number } {
  if (points.length === 0) {
    throw new Error('Points array is empty.')
  }

  // 初始化最小和最大值
  let minX = points[0]!.x
  let minY = points[0]!.y
  let maxX = points[0]!.x
  let maxY = points[0]!.y

  // 遍历所有点，更新最小和最大值
  for (const point of points) {
    if (point.x < minX)
      minX = point.x
    if (point.y < minY)
      minY = point.y
    if (point.x > maxX)
      maxX = point.x
    if (point.y > maxY)
      maxY = point.y
  }

  // 计算宽度和高度
  const width = maxX - minX
  const height = maxY - minY

  // 返回左上角坐标、宽度和高度
  return { left: minX, top: minY, width, height }
}

function adjustPoints(polygonPoints: { x: number, y: number }[], boundingBox: { left: number, top: number, width: number, height: number }) {
  return polygonPoints.map(point => ({
    x: point.x - boundingBox.left,
    y: point.y - boundingBox.top,
  }))
}

export function startPolygonDrawing() {
  const canvas = canvasFabric.value as fabric.Canvas
  // Initialize canvas event handlers for polygon drawing
  canvas.on('mouse:down', onMouseDown)
  canvas.on('mouse:move', onMouseMove)
  canvas.on('mouse:dblclick', onDoubleClick)
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
  const canvas = canvasFabric.value as fabric.Canvas
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
  canvas.off('mouse:down', onMouseDown)
  canvas.off('mouse:move', onMouseMove)
  canvas.off('mouse:dblclick', onDoubleClick)
}

function onMouseDown(event: fabric.IEvent) {
  if (!isDrawingMode.value || !event.pointer)
    return

  const canvas = canvasFabric.value as fabric.Canvas
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

  const canvas = canvasFabric.value as fabric.Canvas
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

  const canvas = canvasFabric.value!
  // // Create final polygon
  const polygonPoints = convertPoints(points)
  // console.warn(polygonPoints)
  const boundingBox = getBoundingBox(points)
  // console.warn(boundingBox)
  const absolutePoints = adjustPoints(polygonPoints, boundingBox)
  const name = `polygon-${nanoid(4)}`

  const polygonWithText = new PolygonWithText(canvas, {
    points: absolutePoints,
    left: boundingBox.left,
    top: boundingBox.top,
    width: boundingBox.width,
    height: boundingBox.height,
    text: name,
    name,
    fill: 'rgba(0,0,0,0.1)',
    stroke: '#000',
    strokeWidth: 1,
    fontSize: 24,
    textColor: '#000',
    pageId: currentPageId.value,
  })

  // canvas.add(polygon)
  // // 移除所有点
  canvas.getObjects().filter(obj => obj.name === 'point').forEach(obj => canvas.remove(obj))

  emitter.emit('polygon:created', polygonWithText.options.name)
  // canvas.renderAll()
  triggerRef(canvasFabric)
  // 添加到对象列表
  polygonWithTextList.value.push(polygonWithText)
  onLayerAdd(polygonWithText.options)
  // Reset drawing state
  stopPolygonDrawing()
}

export function onPolygonInitAdd(options: PolygonWithTextOptions) {
  console.log('onPolygonInitAdd', JSON.stringify(canvasFabric.value))
  if (canvasFabric.value === undefined) {
    console.error('请先初始化画布')
    return
  }
  const canvas = canvasFabric.value
  const polygonWithText = new PolygonWithText(canvas, options)
  polygonWithTextList.value.push(polygonWithText)
}

export function onPolygonDelete(name: string) {
  const polygonWithText = polygonWithTextList.value.find(i => i.options.name === name)
  if (polygonWithText) {
    polygonWithText.remove()
    polygonWithTextList.value = polygonWithTextList.value.filter(i => i.options.name !== name)
  }
}
