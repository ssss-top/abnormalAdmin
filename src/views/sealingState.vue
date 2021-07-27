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
          @lookDetails="lookDetails"
          @tableChange="tableChange"
          @pageChange="handleTableChange"
        >
          <span slot="text" slot-scope="record" :class="record.record.IsCurrent===true?'red':''">{{ record.text }}</span>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { sealingState } from '@/api/login'
import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    BaseTable
  },
  data() {
    return {
      filterSettings: [],
      tableColumns: [],
      tableData: [],
      loading: false,
      minerid: '',
      sort: {
        sort_field: '',
        sort_order: ''
      },
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
          label: '矿工ID',
          key: 'minerid',
          type: 'input',
          placeholder: '请输入矿工ID',
          style: 'width:200px'
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
      this.tableColumns = [
        {
          title: '矿工号',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center'

        },
        {
          title: '集群名称',
          dataIndex: 'Company',
          key: 'Company',
          align: 'center'
        },
        {
          title: '期望算力',
          dataIndex: 'ExpectedPower',
          key: 'ExpectedPower',
          align: 'center',
          sorter: true
        },
        {
          title: '增长算力(24h)',
          dataIndex: 'PowerLastDay',
          key: 'PowerLastDay',
          align: 'center',
          sorter: true
        },
        {
          title: '机器数量',
          dataIndex: 'MachineCount',
          key: 'MachineCount',
          align: 'center',
          sorter: true
        },

        {
          title: 'P1Failed',
          dataIndex: 'PreCommit1Failed',
          key: 'PreCommit1Failed',
          align: 'center',
          width: '90px',
          sorter: true
        },
        {
          title: 'P2Failed',
          dataIndex: 'PreCommit2Failed',
          key: 'PreCommit2Failed',
          align: 'center',
          width: '90px',
          sorter: true
        },

        {
          title: 'C1Failed',
          dataIndex: 'Committing1Failed',
          key: 'Committing1Failed',
          align: 'center',
          width: '90px',
          sorter: true
        },
        {
          title: 'C2Failed',
          dataIndex: 'Committing2Failed',
          key: 'Committing2Failed',
          align: 'center',
          width: '90px',
          sorter: true
        },
        {
          title: 'AP',
          dataIndex: 'AddPiece',
          key: 'AddPiece',
          align: 'center',
          sorter: true
        },
        {
          title: 'P1',
          dataIndex: 'PreCommit1',
          key: 'PreCommit1',
          align: 'center',
          sorter: true
        },
        {
          title: 'P1Wait',
          dataIndex: 'PreCommit1WaitResponse',
          key: 'PreCommit1WaitResponse',
          align: 'center',
          sorter: true
        },
        {
          title: 'P2',
          dataIndex: 'PreCommit2',
          key: 'PreCommit2',
          align: 'center',
          sorter: true
        },
        {
          title: 'P2Wait',
          dataIndex: 'PreCommit2WaitResponse',
          key: 'PreCommit2WaitResponse',
          align: 'center',
          sorter: true
        },
        {
          title: 'C1',
          dataIndex: 'Committing1',
          key: 'Committing1',
          align: 'center',
          sorter: true
        },
        {
          title: 'C1Wait',
          dataIndex: 'Committing1WaitResponse',
          key: 'Committing1WaitResponse',
          align: 'center',
          sorter: true
        },
        {
          title: 'C2',
          dataIndex: 'Committing2',
          key: 'Committing2',
          align: 'center',
          sorter: true
        },
        {
          title: 'C2Wait',
          dataIndex: 'Committing2WaitResponse',
          key: 'Committing2WaitResponse',
          align: 'center',
          sorter: true
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
          style: 'width:100px',
          scopedSlots: { customRender: 'operate' },
          width: '5%',
          buttons: [{
            label: '详情',
            emitName: 'lookDetails',
            type: 'primary',
            key: 'Status',
            val: 1
          }
          ]
        }

      ]
    },
    filterTableData(e) {
      this.filter = { ...e }
      this.getTableData()
    },

    // 排序
    tableChange(sorter) {
      this.page = 1
      console.log(sorter, '1221')
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
    lookDetails(e) {
      console.log(e, '45445545454545')
      this.$router.push('/machine?minerid=' + e.MinerID)
    },
    // 处理表格翻页
    handleTableChange(pagination) {
      console.log('59595599')
      // this.selectedRowKeys = []
      // this.popupFormValue.BoxIdList = []
      // this.$set(this.popupFormValue, 'BoxIdList', [])
      this.page = pagination.pageNumber
      this.size = pagination.pageSize
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      console.log(this.loading, '1212122')
      if (this.loading === true) return
      this.loading = true
      // const params = this.generateParams()
      const params = {
        // minerid: this.minerid,
        page: this.page,
        size: this.size,
        ...this.filter
      }
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      sealingState(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.sealing_state
          this.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    }

  }
}
</script>
