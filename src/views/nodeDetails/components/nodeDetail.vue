<template>
  <div class="node-content">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <!-- 表格数据过滤器 -->
    <div class="card-list">
      <a-card title="矿机数量" style="min-width: 100%">
        <p>
          矿工ID：{{ minerid }}
          <a-tag color="blue" style="margin-left: 10px"> {{ sectorSize }}G </a-tag>
        </p>
        <span v-for="(item, key) of machineCount" :key="key" style="margin-right: 20px"> {{ key }}：{{ item }} </span>
        <p style="margin-top: 10px">迁移任务统计</p>
        <span v-for="item of MigrationCountSetting" :key="item.key" style="margin-right: 20px"> {{ item.label }}：{{ MigrationCount[item.key] }} </span>
        <p style="margin-top: 10px">存储机统计</p>
        <span v-for="item of StoreMachineSetting" :key="item.key" style="margin-right: 20px"> {{ item.label }}：{{ StoreMachineCount[item.key] }} </span>
      </a-card>
      <a-card title="任务数量" style="min-width: 48%; margin-top: 20px">
        <a-range-picker slot="extra" @change="sectorsCountCheckout" />
        <div class="node-chart">
          <Chart id="echartNum" ref="chart_line_one" />
        </div>
      </a-card>
      <a-card title="任务时长" style="min-width: 48%; margin-top: 20px">
        <a-range-picker slot="extra" @change="taskCostscheckout" />
        <div class="node-chart">
          <Chart id="echart" ref="chart_line_tow" />
        </div>
      </a-card>
      <a-card title="节点详情" style="min-width: 100%; margin-top: 20px">
        <div class="node-detail">
          <p v-for="(item, index) in sectorState" :key="index" class="detail-item">{{ item }}</p>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import {
  sectorsState,
  sectorsCount,
  taskCosts,
  migrateOverview
} from '@/api/api'
import Chart from '@/components/common/chart.vue'
import * as moment from 'moment'
// import workerPower from './components/workerPower'
// import workerList from './components/workerList'
// import deadline from './components/deadline'
// import minerSectors from './components/minerSectors'
// import migrateTasks from './components/migrateTasks'
// import storeMachines from './components/storeMachines'
// import restoreTasks from './components/restoreTasks'
export default {
  components: {
    Chart
    // workerPower,
    // workerList,
    // deadline,
    // minerSectors,
    // migrateTasks,
    // storeMachines,
    // restoreTasks
  },
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      MigrationCount: '',
      StoreMachineCount: '',
      moment,
      sectorSize: '',
      minerid: '',
      mode: '0',
      machineCount: {},
      sectorState: {},
      taskCostsList: [],
      taskCostsSearch: {},
      sectorsCountList: [],
      sectorsCountSearch: {},
      StoreMachineSetting: [
        {
          label: '机器数量',
          key: 'MachineTotal'
        },
        {
          label: '存满数量',
          key: 'MachineFilled'
        },
        {
          label: '未满数量',
          key: 'MachineUnfilled'
        },
        {
          label: '启用数量',
          key: 'MachineEnabled'
        },
        {
          label: '停用数量',
          key: 'MachineDisabled'
        },
        {
          label: '扇区容量',
          key: 'MaxSectors'
        },
        {
          label: '已存扇区',
          key: 'StoredSectors'
        },
        {
          label: '剩余容量',
          key: 'RemainSectors'
        }
      ],
      MigrationCountSetting: [
        {
          label: '待迁移数量',
          key: 'WaitingTotal'
        },
        {
          label: '迁移中数量',
          key: 'MigratingTotal'
        },
        {
          label: '已迁移数量',
          key: 'MigratedTotal'
        },
        {
          label: '最大耗时',
          key: 'MigratedCostMax'
        },
        {
          label: '最小耗时',
          key: 'MigratedCostMin'
        },
        {
          label: '平均耗时',
          key: 'MigratedCostAvg'
        }

      ]

    }
  },
  created() {
    this.init()
  },
  // created() {
  //   this.init()
  // },
  methods: {
    // 切换菜单
    switchTab(e) {
      console.log(e, '2112')
    },
    init() {
      this.minerid = this.$route.query.minerid
      if (!this.minerid) {
        this.$router.push('/minerList')
        return false
      }
      this.sectorsState()
      this.sectorsCount()
      this.taskCosts()
      this.migrateOverview()
    },

    // 迁移统计概览
    migrateOverview() {
      migrateOverview({ minerid: this.minerid }).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.MigrationCount = result.data.MigrationCount
          this.StoreMachineCount = result.data.StoreMachineCount
        }
      })
    },

    // 任务数量搜索
    sectorsCountCheckout(e) {
      const fromatStr = 'YYYY-MM-DD HH:mm:ss'
      const startTime = this.moment(e[0]).format(fromatStr)
      const endTime = this.moment(e[1]).format(fromatStr)
      if (new Date(endTime).getMonth() - new Date(startTime).getMonth() > 2) {
        this.$message.error('筛选月份间隔不得超过两个月')
        return false
      }
      this.sectorsCountSearch = {
        start_time: startTime,
        end_time: endTime
      }
      this.sectorsCount()
    },
    // 任务时长搜索
    taskCostscheckout(e) {
      const fromatStr = 'YYYY-MM-DD HH:mm:ss'
      const startTime = this.moment(e[0]).format(fromatStr)
      const endTime = this.moment(e[1]).format(fromatStr)
      if (new Date(endTime).getMonth() - new Date(startTime).getMonth() > 2) {
        this.$message.error('筛选月份间隔不得超过两个月')
        return false
      }
      this.taskCostsSearch = {
        start_time: startTime,
        end_time: endTime
      }
      this.taskCosts()
    },
    // 获取每天完成的任务数量
    sectorsCount() {
      this.sectorsCountList = []
      const params = {
        minerid: this.minerid,
        ...this.sectorsCountSearch
      }
      sectorsCount(params).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.sectorsCountList = result.data.sectors_count
          if (!this.sectorsCountList) {
            return
          }
          this.$refs.chart_line_one.initChart(this.sectorsCountList[0].DateTime, this.sectorsCountList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    // 获取任务时长moment('00:00:01', 'HH:mm:ss')
    taskCosts() {
      this.taskCostsList = []
      const params = {
        minerid: this.minerid,
        ...this.taskCostsSearch
      }
      taskCosts(params).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.taskCostsList = result.data.task_costs
          if (!this.taskCostsList) {
            return
          }
          this.$refs.chart_line_tow.initChart(this.taskCostsList[0].DateTime, this.taskCostsList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 节点详情
    sectorsState() {
      sectorsState({ minerid: this.minerid }).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.machineCount = result.data.machine_count
          this.sectorState = result.data.sector_state
          this.sectorSize = result.data.sector_size
        } else {
          this.$message.error(result.msg)
        }
      })
    }
    // tab切换
    // listChange(e) {
    //   console.log(e.target.value, '511515')
    // }
  }
}
</script>
<style lang="less">
  .card-list {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    flex-wrap: wrap;
    .node-detail {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      ::after {
        display: none;
      }
      .detail-item {
        min-width: 48%;
      }
    }
  }
</style>
