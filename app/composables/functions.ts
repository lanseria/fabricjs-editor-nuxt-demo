async function fetchObjList() {
  const { data } = await queryObjList()
  globalObjList.value = data
}
async function fetchUnitList() {
  const { data } = await queryUnitList()
  globalUnitList.value = data
}
export function queryAllData() {
  fetchObjList()
  fetchUnitList()
}
