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
        >
          <!-- <span slot="CreatedAt" slot-scope="record">{{ moment(record.text).format('YYYY-MM-DD HH:mm:ss') }}</span> -->
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { miningLogs } from '@/api/login'
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
      minerid: '',
      page: 1,
      size: 10,
      total: 10
    }
  },
  created() {
    this.minerid = this.$route.query.minerid
    if (!this.minerid) {
      this.$router.push('/minerList')
      return false
    }
    // console.log(this.$route.query, '6556')
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
          label: '起止时间',
          key: 'time',
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
          title: '高度',
          dataIndex: 'Height',
          key: 'Height',
          align: 'center'
        },
        {
          title: 'WinCount',
          dataIndex: 'WinCount',
          key: 'WinCount',
          align: 'center'
        },
        {
          title: '块哈希',
          dataIndex: 'BlockCID',
          key: 'BlockCID',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'CreatedAt' }
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
      // const params = this.generateParams()
      const params = {
        minerid: this.minerid,
        page: this.page,
        size: this.size,
        ...this.generateParams()
      }
      miningLogs(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.mining_logs
          this.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 表格-条件查询
    filterTableData(e) {
      // console.log(e, '9*9*9*9*99')
      this.filter = { ...e }
      // 时间范围需要特殊处理
      delete this.filter.time
      // console.log(this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss'), this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss'))
      if (e.time) {
        this.filter.start_at = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_at = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.page = 1
      this.getTableData()
    }

  }
}
</script>
