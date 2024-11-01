import type { ShallowRef } from 'vue'
import { fabric } from 'fabric'

export function initFabricCanvas(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    fabricCanvas.value = new fabric.Canvas(canvas, {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      // 禁用多选
      selection: false,
      preserveObjectStacking: true,
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    })
    // initBackground()
  }
}
/**
 * 实时监听wrap大小变化
 * @param width
 * @param height
 */
export function onFabricCanvasResize(width: number, height: number) {
  fabricCanvasWrapSize.value = { width, height }
  // 工作区自动缩放
  if (!fabricCanvasWorkspaceLoaded.value) {
    onFabricCanvasWorkspaceResize()
  }
  else {
    const debouncedFn = useDebounceFn(onFabricCanvasWorkspaceResize, 500)
    debouncedFn()
  }
}

// 控制器/编辑器
export function initFabricDeleteControl() {
  const deleteIcon
    = 'data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'utf-8\'%3F%3E%3C!DOCTYPE svg PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'%3E%3Csvg version=\'1.1\' id=\'Ebene_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' width=\'595.275px\' height=\'595.275px\' viewBox=\'200 215 230 470\' xml:space=\'preserve\'%3E%3Ccircle style=\'fill:%23F44336;\' cx=\'299.76\' cy=\'439.067\' r=\'218.516\'/%3E%3Cg%3E%3Crect x=\'267.162\' y=\'307.978\' transform=\'matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)\' style=\'fill:white;\' width=\'65.545\' height=\'262.18\'/%3E%3Crect x=\'266.988\' y=\'308.153\' transform=\'matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)\' style=\'fill:white;\' width=\'65.544\' height=\'262.179\'/%3E%3C/g%3E%3C/svg%3E'
  const delImg = document.createElement('img')
  delImg.src = deleteIcon

  function renderDelIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object,
  ) {
    utilFabricImageDraw(ctx, left, top, delImg, 24, 24, fabricObject.angle)
  }

  // 删除选中元素
  function deleteObject(mouseEvent: MouseEvent, target: fabric.Transform) {
    const delCanvas = fabricCanvas.value
    if (target.action === 'rotate')
      return true
    const activeObject = delCanvas?.getActiveObjects()
    if (activeObject) {
      activeObject.map(item => delCanvas?.remove(item))
      delCanvas?.requestRenderAll()
      delCanvas?.discardActiveObject()
    }
    // if (target.target.id === 'background')
    //   storeCanvasBackgroundImage.value = undefined

    triggerRef(fabricCanvas)
    return true
  }

  // 删除图标
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderDelIcon,
    // cornerSize: 24,
  })
}

export function initFabricWorkspace() {
  if (!fabricCanvas.value)
    return
  const canvas = fabricCanvas.value
  const workspace = new fabric.Rect({
    fill: 'rgba(255,255,255,1)',
    width: WORKSPACE_WIDTH,
    height: WORKSPACE_HEIGHT,
    left: (canvas.width! - WORKSPACE_WIDTH) / 2,
    top: (canvas.height! - WORKSPACE_HEIGHT) / 2,
    id: 'workspace',
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
