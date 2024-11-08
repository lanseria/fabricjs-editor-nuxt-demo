import { customAlphabet } from 'nanoid'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const nanoid = customAlphabet(alphabet, 4) // 生成长度为4的ID

export function initPageRecord(): PageRecord {
  const id = nanoid()
  return {
    id,
    name: `页面_${id}`,
    children: [],
  }
}

export function onPageAdd() {
  storePageList.value.push(initPageRecord())
}
export function onPageDelete(item: PageRecord) {
  storePageList.value = storePageList.value.filter(i => i.id !== item.id)
}

export function onLayerAdd(options: PolygonWithTextOptions) {
  console.warn('[onLayerAdd]:', options)
  if (!currentPageId.value) {
    console.error('请先选择页面ID', currentPageId.value)
    Message.warning('请先选择页面ID')
    return
  }
  const currentLayerList = storeLayerList.value.filter(i => i.pageId === currentPageId.value)
  if (currentLayerList.find(i => i.name === options.name)) {
    // 更新
    const idx = currentLayerList.findIndex(i => i.name === options.name)
    storeLayerList.value[idx] = { ...options }
  }
  else {
    // 新增
    storeLayerList.value.push(options)
  }
  triggerRef(storePageList)
}
