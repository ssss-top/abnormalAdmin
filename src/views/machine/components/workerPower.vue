<template>
  <!-- 表格数据过滤器 -->

  <div class="tables">
    <table-filter v-if="visibleFilter" style=" margin-bottom: 8px" :settings="filterSettings" @submit="filterTableData" />
    <!-- 表格 开始 -->
    <BaseTable
      :id="'Number'"
      ref="tableMain"
      :columns="tableColumns"
      :data="tableData"
      class="page-base-table"
      :fixed-width="true"
      :loading="loading"
      :current="page.page"
      :page-size="page.size"
      :item-total="page.total"
      :if-hide-pagination="pagination"
      @pageChange="workerListChange"
      @tableChange="tableChange"
      @operateDetial="operateDetial"
      @signError="signError"
    >
      <span slot="text" slot-scope="record" :class="record.record.IsCurrent === true ? 'red' : ''">{{ record.text }}</span>
      <span slot="IP" slot-scope="record" style="text-decoration: underline; cursor: pointer" @click="showIp(record)">{{
        record.text
      }}</span>
      <!-- slotName: 'toFixed' -->
      <span slot="toFixed" slot-scope="record">{{ record.text?Number(record.text).toFixed(2):'0' }}</span>
    </BaseTable>
    <a-modal v-model="visible" title="错误扇区列表" ok-text="确认" cancel-text="关闭" width="50%" :footer="null">
      <p>
        <a-button type="primary" @click="restart">重试</a-button>
        <a-button type="primary" style="margin-left: 20px" @click="remove">删除</a-button>
        <!-- <a-button type="primary" style="margin-left:20px" @click="getScript">获取脚本</a-button> -->
        <a-button type="primary" style="margin-left: 20px" @click="lookFail">查看失败扇区</a-button>
        <a-button type="primary" style="margin-left: 20px" @click="lookFail('All')">查看全部</a-button>
      </p>

      <!-- <table-filter :settings="modalFilterSettings" @submit="modalFilterTableData" /> -->
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <BaseTable
          :id="'Number'"
          ref="modelTable"
          :columns="modalTableColumns"
          :data="modalTableData"
          class="page-base-table"
          :fixed-width="true"
          :loading="loading1"
          :is-selectable="true"
          :if-hide-pagination="true"
          :scroll="{ type: 1 }"
          @selectChange="onSelectChange"
          @tableChange="modalTableChange"
        >
          <span slot="text" slot-scope="record" :class="record.record.IsCurrent === true ? 'red' : ''">{{ record.text }}</span>
        </BaseTable>
      </div>
    </a-modal>

    <a-modal v-model="lookVisible" :title="lookTitle" width="30%">
      <LookInfo :setting="lookSetting" :data="machineDetails" />
      <div slot="footer">
        <a-button type="primary" @click="confirm">确定</a-button>
      </div>
    </a-modal>
    <!-- 表格 结束 -->
    <BaseFormPopup
      title="增加硬件故障信息"
      :visible="visibleSet"
      :setting="formPopupSetting"
      :form-value="popupFormValue"
      @ok="handleOk"
      @close="handleClosePopup"
    >
      <div slot="IP" slot-scope="record">
        <!-- {{ record.record }} -->
        <a-textarea v-model="record.record.ip" :required="true" placeholder="ip" :rows="4" />
      </div>
    </BaseFormPopup>
  </div>

</template>
<script>
import {
  workerPower,
  workerSectors,
  machineIp,
  setHardwareIssue,
  hardwareIssueType,
  sectorsCommands,
  workerPowerTypes
} from '@/api/api'

import BaseTable from '@/components/common/baseTable.vue'
import LookInfo from '@/components/common/lookInfo.vue'
import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable,
    LookInfo,
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
      workerPowerList: [],
      modalTableColumns: [],
      lookVisible: false,
      lookTitle: 'IP详情',
      machineDetails: {},
      modalTableData: [],
      loading1: false,
      filterSettings: [],
      visible: false,
      visibleSet: false,
      visibleSet2: false,
      visibleFilter: false,
      filter: {},
      moment,
      sectorSize: '',
      pagination: false,
      tableColumns: [],
      tableData: [],
      loading: false,
      // minerid: '',
      mode: '0',
      ooption: [],
      machineCount: {},
      sectorState: {},
      taskCostsList: [],
      taskCostsSearch: {},
      sectorsCountList: [],
      sectorsCountSearch: {},
      options: [],
      sort: {
        sort_field: '',
        sort_order: ''
      },
      modalSort: {
        sort_field: '',
        sort_order: ''
      },
      page: {
        page: 1,
        size: 10,
        total: 10
      },
      removeCmd: [],
      retryCmd: [],
      lookSetting: [
        {
          label: 'IP',
          key: 'IP'
        },
        {
          label: 'Type',
          key: 'Type'
        },
        {
          label: 'GroupID',
          key: 'GroupID'
        },
        {
          label: 'C2GroupID',
          key: 'C2GroupID'
        },
        {
          label: 'AddPieceMaxSize',
          key: 'AddPieceMaxSize'
        },
        {
          label: 'SectorMaxSize',
          key: 'SectorMaxSize'
        },
        {
          label: 'P2MaxSize',
          key: 'P2MaxSize'
        },
        {
          label: 'C2MaxSize',
          key: 'C2MaxSize'
        },
        {
          label: 'Status',
          key: 'Status'
        }
      ],
      formPopupSetting: [],

      popupFormValue: {
        ID: '',
        Cluster: '',
        MinerID: '',
        Type: '',
        IP: '',
        Company: '',
        Username: ''
      }
      // popupFormValue2: {
      //   minerid: '',
      //   numbers: '',
      //   storeIps: '',
      //   workerIp: ''
      // }
    }
  },
  // computed: {
  //   onQuery: function() {
  //     return this.$route.query.minerid
  //   }
  // },
  // watch: {
  //   'onQuery'(old, newValue) {
  //     if (newValue) {
  //       this.minerid = this.$route.query.minerid
  //       console.log(this.minerid, '12212122')
  //       if (this.minerid) {
  //         this.init()
  //       }
  //     }
  //   }
  // },
  created() {
    // this.init()
    this.workerPowerTypes()
    this.hardwareIssueType()
    // if (this.minerid) {
    //   this.workerPower()
    // }
  },
  methods: {
    // init() {
    //   // this.minerid = this.$route.query.minerid
    //   if (!this.minerid) {
    //     this.$router.push('/minerList')
    //     return false
    //   }
    //   this.workerPower()
    // },
    // 表格配置
    initTable() {
      // this.sectorsList = []
      this.visibleFilter = true

      this.filterSettings = [
        {
          label: 'IP',
          key: 'IP',
          type: 'input',
          placeholder: 'IP',
          style: 'width:200px'
        },

        {
          label: '算力类型',
          key: 'type',
          type: 'select',
          placeholder: '请选择',
          options: this.workerPowerList
        },
        {
          label: '是否密封',
          key: 'status',
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
          title: 'IP',
          dataIndex: 'IP',
          key: 'IP',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'IP' },
          slotName: 'IP'
        },
        {
          title: '期望算力',
          dataIndex: 'ExpectedPower',
          key: 'ExpectedPower',
          align: 'center'
        },
        {
          title: '增长算力(24h)',
          dataIndex: 'PowerLastDay',
          key: 'PowerLastDay',
          align: 'center',
          sorter: true
          // scopedSlots: { customRender: 'PowerLastDay' }
        },
        {
          title: 'P1时长',
          dataIndex: 'P1Cost',
          key: 'P1Cost',
          align: 'center',
          sorter: true
        },
        {
          title: 'P2时长',
          dataIndex: 'P2Cost',
          key: 'P2Cost',
          align: 'center',
          sorter: true
        },
        {
          title: 'C2时长',
          dataIndex: 'C2Cost',
          key: 'C2Cost',
          align: 'center',
          sorter: true
        },
        {
          title: 'P1数量(24h)',
          dataIndex: 'P1Count',
          key: 'P1Count',
          align: 'center'
        },
        {
          title: 'P2数量(24h)',
          dataIndex: 'P2Count',
          key: 'P2Count',
          align: 'center'
        },
        {
          title: 'C2数量(24h)',
          dataIndex: 'C2Count',
          key: 'C2Count',
          align: 'center'
        },
        {
          title: '未迁移数',
          dataIndex: 'UnmigratedCount',
          key: 'UnmigratedCount',
          align: 'center',
          sorter: true
        },
        {
          title: '是否密封',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          scopedSlots: { customRender: 'Status' },
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
          width: '13%',
          scopedSlots: { customRender: 'operate' },
          buttons: [
            {
              label: '详情',
              emitName: 'operateDetial',
              type: 'primary'
            },
            {
              label: '标记故障',
              emitName: 'signError',
              type: 'primary',
              key: 'Sealing',
              val: 0
            }
          ]
        }
      ]
      this.modalTableColumns = [
        {
          title: 'IP',
          dataIndex: 'IP',
          key: 'MinerID',
          align: 'center',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          sorter: true
        },
        {
          title: '扇区号',
          dataIndex: 'Number',
          key: 'Number',
          align: 'center',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          align: 'center',
          type: 'formatTime',
          sorter: true,
          scopedSlots: { customRender: 'CreatedAt' }
        }
      ]
      this.formPopupSetting = [
        {
          label: 'IP',
          key: 'IP',
          type: 'textarea',
          // slotName: 'IP',
          placeholder: '请输入IP多个用逗号隔开',
          required: true,
          disabled: true
        },
        {
          label: '矿工ID',
          key: 'MinerID',
          type: 'input',
          placeholder: '矿工ID',
          required: true,
          disabled: true
        },
        {
          label: '集群名称',
          key: 'Company',
          type: 'select',
          placeholder: '请选择集群名称',
          disabled: true
          // options: this.clustersList,
          // required: true
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
    addRecover() {
      this.visibleSet2 = true
      // this.popupFormValue2.minerid = this.minerid
    },

    // 算力列表类型
    workerPowerTypes() {
      this.workerPowerList = []
      workerPowerTypes().then((res) => {
        const result = res.data
        if (result.code === 200) {
          // let list = []
          const data = result.data.type
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            this.workerPowerList.push({ label: item.Name, value: item.Type })
          }
          // this.clustersDefault = this.clustersList[0].label
        }
        this.workerPower()
      })
    },

    // 类型列表
    hardwareIssueType() {
      hardwareIssueType().then((res) => {
        const result = res.data
        if (result.code === 200) {
          // let list = []
          const data = result.data.type
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            this.options.push({ label: item.Name, value: item.Type })
          }
          // this.clustersDefault = this.clustersList[0].label
        }
      })
    },
    confirm() {
      this.lookVisible = false
    },
    // 查看失败的扇区
    lookFail(type) {
      this.sectorsList = []
      this.$refs.modelTable.selectedRowKeys = []
      if (type === 'All') {
        this.failed = ''
      } else {
        this.failed = 'failed'
      }
      this.getModalTableData()
    },
    signError(e) {
      this.visibleSet = true
      this.popupFormValue = e
    },

    // 修改
    handleClosePopup() {
      this.visibleSet = false
    },
    handleOk(from) {
      // from.BoxIdList = this.popupFormValue.BoxIdList
      // const params = { ...this.popupFormValue }
      // params.ip = this.popupFormValue.ip.split(',')
      if (!Array.isArray(from.IP)) {
        from.IP = from.IP.split(',')
      }
      from.Cluster = from.Company
      const url = '/v1/hardware_issue'
      setHardwareIssue(from, url).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.$message.success('修改成功')
          this.workerPower()
        } else {
          this.$message.error(result.Msg || '执行失败,请重试')
        }
        this.visible = false
      })
    },
    // 重试remove
    restart() {
      this.getScript('restart')
    },
    // 获取脚本
    getScript(type) {
      // sectorsList
      sectorsCommands({ MinerID: this.minerid, Number: this.sectorsList }).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.retryCmd = result.data.retry_cmd
          this.removeCmd = result.data.remove_cmd
          if ((type === 'restart' && this.retryCmd) || (type === 'remove' && this.removeCmd)) {
            this.$success({
              title: '脚本内容',
              width: '30%',
              content: () => {
                return (
                  <div style={{ fontSize: '14px' }}>
                    {type === 'restart'
                      ? this.retryCmd.map((item) => {
                        return <div>{item}</div>
                      })
                      : this.removeCmd.map((item) => {
                        return <div>{item}</div>
                      })}
                  </div>
                )
              }
            })
          } else {
            this.$error({
              title: '错误信息',
              content: '没有找到可执行的脚本'
            })
          }
        }
      })
    },
    // 删除
    remove() {
      this.getScript('remove')
    },
    // 显示ip详情
    showIp(value) {
      const params = {
        ip: value.record.IP,
        minerid: this.minerid
      }
      machineIp(params).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.machineDetails = result.data.machine
          this.lookVisible = true
        }
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
      this.workerPower()
    },
    // 排序
    modalTableChange(sorter) {
      if (sorter.order === 'descend') {
        this.modalSort.sort_order = 'Desc'
      } else if (sorter.order === 'ascend') {
        this.modalSort.sort_order = 'Asc'
      } else {
        this.modalSort.sort_order = ''
      }
      this.modalSort.sort_field = sorter.field
      this.getModalTableData()
    },
    // 选择
    onSelectChange(selectedRowKeys, selectedRows) {
      this.sectorsList = selectedRows
      // this.changList = selectedRowKeys
      // this.popupFormValue.BoxIdList = selectedRowKeys
    },
    // 获取表格数据
    getModalTableData(ip) {
      if (ip) {
        this.ip = ip
      }
      if (this.loading === true) return
      this.loading1 = true
      const params = {
        ip: this.ip,
        minerid: this.minerid,
        filter: this.failed
      }
      params.sort_field = this.modalSort.sort_field
      params.sort_order = this.modalSort.sort_order
      workerSectors(params).then((res) => {
        this.loading1 = false
        const result = res.data
        if (result.code === 200) {
          this.modalTableData = result.data.sectors
          this.removeCmd = result.data.remove_cmd
          this.retryCmd = result.data.retry_cmd
        } else {
          this.$message.error(result.msg)
        }
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
      this.workerPower()
    },
    // 查看详情workerSectors
    operateDetial(value) {
      this.visible = true
      this.getModalTableData(value.IP)
      // this.$router.push(`/workerSectors?IP=${value.IP}&minerid=${this.minerid}`)
    },

    // 处理表格翻页
    workerListChange(pagination) {
      this.page.page = pagination.pageNumber
      this.page.size = pagination.pageSize
      this.workerPower()
    },

    // 机器算力列表
    workerPower() {
      if (this.loading === true) return
      this.loading = true
      let params = {}
      params = {
        ...this.generateParams(),
        ...this.filter
      }
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      this.pagination = false
      workerPower(params).then((res) => {
        this.initTable()
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.worker_tasks
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
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
