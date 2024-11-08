<script setup lang="ts">
function onDesignPage(item: PageRecord) {
  navigateTo(`/hi/${item.id}`)
}
</script>

<template>
  <div class="h-full flex flex-1">
    <div class="w-300px flex-none border-r-1px border-gray-1">
      <div class="flex items-center justify-between border-b-1px border-gray-1 px-2 py-1">
        <div class="text-14px font-bold">
          页面
        </div>
        <ToolBtn icon-name="i-carbon-add" tooltip-name="添加页面" @click="onPageAdd()" />
      </div>
      <div class="flex flex-col">
        <div v-for="item in storePageList" :key="item.id" class="flex items-center justify-between px-2 py-1 hover:bg-gray-50">
          <div>{{ item.name }}</div>
          <div class="flex">
            <ToolBtn icon-name="i-carbon-area-custom" tooltip-name="设计" @click="onDesignPage(item)" />
            <ToolBtn icon-name="i-carbon-edit" tooltip-name="编辑" />
            <ToolBtn icon-name="i-carbon-trash-can" tooltip-name="删除" @click="onPageDelete(item)" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      1
    </div>
  </div>
</template>
