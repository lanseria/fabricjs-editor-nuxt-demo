<script lang="ts" setup>
const { loadFont } = useFont()

async function onChange(key: keyof fabric.Object, val: any) {
  const canvas = utilFabricGetCanvasInstance()
  if (key === 'fontFamily') {
    if (await loadFont(val)) {
      const activeObject = canvas.getActiveObject()!
      if (activeObject)
        activeObject.set('fontFamily', val)
      canvas.renderAll()
    }
  }
  else {
    const activeObject = canvas.getActiveObject()!
    if (activeObject)
      activeObject.set(key, val)
    canvas.renderAll()
  }
}
</script>

<template>
  <div v-if="['text', 'i-text'].includes(fabricCanvasActiveObjProps.type)" class="flex flex-col gap-10px">
    <div class="flex items-center gap-10px">
      <div class="w-80px flex-none">
        颜色：
      </div>
      <AColorPicker v-model:model-value="fabricCanvasActiveObjProps.fill" format="rgb" show-text disabled-alpha @change="onChange('fill', $event)" />
    </div>
    <div class="flex items-center gap-10px">
      <div class="w-80px flex-none">
        字体大小：
      </div>
      <AInputNumber v-model:model-value="fabricCanvasActiveObjProps.fontSize" @change="onChange('fontSize', $event)" />
    </div>
    <div class="flex items-center gap-10px">
      <div class="w-80px flex-none">
        字体：
      </div>
      <ASelect v-model:model-value="fabricCanvasActiveObjProps.fontFamily" :options="FONT_LIST" :field-names="{ label: 'name', value: 'fontFamily' }" @change="onChange('fontFamily', $event)" />
    </div>
  </div>
</template>
