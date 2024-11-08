<script lang="ts" setup>
defineProps({
  iconName: {
    type: String,
    required: true,
  },
  tooltipName: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="tool-button"
    :class="{ active }"
    :title="tooltipName"
  >
    <div
      class="tool-icon" :class="iconName"
    />
  </div>
</template>

<style lang="css" scoped>
.tool-button {
  @apply m-2px h-32px w-32px flex items-center justify-center rounded cursor-pointer;
}
.tool-button:not(.active) {
  @apply hover:bg-gray-1 dark:hover:bg-gray-8;
}
.tool-button.active {
  @apply bg-gray-1 dark:bg-gray-8;
}
.tool-button.active .tool-icon {
  @apply text-blue-5 dark:text-blue-6;
}
.tool-icon {
  @apply h-20px w-20px;
}
</style>
