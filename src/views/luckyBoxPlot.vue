<template>
  <a-card size="small" :bordered="false">
    <div style="padding:20px;background-color:white;margin-bottom:20px">
      切换周期:
      <a-select
        v-model="duration"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option v-for="(item,index) in periodList" :key="index" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div style="width:100%;height:450px;">
      <ChartTool v-if="chart" :id="id" ref="chart_tool" />
      <a-spin v-else size="large" style="margin:auto" />
    </div>
  </a-card>
</template>

<script>
import { luckyBoxPlot } from '@/api/login'
import ChartTool from '@/components/common/chartTool.vue'
// import dataTool from 'dataTool'
export default {
  components: {
    // Pagination
    ChartTool
  },
  props: {
    // 主键
  },
  data() {
    return {
      chart: true,
      id: 'chart',
      redBoxData: [],
      redBoxDataItems: [],
      duration: '',
      periodList: [
        { label: '24h小时', value: '24h' },
        { label: '7天', value: '7d' },
        { label: '30天', value: '30d' }
      ]
    }
  },
  mounted() {
    this.duration = this.periodList[0].value
    this.luckyBoxPlot()
  },
  methods: {
    // 切换周期
    handleChange(value) {
      console.log(value)
      this.duration = value
      this.luckyBoxPlot()
    },
    // 获取数据
    luckyBoxPlot() {
      this.chart = false
      luckyBoxPlot({ duration: this.duration }).then(res => {
        this.id = 'chart' + Date.parse(new Date())
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.chart = true
          this.redBoxData = result.data.source

          this.redBoxDataItems = result.data.items
          setTimeout(() => {
            this.$refs.chart_tool.initChart(this.redBoxDataItems, this.redBoxData,)
          }, 500)

          // }
        } else {
          this.$message.error(result.msg)
        }
      })
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
