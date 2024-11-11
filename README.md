# Polygon Link

## 设计图

https://js.design/f/FYeggV?p=5ywOngl0pw&mode=design&linkelement=3-16

使用vue3与fabricjs依次实现以下效果

1. 帮我实现在canvas的中间有一个背景为白色的2000px \* 2000px 的画布，画布外是格子背景，用来凸显画布，画布可以通过滚轮缩放。但初始化是画布按比例居中缩放合适大小显示
2. 再添加一个按住空格，cursor变为手的形状，并可以拖移整个画布
3.

- page[] 展示一个 画板 右边一个图例
  - layer[] PolygonWithTextList 进入画板，左边是工具栏，右边是图层
    - object PolygonWithText

## 部署

```bash
nr generate
rsync -av --delete dist/ root@119.3.111.163:/root/bst/design/
ssh root@119.3.111.163
docker cp /root/bst/design/. safety-php:/var/www/bstriskpic/
exit
```
