<template>
  <page-header-wrapper>
    <!-- <div style="padding:20px;background-color:white;margin-bottom:20px">
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
    </div> -->
    <a-card size="small" :bordered="false">
      <!-- 表格数据过滤器 -->
      <table-filter :settings="filterSettings" @submit="filterTableData">
        <a-button type="primary" @click="restart">批量迁移</a-button>
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
          :id="'IP'"
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
          @selectChange="onSelectChange"
          @pageChange="handleTableChange"
          @operation="operation"
        />
      </div>
      <!-- 表格 结束 -->
    </a-card>
    <BaseFormPopup
      title="迁移"
      :visible="visible"
      :setting="formPopupSetting"
      :form-value="popupFormValue"
      @ok="handleOk"
      @close="handleClosePopup"
    >
      <div slot="IP" slot-scope="record">
        <!-- {{ record.record }} -->
        <a-textarea v-model="record.record.ip" placeholder="ip" :rows="4" disabled="disabled" />
      </div>
    </BaseFormPopup>
    <a-modal v-model="lookVisible" :title="lookTitle" width="60%">
      <LookInfo
        :setting="lookSetting"
        :data="lookData"
      />
      <div slot="footer">
        <a-button
          type="primary"
          @click="confirm"
        >确定</a-button>
      </div>
    </a-modal>
  </page-header-wrapper>
</template>
<script>
import { clusters, machines, alarmlogType, machinesMigration } from '@/api/login'
import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
import BaseTable from '@/components/common/baseTable.vue'
import LookInfo from '@/components/common/lookInfo.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable,
    BaseFormPopup,
    LookInfo
  },
  data() {
    return {
      // clientid: [],
      moment,
      // 表格-查询条件配置
      clustersList: [],
      clustersIdList: [],
      clustersDefault: 'c2cloud',
      options: [],
      // clustersShow: false,
      filterSettings: [],
      visible: false,

      // 表格-列
      tableColumns: [],
      // 表格-数据
      tableData: [],
      loading: false,
      // 表格-翻页
      lookTitle: '环境变量',
      lookVisible: false,
      lookSetting: [
        {
          label: 'BELLMAN_CPU_UTILIZATION',
          key: 'BELLMAN_CPU_UTILIZATION'
        },
        {
          label: 'FIL_PROOFS_C2_CPU_HS',
          key: 'FIL_PROOFS_C2_CPU_HS'
        },
        {
          label: 'FIL_PROOFS_C2_L_GPU',
          key: 'FIL_PROOFS_C2_L_GPU'
        },
        {
          label: 'FIL_PROOFS_CORES_FOR_C2',
          key: 'FIL_PROOFS_CORES_FOR_C2'
        },
        {
          label: 'FIL_PROOFS_MAXIMIZE_CACHING',
          key: 'FIL_PROOFS_MAXIMIZE_CACHING'
        },
        {
          label: 'FIL_PROOFS_P2_TREE_C_CPU_STARTS_AFTER_TREE_R',
          key: 'FIL_PROOFS_P2_TREE_C_CPU_STARTS_AFTER_TREE_R'
        },
        {
          label: 'FIL_PROOFS_PARAMETER_CACHE',
          key: 'FIL_PROOFS_PARAMETER_CACHE'
        },
        {
          label: 'FIL_PROOFS_PROGRAM_FOLDER',
          key: 'FIL_PROOFS_PROGRAM_FOLDER'
        },
        {
          label: 'FIL_PROOFS_SDR_PARENTS_CACHE_SIZE',
          key: 'FIL_PROOFS_SDR_PARENTS_CACHE_SIZE'
        },
        {
          label: 'FIL_PROOFS_USE_GPU_COLUMN_BUILDER',
          key: 'FIL_PROOFS_USE_GPU_COLUMN_BUILDER'
        },
        {
          label: 'FIL_PROOFS_USE_GPU_TREE_BUILDER',
          key: 'FIL_PROOFS_USE_GPU_TREE_BUILDER'
        },
        {
          label: 'FIL_PROOFS_USE_MULTICORE_SDR',
          key: 'FIL_PROOFS_USE_MULTICORE_SDR'
        },
        {
          label: 'IPFS_GATEWAY',
          key: 'IPFS_GATEWAY'
        },
        {
          label: 'LOTUS_STORAGE_PATH',
          key: 'LOTUS_STORAGE_PATH'
        },
        {
          label: 'MAX_FULL_SINGLE_THREAD_TASK',
          key: 'MAX_FULL_SINGLE_THREAD_TASK'
        },
        {
          label: 'MINER_SECTOR_REF_MODE',
          key: 'MINER_SECTOR_REF_MODE'
        },
        {
          label: 'MINER_SECTOR_REF_PATH',
          key: 'MINER_SECTOR_REF_PATH'
        },
        {
          label: 'NEXT_C2_INTERVAL',
          key: 'NEXT_C2_INTERVAL'
        },
        {
          label: 'RUST_LOG',
          key: 'RUST_LOG'
        },
        {
          label: 'TRUST_PARAMS',
          key: 'TRUST_PARAMS'
        },
        {
          label: 'WORKER_PATH',
          key: 'WORKER_PATH'
        },
        {
          label: 'WORKER_UNSEALED_CACHE_PATH',
          key: 'WORKER_UNSEALED_CACHE_PATH'
        }
      ],
      lookData: {},
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
        'Cluster': '杭钢',
        'From': '',
        'To': '',
        'IP': []
      },
      formPopupSetting: [

      ]
    }
  },
  created() {
    this.clusters()
    this.initTable()
    this.alarmlogType()
  },
  methods: {
    confirm() {
      this.lookVisible = false
    },
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
    setClustersIdlist() {
      const list = []
      this.clustersList.forEach(v => {
        list.push(...(v.ClientID))
      })
      list.forEach(item => {
        this.clustersIdList.push({ label: item, value: item })
      })
      // const list = this.clustersList.find((v) => {
      //   return v.Name === this.clustersDefault // return v.value ===  '9'  返回undefined
      // }).ClientID
      // list.forEach(item => {
      //   this.clustersIdList.push({ label: item, value: item })
      // })
    },
    // 列表
    clusters(value) {
      clusters().then(res => {
        this.clustersIdList = []
        const data = res.data
        if (data.code === 200) {
          this.clustersList = []
          this.clustersList = data.data.clusters
          this.clustersDefault = 'c2cloud'
          // if (value) {
          //   this.clustersDefault = value
          // } else {
          //   this.clustersDefault = 'c2cloud'
          // }

          this.setClustersIdlist()
          // const list = data.data.clusters.find((v) => {
          //   return v.Name === this.clustersDefault // return v.value ===  '9'  返回undefined
          // }).ClientID
          // list.forEach(item => {
          //   this.clustersIdList.push({ label: item, value: item })
          // })
          // this.clustersIdList.push(list)

          this.initTable()
          this.getTableData()
        }
      })
    },
    // 切换集群
    handleChange(value) {
      this.clusters(value)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.popupFormValue.IP = selectedRowKeys
      const list = []
      for (let i = 0; i < selectedRows.length; i++) {
        const item = selectedRows[i]
        list.push(item.MinerID)
      }
      const ip = this.popupFormValue.IP.toString()
      this.popupFormValue.ip = ip
      if (Array.from(new Set(list)).length > 1) {
        this.$message.error('选择的数据当前节点不一致，请筛选后再操作')
      } else {
        this.popupFormValue.From = list[0]

        return false
      }
      this.initform()
    },
    // onSelectAll (selected, selectedRows, changeRows) {
    //   if (!selected) {
    //     this.popupFormValue.BoxIdList = []
    //   }
    // },
    handleClosePopup() {
      this.visible = false
    },
    restart() {
      if (this.popupFormValue.IP.length > 0) {
        this.visible = true
      } else {
        this.$message.error('您当前没有选择任何机器')
      }
      this.initform()
      // this.$refs.boxClient.openModal()
    },
    // selectChange () {},
    handleOk(from) {
      // from.BoxIdList = this.popupFormValue.BoxIdList
      this.popupFormValue.To = from.To
      const params = {
        ...this.popupFormValue
      }
      delete params.ip
      machinesMigration(params).then(res => {
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
        // {
        //   label: 'IP',
        //   key: 'IP',
        //   type: 'input',
        //   placeholder: '请输入ip地址',
        //   style: 'width:200px'
        // },
        {
          label: '节点名称筛选',
          key: 'minerid',
          type: 'select',
          placeholder: '请选择',
          options: this.clustersIdList
        },
        // {
        //   label: '起止时间',
        //   key: 'time',
        //   type: 'daterange'
        // },
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
              label: '不可用',
              value: 0
            },
            {
              label: '可用',
              value: 1
            }
          ]
        }
      ]
      this.tableColumns = [

        // {
        //   title: 'IP',
        //   dataIndex: 'IP',
        //   key: 'IP',
        //   scopedSlots: { customRender: 'behavior' },
        //   tags: this.tags
        // },
        {
          title: 'IP',
          dataIndex: 'IP',
          key: 'IP',
          align: 'center'
        },
        // {
        //   title: 'AddPiece最大数量',
        //   dataIndex: 'AddPieceMaxSize',
        //   key: 'AddPieceMaxSize',
        //   align: 'center'
        // },
        // {
        //   title: 'AddPiece增加步长',
        //   dataIndex: 'AddPieceIncreaseSize',
        //   key: 'AddPieceIncreaseSize',
        //   align: 'center'
        // },
        // {
        //   title: 'AddPiece初始数量',
        //   dataIndex: 'AddPieceInitialSize',
        //   key: 'AddPieceInitialSize',
        //   align: 'center'
        // },
        {
          title: '最大扇区数量',
          dataIndex: 'SectorMaxSize',
          key: 'SectorMaxSize',
          align: 'center'
        },
        // {
        //   title: '存储机路径',
        //   dataIndex: 'StorePath',
        //   key: 'Storepach',
        //   align: 'center'
        // },
        {
          title: '子MinerID',
          dataIndex: 'SubMinerID',
          key: 'SubMinerID',
          align: 'center',
          width: '20%'
        },
        {
          title: '是否做AddPiece',
          dataIndex: 'CanStore',
          key: 'CanStore',
          align: 'center',
          scopedSlots: { customRender: 'CanStore' },
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
          title: '机器类型',
          dataIndex: 'Type',
          key: 'Type',
          align: 'center'
          // scopedSlots: { customRender: 'Type' },
          // tags: this.options
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          align: 'center',
          scopedSlots: { customRender: 'Status' },
          tags: [
            {
              label: '不可用',
              value: 0,
              color: '#f5222d'
            },
            {
              label: '可用',
              value: 1,
              color: '#04d919'
            }
          ]
        },
        // {
        //   title: '故障类型',
        //   dataIndex: 'FaultType',
        //   key: 'FaultType',
        //   align: 'center'
        // },
        // {
        //   title: '磁盘总空间(GiB)',
        //   dataIndex: 'DiskTotalSpace',
        //   key: 'DiskTotalSpace',
        //   align: 'center'
        // },
        // {
        //   title: '剩余磁盘空间(GiB)',
        //   dataIndex: 'DiskAvailSpace',
        //   key: 'DiskAvailSpace',
        //   align: 'center'
        // },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          key: 'operate',
          style: 'width:100px',
          scopedSlots: { customRender: 'operate' },
          width: '10%',
          buttons: [{
            label: '查看',
            emitName: 'operation',
            type: 'primary'
          }]
        }
      ]
    },
    initform() {
      this.formPopupSetting = [{
        label: '集群名称',
        key: 'Cluster',
        type: 'input',
        placeholder: '集群名称',
        disabled: true
      },
      {
        label: '当前集群',
        key: 'From',
        type: 'input',
        placeholder: '当前集群',
        disabled: true
      },
      {
        label: '目标集群',
        key: 'To',
        placeholder: '集群名称',
        type: 'select',
        options: this.clustersIdList
      },
      {
        label: 'IP地址',
        key: 'IP',
        placeholder: 'IP',
        type: 'slotName',
        slotName: 'IP'
      }]
    },
    // 操作
    operation(e) {
      this.lookVisible = true
      this.lookData = e.Env
      // this.visible = true
      // const ip = e.IP.toString()
      // this.popupFormValue.From = e.MinerID
      // this.popupFormValue.IP = [e.IP]
      // this.popupFormValue.ip = ip
      // this.initform()
    },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      const params = this.generateParams()
      params.cluster = this.clustersDefault
      machines(params, this.clustersDefault).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.machines
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
      this.popupFormValue.IP = []
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
