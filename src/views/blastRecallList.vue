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
            <p v-for="(item,index) in record.text" :key="index" class="link" :style="(record.text.length-1)===index?'margin-bottom:0;':''" @click="link(item)">{{ item }}</p>
          </div>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { backtracks } from '@/api/api'
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
  },
  methods: {
    link(item) {
      window.open('https://filfox.info/zh/tipset/' + item, '_blank')
    },
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
          label: '起始高度',
          key: 'start_height',
          type: 'input',
          placeholder: '起始高度',
          style: 'width:200px'
        },
        {
          label: '结束高度',
          key: 'end_height',
          type: 'input',
          placeholder: '结束高度',
          style: 'width:200px'
        },
        {
          label: '起止时间',
          key: 'time',
          type: 'daterange'
        },
        {
          label: '只看差异',
          key: 'only_differ',
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
            }]
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
          title: '起始高度',
          dataIndex: 'StartHeight',
          key: 'StartHeight',
          align: 'center'
        },
        {
          title: '结束高度',
          dataIndex: 'EndHeight',
          key: 'EndHeight',
          align: 'center'
        },

        {
          title: '回溯爆块',
          dataIndex: 'Offline',
          key: 'Offline',
          align: 'center',
          scopedSlots: { customRender: 'Offline' },
          slotName: 'list'
          // scopedSlots: { customRender: 'CreatedAt' }
        },
        {
          title: '链上爆块',
          dataIndex: 'OnChain',
          key: 'OnChain',
          align: 'center',
          scopedSlots: { customRender: 'OnChain' },
          slotName: 'list'
        },
        {
          title: '差异爆块',
          dataIndex: 'Differ',
          key: 'Differ',
          align: 'center',
          scopedSlots: { customRender: 'Differ' },
          slotName: 'list'
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
      const params = this.generateParams()
      params.page = this.page
      params.size = this.size
      // ...this.generateParams()
      backtracks(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.backtracks
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
      console.log(e.time, '9*9*9*9*99')
      this.filter = { ...e }
      // 时间范围需要特殊处理
      delete this.filter.time
      if (e.time && e.time.length) {
        this.filter.start_time = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_time = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.minerid = e.minerid
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
}
</style>
