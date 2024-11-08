export function onObjectChange() {
  const canvas = canvasFabric.value!
  // 监听所有对象的变化
  canvas.on('object:modified', (e) => {
    const obj = e.target
    if (!obj) {
      return
    }
    const index = polygonWithTextList.value.findIndex(polygonWithText => polygonWithText.options.name === obj.name)
    const modifiedObj = polygonWithTextList.value[index]
    if (!modifiedObj) {
      return
    }
    storeLayerList.value[index] = { ...storeLayerList.value[index], ...modifiedObj.options }
  })
}

export function offObjectChange() {
  const canvas = canvasFabric.value!
  canvas.off('object:modified')
}
