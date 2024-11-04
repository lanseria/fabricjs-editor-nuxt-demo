import type { Transform } from 'fabric/fabric-impl'
import type { ShallowRef } from 'vue'
import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

export function initCanvasElementObjectProps(): CanvasElementObjectProps {
  return {
    url: '',
    value: '',
    id: '',
    left: 0,
    top: 0,
    scaleX: 1,
    scaleY: 1,
    type: '',
    fill: '',
    fontSize: 30,
    fontFamily: '思源黑体', // 可考虑自定义字体
  }
}

export function initFabricSelectEvent() {
  function _emitSelectEvent(e: fabric.IEvent<MouseEvent>) {
    console.warn('[emitSelectEvent]:', e.selected)
    if (e.selected && e.selected?.length > 0) {
      fabricCanvasActiveObj.value = e.selected[0]
      if (fabricCanvasActiveObj.value) {
        fabricCanvasActiveObjProps.value.type = fabricCanvasActiveObj.value.type ?? ''
        fabricCanvasActiveObjProps.value.id = fabricCanvasActiveObj.value.id ?? ''
        fabricCanvasActiveObjProps.value.url = fabricCanvasActiveObj.value.url ?? ''
        fabricCanvasActiveObjProps.value.fill = fabricCanvasActiveObj.value.fill as string ?? ''
        fabricCanvasActiveObjProps.value.fontSize = fabricCanvasActiveObj.value.fontSize ?? 30
        fabricCanvasActiveObjProps.value.fontFamily = fabricCanvasActiveObj.value.fontFamily ?? '思源黑体'
      }
    }
    else {
      fabricCanvasActiveObjProps.value = initCanvasElementObjectProps()
    }
  }
  const canvas = utilFabricGetCanvasInstance()
  canvas.on('selection:created', _emitSelectEvent)
  canvas.on('selection:updated', _emitSelectEvent)
  canvas.on('selection:cleared', _emitSelectEvent)
}

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
    initFabricSelectEvent()
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
    id: WORKSPACE_ID,
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
          id: BACKGROUND_ID,
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
          id: `${CUSTOM_IMAGE_ID_PREFIX}${id}`,
          name: `${CUSTOM_IMAGE_ID_PREFIX}${id}`,
          url,
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

export function onAddDynamicText(record: CanvasObjects) {
  return new Promise((resolve, reject) => {
    const { canvas, workspace } = utilFabricGetWorkspaceInstance()
    if (record.type === 'i-text') {
      const id = nanoid(4)
      const iText = new fabric.IText(record.value, {
        ...DEFAULT_TEXT_OPTIONS,
        editable: true,
        id: `${record.id}_${id}`,
        name: record.value,
        left: workspace.left! + (record.left ?? workspace.width! / 2), // left
        top: workspace.top! + (record.top ?? workspace.height! / 2), // bottom
        scaleX: record.scaleX ?? 1,
        scaleY: record.scaleY ?? 1,
        fill: record.fill ?? DEFAULT_TEXT_FILL,
        fontSize: record.fontSize ?? DEFAULT_FONT_SIZE,
        fontFamily: record.fontFamily ?? DEFAULT_FONT_FAMILY,
      })
      canvas.add(iText)
      canvas.setActiveObject(iText)
      canvas.renderAll()
      triggerRef(fabricCanvas)
      resolve(iText)
      // TODO: 监听更新时间并保存
    }
    else if (record.type === 'text') {
      const text = new fabric.Text(record.value, {
        ...DEFAULT_TEXT_OPTIONS,
        id: record.id,
        name: record.value,
        left: workspace.left! + (record.left ?? workspace.width! / 2), // left
        top: workspace.top! + (record.top ?? workspace.height! / 2), // bottom
        scaleX: record.scaleX ?? 1,
        scaleY: record.scaleY ?? 1,
        fill: record.fill ?? DEFAULT_TEXT_FILL,
        fontSize: record.fontSize ?? DEFAULT_FONT_SIZE,
        fontFamily: record.fontFamily ?? DEFAULT_FONT_FAMILY,
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
      triggerRef(fabricCanvas)
      resolve(text)
    }
    else if (record.type === 'image') {
      let IMAGE_URL = ''
      // 内置固定图片
      if (CERT_IMAGE_TYPES.includes(record.id)) {
        IMAGE_URL = CERT_IMAGE_MAP[record.id as keyof typeof CERT_IMAGE_MAP]
      }
      // 自定义图片 CUSTOM_IMAGE_
      else if (record.url) {
        IMAGE_URL = record.url // blob url
      }
      else {
        throw new Error('url is null')
      }
      fabric.Image.fromURL(IMAGE_URL, (imgInstance) => {
        canvas.add(imgInstance.set({
          left: workspace.left! + (record.left ?? workspace.width! / 2), // left
          top: workspace.top! + (record.top ?? workspace.height! / 2), // bottom
          scaleX: record.scaleX ?? 1,
          scaleY: record.scaleY ?? 1,
          id: record.id,
          name: record.value,
          url: IMAGE_URL,
          ...DEFAULT_IMAGE_OPTIONS,
        }))
        canvas.setActiveObject(imgInstance)
        canvas.renderAll()
        triggerRef(fabricCanvas)
        resolve(imgInstance)
      }, {
        crossOrigin: 'anonymous',
      })
    }
    else {
      reject(new Error('type is not supported'))
    }
  })
}
