<template>
  <page-header-wrapper>
    <a-card size="small" :bordered="false">
      <!-- 表格数据过滤器 -->
      <table-filter :settings="filterSettings" @submit="filterTableData">
        <!-- <a-button type="primary" @click="restart">重启</a-button> -->
        <!-- <export-button url="/v1/admin/pool/getReleaseList" file-name="释放记录"></export-button> -->
      </table-filter>
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <!-- <a-table
          :columns="tableColumns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ onChange: onSelectChange }"
          :loading="tableDataLoading === 1"
          row-key="id"
          size="small"
          bordered
          @change="handleTableChange"
        >
        </a-table> -->
        <BaseTable
          ref="table"
          :columns="tableColumns"
          :data="tableData"
          :item-total="pagination.total"
          :page-size="pagination.pageSize"
          class="page-base-table"
          :current="pagination.current"
          :fixed-width="true"
          :loading="loading"
          @pageChange="handleTableChange"
          @LookDetils="LookDetils"
        >
          <!-- <span slot="title"></span> -->
        </BaseTable>
      </div>
      <!-- 表格 结束 -->
    </a-card>
    <a-modal v-model="visible" title="盒子状态列表" ok-text="确认" cancel-text="关闭" width="80%" :footer="null">
      <BaseTable
        ref="table"
        :columns="tableColumnsDetils"
        :data="tableDataDetils"
        :item-total="paginationDetils.total"
        :page-size="paginationDetils.pageSize"
        class="page-base-table"
        :current="paginationDetils.current"
        :fixed-width="true"
        :loading="detilsLoading"
        @pageChange="handleTableChangeDetils"
        @LookDetils="LookDetils"
      >
        <!-- <span slot="title"></span> -->
      </BaseTable>
    </a-modal>
    <!-- <BaseFormPopup
      title="运行脚本"
      :visible="visible"
      :setting="formPopupSetting"
      :formValue="popupFormValue"
      @ok="handleOk"
      @close="handleClosePopup"
      @selectChange="selectChange"
    ></BaseFormPopup> -->
  </page-header-wrapper>
</template>
<script>
import { bseJobsList, bseJobsSubmit, bseJobItemList } from '@/api/api'
// import BaseFormPopup from '@/components/baseFormPopup/index.vue'
import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    // BaseFormPopup,
    BaseTable
  },
  data() {
    return {
      // 表格-查询条件配置
      filterSettings: [],
      visible: false,
      loading: false,
      detilsLoading: false,
      formPopupSetting: [{
        label: '脚本内容',
        key: 'ShellContent',
        type: 'textarea',
        placeholder: '要执行的脚本内容，不可为空',
        required: true
      }, {
        label: '标题',
        key: 'Title',
        type: 'input',
        placeholder: '任务标题，不可为空',
        required: true
      }, {
        label: '备注',
        key: 'Remark',
        type: 'input',
        placeholder: '请输入备注',
        required: false
      }],
      // 表格-列
      tableColumns: [],
      tableColumnsDetils: [
        {
          title: 'ID',
          dataIndex: 'ID',
          key: 'ID',
          align: 'center'
        },
        {
          title: '任务ID',
          dataIndex: 'JobID',
          key: 'JobID',
          align: 'center'
        },
        {
          title: '盒子ID',
          dataIndex: 'BoxID',
          key: 'BoxID',
          align: 'center'
        },
        {
          title: '执行结果',
          dataIndex: 'ShellRespContent',
          key: 'ShellRespContent',
          align: 'center'
        },
        {
          title: '执行状态',
          dataIndex: 'ExecutionResultStr',
          key: 'ExecutionResultStr',
          align: 'center'
        },
        {
          title: '失败原因',
          dataIndex: 'FailDesc',
          key: 'FailDesc',
          align: 'center'
        },
        {
          title: '开始时间',
          dataIndex: 'BeginDateStr',
          key: 'BeginDateStr',
          align: 'center'
        },
        {
          title: ' 结束时间',
          dataIndex: 'EndDateStr',
          key: 'EndDateStr',
          align: 'center'
        },
        {
          title: '盒子序列号',
          dataIndex: 'BoxSn',
          key: 'BoxSn',
          align: 'center'
        }
      ],
      // 表格-数据
      tableData: [],
      tableDataDetils: [],
      // tableDataLoading: 0,
      // 表格-翻页
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showSizeChanger: true
      },
      paginationDetils: {
        total: 0,
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showSizeChanger: true
      },
      // rowSelection,
      popupFormValue: {
        ShellContent: '', // -- 要执行的脚本内容，不可为空。
        Title: '', // --任务标题，不可为空
        Remark: '', // --备注
        BoxIdList: [
          // --盒子ID列表，状态必须是正常的（BusiStatus是1的才能选择）
        ]
      }
    }
  },
  created() {
    this.initTable()
    this.getTableData()
  },
  methods: {
  //    onSelectChange (selectedRowKeys, selectedRows) {
  //   for (let i = 0; i < selectedRows.length; i++) {
  //     let item = selectedRows[i]
  //     this.popupFormValue.BoxIdList.push(item.ID)
  //   }
  // },
  // 查看任务详情
    LookDetils(e) {
      this.visible = true
      this.paginationDetils.current = 1
      this.getTableDataDetils(e)
    },
    handleClosePopup() {
      this.visible = false
    },
    restart() {
      if (this.popupFormValue.BoxIdList.length > 0) {
        this.visible = true
      }
      // this.$refs.boxClient.openModal()
    },
    selectChange() {},
    handleOk(from) {
      from.BoxIdList = this.popupFormValue.BoxIdList
      bseJobsSubmit(from).then(res => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('执行成功')
        } else {
          this.$message.error(result.Msg, '执行失败,请重试')
        }
        this.visible = false
      })
    },
    initTable() {
      this.filterSettings = [
        {
          label: '任务标题',
          key: 'title',
          type: 'input',
          placeholder: '任务标题',
          style: 'width:200px'
        },
        {
          label: '盒子业务状态',
          key: 'status',
          type: 'select',
          placeholder: '请选择',
          options: [
            {
              label: '所有',
              value: -1
            },
            {
              label: '已提交',
              value: 1
            },
            {
              label: '已取消',
              value: 2
            },
            {
              label: '运行中',
              value: 3
            },
            {
              label: '已完成',
              value: 4
            }
          ]
        }
      ]
      this.tableColumns = [
        {
          title: '任务ID',
          dataIndex: 'ID',
          key: 'ID',
          align: 'center'
        },
        {
          title: '标题',
          dataIndex: 'Title',
          key: 'Title',
          align: 'center'
        },
        {
          title: '任务提交人',
          dataIndex: 'CreateUserName',
          key: 'CreateUserName',
          align: 'center'
        },
        {
          title: '已提交',
          dataIndex: 'StatusStr',
          key: 'StatusStr',
          align: 'center'
        },
        {
          title: '执行数量',
          dataIndex: 'BoxCount',
          key: 'BoxCount',
          align: 'center'
        },
        {
          title: ' 成功数量',
          dataIndex: 'SuccCount',
          key: 'SuccCount',
          align: 'center'
        },
        {
          title: '脚本内容',
          dataIndex: 'ShellContent',
          key: 'ShellContent',
          align: 'center'
        },
        {
          title: '失败数量',
          dataIndex: 'FailCount',
          key: 'FailCount',
          align: 'center'
        },
        {
          title: '提交时间',
          dataIndex: 'CreateDateStr',
          key: 'CreateDateStr',
          align: 'center'
        },
        {
          title: '开始时间',
          dataIndex: 'BeginDateStr',
          key: 'BeginDateStr',
          align: 'center'
        },
        {
          title: '结束时间',
          dataIndex: 'EndDateStr',
          key: 'EndDateStr',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'Remark',
          key: 'Remark',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'centent',
          key: 'operate',
          scopedSlots: { customRender: 'operate' },
          buttons: [{
            label: '详情',
            emitName: 'LookDetils',
            type: 'primary'
          }]
        }
      ]
    },
    // 获取表格数据
    getTableData() {
      const params = this.generateParams()
      this.loading = true
      bseJobsList(params, this.pagination.current).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.Data.DataList
          this.pagination.total = result.Data.TotalRecordCount
        } else {
          this.$message.error(result.Msg)
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    getTableDataDetils(value) {
      this.detilsLoading = true
      if (value) {
        this.paginationDetils.jobId = value.ID
      }
      const params = this.paginationDetils
      bseJobItemList(params, this.paginationDetils.current).then((res) => {
        this.detilsLoading = false
        const result = res.data
        if (result.code === 200) {
          this.tableDataDetils = result.Data.DataList
          this.paginationDetils.total = result.Data.TotalRecordCount
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    // 生成获取表格数据的请求参数
    generateParams() {
      const params = {
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      }
      Object.assign(params, this.filter)
      return params
    },
    // 处理表格翻页
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.pageNumber
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTableData()
    },
    // 弹窗翻页
    handleTableChangeDetils(pagination) {
      const pager = { ...this.paginationDetils }
      pager.current = pagination.pageNumber
      pager.pageSize = pagination.pageSize
      this.paginationDetils = pager
      this.getTableDataDetils()
    },
    // 重新获取表格数据
    resetTableData() {
      this.pagination.current = 1
      this.getTableData()
    },
    // 表格-条件查询
    filterTableData(e) {
      this.filter = { ...e }
      // 时间范围需要特殊处理
      delete this.filter.daterange
      if (e.daterange) {
        this.filter.start_time = e.daterange[0]
        this.filter.end_time = e.daterange[1]
      }
      this.pagination.current = 1
      this.getTableData()
    }
  }
}
// const rowSelection = {
//   onSelectChange: (selectedRowKeys, selectedRows) => {
//     for (let i = 0; i < selectedRows.length; i++) {
//       let item = selectedRows[i]
//       this.popupFormValue.BoxIdList.push(item.ID)
//     }
//   },
//   // onSelect: (record, selected, selectedRows) => {
//   // },
//   // onSelectAll: (selected, selectedRows, changeRows) => {
//   // },
// }
</script>
