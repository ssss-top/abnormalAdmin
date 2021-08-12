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
          <div slot="list" slot-scope="record">
            <p class="link" @click="link(record.text)">{{ record.text }}</p>
          </div>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { lotusinfos, clusters } from '@/api/api'
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
      clustersList: [],
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
    // console.log(this.$route.query, '6556')
    this.initTable()
    this.getTableData()
    this.clusters()
  },
  methods: {

    initTable() {
      this.filterSettings = [
        {
          label: 'IP',
          key: 'ip',
          type: 'input',
          placeholder: 'IP',
          style: 'width:200px'
        },
        {
          label: '内网IP',
          key: 'innerip',
          type: 'input',
          placeholder: '内网IP',
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
              label: '异常',
              value: 'Differ'
            },
            {
              label: '正常',
              value: 'Normal'
            }
          ]
        },
        {
          label: '集群名称',
          key: 'cluster',
          type: 'select',
          placeholder: '请选择',
          options: this.clustersList
        }
        // {
        //   label: '起止时间',
        //   key: 'time',
        //   type: 'daterange'
        // }

      ]
      this.tableColumns = [
        {
          title: '接口IP',
          dataIndex: 'IP',
          key: 'IP',
          align: 'center'

        },
        {
          title: '接口port',
          dataIndex: 'Port',
          key: 'Port',
          align: 'center'
        },
        {
          title: 'Token',
          dataIndex: 'Token',
          key: 'Token',
          align: 'center'
        },
        {
          title: '是否监控',
          dataIndex: 'Monitor',
          key: 'Monitor',
          align: 'center',
          scopedSlots: { customRender: 'Monitor' },
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
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          scopedSlots: { customRender: 'Status' },
          colorMarks: [
            {
              label: '异常',
              value: 'Differ',
              color: '#f5222d'
            },
            {
              label: '正常',
              value: 'Normal',
              color: '#04d919'
            }
          ]
          // scopedSlots: { customRender: 'CreatedAt' }
        },
        {
          title: '告警阀值',
          dataIndex: 'Threshold',
          key: 'Threshold',
          align: 'center'
        },
        {
          title: '当前高度',
          dataIndex: 'CurrentHeight',
          key: 'CurrentHeight',
          align: 'center',
          scopedSlots: { customRender: 'CurrentHeight' },
          slotName: 'list'
        },
        {
          title: '目前高度',
          dataIndex: 'TargetHeight',
          key: 'TargetHeight',
          align: 'center'
        },
        {
          title: '内网IP',
          dataIndex: 'InnerIP',
          key: 'InnerIP',
          align: 'center'
        },
        {
          title: '集群名称',
          dataIndex: 'Cluster',
          key: 'Cluster',
          align: 'center'
        },

        {
          title: '创建时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'CreatedAt' }
        },
        {
          title: '更新时间',
          dataIndex: 'UpdatedAt',
          key: 'UpdatedAt',
          align: 'center',
          type: 'formatTime',
          scopedSlots: { customRender: 'UpdatedAt' }
        }

      ]
    },
    link(item) {
      window.open('https://filfox.info/zh/tipset/' + item, '_blank')
    },
    // 列表
    clusters() {
      clusters().then(res => {
        const data = res.data
        // console.log(data, '5656566')
        if (data.code === 200) {
          const list = data.data.clusters
          list.forEach(item => {
            this.clustersList.push({ label: item.Name, value: item.Name })
          })
        }
      })
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
      // minerid: this.minerid,
      params.page = this.page
      params.size = this.size
      // ...this.generateParams()
      lotusinfos(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.lotus_infos
          this.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 表格-条件查询
    filterTableData(e) {
      this.filter = { ...e }
      // 时间范围需要特殊处理
      delete this.filter.time
      if (e.time && e.time.length) {
        this.filter.start_time = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_time = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.page = 1
      this.getTableData()
    }

  }
}
</script>
<style lang="less" scoped>
.link{
text-decoration: underline;
cursor: pointer;
margin-bottom: 0;
}
</style>
