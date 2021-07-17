<template>
  <page-header-wrapper>
    <div style="padding:20px;background-color:white;margin-bottom:20px">
      集群名称:
      <a-select
        v-model="clustersDefault"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option v-for="(item,index) in clustersList" :key="index" :value="item.Name">
          {{ item.Name }}
        </a-select-option>
      </a-select>
    </div>
    <a-card size="small" :bordered="false">
      <!-- 表格数据过滤器 -->
      <table-filter :settings="filterSettings" @submit="filterTableData">
        <!-- <a-button type="primary" @click="restart">批量操作</a-button> -->
        <!-- <export-button url="/v1/admin/pool/getReleaseList" file-name="释放记录"></export-button> -->
      </table-filter>
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <!-- <a-table
          :columns="tableColumns"
          :data-source="tableData"
          :pagination="pagination"
          :row-selection="{ onChange: onSelectChange }"
          :loading="loading === 1"
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
        />
      </div>
      <!-- 表格 结束 -->
    </a-card>
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
import { clusters, alarmlogs, alarmlogType } from '@/api/login'
// import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
import BaseTable from '@/components/common/baseTable.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable
    // BaseFormPopup
  },
  data() {
    return {
      moment,
      // 表格-查询条件配置
      clustersList: [],
      clustersDefault: '--',
      options: [],
      // clustersShow: false,
      filterSettings: [],
      visible: false,
      // formPopupSetting: [{
      //   label: '脚本内容',
      //   key: 'ShellContent',
      //   type: 'textarea',
      //   placeholder: '要执行的脚本内容，不可为空',
      //   required: true
      // }, {
      //   label: '标题',
      //   key: 'Title',
      //   type: 'input',
      //   placeholder: '任务标题，不可为空',
      //   required: true
      // }, {
      //   label: '备注',
      //   key: 'Remark',
      //   type: 'input',
      //   placeholder: '请输入备注',
      //   required: false
      // }],
      // 表格-列
      tableColumns: [],
      // 表格-数据
      tableData: [],
      loading: false,
      // 表格-翻页
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showQuickJumper: true,
        showSizeChanger: true
      }
      // selectedRowKeys: [],
      // rowSelection,
      // popupFormValue: {
      //   ShellContent: '', // -- 要执行的脚本内容，不可为空。
      //   Title: '', // --任务标题，不可为空
      //   Remark: '', // --备注
      //   BoxIdList: [
      //     // --盒子ID列表，状态必须是正常的（BusiStatus是1的才能选择）
      //   ]
      // }
    }
  },
  created() {
    this.clusters()
    this.initTable()
    this.alarmlogType()
  },
  methods: {
    // 类型列表
    alarmlogType() {
      alarmlogType().then(res => {
        const result = res.data
        if (result.code === 200) {
          // let list = []
          const data = result.data.type
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            this.options.push({ label: item.Name, value: item.Type })
          }
        }
      })
    },
    // 列表
    clusters() {
      clusters().then(res => {
        const data = res.data
        if (data.code === 200) {
          this.clustersList = data.data.clusters
          this.clustersDefault = this.clustersList[0].Name
          this.getTableData()
        }
      })
    },
    handleChange(value) {
      this.clustersDefault = value
      this.getTableData()
      console.log(value) // { key: "lucy", label: "Lucy (101)" }
    },
    // onSelectChange (selectedRowKeys, selectedRows) {
    //   // this.selectedRowKeys = selectedRowKeys
    //   // for (let i = 0; i < selectedRows.length; i++) {
    //   //   const item = selectedRows[i]
    //   //   this.popupFormValue.BoxIdList.push(item.ID)
    //   // }
    //   this.popupFormValue.BoxIdList = selectedRowKeys
    // },
    // onSelectAll (selected, selectedRows, changeRows) {
    //   if (!selected) {
    //     this.popupFormValue.BoxIdList = []
    //   }
    // },
    // handleClosePopup () {
    //   this.visible = false
    // },
    // restart () {
    //   if (this.popupFormValue.BoxIdList.length > 0) {
    //     this.visible = true
    //   } else {
    //     this.$message.error('请选择需要执行任务的盒子')
    //   }
    //   // this.$refs.boxClient.openModal()
    // },
    // selectChange () {},
    // handleOk (from) {
    //   from.BoxIdList = this.popupFormValue.BoxIdList
    //   bseJobsSubmit(from).then(res => {
    //     const result = res.data
    //     if (result.code === 200) {
    //       this.$message.success('执行成功')
    //     } else {
    //       this.$message.error(result.Msg || '执行失败,请重试')
    //     }
    //     this.visible = false
    //   })
    // },
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
          label: '起止时间',
          key: 'time',
          type: 'daterange'
        },
        {
          label: '状态',
          key: 'type',
          type: 'select',
          placeholder: '请选择',
          options: this.options
        }
      ]
      this.tableColumns = [
        {
          title: '矿工ID',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center'
        },
        // {
        //   title: 'IP',
        //   dataIndex: 'IP',
        //   key: 'IP',
        //   scopedSlots: { customRender: 'behavior' },
        //   tags: this.tags
        // },
        {
          title: '创建时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          align: 'center'
        },
        {
          title: 'Msg',
          dataIndex: 'Msg',
          key: 'Msg',
          align: 'center',
          width: '50%'
        },
        {
          title: '状态',
          dataIndex: 'Type',
          key: 'Type',
          align: 'center',
          scopedSlots: { customRender: 'Type' },
          tags: this.options
        }
        // {
        //   title: '操作',
        //   dataIndex: 'operate',
        //   align: 'center',
        //   key: 'operate',
        //   style: 'width:100px',
        //   scopedSlots: { customRender: 'operate' },
        //   width: '10%',
        //   buttons: [{
        //     label: '操作',
        //     emitName: 'operation',
        //     type: 'primary'
        //   }]
        // }
      ]
    },
    // 操作
    // operation (e) {
    //   console.log(e, '66+6')
    // },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      const params = this.generateParams()
      alarmlogs(params, this.clustersDefault).then((res) => {
        this.loading = false
        const result = res.data
        console.log(result, '56566566')
        if (result.code === 200) {
          this.tableData = result.data.alarm_logs
          this.pagination.total = result.data.total
          // for (let i = 0; i <= this.tableData.length; i++) {
          //   const item = this.tableData[i]
          //   console.log(item.IP)
          // }
          // this.tags = []
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 生成获取表格数据的请求参数
    generateParams() {
      console.log(this.filter, '151551515151515')
      const params = {
        size: this.pagination.pageSize,
        page: this.pagination.current
      }
      Object.assign(params, this.filter)
      return params
    },
    // // 格式化表格数据
    // formatTableData(data) {
    //   let types = ['', '挖矿收益', '首日释放25%', '180天线性释放']
    //   if (data.length > 0) {
    //     data.forEach(item => {
    //       item.type_text = types[item.type]
    //     })
    //   }
    //   return data
    // },
    // 处理表格翻页
    handleTableChange(pagination) {
      // this.selectedRowKeys = []
      // this.popupFormValue.BoxIdList = []
      // this.$set(this.popupFormValue, 'BoxIdList', [])
      const pager = { ...this.pagination }
      pager.current = pagination.pageNumber
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTableData()
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
      delete this.filter.time
      if (e.time) {
        this.filter.start_at = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_at = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.pagination.current = 1
      console.log(this.filter, '666666666')
      this.getTableData()
    }
  }
}
</script>
