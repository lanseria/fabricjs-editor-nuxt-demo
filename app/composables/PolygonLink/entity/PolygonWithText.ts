import { fabric } from 'fabric'

export class PolygonWithText {
  private canvas: fabric.Canvas | fabric.StaticCanvas
  private polygon: fabric.Polygon
  private text: fabric.Text
  private group: fabric.Group
  public options: PolygonWithTextOptions

  constructor(canvas: fabric.Canvas | fabric.StaticCanvas, options: PolygonWithTextOptions, selectable = true) {
    this.canvas = canvas
    this.options = options

    // 创建多边形
    this.polygon = new fabric.Polygon(options.points, {
      fill: options.fill || DEFAULT_BG_COLOR,
      stroke: options.stroke || DEFAULT_STROKE_COLOR,
      strokeWidth: options.strokeWidth || 1,
      originX: 'center',
      originY: 'center',
    })

    // 创建文本
    this.text = new fabric.Text(options.text, {
      left: options.width / 2,
      top: options.height / 2,
      fontSize: options.fontSize || DEFAULT_TEXT_SIZE,
      fill: options.textColor || DEFAULT_TEXT_COLOR,
      originX: 'center',
      originY: 'center',
    })

    // 将多边形和文本组合成组
    this.group = new fabric.Group([this.polygon, this.text], {
      selectable,
      hasControls: true,
      name: options.name,
      left: options.left,
      top: options.top,
    })

    // 添加事件监听器
    this.setupEventListeners()
    // 添加到画布
    this.canvas.add(this.group)
  }

  private setupEventListeners() {
    // 监听移动事件
    this.group.on('moving', () => {
      this.syncPositionToOptions()
    })

    // 监听缩放事件
    this.group.on('scaling', () => {
      this.syncSizeToOptions()
    })

    // 监听旋转事件
    // this.group.on('rotating', () => {
    //   this.syncRotationToOptions()
    // })

    // 监听修改完成事件
    this.group.on('modified', () => {
      this.syncAllPropertiesToOptions()
      triggerRef(canvasFabric)
    })
  }

  // 同步位置到 options
  private syncPositionToOptions() {
    if (this.group) {
      this.options.left = this.group.left ?? 0
      this.options.top = this.group.top ?? 0
    }
  }

  // 同步大小到 options
  private syncSizeToOptions() {
    if (this.group) {
      const scaled = {
        width: (this.group.width ?? 0) * (this.group.scaleX ?? 1),
        height: (this.group.height ?? 0) * (this.group.scaleY ?? 1),
      }
      this.options.width = scaled.width
      this.options.height = scaled.height

      // 更新点坐标
      if (this.group.scaleX && this.group.scaleY) {
        this.options.points = this.options.points.map(point => ({
          x: point.x * this.group.scaleX!,
          y: point.y * this.group.scaleY!,
        }))
      }
    }
  }

  // 同步所有属性到 options
  private syncAllPropertiesToOptions() {
    this.syncPositionToOptions()
    this.syncSizeToOptions()
  }

  // 更新文本内容
  private updateText(newText: string, newColor: string) {
    this.options.text = newText
    this.options.textColor = newColor
    this.text.set('text', newText)
    this.text.set('fill', newColor)
  }

  // 更新图形背景色
  private updateBg(newColor: string) {
    this.options.fill = newColor
    this.polygon.set('fill', newColor)
  }

  // 获取组对象
  // private getGroup() {
  //   return this.group
  // }

  // 通过绑定风险分析对象改变多边形颜色以及文字
  public bindRiskAnalysis(riskAnalysis: ObjUnitRecord) {
    const bgColor = levelColorMap[riskAnalysis.level] || DEFAULT_BG_COLOR
    const textColor = levelTextColorMap[riskAnalysis.level] || DEFAULT_TEXT_COLOR
    this.updateText(riskAnalysis.name, textColor)
    this.updateBg(bgColor)
    this.options.riskAnalysisObjectId = riskAnalysis.id
    this.options.riskAnalysisObjectLevel = riskAnalysis.level
    this.canvas.renderAll()
    triggerRef(canvasFabric)
  }

  // 删除自己
  public remove() {
    this.canvas.remove(this.group)
    this.canvas.renderAll()
    triggerRef(canvasFabric)
  }
}
