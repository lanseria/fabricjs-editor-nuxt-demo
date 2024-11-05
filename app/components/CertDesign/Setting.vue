<script lang="ts" setup>
import BackgroundBtn from './Btn/BackgroundBtn.vue'
import PolygonBtn from './Btn/PolygonBtn.vue'
import TextBtn from './Btn/TextBtn.vue'
</script>

<template>
  <div class="inline-flex flex-wrap gap-2">
    <BackgroundBtn />
    <PolygonBtn>风险分析对象</PolygonBtn>
    <PolygonBtn>风险分析单元</PolygonBtn>
    <TextBtn>文字</TextBtn>
  </div>
</template>
