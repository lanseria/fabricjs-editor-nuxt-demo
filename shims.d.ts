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

interface CanvasObjects {
  id: string
  type?: string
  left?: number
  top?: number
  value: string
  scaleX?: number
  scaleY?: number
  url?: string
  fill?: string
  fontSize?: number
  fontFamily?: string
}

interface CanvasElementObjectProps {
  /**
   * 自定义图片url
   */
  url: string
  /**
   * {{自定义图片}}
   */
  value: string
  /**
   * 固定写死，自定义图片CUSTOM_IMAGE_1
   */
  id: string
  left: number
  top: number
  scaleX: number
  scaleY: number
  /**
   * text image
   */
  type: string
  /**
   * 填充颜色 默认黑色
   */
  fill: string
  /**
   * 字体大小
   */
  fontSize: number
  /**
   * 字体
   */
  fontFamily: string
}
