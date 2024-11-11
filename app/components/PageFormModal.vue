<script lang="ts" setup>
const formData = ref(initPageRecord())
const ModalVisible = ref(false)
function open(record: PageRecord) {
  formData.value = { ...record }
  ModalVisible.value = true
}
async function onBeforeOk(done: (closed: boolean) => void) {
  const { code, msg } = await putPage(formData.value)
  if (code) {
    Message.warning(msg)
    done(false)
  }
  else {
    Message.success('修改成功')
    fetchPageList()
    done(true)
  }
}
defineExpose({
  open,
})
</script>

<template>
  <AModal v-model:visible="ModalVisible" @before-ok="onBeforeOk">
    <template #title>
      修改标题
    </template>

    <AForm :model="formData" auto-label-width>
      <AFormItem field="name" label="名称">
        <AInput
          v-model="formData.name"
          placeholder="请输入名称"
        />
      </AFormItem>
    </AForm>
  </AModal>
</template>
