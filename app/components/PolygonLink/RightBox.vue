<script lang="ts" setup>
import LayerList from './LayerList.vue'
import PolygonBtn from './PolygonBtn.vue'
</script>

<template>
  <div class="inline-flex flex-wrap gap-2">
    <div class="text-14px text-dark font-bold">
      添加对象
    </div>
    <div class="h-2px w-full" />
    <div class="inline-flex gap-2">
      <PolygonBtn>风险分析对象</PolygonBtn>
    </div>
    <div class="my-10px h-1px w-full bg-[#f1f1f1]" />
    <div class="text-14px text-dark font-bold">
      对象图层
    </div>
    <div class="h-2px w-full" />
    <LayerList />
  </div>
</template>
