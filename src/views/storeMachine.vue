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
import { storeMachines, clusters } from '@/api/login'
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
      clustersList: [],
      page: 1,
      size: 10,
      total: 10
    }
  },
  created() {
    this.clusters()
    // this.minerid = this.$route.query.minerid
    // if (!this.minerid) {
    //   this.$router.push('/minerList')
    //   return false
    // }
    console.log(this.$route.query, '6556')
    this.initTable()
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
          label: '集群名称',
          key: 'cluster',
          type: 'select',
          placeholder: '请选择',
          options: this.clustersList
        },
        {
          label: '存储IP',
          key: 'storeip',
          type: 'input',
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
              value: 11,
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
        }
        //  {
        //   title: 'Ftp参数',
        //   dataIndex: 'FtpEnv',
        //   key: 'FtpEnv',
        //   align: 'center'
        // },
        // {
        //   title: '总耗时',
        //   dataIndex: 'ElapsedTime',
        //   key: 'ElapsedTime',
        //   align: 'center'
        // },

      ]
    },
    // 列表
    clusters() {
      clusters().then(res => {
        const data = res.data
        if (data.code === 200) {
          const list = data.data.clusters
          list.forEach(item => {
            this.clustersList.push({ label: item.Name, value: item.Name })
          })
          this.defaultClusters = this.clustersList[0].label
          this.getTableData()
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
      params.cluster = this.defaultClusters
      params.page = this.page
      params.size = this.size
      // params.minerid = 'f0427989'
      // ...this.generateParams()
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      storeMachines(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.machines
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
