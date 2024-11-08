import { fabric } from 'fabric'

export class PolygonWithText {
  private canvas: fabric.Canvas
  private polygon: fabric.Polygon
  private text: fabric.Text
  private group: fabric.Group
  public options: PolygonWithTextOptions

  constructor(canvas: fabric.Canvas, options: PolygonWithTextOptions) {
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
      left: options.left + options.width / 2,
      top: options.top + options.height / 2,
      fontSize: options.fontSize || DEFAULT_TEXT_SIZE,
      fill: options.textColor || DEFAULT_TEXT_COLOR,
      originX: 'center',
      originY: 'center',
    })

    // 将多边形和文本组合成组
    this.group = new fabric.Group([this.polygon, this.text], {
      selectable: true,
      hasControls: true,
      name: options.name,
    })

    // 添加到画布
    // console.warn(this.group.width, this.group.height)
    this.canvas.add(this.group)
    // this.canvas.renderAll()
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
  public bindRiskAnalysis(riskAnalysis: AnalysisObject) {
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
    triggerRef(canvasFabric)
  }
}
