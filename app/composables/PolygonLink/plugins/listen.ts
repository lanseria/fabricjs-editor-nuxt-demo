export function onObjectChange() {
  const canvas = canvasFabric.value!
  // 监听所有对象的变化
  canvas.on('object:modified', async (e) => {
    const obj = e.target
    if (!obj) {
      return
    }
    const index = polygonWithTextList.value.findIndex(polygonWithText => polygonWithText.options.name === obj.name)
    const modifiedObj = polygonWithTextList.value[index]
    if (!modifiedObj) {
      return
    }
    // 修改后重新绘制
    await putLayer(modifiedObj.options)
    // storeLayerList.value[index] = { ...storeLayerList.value[index], ...modifiedObj.options }
  })
}

export function offObjectChange() {
  const canvas = canvasFabric.value!
  canvas.off('object:modified')
}
