<template>
  <div
    :id="id"
    class="echart"
    :style="{ float: 'left', width: '100%' }"
  />
</template>

<script>
import * as echarts from 'echarts'
var posList = [
  'left', 'right', 'top', 'bottom',
  'inside',
  'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
  'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
]
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
      app: {}
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart && this.myChart.resize()
    }
  },
  methods: {
    initChart(xData, yData,) {
      this.myChart = echarts.init(
        document.getElementById(this.id),

      )
      this.app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: posList.reduce(function(map, pos) {
            map[pos] = pos
            return map
          }, {})
        },
        distance: {
          min: 0,
          max: 100
        }
      }

      this.app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function() {
          this.labelOption = {
            normal: {
              rotate: this.app.config.rotate,
              align: this.app.config.align,
              verticalAlign: this.app.config.verticalAlign,
              position: this.app.config.position,
              distance: this.app.config.distance
            }
          }
          this.myChart.setOption({
            series: [{
              label: this.labelOption
            }, {
              label: this.labelOption
            }, {
              label: this.labelOption
            }, {
              label: this.labelOption
            }]
          })
        }
      }
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [yData[0].State, yData[1] && yData[1].State, yData[2] && yData[2].State, yData[3] && yData[3].State]
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: xData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: yData[0].State,
            type: 'bar',
            barGap: 0,
            label: yData[0].State,
            emphasis: {
              focus: 'series'
            },
            data: yData[0].Count
          },
          {
            name: yData[1] && yData[1].State,
            type: 'bar',
            label: yData[1] && yData[1].State,
            emphasis: {
              focus: 'series'
            },
            data: yData[1] && yData[1].Count
          },
          {
            name: yData[2] && yData[2].State,
            type: 'bar',
            label: yData[2] && yData[2].State,
            emphasis: {
              focus: 'series'
            },
            data: yData[2] && yData[2].Count
          },
          {
            name: yData[3] && yData[3].State,
            type: 'bar',
            label: yData[3] && yData[3].State,
            emphasis: {
              focus: 'series'
            },
            data: yData[3] && yData[3].Count
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
