<template>
  <!-- 恢复任务 -->

  <div class="tables">
    <table-filter style=" margin-bottom: 8px" :settings="filterSettings" @submit="filterTableData">
      <a-button type="primary" @click="addRecover">添加</a-button>
      <a-button type="primary" style="margin-left:20px" @click="batchDetele">批量删除</a-button>
    </table-filter>
    <!-- 表格 开始 -->
    <BaseTable
      :id="'ID'"
      ref="table"
      :columns="tableColumns"
      :data="tableData"
      class="page-base-table"
      :fixed-width="true"
      :loading="loading"
      :current="page.page"
      :page-size="page.size"
      :item-total="page.total"
      :is-selectable="true"
      :if-hide-pagination="false"
      @tableChange="tableChange"
      @pageChange="pageChange"
      @changeTask="changeTask"
      @deleteTask="deleteTask"
      @selectChange="onSelectChange"
    >
      <span slot="text" slot-scope="record" :class="record.record.IsCurrent === true ? 'red' : ''">{{ record.text }}</span>
      <!-- slotName: 'toFixed' -->
      <span slot="toFixed" slot-scope="record">{{ record.text?Number(record.text).toFixed(2):'0' }}</span>
    </BaseTable>
    <BaseFormPopup
      title="添加任务"
      :visible="visibleSet1"
      :setting="formPopupSetting1"
      :form-value="popupFormValue1"
      @ok="handleOk1"
      @close="handleClosePopup1"
    />
    <BaseFormPopup
      title="添加任务"
      :visible="visibleSet2"
      :setting="formPopupSetting2"
      :form-value="popupFormValue2"
      @ok="handleOk2"
      @close="handleClosePopup2"
    />
  </div>

</template>
<script>
import {
  restoreTasks,
  addRestoreTasks,
  delRestoreTasks,
  setRestoreTask
} from '@/api/api'

import BaseTable from '@/components/common/baseTable.vue'
import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable,
    // LookInfo
    BaseFormPopup
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
      IdList: [],
      filter: {},
      moment,
      tableColumns: [],
      tableData: [],
      loading: false,
      popupFormValue1: {
        MinerID: '',
        WorkerIP: '',
        StoreIP: ''
      },
      formPopupSetting1: [],
      visibleSet1: false,
      popupFormValue2: {
        MinerID: '',
        Numbers: '',
        WorkerIP: ''
      },
      formPopupSetting2: [],
      visibleSet2: false,
      sort: {
        sort_field: '',
        sort_order: ''
      },
      page: {
        page: 1,
        size: 10,
        total: 10
      },
      type: 'add',
      removeCmd: [],
      retryCmd: []

    }
  },

  created() {
    this.getTableData()
  },
  methods: {
    // 表格配置
    initTable() {
      this.formPopupSetting2 = [
        {
          label: '矿工ID',
          key: 'MinerID',
          type: 'input',
          placeholder: '矿工ID',
          required: true,
          disabled: true
        },
        {
          label: '扇区号',
          key: 'Numbers',
          type: 'textarea',
          placeholder: '请输入扇区号多个用逗号隔开'
        },

        {
          label: '算力机IP',
          key: 'WorkerIP',
          type: 'textarea',
          placeholder: '请输入存储机多个用逗号隔开'
        }
      ]
      this.formPopupSetting1 = [
        {
          label: '矿工号',
          key: 'MinerID',
          type: 'input',
          placeholder: '矿工号',
          required: true,
          disabled: true
        },
        {
          label: '算力机IP',
          key: 'WorkerIP',
          type: 'input',
          placeholder: '请输入算力机IP'
        },

        {
          label: '存储机IP',
          key: 'StoreIP',
          type: 'input',
          placeholder: '请输入存储机IP'
        }
      ]
      this.filterSettings = [
        {
          label: '扇区号',
          key: 'number',
          type: 'input',
          sorter: true,
          placeholder: '扇区号',
          style: 'width:100px'
        },
        {
          label: '存储IP',
          key: 'storeip',
          type: 'input',
          sorter: true,
          placeholder: '存储IP',
          style: 'width:100px'
        },
        {
          label: '算力机IP',
          key: 'workerip',
          type: 'input',
          sorter: true,
          placeholder: '存储IP',
          style: 'width:100px'
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
          title: '扇区ID',
          dataIndex: 'SectorID',
          key: 'SectorID',
          align: 'center'
        },

        {
          title: '扇区号',
          dataIndex: 'Number',
          key: 'Number',
          align: 'center'
        },
        {
          title: '机器IP',
          dataIndex: 'WorkerIP',
          key: 'WorkerIP',
          align: 'center'
        },
        {
          title: 'WorkerPath',
          dataIndex: 'WorkerPath',
          key: 'WorkerPath',
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
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          scopedSlots: { customRender: 'Status' },
          colorMarks: [
            {
              label: '未完成',
              value: 'wait',
              color: '#f5222d'
            },
            {
              label: '已完成',
              value: 'done',
              color: '#04d98a'
            },
            {
              label: '恢复中',
              value: 'doing',
              color: '#04d98a'
            },
            {
              label: '迁移失败',
              value: 'migratefailed',
              color: '#f5222d'
            },
            {
              label: '恢复失败',
              value: 'failed',
              color: '#f5222d'
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
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          key: 'operate',

          scopedSlots: { customRender: 'operate' },
          buttons: [
            {
              label: '修改',
              emitName: 'changeTask',
              type: 'primary'
            },
            {
              label: '删除',
              emitName: 'deleteTask',
              type: 'primary'
            }
          ]
        }

      ]
    },
    addRecover() {
      this.popupFormValue2.Numbers = ''
      this.popupFormValue2.WorkerIP = ''
      this.visibleSet2 = true
      this.popupFormValue2.MinerID = this.minerid
    },
    // 选择
    onSelectChange(selectedRowKeys, selectedRows) {
      this.IdList = selectedRowKeys
      // this.changList = selectedRowKeys
    },
    // 取消
    handleClosePopup2() {
      this.visibleSet2 = false
    },
    handleClosePopup1() {
      this.visibleSet1 = false
    },
    // 修改任务
    changeTask(e) {
      // this.type = 'set'
      this.ID = e.ID
      this.visibleSet1 = true
      this.popupFormValue1.Numbers = e.Number
      this.popupFormValue1.WorkerIP = e.WorkerIP
      this.popupFormValue1.MinerID = this.minerid
    },
    // 批量删除
    batchDetele() {
      const what = this
      if (this.IdList.length <= 0) {
        what.$message.error('请选择要删除的任务')
        return false
      }
      this.$confirm({
        title: '确认删除以下任务',
        width: '30%',
        content: () => {
          return (
            <div style={{ color: 'red' }}>
              { what.IdList.map((item) => {
                return <span>{item}，</span>
              })}
            </div>
          )
        },
        onOk() {
          what.delRestoreTasks()
        },
        onCancel() {
          what.$message.error('取消删除')
        }
      })
    },
    // 删除任务
    deleteTask(e) {
      this.IdList = []
      this.IdList.push(e.ID)
      const what = this
      this.$confirm({
        title: '删除任务',
        width: '30%',
        content: '确认删除该任务吗？',
        onOk() {
          what.delRestoreTasks()
          what.IdList = []
          what.$refs.table.selectedRowKeys = []
        },
        onCancel() {
          what.$message.error('取消删除')
        }
      })
    },
    delRestoreTasks() {
      const params = {
        MinerID: this.minerid,
        ID: this.IdList
      }
      delRestoreTasks(params).then(res => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('删除成功')
          this.getTableData()
        } else {
          this.$message.error(result.msg || '更新失败')
        }
      })
    },
    // 修改确定
    handleOk2(from) {
      // from.BoxIdList = this.popupFormValue.BoxIdList
      // const params = { ...this.popupFormValue }
      // params.ip = this.popupFormValue.ip.split(',')
      addRestoreTasks(from).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('添加成功')
          this.visibleSet2 = false
          this.getTableData()
        } else {
          this.$message.error(result.Msg || '添加失败,请重试')
        }
        this.visibleSet2 = false
      })
    },
    handleOk1(from) {
      const params = {
        ID: this.ID,
        ...from
      }
      setRestoreTask(params).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('修改成功')
          this.visibleSet1 = false
          this.getTableData()
        } else {
          this.$message.error(result.message || '修改失败,请重试')
        }
        this.visibleSet1 = false
      })
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
      restoreTasks(params).then((res) => {
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

