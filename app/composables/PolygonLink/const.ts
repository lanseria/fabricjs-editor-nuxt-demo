export const DEFAULT_TEXT_COLOR = '#333333'
export const DEFAULT_TEXT_SIZE = 24
export const DEFAULT_BG_COLOR = 'rgba(0,0,0,0.1)'
export const DEFAULT_STROKE_COLOR = '#000'
/**
 * 风险对象
 */
export const riskLevelStatusMap: Record<number, string> = {
  4: '低风险',
  3: '一般风险',
  2: '较大风险',
  1: '重大风险',
}
export const selectedKeys = ref<number[]>([])
export const levelColorMap: Record<number, string> = {
  4: '#035EF7',
  3: '#FEE516',
  2: '#FF9309',
  1: '#D70002',
}
export const levelTextColorMap: Record<number, string> = {
  4: '#ffffff',
  3: '#333333',
  2: '#ffffff',
  1: '#ffffff',
}
