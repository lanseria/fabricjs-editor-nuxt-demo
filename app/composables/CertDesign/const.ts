export const WORKSPACE_WIDTH = 1920
export const WORKSPACE_HEIGHT = 1080
export const WORKSPACE_ID = 'workspace'
export const BACKGROUND_ID = 'background'
export const CUSTOM_IMAGE_ID_PREFIX = 'CUSTOM_IMAGE_'
export const DELETE_ICON_SVG_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xNiAyQzguMiAyIDIgOC4yIDIgMTZzNi4yIDE0IDE0IDE0czE0LTYuMiAxNC0xNFMyMy44IDIgMTYgMm01LjQgMjFMMTYgMTcuNkwxMC42IDIzTDkgMjEuNGw1LjQtNS40TDkgMTAuNkwxMC42IDlsNS40IDUuNEwyMS40IDlsMS42IDEuNmwtNS40IDUuNGw1LjQgNS40eiIvPjwvc3ZnPg=='

export const CERT_IMAGE_MAP = {
  QR_CODE: '/images/qrcode.svg',
  PASSPORT_PHOTO: '/images/passport_photo.svg',
}
export const CERT_IMAGE_TYPES = Object.keys(CERT_IMAGE_MAP)

// 图片
export const DEFAULT_IMAGE_OPTIONS = {
  // lockScalingFlip: false, // 锁定翻转
  // lockRotation: false, // 锁定旋转
  hasControls: true, // 启用控制点
  hasBorders: true, // 启用边框
  selectable: true, // 使图片可选
  lockScalingFlip: true, // 防止图像在缩放时翻转
  centeredRotation: true, // 围绕中心旋转
  centeredScaling: true, // 围绕中心缩放
  originX: 'left',
  originY: 'bottom',
}
// 文本
export const DEFAULT_TEXT_OPTIONS = {
  fontSize: 30,
  hasControls: true,
  lockScalingX: false, // 锁定X缩放
  lockScalingY: false, // 锁定Y缩放
  centeredScaling: true, // 文本居中
  lockScalingFlip: true, // 锁定翻转
  lockRotation: true, // 锁定旋转
  originX: 'left',
  originY: 'bottom',
}

/**
 * 默认文本颜色
 */
export const DEFAULT_TEXT_FILL = 'rgb(0,0,0)'

/**
 * 默认字体大小
 */
export const DEFAULT_FONT_SIZE = 30
/**
 * 默认字体
 */
export const DEFAULT_FONT_FAMILY = '思源黑体'
/**
 * 字体文件列表
 */
export const FONT_LIST = [
  {
    name: '思源黑体',
    fontFamily: '思源黑体',
  },
  {
    name: '思源宋体',
    fontFamily: '思源宋体',
  },
  // {
  //   name: '王汉宗中仿宋简',
  //   fontFamily: '王汉宗中仿宋简',
  // },
]
export const GROUP_TYPE = [
  '取证人信息',
  '证书文本内容',
  '其他信息',
]
/**
 * 预设可以添加模板的字段
 */
export const ELEMENT_LIST = [
  {
    type: 'text',
    value: '{{姓名}}',
    id: 'USER_NAME',
    groupIdx: 0,
  },
  {
    type: 'text',
    value: '{{性别}}',
    id: 'USER_GENDER',
    groupIdx: 0,
  },
  {
    type: 'text',
    value: '{{身份证号}}',
    id: 'USER_ID_CARD',
    groupIdx: 0,
  },
  {
    type: 'image',
    value: '{{一寸照}}',
    id: 'PASSPORT_PHOTO',
    groupIdx: 0,
  },
  {
    type: 'text',
    value: '{{部门/单位}}',
    id: 'USER_DEPARTMENT',
    groupIdx: 0,
  },
  {
    type: 'text',
    value: '{{证书名称}}',
    id: 'CERT_NAME',
    groupIdx: 1,
  },
  {
    type: 'text',
    value: '{{培训名称}}',
    id: 'TRAINING_NAME',
    groupIdx: 1,
  },
  {
    type: 'text',
    value: '{{证书有效期}}',
    id: 'VALIDITY_PERIOD',
    groupIdx: 1,
  },
  {
    type: 'text',
    value: '{{发证机构}}',
    id: 'ISSUING_AUTHORITY',
    groupIdx: 1,
  },
  {
    type: 'text',
    value: '{{证书编号}}',
    id: 'CERT_CODE',
    groupIdx: 1,
  },
  {
    type: 'i-text',
    value: '自定义文本',
    id: 'I_TEXT',
    groupIdx: 1,
  },
  {
    type: 'text',
    value: '{{人员类型}}',
    id: 'USER_TYPE',
    groupIdx: 2,
  },
  {
    type: 'image',
    value: '{{二维码}}',
    id: 'QR_CODE',
    groupIdx: 2,
  },
]
