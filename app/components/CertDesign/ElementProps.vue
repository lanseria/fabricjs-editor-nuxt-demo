<script lang="ts" setup>
async function onChange(key: keyof fabric.Object, e: Event) {
  const canvas = utilFabricGetCanvasInstance()
  if (key === 'fontFamily') {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const val: string = e.target!.value
    if (await utilFabricLoadFont(val)) {
      const activeObject = canvas.getActiveObject()!
      if (activeObject)
        activeObject.set('fontFamily', val)
      canvas.renderAll()
    }
  }
  else if (key === 'fill') {
    const activeObject = canvas.getActiveObject()!
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const val: string = e.target!.value
    if (activeObject && val)
      activeObject.set(key, val)
    canvas.renderAll()
  }
  else if (key === 'fontSize') {
    const activeObject = canvas.getActiveObject()!
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const val: string = e.target!.value
    if (activeObject && val)
      activeObject.set(key, +val)
    canvas.renderAll()
  }
}
</script>

<template>
  <div v-if="['text', 'i-text'].includes(fabricCanvasActiveObjProps.type)" class="flex flex-col gap-10px">
    <div class="flex items-center gap-10px">
      <div class="w-80px flex-none">
        颜色：
      </div><input
        type="color"
        :value="fabricCanvasActiveObjProps.fill"
        @input="onChange('fill', $event)"
      >
    </div>
    <div class="flex items-center gap-10px">
      <div class="w-80px flex-none">
        字体大小：
      </div>
      <input
        type="number"
        class="ipt"
        :value="fabricCanvasActiveObjProps.fontSize"
        @input="onChange('fontSize', $event)"
      >
    </div>
    <div class="flex items-center gap-10px">
      <div class="w-80px flex-none">
        字体：
      </div>
      <select
        class="slt"
        :value="fabricCanvasActiveObjProps.fontFamily"
        @change="onChange('fontFamily', $event)"
      >
        <option v-for="font in FONT_LIST" :key="font.fontFamily" :value="font.fontFamily">
          {{ font.name }}
        </option>
      </select>
    </div>
  </div>
</template>
