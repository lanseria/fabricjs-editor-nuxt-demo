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

export function onFabricAddPhoto(url: string): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, async (img) => {
      if (img) {
        const { canvas, workspace } = utilFabricGetWorkspaceInstance()
        const id = nanoid(4) // 计算图像应该缩放的比例,使其完全显示在画布中
        const { width, height } = fabricCanvasWorkspaceSize.value
        const scaleRatio = Math.min(width / img.width!, height / img.height!) * 0.8
        img.set({
          name: `PHOTO_${id}`,
          left: workspace.left! + (workspace.width! / 2) - (img.width! * scaleRatio) / 2, // left
          top: workspace.top! + (workspace.height! / 2) + (img.height! * scaleRatio) / 2, // bottom
          scaleX: scaleRatio,
          scaleY: scaleRatio,
          ...DEFAULT_IMAGE_OPTIONS,
        })
        console.warn('[util.ts]:', '添加图片', url, img)
        canvas.add(img)
        // 先放置在最底层
        canvas.sendToBack(img)
        // 再向上移动两层
        canvas.bringForward(img, false)
        canvas.bringForward(img, false)
        canvas.setActiveObject(img)
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
