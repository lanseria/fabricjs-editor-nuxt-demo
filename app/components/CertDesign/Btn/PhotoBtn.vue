<script lang="ts" setup>
const { open, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  multiple: false,
  reset: true,
})

onChange((files) => {
  if (files) {
    // 获取第一个文件
    const filesList = Array.from(files)
    if (filesList.length !== 0) {
      const file = filesList[0]
      const url = useObjectUrl(file)
      onFabricAddPhoto(url.value!)
    }
  }
})
</script>

<template>
  <button class="inline-flex items-center gap-1 btn" @click="open()">
    <div class="i-carbon-image text-14px" />
    添加图片
  </button>
</template>
