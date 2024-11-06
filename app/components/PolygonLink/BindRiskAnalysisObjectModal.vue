<script lang="ts" setup>
import type { TableRowSelection } from '@arco-design/web-vue'

const emits = defineEmits(['fetchData'])

const ModalVisible = ref(false)
const rowSelection: TableRowSelection = {
  type: 'radio',
}
const currentPolygonWithTextName = shallowRef('')

const renderData = ref<AnalysisObject[]>([
  {
    id: 1,
    name: '中控楼',
    level: 0,
  },
  {
    id: 2,
    name: '35kV变电所2',
    level: 1,
  },
  {
    id: 3,
    name: '35kV变电所3',
    level: 2,
  },
  {
    id: 4,
    name: '35kV变电所4',
    level: 3,
  },
  {
    id: 5,
    name: '35kV变电所5',
    level: 1,
  },
  {
    id: 6,
    name: '35kV变电所6',
    level: 1,
  },
])

function open(polygonWithTextName: string) {
  console.warn('[BindRiskAnalysisObjectModal.vue]:', 'polygon:created', polygonWithTextName)
  currentPolygonWithTextName.value = polygonWithTextName
  ModalVisible.value = true
}
function onSelect(rowKeys: (string | number)[]) {
  const val = rowKeys as number[]
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
      polygonWithTextList.value[currentPolygonWithTextIdx]!.bindRiskAnalysis(selectItem)
      triggerRef(polygonWithTextList)
    }
    done(true)
  }
}
onMounted(() => {
  emitter.on('polygon:created', (val: string) => {
    open(val)
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
    <div>
      <ATable :data="renderData" row-key="id" :row-selection="rowSelection" :selected-keys="selectedKeys" @select="onSelect">
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
