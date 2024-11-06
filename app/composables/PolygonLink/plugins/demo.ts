import { fabric } from 'fabric'

function createStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  const points = []
  const angle = Math.PI / spikes

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = cx + Math.cos(i * angle) * radius
    const y = cy + Math.sin(i * angle) * radius
    points.push({ x, y })
  }

  return points
}
export function addStar() {
  const canvas = canvasFabric.value!
  const starPoints = createStar(250, 200, 5, 70, 30)
  console.warn(starPoints)
  const star = new fabric.Polygon(starPoints, {
    left: 100,
    top: 50,
    fill: '#D81B60',
    strokeWidth: 4,
    stroke: 'green',
    name: 'star',
  })

  canvas.add(star)
  triggerRef(canvasFabric)
}
