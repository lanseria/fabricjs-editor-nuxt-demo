export const DEFAULT_TEXT_COLOR = '#333333'
export const DEFAULT_TEXT_SIZE = 24
export const DEFAULT_BG_COLOR = 'rgba(0,0,0,0.1)'
export const DEFAULT_STROKE_COLOR = '#000'

export const riskLevelStatusMap: Record<number, string> = {
  0: '低风险',
  1: '一般风险',
  2: '较大风险',
  3: '重大风险',
}
// const dangerLevelStatusMap: Record<number, string> = {
//   0: '四级',
//   1: '三级',
//   2: '二级',
//   3: '一级',
// }
export const selectedKeys = ref<number[]>([])
export const levelColorMap: Record<number, string> = {
  0: '#035EF7',
  1: '#FEE516',
  2: '#FF9309',
  3: '#D70002',
}
export const levelTextColorMap: Record<number, string> = {
  0: '#ffffff',
  1: '#333333',
  2: '#ffffff',
  3: '#ffffff',
}
