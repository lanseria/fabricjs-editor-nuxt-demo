export const WORKSPACE_WIDTH = 1920
export const WORKSPACE_HEIGHT = 1080
export const DEFAULT_TEXT_COLOR = '#333333'
export const DEFAULT_TEXT_SIZE = 24
export const DEFAULT_BG_COLOR = 'rgba(0,0,0,0.1)'
export const DEFAULT_STROKE_COLOR = '#000'
export const DRAW_STROKE_WIDTH = 1
export const DRAW_STROKE_COLOR = '#43CF7C'
export const DRAW_FILL_COLOR = '#43CF7C4C'

export const WORKSPACE_NAME = 'workspace'
export const BACKGROUND_NAME = 'background'

export const riskLevelList = [
  {
    label: '低风险',
    bgColor: '#035EF7',
    textColor: '#ffffff',
  },
  {
    label: '一般风险',
    bgColor: '#FEE516',
    textColor: '#333333',
  },
  {
    label: '较大风险',
    bgColor: '#FF9309',
    textColor: '#333333',
  },
  {
    label: '重大风险',
    bgColor: '#D70002',
    textColor: '#ffffff',
  },
]
export const riskLevelStatusMap: Record<string, string> = {}
export const levelColorMap: Record<string, string> = {}
export const levelTextColorMap: Record<string, string> = {}

riskLevelList.forEach((item) => {
  riskLevelStatusMap[item.label] = item.label
  levelColorMap[item.label] = item.bgColor
  levelTextColorMap[item.label] = item.textColor
})
