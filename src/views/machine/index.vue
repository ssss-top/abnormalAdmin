<template>
  <page-header-wrapper>
    <!-- 表格数据过滤器 -->
    <div class="card-list">
      <a-card title="矿机数量" style="min-width: 100%">
        <p>矿工ID：{{ minerid }}</p>
        <p v-for="(item,key,index) of machineCount" :key="index">
          {{ key }}：{{ item }}
        </p>
      </a-card>
      <!-- <a-card title="Default size card" style="min-width: 48%">
        <p />
      </a-card> -->
      <a-card title="完成的任务数量" style="min-width: 48%;margin-top:20px">
        <!-- <a slot="extra" href="#">more</a> -->
        <a-range-picker slot="extra" @change="sectorsCountCheckout" />
        <div class="node-chart">
          <Chart id="echartNum" ref="chart_line_one" />
        </div>
      </a-card>
      <a-card title="任务时长" style="min-width: 48%;margin-top:20px">
        <a-range-picker slot="extra" @change="taskCostscheckout" />
        <div class="node-chart">
          <Chart id="echar:ime" ref="chart_line_tow" />
        </div>
      </a-card>
      <a-card title="节点详情" style="min-width: 100%;margin-top:20px">
        <div class="node-detail">
          <p v-for="(item,key,index) in sectorState" :key="index" class="detail-item">{{ key+":"+ item }}</p>
        </div>

      </a-card>
    </div>

    <a-card size="small" :bordered="false">
      <!-- <table-filter :settings="filterSettings" @submit="filterTableData" /> -->
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }" @change="listChange">
          <a-radio-button value="0">
            机器算力
          </a-radio-button>
          <a-radio-button value="1">
            任务列表
          </a-radio-button>
          <a-radio-button value="2">
            Deadline
          </a-radio-button>
        </a-radio-group>
        <BaseTable
          ref="table"
          :columns="tableColumns"
          :data="tableData"
          class="page-base-table"
          :fixed-width="true"
          :loading="loading"
          :current="page.page"
          :page-size="page.size"
          :item-total="page.total"
          :if-hide-pagination="pagination"
          @pageChange="workerListChange"
          @tableChange="tableChange"
        >
          <span slot="text" slot-scope="record" :class="record.record.IsCurrent===true?'red':''">{{ record.text }}</span>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { wdpostDeadlines, workerList, sectorsState, sectorsCount, taskCosts, workerPower } from '@/api/login'
import Chart from '@/components/common/chart.vue'
import BaseTable from '@/components/common/baseTable.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable,
    Chart
  },
  data() {
    return {
      // filterSettings: [],
      moment,
      pagination: false,
      tableColumns: [],
      tableData: [],
      loading: false,
      minerid: '',
      mode: '0',
      machineCount: {},
      sectorState: {},
      taskCostsList: [],
      taskCostsSearch: {},
      sectorsCountList: [],
      sectorsCountSearch: {},
      sort: {
        sort_field: '',
        sort_order: ''
      },
      page: {
        page: 1,
        size: 10,
        total: 10
      }
    }
  },
  created() {
    this.minerid = this.$route.query.minerid
    if (!this.minerid) {
      this.$router.push('/minerList')
      return false
    }
    this.initTable()
    this.listChange()
    this.sectorsState()
    this.sectorsCount()
    this.taskCosts()
    this.workerPower()
  },
  methods: {

    // 表格配置
    initTable() {
      if (this.mode === '1') {
        this.tableColumns = [
          {
            title: 'IP',
            dataIndex: 'IP',
            key: 'IP',
            align: 'center',
            width: '8%'
          },
          {
            title: 'P1Failed',
            dataIndex: 'PreCommit1Failed',
            key: 'PreCommit1Failed',
            align: 'center'
          },
          {
            title: 'P2Failed',
            dataIndex: 'PreCommit2Failed',
            key: 'PreCommit2Failed',
            align: 'center'
          },

          {
            title: 'C1Failed',
            dataIndex: 'Committing1Failed',
            key: 'Committing1Failed',
            align: 'center'
          },
          {
            title: 'C2Failed',
            dataIndex: 'Committing2Failed',
            key: 'Committing2Failed',
            align: 'center'
          },
          {
            title: 'AP',
            dataIndex: 'AddPiece',
            key: 'AddPiece',
            align: 'center'
          },
          {
            title: 'P1',
            dataIndex: 'PreCommit1',
            key: 'PreCommit1',
            align: 'center'
          },
          {
            title: 'P1Wait',
            dataIndex: 'PreCommit1WaitResponse',
            key: 'PreCommit1WaitResponse',
            align: 'center'
          },
          {
            title: 'P2',
            dataIndex: 'PreCommit2',
            key: 'PreCommit2',
            align: 'center'
          },
          {
            title: 'P2Wait',
            dataIndex: 'PreCommit2WaitResponse',
            key: 'PreCommit2WaitResponse',
            align: 'center'
          },
          {
            title: 'C1',
            dataIndex: 'Committing1',
            key: 'Committing1',
            align: 'center'
          },
          {
            title: 'C1Wait',
            dataIndex: 'Committing1WaitResponse',
            key: 'Committing1WaitResponse',
            align: 'center'
          },
          {
            title: 'C2',
            dataIndex: 'Committing2',
            key: 'Committing2',
            align: 'center'
          },
          {
            title: 'C2Wait',
            dataIndex: 'Committing2WaitResponse',
            key: 'Committing2WaitResponse',
            align: 'center'
          },
          {
            title: '是否密封',
            dataIndex: 'Sealing',
            key: 'Sealing',
            align: 'center',
            scopedSlots: { customRender: 'Sealing' },
            colorMarks: [
              {
                label: '否',
                value: 0,
                color: '#f5222d'
              },
              {
                label: '是',
                value: 1,
                color: '#04d919'
              }
            ]
          }
        ]
      } else if (this.mode === '2') {
        this.tableColumns = [
          {
            title: '矿工号',
            dataIndex: 'MinerID',
            key: 'MinerID',
            align: 'center',
            scopedSlots: { customRender: 'MinerID' },
            slotName: 'text'

          },
          {
            title: 'Deadline',
            dataIndex: 'Index',
            key: 'Index',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'Index' }
          },
          {
            title: 'AllPartitions',
            dataIndex: 'AllPartitions',
            key: 'AllPartitions',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'AllPartitions' }
          },
          {
            title: 'ProvenPartitions',
            dataIndex: 'ProvenPartitions',
            key: 'ProvenPartitions',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'ProvenPartitions' }
          },
          {
            title: 'AllSectors',
            dataIndex: 'AllSectors',
            key: 'AllSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'AllSectors' }
          },
          {
            title: 'FaultySectors',
            dataIndex: 'FaultySectors',
            key: 'FaultySectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'FaultySectors' }
          },
          {
            title: 'RecoveringSectors',
            dataIndex: 'RecoveringSectors',
            key: 'RecoveringSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'RecoveringSectors' }
          },
          {
            title: 'LiveSectors',
            dataIndex: 'LiveSectors',
            key: 'LiveSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'LiveSectors' }
          },
          {
            title: 'ActiveSectors',
            dataIndex: 'ActiveSectors',
            key: 'ActiveSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'ActiveSectors' }
          },
          {
            title: 'OpenEpoch',
            dataIndex: 'OpenEpoch',
            key: 'OpenEpoch',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'OpenEpoch' }
          },
          {
            title: 'CloseEpoch',
            dataIndex: 'CloseEpoch',
            key: 'CloseEpoch',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'CloseEpoch' }
          },
          {
            title: 'ChallengeEpoch',
            dataIndex: 'ChallengeEpoch',
            key: 'ChallengeEpoch',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'ChallengeEpoch' }
          }
        ]
      } else {
        this.tableColumns = [
          {
            title: 'IP',
            dataIndex: 'IP',
            key: 'IP',
            align: 'center',
            sorter: true
          },
          {
            title: '期望算力',
            dataIndex: 'ExpectedPower',
            key: 'ExpectedPower',
            align: 'center'
          },
          {
            title: '增长算力(24h)',
            dataIndex: 'PowerLastDay',
            key: 'PowerLastDay',
            align: 'center',
            sorter: true
            // scopedSlots: { customRender: 'PowerLastDay' }
          },
          {
            title: 'P1时长',
            dataIndex: 'P1Cost',
            key: 'P1Cost',
            align: 'center'
          },
          {
            title: 'P2时长',
            dataIndex: 'P2Cost',
            key: 'P2Cost',
            align: 'center'
          },
          {
            title: 'C2时长',
            dataIndex: 'C2Cost',
            key: 'C2Cost',
            align: 'center'
          },
          {
            title: 'P1数量(24h)',
            dataIndex: 'P1Count',
            key: 'P1Count',
            align: 'center'
          },
          {
            title: 'P2数量(24h)',
            dataIndex: 'P2Count',
            key: 'P2Count',
            align: 'center'
          },
          {
            title: 'C2数量(24h)',
            dataIndex: 'C2Count',
            key: 'C2Count',
            align: 'center'
          },
          {
            title: '是否密封',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            scopedSlots: { customRender: 'Status' },
            colorMarks: [
              {
                label: '否',
                value: false,
                color: '#f5222d'
              },
              {
                label: '是',
                value: true,
                color: '#04d919'
              }
            ]
          }
        ]
      }
    },
    // 排序
    tableChange(sorter) {
      console.log(sorter, '222222222222222222222222222')
      if (sorter.order === 'descend') {
        this.sort.sort_order = 'Asc'
      } else if (sorter.order === 'ascend') {
        this.sort.sort_order = 'Desc'
      }
      this.sort.sort_field = sorter.field
      if (this.mode === '0') {
        this.workerPower()
      }
    },
    // 获取每天完成的任务数量
    sectorsCount() {
      const params = {
        minerid: this.minerid
      }
      sectorsCount(params).then(res => {
        const result = res.data
        console.log(result, '12121221212122221212')
        if (result.code === 200) {
          this.sectorsCountList = result.data.sectors_count
          this.$refs.chart_line_one.initChart(this.sectorsCountList[0].DateTime, this.sectorsCountList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    sectorsCountCheckout(e) {
      const fromatStr = 'YYYY-MM-DD HH:mm:ss'
      this.taskCostsSearch = {
        start_time: this.moment(e[0]).format(fromatStr),
        end_time: this.moment(e).format(fromatStr)
      }
    },
    taskCostscheckout(e) {
      const fromatStr = 'YYYY-MM-DD HH:mm:ss'
      this.taskCostsSearch = {
        start_time: this.moment(e[0]).format(fromatStr),
        end_time: this.moment(e).format(fromatStr)
      }
    },
    // 获取任务时长moment('00:00:01', 'HH:mm:ss')
    taskCosts() {
      const params = {
        minerid: this.minerid
      }
      taskCosts(params).then(res => {
        const result = res.data
        console.log(result, '33333333333333333333')
        if (result.code === 200) {
          this.taskCostsList = result.data.task_costs
          this.$refs.chart_line_tow.initChart(this.taskCostsList[0].DateTime, this.taskCostsList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 节点详情
    sectorsState() {
      sectorsState({ minerid: this.minerid }).then(res => {
        const result = res.data
        console.log(result, '12121221212122221212')
        if (result.code === 200) {
          this.machineCount = result.data.machine_count
          this.sectorState = result.data.sector_state
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // tab切换
    listChange() {
      if (this.mode === '1') {
        this.workerList()
      } else if (this.mode === '2') {
        this.deadline()
      } else if (this.mode === '0') {
        this.workerPower()
      }
    },
    // 处理表格翻页
    workerListChange(pagination) {
      this.page.page = pagination.pageNumber
      this.page.size = pagination.pageSize
      if (this.mode === '0') {
        this.workerPower()
      } else {
        this.workerList()
      }
    },
    workerPower() {
      this.initTable()
      if (this.loading === true) return
      this.loading = true
      const params = this.generateParams()
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      this.pagination = false
      workerPower(params).then(res => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.worker_tasks
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 机器列表
    workerList() {
      this.initTable()
      if (this.loading === true) return
      this.loading = true
      const params = this.generateParams()
      this.pagination = false
      workerList(params).then(res => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.worker_tasks
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 获取deadline表格数据
    deadline() {
      this.initTable()
      if (this.loading === true) return
      this.loading = true
      const params = this.generateParams()
      delete params.page
      delete params.size
      this.pagination = true
      wdpostDeadlines(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.deadlines
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    // 生成获取表格数据的请求参数
    generateParams() {
      const params = {
        page: this.page.page,
        size: this.page.size,
        minerid: this.minerid
      }
      // Object.assign(params)
      return params
    }

  }
}
</script>
<style lang="less">
.card-list{
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-bottom:20px;
  flex-wrap: wrap;
  .node-detail{
 display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ::after{
    display: none;
  }
    .detail-item{
      min-width: 48%;
    }
  }
}
</style>
