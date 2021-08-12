<template>
  <page-header-wrapper>
    <!-- 表格数据过滤器 -->
    <a-card size="small" :bordered="false">
      <!-- <table-filter :settings="filterSettings" @submit="filterTableData" /> -->
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <BaseTable
          ref="table"
          :columns="tableColumns"
          :data="tableData"
          class="page-base-table"
          :fixed-width="true"
          :loading="loading"
          :if-hide-pagination="true"
        >
          <span slot="text" slot-scope="record" :class="record.record.IsCurrent===true?'red':''">{{ record.text }}</span>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { processes } from '@/api/api'
import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    BaseTable
  },
  data() {
    return {
      // filterSettings: [],
      tableColumns: [],
      tableData: [],
      loading: false,
      minerid: ''
    }
  },
  computed: {
    onQuery: function() {
      return this.$route.query.minerid
    }
  },
  watch: {
    'onQuery'(old, newValue) {
      if (newValue) {
        this.minerid = this.$route.query.minerid
        console.log(this.minerid, '12212122')
        if (this.minerid) {
          this.getTableData()
        }
      }
    },
    immediate: true
  },
  activated() {
    this.minerid = this.$route.query.minerid
    if (!this.minerid) {
      this.$router.push('/minerList')
      return false
    }
    this.getTableData()
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
      this.tableColumns = [
        {
          title: '矿工号',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center'

        },
        {
          title: '机器IP',
          dataIndex: 'IP',
          key: 'IP',
          align: 'center'
        },
        {
          title: '进程类型',
          dataIndex: 'ProcType',
          key: 'ProcType',
          align: 'center'
        },
        {
          title: '进程号',
          dataIndex: 'PID',
          key: 'PID',
          align: 'center'
        },
        {
          title: '启动时间',
          dataIndex: 'StartUpAt',
          key: 'StartUpAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'StartUpAt' }
        },
        {
          title: '关闭时间',
          dataIndex: 'ShutdownAt',
          key: 'ShutdownAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'ShutdownAt' }
        },
        {
          title: '心跳时间',
          dataIndex: 'Heartbeat',
          key: 'Heartbeat',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'Heartbeat' }
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
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      this.loading = true
      // const params = this.generateParams()
      const params = {
        minerid: this.minerid,
        page: this.page,
        size: this.size
      }
      processes(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.processes
        } else {
          this.$message.error(result.msg)
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    }

  }
}
</script>
