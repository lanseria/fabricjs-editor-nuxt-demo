<!-- ImagePreview.vue -->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array,
    default: () => [],
  },
  initialIndex: {
    type: Number,
    default: 0,
  },
  alt: {
    type: String,
    default: 'preview image',
  },
})

const emit = defineEmits(['update:visible'])

const currentIndex = ref(props.initialIndex)

// 计算属性
const currentImage = computed(() => props.images[currentIndex.value])
const showNavigation = computed(() => props.images.length > 1)

// 方法
function handleClose() {
  emit('update:visible', false)
}

function handlePrev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
  else {
    currentIndex.value = props.images.length - 1
  }
}

function handleNext() {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
  else {
    currentIndex.value = 0
  }
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="handleClose"
      >
        <div class="absolute inset-0 bg-black/75" />

        <div class="relative max-h-90vh max-w-90vw">
          <!-- 关闭按钮 -->
          <div
            class="absolute right-0 cursor-pointer text-white -top-10 hover:text-gray-300"
            @click="handleClose"
          >
            <div class="i-carbon-close text-24px" />
          </div>

          <!-- 图片展示区 -->
          <div class="relative">
            <!-- 上一张按钮 -->
            <div
              v-if="showNavigation"
              class="absolute left-4 top-1/2 cursor-pointer text-white -translate-y-1/2 hover:text-gray-300"
              @click.stop="handlePrev"
            >
              <div class="i-carbon-chevron-left text-32px" />
            </div>

            <!-- 图片 -->
            <img
              :src="currentImage"
              :alt="alt"
              class="max-h-90vh max-w-90vw object-contain"
              @click.stop
            >

            <!-- 下一张按钮 -->
            <div
              v-if="showNavigation"
              class="absolute right-4 top-1/2 cursor-pointer text-white -translate-y-1/2 hover:text-gray-300"
              @click.stop="handleNext"
            >
              <div class="i-carbon-chevron-right text-32px" />
            </div>
          </div>

          <!-- 图片计数 -->
          <div
            v-if="showNavigation"
            class="absolute bottom-4 left-1/2 text-white -translate-x-1/2"
          >
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
