export const WORKSPACE_WIDTH = 1920
export const WORKSPACE_HEIGHT = 1080
export const WORKSPACE_ID = 'workspace'
export const BACKGROUND_ID = 'background'
export const DELETE_ICON_SVG_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xNiAyQzguMiAyIDIgOC4yIDIgMTZzNi4yIDE0IDE0IDE0czE0LTYuMiAxNC0xNFMyMy44IDIgMTYgMm01LjQgMjFMMTYgMTcuNkwxMC42IDIzTDkgMjEuNGw1LjQtNS40TDkgMTAuNkwxMC42IDlsNS40IDUuNEwyMS40IDlsMS42IDEuNmwtNS40IDUuNGw1LjQgNS40eiIvPjwvc3ZnPg=='
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
