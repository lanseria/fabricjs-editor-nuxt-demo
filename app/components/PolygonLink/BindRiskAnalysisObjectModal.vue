<script lang="ts" setup>
import type { TableRowSelection } from '@arco-design/web-vue'

const emits = defineEmits(['fetchData'])

const ModalVisible = ref(false)
const selectedKeys = ref<string[]>([])
const riskType = ref<'obj' | 'unit'>('obj')
const keyword = ref('')
const rowSelection: TableRowSelection = {
  type: 'radio',
}
const currentPolygonWithTextName = shallowRef('')

const renderData = computed(() => {
  if (riskType.value === 'obj')
    return globalObjList.value
  else
    return globalUnitList.value
})

const searchRenderData = computed(() => {
  if (keyword.value === '')
    return renderData.value
  else
    return renderData.value.filter(item => item.name.includes(keyword.value))
})

function open(polygonWithTextName: string) {
  console.warn('[BindRiskAnalysisObjectModal.vue]:', 'polygon:created', polygonWithTextName)
  currentPolygonWithTextName.value = polygonWithTextName
  ModalVisible.value = true
  fetchObjList()
  fetchUnitList()
}

function edit({ id, name }: { id: string, name: string }) {
  console.warn('[BindRiskAnalysisObjectModal.vue]:', 'polygon:updated', name, id)
  currentPolygonWithTextName.value = name
  selectedKeys.value = [id]
  ModalVisible.value = true
  fetchObjList()
  fetchUnitList()
}
function onSelect(rowKeys: (string | number)[]) {
  const val = rowKeys as string[]
  console.warn('[BindRiskAnalysisObjectModal.vue]:', 'onSelect', val)
  selectedKeys.value = val
}
function onBeforeOk(done: (closed: boolean) => void) {
  if (selectedKeys.value.length === 0) {
    Message.warning('请选择风险分析对象')
    done(false)
  }
  else {
    const selectItem = renderData.value.find(item => item.id === selectedKeys.value[0])
    const currentPolygonWithTextIdx = polygonWithTextList.value.findIndex(item => item.options.name === currentPolygonWithTextName.value)
    if (selectItem && currentPolygonWithTextIdx !== -1) {
      const polygonWithText = polygonWithTextList.value[currentPolygonWithTextIdx]!
      polygonWithText.bindRiskAnalysis(selectItem)
      triggerRef(polygonWithTextList)
      onLayerAdd(polygonWithText.options)
    }
    done(true)
  }
}
onMounted(() => {
  emitter.on('polygon:created', (val: string) => {
    open(val)
  })
  emitter.on('polygon:updated', ({ name, id }: { name: string, id: string }) => {
    edit({ id, name })
  })
})
onUnmounted(() => {
  emitter.off('polygon:created')
})
</script>

<template>
  <AModal
    v-model:visible="ModalVisible"
    width="700px"
    :mask-closable="false"
    unmount-on-close
    draggable
    hide-cancel
    @before-ok="onBeforeOk"
    @close="emits('fetchData')"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <div>绑定风险分析对象</div>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <ARadioGroup v-model:model-value="riskType" type="button">
          <ARadio value="obj">
            对象
          </ARadio>
          <ARadio value="unit">
            单元
          </ARadio>
        </ARadioGroup>
        <AInputSearch v-model="keyword" class="w-320px!" placeholder="输入风险分析对象" />
      </div>
      <ATable :data="searchRenderData" row-key="id" :row-selection="rowSelection" :selected-keys="selectedKeys" @select="onSelect">
        <template #columns>
          <ATableColumn title="风险分析对象名称" data-index="name" :width="400" />
          <ATableColumn title="风险等级" data-index="level" :width="150">
            <template #cell="{ record }">
              <div
                class="inline-flex items-center justify-center rounded px-2 py-1 font-bold"
                :style="{
                  backgroundColor: levelColorMap[record.level],
                  color: levelTextColorMap[record.level],
                }"
              >
                {{ riskLevelStatusMap[record.level] }}
              </div>
            </template>
          </ATableColumn>
        </template>
      </ATable>
    </div>
  </AModal>
</template>
