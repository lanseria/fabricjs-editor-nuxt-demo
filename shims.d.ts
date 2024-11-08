declare global {
  declare module 'fabric/fabric-impl' {
    interface IObjectOptions {
      /**
       * 标识
       */
      id?: string | undefined
      text?: string | undefined
      zoomX?: number | undefined
      url?: string | undefined
      fontSize?: number | undefined
      fontFamily?: string | undefined
    }
  }
}

interface PolygonDrawnEvent {
  polygon: fabric.Polygon
}

interface AnalysisObject {
  id: number
  name: string
  level: number
}

interface PolygonWithTextOptions {
  left: number
  top: number
  width: number
  height: number
  points: { x: number, y: number }[]
  text: string
  name: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  fontSize?: number
  textColor?: string
  // 绑定风险分析对象ID
  riskAnalysisObjectId?: number
  riskAnalysisObjectLevel?: number
}

interface PageRecord {
  id: string
  name: string
  children: PolygonWithTextOptions[]
}
