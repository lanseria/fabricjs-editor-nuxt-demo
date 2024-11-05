import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

let lineObjects: fabric.Line[] = []
let activePolygon: fabric.Polygon | null = null
const points: fabric.Point[] = []

export function initPolygonDrawing() {
  const canvas = canvasFabric.value!

  // Initialize canvas event handlers for polygon drawing
  canvas.on('mouse:down', onMouseDown)
  canvas.on('mouse:move', onMouseMove)
  canvas.on('mouse:dblclick', onDoubleClick)
}

export function startPolygonDrawing() {
  const canvas = canvasFabric.value!
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
  const canvas = canvasFabric.value!
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

  const canvas = canvasFabric.value!
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

  const canvas = canvasFabric.value!
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

  // Remove all temporary drawing objects
  lineObjects.forEach(line => canvas.remove(line))
  if (activePolygon) {
    canvas.remove(activePolygon)
  }

  // Create final polygon
  const polygon = new fabric.Polygon(points, {
    fill: '#ccccccff',
    // stroke: '#000000',
    // strokeWidth: 2,
    name: `polygon-${nanoid()}`,
    // lockScalingX: true,
    // lockScalingY: true,
  })

  canvas.add(polygon)
  // 移除所有点
  canvas.getObjects().filter(obj => obj.name === 'point').forEach(obj => canvas.remove(obj))

  // Convert points to simple objects for event
  const pointObjects = points.map(p => ({ x: p.x, y: p.y }))

  // Emit custom event
  canvas.fire('polygon:created', {
    polygon,
    points: pointObjects,
  } as PolygonDrawnEvent)
  canvas.renderAll()
  triggerRef(canvasFabric)
  // Reset drawing state
  stopPolygonDrawing()
}

// Clean up function
export function destroyPolygonDrawing() {
  const canvas = canvasFabric.value!
  canvas.off('mouse:down', onMouseDown)
  canvas.off('mouse:move', onMouseMove)
  canvas.off('mouse:dblclick', onDoubleClick)
}
