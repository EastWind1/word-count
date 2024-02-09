<template>
  <div ref="chartElement" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import { onMounted, ref } from 'vue'

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

const chartElement = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts

const option: ECOption = {
  dataset: {
    dimensions: ['name', 'count'],
    source: []
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [{ type: 'bar' }],
  tooltip: {
    trigger: 'item'
  }
}

window.addEventListener('resize', () => chart?.resize())

onMounted(() => {
  if (!chartElement.value) {
    return
  }
  chart = echarts.init(chartElement.value)
  chart.showLoading()
  chart.setOption(option)
  window.api.db.findAllByPage(10, 0).then(({ data }) => {
    chart.setOption({
      dataset: {
        dimensions: ['name', 'count'],
        source: data
      }
    })
    chart.hideLoading()
  })
})
</script>

<style scoped>
.chart {
  width: 80vw;
  height: 80vh;
}
</style>
