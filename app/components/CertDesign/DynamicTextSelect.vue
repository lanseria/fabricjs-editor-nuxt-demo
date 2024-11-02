<script lang="ts" setup>
const { groupType = 0 } = defineProps<{
  groupType: number
}>()

const dynamicTextList = computed(() => {
  return dynamicTextElementList.value.filter(item => item.groupIdx === groupType)
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in dynamicTextList" :key="item.id" class="btn"
      :disabled="item.disabled"
      @click="onAddDynamicText(item)"
    >
      {{ item.value }}
    </button>
  </div>
</template>
