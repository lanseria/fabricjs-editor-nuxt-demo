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
      setBackground(url.value!)
    }
  }
})
function setBackground(imgUrl: string) {
  setBackgroundImageBlobUrl(imgUrl)
  setBackgroundImage()
}
</script>

<template>
  <ToolBtn icon-name="i-carbon-image" tooltip-name="设置背景图" @click="open()" />
</template>
