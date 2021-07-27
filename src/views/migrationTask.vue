<template>
  <page-header-wrapper>
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
          :current="page"
          :page-size="size"
          :item-total="total"
          @pageChange="handleTableChange"
          @tableChange="modalTableChange"
        >
          <div slot="list" slot-scope="record">
            <p v-for="(item,index) in record.text" :key="index">{{ item }}</p>
          </div>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { migrateTasks } from '@/api/login'
import BaseTable from '@/components/common/baseTable.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable
  },
  data() {
    return {
      moment,
      filterSettings: [],
      tableColumns: [],
      tableData: [],
      loading: false,
      sort: {
        sort_field: '',
        sort_order: ''
      },
      // minerid: '',
      page: 1,
      size: 10,
      total: 10
    }
  },
  created() {
    // this.minerid = this.$route.query.minerid
    // if (!this.minerid) {
    //   this.$router.push('/minerList')
    //   return false
    // }
    console.log(this.$route.query, '6556')
    this.initTable()
    this.getTableData()
  },
  methods: {

    initTable() {
      this.filterSettings = [
        {
          label: '矿工号',
          key: 'minerid',
          type: 'input',
          placeholder: '矿工号',
          style: 'width:200px'
        },
        {
          label: '状态',
          key: 'status',
          type: 'select',

          placeholder: '状态',
          style: 'width:200px',
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
          title: 'StoreIP',
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
    // 处理表格翻页
    handleTableChange(pagination) {
      // this.selectedRowKeys = []
      // this.popupFormValue.BoxIdList = []
      // this.$set(this.popupFormValue, 'BoxIdList', [])
      this.page = pagination.pageNumber
      this.size = pagination.pageSize
      this.getTableData()
    },
    // 生成获取表格数据的请求参数
    generateParams() {
      const params = {
        page: this.page,
        size: this.size
      }
      Object.assign(params, this.filter)
      return params
    },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      this.loading = true
      const params = this.generateParams()
      params.page = this.page
      params.size = this.size
      // params.minerid = 'f0427989'
      // ...this.generateParams()
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      migrateTasks(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.tasks
          this.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 排序
    modalTableChange(sorter) {
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
    // 表格-条件查询
    filterTableData(e) {
      console.log(e, '9*9*9*9*99')
      this.filter = { ...e }
      // 时间范围需要特殊处理
      delete this.filter.time
      if (e.time) {
        this.filter.updated_start_time = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.updated_end_time = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.minerid = e.minerid
      this.page = 1
      this.getTableData()
    }

  }
}
</script>
