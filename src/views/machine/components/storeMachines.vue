<template>
  <!-- 表格数据过滤器 -->

  <div class="tables">
    <table-filter style=" margin-bottom: 8px" :settings="filterSettings" @submit="filterTableData" />
    <!-- 表格 开始 -->
    <BaseTable
      :id="'Number'"
      ref="tableMain"
      :columns="tableColumns"
      :data="tableData"
      class="page-base-table"
      :fixed-width="true"
      :loading="loading"
      :current="page.page"
      :page-size="page.size"
      :item-total="page.total"
      :if-hide-pagination="false"
      @tableChange="tableChange"
      @pageChange="pageChange"
    >
      <span slot="text" slot-scope="record" :class="record.record.IsCurrent === true ? 'red' : ''">{{ record.text }}</span>
      <!-- slotName: 'toFixed' -->
      <span slot="toFixed" slot-scope="record">{{ record.text?Number(record.text).toFixed(2):'0' }}</span>
    </BaseTable>
  </div>

</template>
<script>
import {
  storeMachines
} from '@/api/api'

import BaseTable from '@/components/common/baseTable.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable
    // LookInfo
    // BaseFormPopup
  },
  props: {
    minerid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      filterSettings: [],
      filter: {},
      moment,
      tableColumns: [],
      tableData: [],
      loading: false,
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
    this.getTableData()
  },
  methods: {

    // 表格配置
    initTable() {
      this.filterSettings = [
        {
          label: '存储IP',
          key: 'storeip',
          type: 'input',
          sorter: true,
          placeholder: '存储IP',
          style: 'width:200px'
        },

        {
          label: '状态',
          key: 'status',
          type: 'select',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '禁用',
              value: 0
            },
            {
              label: '启用',
              value: 1
            }
          ]
        },
        {
          label: '更新时间',
          key: 'time',
          style: 'width:200px',
          type: 'daterange'
        }
      ]
      this.tableColumns = [
        {
          title: '矿工号',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center'
        },

        {
          title: 'StoreIP',
          dataIndex: 'StoreIP',
          key: 'StoreIP',
          align: 'center'
        },
        {
          title: 'StorePath',
          dataIndex: 'StorePath',
          key: 'StorePath',
          align: 'center'
        },
        {
          title: 'GroupID',
          dataIndex: 'GroupID',
          key: 'GroupID',
          align: 'center'
        },
        {
          title: '当前并发',
          dataIndex: 'ParallelMigrateSectors',
          key: 'ParallelMigrateSectors',
          align: 'center'
        },
        {
          title: '最大并发',
          dataIndex: 'MaxParallelMigrateSectors',
          key: 'MaxParallelMigrateSectors',
          align: 'center'
        },
        {
          title: '完成迁移',
          dataIndex: 'StoredSectors',
          key: 'StoredSectors',
          align: 'center'
        },
        {
          title: '最大可迁移',
          dataIndex: 'MaxStoreSectors',
          key: 'MaxStoreSectors',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          scopedSlots: { customRender: 'Status' },
          colorMarks: [
            {
              label: '禁用',
              value: 0,
              color: '#f5222d'
            },
            {
              label: '启用',
              value: 1,
              color: '#04d919'
            }
          ]
        },

        {
          title: '创建时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'CreatedAt' },
          sorter: true
        },

        {
          title: '更新时间',
          dataIndex: 'UpdatedAt',
          key: 'UpdatedAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'UpdatedAt' },
          sorter: true
        },
        {
          title: '迁移最大耗时(min)',
          dataIndex: 'MigrateCostMax',
          key: 'MigrateCostMax',
          align: 'center',
          scopedSlots: { customRender: 'MigrateCostMax' },
          slotName: 'toFixed'
        },
        {
          title: '迁移最小耗时(min)',
          dataIndex: 'MigrateCostMin',
          key: 'MigrateCostMin',
          align: 'center',
          scopedSlots: { customRender: 'MigrateCostMin' },
          slotName: 'toFixed'
        },
        {
          title: '迁移平均耗时(min)',
          dataIndex: 'MigrateCostAvg',
          key: 'MigrateCostAvg',
          align: 'center',
          scopedSlots: { customRender: 'MigrateCostAvg' },
          slotName: 'toFixed'
        },
        {
          title: '已迁移数量',
          dataIndex: 'MigratedCount',
          key: 'MigratedCount',
          align: 'center'
        },
        {
          title: '迁移中数量',
          dataIndex: 'MigratingCount',
          key: 'MigratingCount',
          align: 'center'
        }
      ]
    },

    // 筛选
    filterTableData(e) {
      this.page.page = 1
      this.filter = { ...e }
      if (e.time && e.time.length) {
        this.filter.start_time = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_time = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
        delete this.filter.time
      }
      this.getTableData()
    },

    // 获取表格数据
    getTableData() {
      if (this.loading === true) return

      this.loading = true
      let params = {}
      params = {
        ...this.generateParams(),
        ...this.filter
      }
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      storeMachines(params).then((res) => {
        this.initTable()
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.machines
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 排序
    tableChange(sorter) {
      this.page.page = 1
      if (sorter.order === 'descend') {
        this.sort.sort_order = 'Desc'
      } else if (sorter.order === 'ascend') {
        this.sort.sort_order = 'Asc'
      } else {
        this.sort.sort_order = ''
      }
      this.sort.sort_field = sorter.field
      this.getTableData()
    },

    // 处理表格翻页
    pageChange(pagination) {
      this.page.page = pagination.pageNumber
      this.page.size = pagination.pageSize
      this.getTableData()
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

