export function onObjectChange() {
  const canvas = canvasFabric.value!
  // 监听所有对象的变化
  canvas.on('object:modified', (e) => {
    const obj = e.target
    console.log(`Object modified: ${obj.type}`)
    console.log(`New position: (${obj.left}, ${obj.top})`)
    console.log(`New scale: (scaleX: ${obj.scaleX}, scaleY: ${obj.scaleY})`)

    polygonWithTextList.value.forEach((polygonWithText) => {
      console.log(polygonWithText.options)
    })
  })
}

export function offObjectChange() {
  const canvas = canvasFabric.value!
  canvas.off('object:modified')
}
