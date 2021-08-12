<template>
  <!-- 表格数据过滤器 -->

  <div class="tables">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <table-filter style=" margin-bottom: 8px" :settings="filterSettings" @submit="filterTableData" />
    <!-- 表格 开始 -->
    <BaseTable
      :id="'Number'"
      ref="table"
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
  migrateTasks
} from '@/api/api'

import BaseTable from '@/components/common/baseTable.vue'
// import LookInfo from '@/components/common/lookInfo.vue'
// import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
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
    },
    title: {
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
          label: '扇区号',
          key: 'number',
          type: 'input',
          placeholder: '扇区号',
          style: 'width:200px'
        },
        {
          label: 'FromIp',
          key: 'fromip',
          type: 'input',
          placeholder: 'fromip',
          style: 'width:200px'
        },
        {
          label: 'StoreIP',
          key: 'storeip',
          type: 'input',
          placeholder: 'StoreIP',
          style: 'width:200px'
        },
        {
          label: '状态',
          key: 'status',
          type: 'select',
          placeholder: '状态',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未迁移',
              value: 'Wait'
            },
            {
              label: '迁移中',
              value: 'Migrating'
            },
            {
              label: '已迁移',
              value: 'Migrated'
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
          title: '扇区号',
          dataIndex: 'Number',
          key: 'Number',
          align: 'center'
        },
        {
          title: 'FromIP',
          dataIndex: 'FromIP',
          key: 'FromIP',
          align: 'center',
          sorter: true
        },
        {
          title: 'FromPath',
          dataIndex: 'FromPath',
          key: 'FromPath',
          align: 'center'
        },

        {
          title: '存储IP',
          dataIndex: 'StoreIP',
          key: 'StoreIP',
          align: 'center',
          sorter: true
        },
        {
          title: 'StorePath',
          dataIndex: 'StorePath',
          key: 'StorePath',
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
              label: '未迁移',
              value: 'Wait',
              color: '#f5222d'
            },
            {
              label: '迁移中',
              value: 'Migrating',
              color: ''
            },
            {
              label: '已迁移',
              value: 'Migrated',
              color: '#04d919'
            }
          ]
        },
        {
          title: 'FtpStatus',
          dataIndex: 'FtpStatus',
          key: 'FtpStatus',
          align: 'center'
        },
        {
          title: '失败',
          dataIndex: 'FailureCount',
          key: 'FailureCount',
          align: 'center'
        },
        {
          title: '总耗时',
          dataIndex: 'ElapsedTime',
          key: 'ElapsedTime',
          align: 'center'
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
        }
      ]
    },

    // 筛选
    filterTableData(e) {
      this.sectorsList = []
      this.$refs.table.selectedRowKeys = []
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
      migrateTasks(params).then((res) => {
        this.initTable()
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.tasks
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

