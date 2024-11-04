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
  points: { x: number, y: number }[]
}
