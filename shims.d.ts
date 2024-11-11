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

interface R<T> {
  code: number
  data: T
  msg: string
}

interface PolygonDrawnEvent {
  polygon: fabric.Polygon
}

interface PolygonWithTextOptions {
  // id: string
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
  riskAnalysisObjectId?: string
  riskAnalysisObjectLevel?: string
  // pageId
  pageId: string
}

interface PostPageLayerList {
  pageId: string
  children: PolygonWithTextOptions[]
}

interface PageRecord {
  id: string
  name: string
}

interface ObjUnitRecord {
  id: string
  name: string
  level: string
}
