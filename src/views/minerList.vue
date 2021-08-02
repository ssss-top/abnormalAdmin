<template>
  <page-header-wrapper>
    <!-- <div style="padding:20px;background-color:white;margin-bottom:20px">
      集群名称:
      <a-select
        v-model="clustersDefault"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option v-for="(item,index) in clustersList" :key="index" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div> -->
    <!-- 表格数据过滤器 -->
    <a-card size="small" :bordered="false">
      <table-filter :settings="filterSettings" @submit="filterTableData" />
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <BaseTable
          ref="table"
          :columns="tableColumns"
          :data="tableData"
          class="page-base-table"
          :fixed-width="true"
          :loading="loading"
          :item-total="pagination.total"
          :page-size="pagination.pageSize"
          :current="pagination.current"
          @lookMininglog="lookMininglog"
          @lookcourse="lookcourse"
          @tableChange="tableChange"
          @pageChange="handleTableChange"
        >
          <!-- <span slot="LuckyValue" slot-scope="record">{{ record.text }} 45455</span> -->
          <!-- <a-popover v-if="record.listText" slot="LuckyValue" slot-scope="record" placement="bottom">
            <template slot="content">
              <BaseTable
                ref="table"
                :columns="ableColumnsPopover"
                :data="record.listText"
                class="page-base-table"
                :fixed-width="true"
                :loading="loading"
                :if-hide-pagination="true"
              />
            </template>
            <a-button>{{ record.text }}</a-button>
          </a-popover>
          <span v-else>{{ record.text }} </span> -->
          <span slot="FaultCount" slot-scope="record" :class="record.text!==0?'red text':'green'" @click="lookError(record)">{{ record.text }}</span>
          <span slot="Miner" slot-scope="record" class="text" @click="lookDeadline(record)">{{ record.text }}</span>
          <div slot="OrphanBlockCnt" slot-scope="record" style="min-width:90px">
            <div v-for="(item,key,index) in record.text" :key="index" style="display:inline-block;">
              <a-popover v-if="record.record[key]" slot="LuckyValue" placement="bottom">
                <template slot="content">
                  <BaseTable
                    ref="table"
                    :columns="ableColumnsPopover"
                    :data="record.record[key]"
                    class="page-base-table"
                    :fixed-width="true"
                    :loading="loading"
                    :if-hide-pagination="true"
                  />
                </template>
                <a-tag :color="index===0?'cyan':'blue'" style="cursor: pointer;">
                  {{ item }}
                </a-tag>
              </a-popover>
              <!-- <span v-else>{{ record.text }} </span> -->
              <a-tag v-else :color="index===0?'cyan':'blue'" style="cursor: pointer;">
                {{ item }}
              </a-tag>
            </div>
            <!-- <a-tag color="blue">
              {{ record.text['OrphanBlock7d'] }}
            </a-tag> -->
          </div>
        </BaseTable>
      </div>
      <!-- 表格 结束 -->
      <a-modal v-model="visible" title="证明错误扇区列表" ok-text="确认" cancel-text="关闭" width="80%" :footer="null">
        <BaseTable
          ref="table"
          :columns="tableColumnsError"
          :data="tableDataDetils"
          :item-total="paginationError.total"
          :page-size="paginationError.pageSize"
          class="page-base-table"
          :current="paginationError.current"
          :fixed-width="true"
          :loading="detilsLoading"
          :scroll="{type:1}"
          @pageChange="handleTableChangeDetils"
          @tableChange="tableChangeDetils"
        >
        <!-- <span slot="title"></span> -->
        </BaseTable>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { minerList, faultySectors, clusters } from '@/api/login'
import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    BaseTable
  },
  data() {
    return {
      filterSettings: [],
      // clustersDefault: '',
      filter: {},
      ableColumnsPopover: [],
      visible: false,
      // 表格-列
      tableColumns: [],
      // 表格-数据
      tableData: [],
      loading: false,
      detilsLoading: false,
      clustersList: [],
      tableDataDetils: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      paginationError: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      sort: {
        sort_field: '',
        sort_order: ''
      },
      sortDetils:
        {
          sort_field: '',
          sort_order: ''
        },

      tableColumnsError: [
        {
          title: '扇区序号',
          dataIndex: 'Number',
          key: 'Number',
          align: 'center'
        },
        {
          title: 'Deadline',
          dataIndex: 'Deadline',
          key: 'Deadline',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          align: 'center'
        },
        {
          title: '扇区状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center'
        },
        {
          title: '迁移状态',
          dataIndex: 'MigrateStatus',
          key: 'MigrateStatus',
          align: 'center'
        },
        {
          title: '是否禁用',
          dataIndex: 'Disable',
          key: 'Disable',
          align: 'center',
          scopedSlots: { customRender: 'Disable' },
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
        },
        {
          title: 'StoreIP',
          dataIndex: 'StoreIP',
          key: 'StoreIP',
          align: 'center',
          sorter: true
        },
        {
          title: ' StorePath',
          dataIndex: 'StorePath',
          key: 'StorePath',
          align: 'center'
        },
        {
          title: 'FromIP',
          dataIndex: 'FromIP',
          key: 'FromIP',
          align: 'center'
        },
        {
          title: 'FromPath',
          dataIndex: 'FromPath',
          key: 'FromPath',
          align: 'center'
        },
        {
          title: '错误原因',
          dataIndex: 'Reason',
          key: 'Reason',
          align: 'center'
        },
        {
          title: '证明步骤',
          dataIndex: 'WdPoStStep',
          key: 'WdPoStStep',
          align: 'center'
        },
        {
          title: '证明进程IP',
          dataIndex: 'ProcessIP',
          key: 'ProcessIP',
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.getTableData()
    this.clusters()
  },
  methods: {
    initTable() {
      this.filterSettings = [
        {
          label: '矿工ID',
          key: 'minerid',
          type: 'input',
          placeholder: '请输入矿工ID',
          style: 'width:200px'
        },
        {
          label: '集群名称',
          key: 'cluster',
          type: 'select',
          placeholder: '请选择',
          options: this.clustersList
        },
        {
          label: '是否密封',
          key: 'sealing',
          type: 'select',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        }
      ]
      this.ableColumnsPopover = [
        {
          title: '矿工号',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center'
        },
        {
          title: '孤块高度',
          dataIndex: 'Height',
          key: 'Height',
          align: 'center'
        },
        {
          title: '孤块哈希',
          dataIndex: 'CID',
          key: 'CID',
          align: 'center'
        },
        {
          title: '出块时间',
          dataIndex: 'MineTime',
          key: 'MineTime',
          align: 'center'
        }
      ]
      this.tableColumns = [
        {
          title: '集群名称',
          dataIndex: 'Cluster',
          key: 'Cluster',
          sorter: true,
          align: 'center'
        },
        {
          title: '公司名称',
          dataIndex: 'Company',
          key: 'Company',
          sorter: true,
          align: 'center'
        },

        {
          title: '幸运值（24h）',
          dataIndex: 'LuckyValue24hStr',
          key: 'LuckyValue24h',
          align: 'center',
          sorter: true
          // scopedSlots: { customRender: 'LuckyValue24hStr' },
          // slotName: 'LuckyValue',
          // listKey: 'OrphanBlock24h'
        },
        {
          title: '幸运值（7d）',
          dataIndex: 'LuckyValue7dStr',
          key: 'LuckyValue7dStr',
          align: 'center',
          sorter: true
          // scopedSlots: { customRender: 'LuckyValue7dStr' },
          // slotName: 'LuckyValue',
          // listKey: 'LuckyValue7d'
        },
        {
          title: '幸运值（30d）',
          dataIndex: 'LuckyValue30dStr',
          key: 'LuckyValue30d',
          sorter: true,
          align: 'center'
          // scopedSlots: { customRender: 'LuckyValue30dStr' }
        },

        {
          title: '矿工号',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'MinerID' },
          slotName: 'Miner'
        },
        {
          title: '有效算力',
          dataIndex: 'RawPowerStr',
          key: 'RawPower',
          sorter: true,
          align: 'center'
          // scopedSlots: { customRender: 'RawPowerStr' }
        },
        {
          title: '新增算力',
          dataIndex: 'PowerGrowthStr',
          key: 'PowerGrowth',
          align: 'center',
          sorter: true
          // scopedSlots: { customRender: 'PowerGrowthStr' }
        }, {
          title: '增量算力',
          dataIndex: 'PowerDeltaStr',
          key: 'PowerDelta',
          align: 'center',
          sorter: true
          // scopedSlots: { customRender: 'PowerDeltaStr' }
        },
        {
          title: '孤块(24H/7D)',
          dataIndex: 'OrphanBlockCnt',
          key: 'OrphanBlockCnt',
          align: 'center',
          scopedSlots: { customRender: 'OrphanBlockCnt' },
          slotName: 'OrphanBlockCnt',
          listKey: 'LuckyValue'
        },
        {
          title: '错误证明',
          dataIndex: 'FaultCount',
          key: 'FaultCount',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'FaultCount' },
          slotName: 'FaultCount'
          // colorMarks: [
          //   {
          //     label: '0',
          //     value: 0,
          //     color: '#04d919'
          //   }
          //   // {
          //   //   label: '',
          //   //   value: true,
          //   //   color: '#04d919'
          //   // }
          // ]
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
              value: false,
              color: '#f5222d'
            },
            {
              label: '是',
              value: true,
              color: '#04d919'
            }
          ]
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          key: 'operate',
          scopedSlots: { customRender: 'operate' },
          width: '13%',
          buttons: [
            {
              label: '爆块日志',
              emitName: 'lookMininglog',
              type: 'primary',
              key: 'Status',
              val: 1
            }, {
              label: '查看进程',
              emitName: 'lookcourse',
              type: 'primary',
              key: 'Status',
              val: 1
            }
          ]
        }

      ]
    },
    // // 切换集群
    // handleChange(value) {
    //   this.clustersDefault = value
    //   this.getTableData()
    // },
    // 列表
    clusters() {
      clusters().then(res => {
        const data = res.data
        if (data.code === 200) {
          this.clustersList = []
          data.data.clusters.forEach(item => {
            this.clustersList.push({ label: item.Name, value: item.Name, ClientID: item.ClientID })
          })
          this.initTable()
          // this.clustersList = data.data.clusters
          // this.clustersDefault = this.clustersList[0].label
        }
      })
    },
    // 排序
    tableChange(sorter) {
      // console.log(sorter, '121211')
      if (sorter.order === 'descend') {
        this.sort.sort_order = 'Desc'
      } else if (sorter.order === 'ascend') {
        this.sort.sort_order = 'Asc'
      } else {
        this.sort.sort_order = ''
      }
      this.sort.sort_field = sorter.columnKey

      this.getTableData()
    },
    // 错误详情排序
    tableChangeDetils(sorter) {
      console.log(sorter, '121211')
      if (sorter.order === 'descend') {
        this.sortDetils.sort_order = 'Desc'
      } else if (sorter.order === 'ascend') {
        this.sortDetils.sort_order = 'Asc'
      } else {
        this.sortDetils.sort_order = ''
      }
      this.sortDetils.sort_field = sorter.columnKey

      this.getTableDataDetils()
    },
    // 列表详情翻页
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.pageNumber
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTableData()
    },
    // 错误详情翻页
    handleTableChangeDetils(pagination) {
      const pager = { ...this.paginationError }
      pager.current = pagination.pageNumber
      pager.pageSize = pagination.pageSize
      this.paginationError = pager
      this.getTableDataDetils()
    },
    getTableDataDetils() {
      const params = {
        minerid: this.minerid,
        page: this.paginationError.current,
        size: this.paginationError.pageSize
      }
      params.sort_field = this.sortDetils.sort_field
      params.sort_order = this.sortDetils.sort_order
      faultySectors(params).then(res => {
        this.detilsLoading = false
        const result = res.data
        if (result.code === 200) {
          this.tableDataDetils = result.data.sectors
          this.paginationError.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    filterTableData(e) {
      this.filter = { ...e }
      this.getTableData()
    },
    // 查看爆块日志
    lookMininglog(e) {
      this.$router.push('/blockMininglog?minerid=' + e.MinerID)
    },
    // 查看程序进程
    lookcourse(e) {
      this.$router.push('/procedureCourse?minerid=' + e.MinerID)
    },
    lookDeadline(value) {
      const minerid = value.record.MinerID
      // if (value.text > 0) {
      this.$router.push('/machine?minerid=' + minerid)
      // }
    },
    lookError(value) {
      this.minerid = value.record.MinerID
      this.detilsLoading = true
      this.paginationError.current = 1
      if (value.text > 0) {
        this.visible = true
        this.getTableDataDetils()
        // this.$router.push('/wdpostDeadlines?minerid=' + minerid)
      }
    },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      this.loading = true
      const params = this.generateParams()
      params.page = this.pagination.current
      params.size = this.pagination.pageSize
      // params.cluster = this.clustersDefault
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      minerList(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.miners
          this.pagination.total = result.data.total || 0
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    generateParams() {
      return this.filter
    }

  }
}
</script>
<style>
.text{
  text-decoration: underline;
  cursor: pointer;
}
</style>
