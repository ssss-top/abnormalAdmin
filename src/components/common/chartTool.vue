<template>
  <div
    :id="id"
    class="echart"
    :style="{ float: 'left', width: '100%' }"
  />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/extension/dataTool')
export default {
  props: {
    // 主键
    id: {
      type: String,
      default: 'chart'
    }
  },
  data() {
    return {
      myChart: null,
      app: {},
      data: []
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart && this.myChart.resize()
    }
  },
  methods: {
    initChart(rowData, data) {
      console.log(rowData, data)
      this.data.push(echarts.dataTool.prepareBoxplotData(data))
      // this.data.push(echarts.dataTool.prepareBoxplotData(this.blockBoxData))
      // this.id = 'chart' + Date.parse(new Date())
      this.myChart = echarts.init(
        document.getElementById(this.id),
      )
      const option = {
        title: {
          text: '全网幸运值分布',
          left: 10 // 标题显示的位置
        },
        legend: {
          y: '10%'
        },
        dataset: [
          { source: data },
          {
            transform: {
              type: 'boxplot',
              config: {
                itemNameFormatter: function(params) {
                  return rowData[params.value]
                }
              }
            }
          },
          {
            fromDatasetIndex: 1,
            fromTransformResult: 1
          }
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '5%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: true
          },
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          /* min:-400,//可自定义y轴的最大和最小值
            max:600,*/
          type: 'value',
          // name: 'Value',
          splitArea: {
            show: false
          }
        },

        series: [
          {
            name: 'boxplot',
            type: 'boxplot',
            datasetIndex: 1
          },
          {
            name: 'outlier',
            type: 'scatter',
            datasetIndex: 2
          }

        ]
      }
      this.myChart.setOption(option)
    }
  }
}
</script>
<style lang="less">
.node-label-title {
  background-color: #2b5ed6;
  color: #fff;
  padding: 10px 20px;

  border-radius: 8px 8px 0px 0px;
}
.node-label-item {
  background-color: #fff;
  color: #646c80;
  padding: 10px 20px;
  font-size: 0;
  display: flex;
  .label {
    display: inline-block;
    width: 8px;
    height: 8px;
    vertical-align: middle;
    margin-right: 8px;
  }
  span {
    font-size: 14px;
    color: #646c80;
    margin-right: 20px;
  }
  p {
    font-size: 18px;
    margin: 0;
  }
  .label-blue {
    background-color: #2b5ed6;
  }
  .label-green {
    background-color: #1db889;
  }
  &:last-child {
    padding-top: 0;
    border-radius: 0px 0px 8px 8px;
  }
}
.echart {
  height: 450px;
}
</style>
