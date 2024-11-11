<script lang="ts" setup></script>

<template>
  <ATrigger trigger="click" :unmount-on-close="false">
    <ToolBtn icon-name="i-carbon-help" tooltip-name="帮助" />
    <template #content>
      <div class="w-300px border-1px border-gray-1 bg-white px-4 py-2 shadow">
        <div class="text-14px font-bold">
          帮助提示
        </div>
        <div class="h-10px w-full" />
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <ToolBtn icon-name="i-carbon-cursor-1 text-blue-6" tooltip-name="移动对象" />
            <div>移动对象</div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <ToolBtn icon-name="i-carbon-image text-blue-6" tooltip-name="设置背景图" />
            <div>设置背景图</div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <ToolBtn icon-name="i-carbon-area-custom text-blue-6" tooltip-name="绘制区域" />
            <div>绘制区域</div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <ToolBtn icon-name="i-carbon-save text-blue-6" tooltip-name="保存页面" />
            <div>保存页面</div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <div>自由移动画布</div>
            <div>空格 + 鼠标拖动</div>
          </div>
        </div>
      </div>
    </template>
  </ATrigger>
</template>
