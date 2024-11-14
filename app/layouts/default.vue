<script setup lang="ts">
const route = useRoute()

const showBack = computed(() => route.path !== '/')
</script>

<template>
  <main class="h-screen w-screen flex flex-col">
    <div class="flex items-center justify-between gap-2 border-b-1px border-gray-1 p-2">
      <div class="flex items-center justify-start gap-2">
        <ToolBtn v-if="showBack" icon-name="i-carbon-arrow-left" tooltip-name="返回" @click="$router.back()" />
        <img src="/favicon.svg" class="h-32px w-32px">
        <div class="text-20px">
          风险四色图
        </div>
      </div>
      <HelpBtn />
    </div>
    <div class="flex flex-1">
      <slot />
      <div class="w-200px flex-none border-l-1px border-gray-1 px-4 py-2">
        <div>风险等级</div>
        <div class="h-10px w-full" />
        <div class="flex flex-col gap-2">
          <div v-for="i in riskLevelList" :key="i.label" class="flex items-center gap-2">
            <div class="h-20px w-20px" :style="{ backgroundColor: i.bgColor }" />
            <div>{{ i.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
