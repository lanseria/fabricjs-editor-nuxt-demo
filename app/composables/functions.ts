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
export async function fetchLayerList() {
  const { data } = await queryLayerList()
  globalLayerList.value = data
}
export function queryAllData() {
  fetchObjList()
  fetchUnitList()
  fetchPageList()
  fetchLayerList()
}
