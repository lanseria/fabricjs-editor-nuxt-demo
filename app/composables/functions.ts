export async function fetchObjList() {
  const { data } = await queryObjList()
  globalObjList.value = data
}
export async function fetchUnitList() {
  const { data } = await queryUnitList()
  globalUnitList.value = data
}
export async function fetchPageList() {
  const { data } = await queryPageList()
  globalPageList.value = data
}
export async function fetchPageDetail(id: string) {
  const { data } = await queryPageById(id)
  globalPageDetail.value = data
}
export function queryAllData() {
  // fetchObjList()
  // fetchUnitList()
  // fetchPageList()
  // fetchLayerList()
}

export function setToolActive(tool: ToolActive) {
  toolActive.value = tool
  if (tool === 'select') {
    polygonWithTextList.value.forEach((item) => {
      item.setMoveable(true)
    })
  }
  else {
    polygonWithTextList.value.forEach((item) => {
      item.setMoveable(false)
    })
  }
}

export function setBackgroundImageBlobUrl(url: string) {
  backgroundImageBlobUrl.value = url
}

export function initBackgroundImageBlobUrl() {
  backgroundImageBlobUrl.value = ''
}
