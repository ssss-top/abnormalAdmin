<template>
  <page-header-wrapper>
    <div style="padding:20px;background-color:white;margin-bottom:20px">
      集群名称:
      <a-select
        v-model="clustersDefault"
        style="width: 120px"
        @change="handleChange"
      >
        <a-select-option v-for="(item,index) in clustersList" :key="index" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <a-card size="small" :bordered="false">
      <!-- 表格数据过滤器 -->
      <table-filter :settings="filterSettings" @submit="filterTableData">
        <a-button type="primary" @click="restart">批量修改状态</a-button>
        <a-button type="primary" style="margin-left:20px" @click="addIssue">添加问题记录</a-button>
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
          :is-selectable="true"
          @pageChange="handleTableChange"
          @selectChange="onSelectChange"
          @onSelectAll="onSelectAll"
          @changeStatus="changeStatus"
          @changeInfo="changeInfo"
        >
          <div slot="IP" slot-scope="record">
            <span v-for="(item,index) in record.record.IP" :key="index" style="display:block">{{ item }}</span>
          </div>
        </BaseTable>
      </div>
      <!-- 表格 结束 -->
    </a-card>
    <BaseFormPopup
      title="修改硬件信息"
      :visible="visible"
      :setting="formPopupSetting"
      :form-value="popupFormValue"
      @ok="handleOk"
      @close="handleClosePopup"
      @selectChange="selectChange"
    >
      <div slot="IP" slot-scope="record">
        <!-- {{ record.record }} -->
        <a-textarea v-model="record.record.ip" :required="true" placeholder="ip" :rows="4" />
      </div>
    </BaseFormPopup>
  </page-header-wrapper>
</template>
<script>
import { clusters, hardwareIssues, setHardwareIssue, hardwareIssueType, setHardwareIssueSstatus } from '@/api/login'
import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
import BaseTable from '@/components/common/baseTable.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable,
    BaseFormPopup
  },
  data() {
    return {
      moment,
      // 表格-查询条件配置
      clustersList: [],
      clustersDefault: '--',
      options: [],
      changList: [],
      // clustersShow: false,
      filterSettings: [],
      visible: false,
      formPopupSetting: [
      //   {
      //   label: '脚本内容',
      //   key: 'ShellContent',
      //   type: 'textarea',
      //   placeholder: '要执行的脚本内容，不可为空',
      //   required: true
      // },

      ],
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
      },
      // selectedRowKeys: [],
      // rowSelection,
      popupFormValue: {
        'ID': '',
        'Cluster': '',
        'MinerID': '',
        'Type': '',
        'IP': '',
        'Content': '',
        'Username': ''
      }
    }
  },
  created() {
    this.clusters()
    this.initTable()
    this.hardwareIssueType()
  },
  methods: {
    // 类型列表
    hardwareIssueType() {
      hardwareIssueType().then(res => {
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
          this.clustersList = []
          data.data.clusters.forEach(item => {
            this.clustersList.push({ label: item.Name, value: item.Name, ClientID: item.ClientID })
          })
          // this.clustersList = data.data.clusters
          this.clustersDefault = this.clustersList[0].label
          this.getTableData()
        }
      })
    },
    handleChange(value) {
      this.clustersDefault = value
      this.getTableData()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      // this.selectedRowKeys = selectedRowKeys
      // for (let i = 0; i < selectedRows.length; i++) {
      //   const item = selectedRows[i]
      //   this.popupFormValue.BoxIdList.push(item.ID)
      // }
      this.changList = selectedRowKeys
      this.popupFormValue.BoxIdList = selectedRowKeys
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (!selected) {
        this.popupFormValue.BoxIdList = []
      }
    },
    handleClosePopup() {
      this.visible = false
    },
    restart() {
      if (this.changList.length > 0) {
        // this.visible = true
      } else {
        this.$message.error('请选择需要改变状态的硬件')
        return false
      }
      const what = this
      this.$confirm({
        title: '修改状态',
        content: '是否将状态改成已解决',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          what.setHardwareIssueSstatus()
        },
        onCancel() {
        }
      })
      // this.$refs.boxClient.openModal()
    },

    selectChange() {},
    handleOk(from) {
      // from.BoxIdList = this.popupFormValue.BoxIdList
      // const params = { ...this.popupFormValue }
      // params.ip = this.popupFormValue.ip.split(',')
      if (!Array.isArray(from.IP)) {
        from.IP = from.IP.split(',')
      }
      let url
      if (this.type === 2) {
        url = '/v1/hardware_issue'
      } else {
        url = '/v1/set_hardware_issue'
      }

      setHardwareIssue(from, url).then(res => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('执行成功')
          this.getTableData()
        } else {
          this.$message.error(result.Msg || '执行失败,请重试')
        }
        this.visible = false
      })
    },
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
          key: 'status',
          type: 'select',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未处理',
              value: 0
            },
            {
              label: '已处理',
              value: 1
            }]
        },
        {
          label: '类型',
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
        {
          title: 'IP',
          dataIndex: 'IP',
          key: 'IP',
          align: 'center',
          scopedSlots: { customRender: 'IP' },
          slotName: 'IP'
        },
        {
          title: '集群名称',
          dataIndex: 'Cluster',
          key: 'Cluster',
          align: 'center'
        },
        {
          title: '故障内容',
          dataIndex: 'Content',
          key: 'Content',
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
          title: '操作人',
          dataIndex: 'Username',
          key: 'Username',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          scopedSlots: { customRender: 'Status' },
          tags: [
            {
              label: '未处理',
              value: 0,
              color: '#f5222d'
            },
            {
              label: '已处理',
              value: 1,
              color: '#04d919'
            }
          ]
        },
        {
          title: '类型',
          dataIndex: 'Type',
          key: 'Type',
          align: 'center',
          scopedSlots: { customRender: 'Type' },
          tags: this.options
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          key: 'operate',
          style: 'width:100px',
          scopedSlots: { customRender: 'operate' },
          width: '10%',
          buttons: [
            {
              label: '修改状态',
              emitName: 'changeStatus',
              type: 'primary',
              key: 'Status',
              val: 1
            },
            {
              label: '修改信息',
              emitName: 'changeInfo',
              type: 'primary'
            }]
        }
      ]
    },

    // 修改状态
    changeStatus(e) {
      const what = this
      this.changList = []
      // if(e.Status===0){

      // }
      this.$confirm({
        title: '修改状态',
        content: '是否将状态改成已解决',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          what.changList.push(e.ID)
          what.setHardwareIssueSstatus()
        },
        onCancel() {
        }
      })
    },
    setHardwareIssueSstatus() {
      const params = {
        ID: this.changList,
        Status: 1
      }
      setHardwareIssueSstatus(params).then(res => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('执行成功')
          this.getTableData()
        } else {
          this.$message.error(result.msg || '执行失败,请重试')
        }
      })
    },
    // 添加信息
    addIssue() {
      this.visible = true
      this.type = 2
      this.popupFormValue = {
        'ID': '',
        'Cluster': '',
        'MinerID': '',
        'Type': '',
        'IP': '',
        'Content': '',
        'Username': ''
      }
      this.formPopupSetting = [
        {
          label: 'IP',
          key: 'IP',
          type: 'textarea',
          // slotName: 'IP',
          placeholder: '请输入IP多个用逗号隔开',
          required: true
        },
        {
          label: '矿工ID',
          key: 'MinerID',
          type: 'input',
          placeholder: '矿工ID',
          required: true
        },
        {
          label: '集群名称',
          key: 'Cluster',
          type: 'select',
          placeholder: '请选择集群名称',
          options: this.clustersList,
          required: true
        },
        {
          label: '类型',
          key: 'Type',
          type: 'select',
          placeholder: '请选择类型',
          options: this.options,
          required: true
        },
        {
          label: '故障内容',
          key: 'Content',
          type: 'input',
          placeholder: '请输入故障内容',
          required: true
        },
        {
          label: '操作人',
          key: 'Username',
          placeholder: '请输入操作人',
          type: 'input'
        }
      ]
    },
    // 修改信息
    changeInfo(e) {
      this.settingsinit()
      this.visible = true
      const ip = e.IP.toString()
      this.popupFormValue = e
      this.popupFormValue.ip = ip
    },
    settingsinit() {
      this.formPopupSetting = [
        {
          label: 'IP',
          key: 'IP',
          placeholder: 'IP',
          type: 'slotName',
          slotName: 'IP'
        },
        {
          label: 'ID',
          key: 'ID',
          type: 'input',
          placeholder: 'ID',
          disabled: true
        },
        {
          label: '矿工ID',
          key: 'MinerID',
          type: 'input',
          disabled: true,
          placeholder: '矿工ID'
        },
        {
          label: '集群名称',
          key: 'Cluster',
          type: 'input',
          disabled: true,
          placeholder: '集群名称'
        },
        {
          label: '状态',
          key: 'Status',
          type: 'select',
          disabled: true,
          options: [
            {
              label: '未处理',
              value: 0
            },
            {
              label: '已处理',
              value: 1
            }
          ]
        },
        {
          label: '类型',
          key: 'Type',
          type: 'select',
          options: this.options
        },
        {
          label: '故障内容',
          key: 'Content',
          type: 'input',
          required: true
        },
        {
          label: '操作人',
          key: 'Username',
          type: 'input'
          // disabled: true
        }
      ]
    },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      const params = this.generateParams()
      hardwareIssues(params, this.clustersDefault).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.hardware_issues
          this.pagination.total = result.data.total
          // for (let i = 0; i <= this.tableData.length; i++) {
          //   const item = this.tableData[i]
          // }
          // this.tags = []
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 生成获取表格数据的请求参数
    generateParams() {
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
      this.$refs.table.selectedRowKeys = []
      this.changList = []
      this.filter = { ...e }
      // 时间范围需要特殊处理
      delete this.filter.time
      if (e.time) {
        this.filter.start_at = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_at = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.pagination.current = 1
      this.getTableData()
    }
  }
}
</script>
