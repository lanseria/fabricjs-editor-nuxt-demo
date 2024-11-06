<script setup>
function editObject(index) {
  // 编辑对象逻辑
  const name = polygonWithTextList.value[index].options.name
  if (name) {
    emitter.emit('polygon:created', name)
  }
  else {
    Message.warning('该图形无name')
  }
}

function deleteObject(index) {
  // 删除对象逻辑
  Modal.warning({
    title: '删除',
    content: '确定删除该对象吗？',
    onOk: () => {
      console.warn('ok')
      polygonWithTextList.value[index].remove()
      polygonWithTextList.value.splice(index, 1)
      triggerRef(polygonWithTextList)
    },
  })
}
</script>

<template>
  <div class="w-full">
    <div v-for="(object, index) in polygonWithTextList" :key="index" class="flex items-center justify-between border-b p-2">
      <span class="object-name">{{ object.options.text }}</span>
      <div class="flex items-center gap-2">
        <button class="i-carbon-edit cursor-pointer text-blue-5" @click="editObject(index)" />
        <button class="i-carbon-trash-can cursor-pointer text-red-5" @click="deleteObject(index)" />
      </div>
    </div>
  </div>
</template>
