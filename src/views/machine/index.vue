<template>
  <page-header-wrapper>
    <!-- 表格数据过滤器 -->
    <div class="card-list">
      <a-card title="矿机数量" style="min-width: 100%">
        <p>
          矿工ID：{{ minerid }}
          <a-tag color="blue" style="margin-left: 10px"> {{ sectorSize }}G </a-tag>
        </p>
        <span v-for="(item, key) of machineCount" :key="key" style="margin-right: 20px"> {{ key }}：{{ item }} </span>
        <p style="margin-top: 10px">迁移任务统计</p>
        <span v-for="item of MigrationCountSetting" :key="item.key" style="margin-right: 20px"> {{ item.label }}：{{ MigrationCount[item.key] }} </span>
        <p style="margin-top: 10px">存储机统计</p>
        <span v-for="item of StoreMachineSetting" :key="item.key" style="margin-right: 20px"> {{ item.label }}：{{ StoreMachineCount[item.key] }} </span>
      </a-card>
      <!-- <a-card title="Default size card" style="min-width: 48%">
        <p />
      </a-card> -->
      <a-card title="任务数量" style="min-width: 48%; margin-top: 20px">
        <!-- <a slot="extra" href="#">more</a> -->
        <a-range-picker slot="extra" @change="sectorsCountCheckout" />
        <div class="node-chart">
          <Chart id="echartNum" ref="chart_line_one" />
        </div>
      </a-card>
      <a-card title="任务时长" style="min-width: 48%; margin-top: 20px">
        <a-range-picker slot="extra" @change="taskCostscheckout" />
        <div class="node-chart">
          <Chart id="echart" ref="chart_line_tow" />
        </div>
      </a-card>
      <a-card title="节点详情" style="min-width: 100%; margin-top: 20px">
        <div class="node-detail">
          <p v-for="(item, index) in sectorState" :key="index" class="detail-item">{{ item }}</p>
        </div>
      </a-card>
    </div>

    <a-card size="small" :bordered="false">
      <!-- <table-filter :settings="filterSettings" @submit="filterTableData" /> -->

      <div style="margin-top: 20px">
        <div>
          <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }" @change="listChange">
            <a-radio-button value="0"> 机器算力 </a-radio-button>
            <a-radio-button value="1"> 任务列表 </a-radio-button>
            <a-radio-button value="2"> Deadline </a-radio-button>
            <a-radio-button value="3"> 扇区列表 </a-radio-button>
            <a-radio-button value="4"> 迁移任务 </a-radio-button>
            <a-radio-button value="5"> 存储机列表 </a-radio-button>
          </a-radio-group>

          <table-filter v-if="visibleFilter" style="float: right; margin-bottom: 8px" :settings="filterSettings" @submit="filterTableData">
            <div v-if="mode === '3'">
              <a-button type="primary" @click="restart">重试</a-button>
              <a-button type="primary" style="margin-left: 20px" @click="remove">删除</a-button>
            </div>
          </table-filter>
        </div>
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
          :is-selectable="isSelectable()"
          @pageChange="workerListChange"
          @tableChange="tableChange"
          @selectChange="sectionSelectChange"
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
      </div>
    </a-card>
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
  </page-header-wrapper>
</template>
<script>
import {
  wdpostDeadlines,
  workerList,
  sectorsState,
  sectorsCount,
  taskCosts,
  workerPower,
  workerSectors,
  machineIp,
  setHardwareIssue,
  hardwareIssueType,
  sectorsCommands,
  minerSectors,
  minerSectorsTypes,
  migrateOverview,
  workerPowerTypes,
  migrateTasks,
  storeMachines
} from '@/api/login'
import Chart from '@/components/common/chart.vue'
import BaseTable from '@/components/common/baseTable.vue'
import LookInfo from '@/components/common/lookInfo.vue'
import BaseFormPopup from '@/components/common/BaseFormPopup.vue'
import * as moment from 'moment'
export default {
  components: {
    // Pagination
    BaseTable,
    Chart,
    LookInfo,
    BaseFormPopup
  },
  data() {
    return {
      MigrationCount: '',
      StoreMachineCount: '',
      minerSectorsList: [],
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
      visibleFilter: false,
      filter: {},
      moment,
      sectorSize: '',
      pagination: false,
      tableColumns: [],
      tableData: [],
      loading: false,
      minerid: '',
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
      StoreMachineSetting: [
        {
          label: '机器数量',
          key: 'MachineTotal'
        },
        {
          label: '存满数量',
          key: 'MachineFilled'
        },
        {
          label: '未满数量',
          key: 'MachineUnfilled'
        },
        {
          label: '启用数量',
          key: 'MachineEnabled'
        },
        {
          label: '停用数量',
          key: 'MachineDisabled'
        },
        {
          label: '扇区容量',
          key: 'MaxSectors'
        },
        {
          label: '已存扇区',
          key: 'StoredSectors'
        },
        {
          label: '剩余容量',
          key: 'RemainSectors'
        }
      ],
      MigrationCountSetting: [
        {
          label: '待迁移数量',
          key: 'WaitingTotal'
        },
        {
          label: '迁移中数量',
          key: 'MigratingTotal'
        },
        {
          label: '已迁移数量',
          key: 'MigratedTotal'
        },
        {
          label: '最大耗时',
          key: 'MigratedCostMax'
        },
        {
          label: '最小耗时',
          key: 'MigratedCostMin'
        },
        {
          label: '平均耗时',
          key: 'MigratedCostAvg'
        }

      ],
      clustersDefault: '',
      formPopupSetting: [],
      modalFilterSettings: [
        {
          label: 'IP',
          key: 'IP',
          type: 'input',
          placeholder: 'IP',
          style: 'width:200px'
        }
      ],
      popupFormValue: {
        ID: '',
        Cluster: '',
        MinerID: '',
        Type: '',
        IP: '',
        Company: '',
        Username: ''
      }
    }
  },
  created() {
    this.minerid = this.$route.query.minerid
    if (!this.minerid) {
      this.$router.push('/minerList')
      return false
    }
    this.workerPowerTypes()
    this.minerSectorsTypes()
    this.initTable()
    this.listChange()
    this.sectorsState()
    this.sectorsCount()
    this.taskCosts()
    this.workerPower()
    this.hardwareIssueType()
    this.migrateOverview()
  },
  methods: {
    isSelectable() {
      return this.mode === '3' ? true : null
    },
    // 表格配置
    initTable() {
      // this.sectorsList = []
      this.visibleFilter = true
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
      this.filterSettings = [
        {
          label: 'IP',
          key: 'IP',
          type: 'input',
          placeholder: 'IP',
          style: 'width:100px'
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
      if (this.mode === '1') {
        this.tableColumns = [
          {
            title: 'IP',
            dataIndex: 'IP',
            key: 'IP',
            align: 'center',
            width: '8%',
            sorter: true,
            scopedSlots: { customRender: 'IP' },
            slotName: 'IP'
          },
          {
            title: 'P1Failed',
            dataIndex: 'SealPreCommit1Failed',
            key: 'SealPreCommit1Failed',
            align: 'center',
            sorter: true
          },
          {
            title: 'P2Failed',
            dataIndex: 'SealPreCommit2Failed',
            key: 'SealPreCommit2Failed',
            align: 'center',
            sorter: true
          },

          {
            title: 'C1Failed',
            dataIndex: 'Committing1Failed',
            key: 'Committing1Failed',
            align: 'center',
            sorter: true
          },
          {
            title: 'C2Failed',
            dataIndex: 'Committing2Failed',
            key: 'Committing2Failed',
            align: 'center',
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
                value: 0,
                color: '#f5222d'
              },
              {
                label: '是',
                value: 1,
                color: '#04d919'
              }
            ]
          },
          {
            title: '操作',
            dataIndex: 'operate',
            align: 'center',
            key: 'operate',

            scopedSlots: { customRender: 'operate' },
            buttons: [
              {
                label: '详情',
                emitName: 'operateDetial',
                type: 'primary'
              }
            ]
          }
        ]
      } else if (this.mode === '2') {
        this.visibleFilter = false
        this.tableColumns = [
          {
            title: '矿工号',
            dataIndex: 'MinerID',
            key: 'MinerID',
            align: 'center',
            scopedSlots: { customRender: 'MinerID' },
            slotName: 'text'
          },
          {
            title: 'Deadline',
            dataIndex: 'Index',
            key: 'Index',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'Index' }
          },
          {
            title: 'AllPartitions',
            dataIndex: 'AllPartitions',
            key: 'AllPartitions',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'AllPartitions' }
          },
          {
            title: 'ProvenPartitions',
            dataIndex: 'ProvenPartitions',
            key: 'ProvenPartitions',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'ProvenPartitions' }
          },
          {
            title: 'AllSectors',
            dataIndex: 'AllSectors',
            key: 'AllSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'AllSectors' }
          },
          {
            title: 'FaultySectors',
            dataIndex: 'FaultySectors',
            key: 'FaultySectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'FaultySectors' }
          },
          {
            title: 'RecoveringSectors',
            dataIndex: 'RecoveringSectors',
            key: 'RecoveringSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'RecoveringSectors' }
          },
          {
            title: 'LiveSectors',
            dataIndex: 'LiveSectors',
            key: 'LiveSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'LiveSectors' }
          },
          {
            title: 'ActiveSectors',
            dataIndex: 'ActiveSectors',
            key: 'ActiveSectors',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'ActiveSectors' }
          },
          {
            title: 'OpenEpoch',
            dataIndex: 'OpenEpoch',
            key: 'OpenEpoch',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'OpenEpoch' }
          },
          {
            title: 'CloseEpoch',
            dataIndex: 'CloseEpoch',
            key: 'CloseEpoch',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'CloseEpoch' }
          },
          {
            title: 'ChallengeEpoch',
            dataIndex: 'ChallengeEpoch',
            key: 'ChallengeEpoch',
            align: 'center',
            slotName: 'text',
            scopedSlots: { customRender: 'ChallengeEpoch' }
          }
        ]
      } else if (this.mode === '0') {
        this.filterSettings = [
          {
            label: 'IP',
            key: 'IP',
            type: 'input',
            placeholder: 'IP',
            style: 'width:100px'
          },

          {
            label: '算力类型',
            key: 'sealing',
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
      } else if (this.mode === '3') {
        this.filterSettings = [
          {
            label: 'IP',
            key: 'IP',
            type: 'input',
            placeholder: 'IP',
            style: 'width:100px'
          },
          {
            label: '扇区号',
            key: 'number',
            type: 'input',
            placeholder: '扇区号',
            style: 'width:100px'
          },
          {
            label: '状态',
            key: 'type',
            type: 'select',
            placeholder: '请选择',
            style: 'width:220px',
            options: this.minerSectorsList
          }
        ]
        this.tableColumns = [
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
            title: 'C2WorkerIP',
            dataIndex: 'C2WorkerIP',
            key: 'C2WorkerIP',
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
          // {
          //   title: '操作',
          //   dataIndex: 'operate',
          //   align: 'center',
          //   key: 'operate',
          //   width: '10%',
          //   scopedSlots: { customRender: 'operate' },
          //   buttons: [
          //     {
          //       label: '重试',
          //       emitName: 'restart',
          //       type: 'primary'
          //     },
          //     {
          //       label: '删除',
          //       emitName: 'remove',
          //       type: 'primary'
          //     }
          //   ]
          // }
        ]
      } else if (this.mode === '4') {
        this.filterSettings = [
          {
            label: '扇区号',
            key: 'number',
            type: 'input',
            placeholder: '扇区号',
            style: 'width:100px'
          },
          {
            label: '扇区号',
            key: 'FromIp',
            type: 'input',
            placeholder: 'FromIp',
            style: 'width:100px'
          },
          {
            label: '状态',
            key: 'status',
            type: 'select',

            placeholder: '状态',
            style: 'width:100px',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '未迁移',
                value: 'Wait'
              },
              {
                label: '迁移中',
                value: 'Migrating'
              },
              {
                label: '已迁移',
                value: 'Migrated'
              }
            ]
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
            title: '扇区号',
            dataIndex: 'Number',
            key: 'Number',
            align: 'center'
          },
          {
            title: 'FromIP',
            dataIndex: 'FromIP',
            key: 'FromIP',
            align: 'center',
            sorter: true
          },
          {
            title: 'FromPath',
            dataIndex: 'FromPath',
            key: 'FromPath',
            align: 'center'
          },

          {
            title: 'StoreIP',
            dataIndex: 'StoreIP',
            key: 'StoreIP',
            align: 'center',
            sorter: true
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
                label: '未迁移',
                value: 'Wait',
                color: '#f5222d'
              },
              {
                label: '迁移中',
                value: 'Migrating',
                color: ''
              },
              {
                label: '已迁移',
                value: 'Migrated',
                color: '#04d919'
              }
            ]
          },
          {
            title: 'FtpStatus',
            dataIndex: 'FtpStatus',
            key: 'FtpStatus',
            align: 'center'
          },
          {
            title: '失败',
            dataIndex: 'FailureCount',
            key: 'FailureCount',
            align: 'center'
          },
          {
            title: '总耗时',
            dataIndex: 'ElapsedTime',
            key: 'ElapsedTime',
            align: 'center'
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
        ]
      } else if (this.mode === '5') {
        this.filterSettings = [
          {
            label: '存储IP',
            key: 'storeip',
            type: 'input',
            sorter: true,
            placeholder: '存储IP',
            style: 'width:100px'
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
                value: 1,
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
          },
          {
            title: '迁移最大耗时(min)',
            dataIndex: 'MigrateCostMax',
            key: 'MigrateCostMax',
            align: 'center',
            scopedSlots: { customRender: 'MigrateCostMax' },
            slotName: 'toFixed'
          },
          {
            title: '迁移最小耗时(min)',
            dataIndex: 'MigrateCostMin',
            key: 'MigrateCostMin',
            align: 'center',
            scopedSlots: { customRender: 'MigrateCostMin' },
            slotName: 'toFixed'
          },
          {
            title: '迁移平均耗时(min)',
            dataIndex: 'MigrateCostAvg',
            key: 'MigrateCostAvg',
            align: 'center',
            scopedSlots: { customRender: 'MigrateCostAvg' },
            slotName: 'toFixed'
          },
          {
            title: '已迁移数量',
            dataIndex: 'MigratedCount',
            key: 'MigratedCount',
            align: 'center'
          },
          {
            title: '迁移中数量',
            dataIndex: 'MigratingCount',
            key: 'MigratingCount',
            align: 'center'
          }
        ]
      }
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
          console.log(this.workerPowerList, '111111111111111111111')
          // this.clustersDefault = this.clustersList[0].label
        }
      })
    },
    // 迁移统计概览
    migrateOverview() {
      migrateOverview({ minerid: this.minerid }).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.MigrationCount = result.data.MigrationCount
          this.StoreMachineCount = result.data.StoreMachineCount
        }
      })
    },
    // 获取扇区列表类型
    minerSectorsTypes() {
      this.minerSectorsList = []
      minerSectorsTypes().then((res) => {
        const result = res.data
        if (result.code === 200) {
          // let list = []
          const data = result.data.type
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            this.minerSectorsList.push({ label: item.Name, value: item.Type })
          }
          // this.clustersDefault = this.clustersList[0].label
        }
      })
    },
    modalFilterTableData(e) {
      this.modalFilter = { ...e }

      // this.
      // if (this.mode === '0') {
      //   this.workerPower()
      // } else if (this.mode === '1') {
      //   this.workerList()
      // }
    },
    // 表格选择
    sectionSelectChange(selectedRowKeys, selectedRows) {
      this.sectorsList = selectedRows
      // this.changList = selectedRowKeys
      // this.popupFormValue.BoxIdList = selectedRowKeys
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.sectorsList = selectedRows
      // this.changList = selectedRowKeys
      // this.popupFormValue.BoxIdList = selectedRowKeys
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
      sectorsCommands({ Sectors: this.sectorsList }).then((res) => {
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
      if (this.mode === '0') {
        this.workerPower()
      } else if (this.mode === '1') {
        this.workerList()
      } else if (this.mode === '3') {
        this.sectorsList = []
        this.$refs.tableMain.selectedRowKeys = []
        this.minerSectors()
      } else if (this.mode === '4') {
        this.migrateTasks()
      } else if (this.mode === '5') {
        this.storeMachines()
      }
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
      if (this.mode === '0') {
        this.workerPower()
      } else if (this.mode === '1') {
        this.workerList()
      } else if (this.mode === '3') {
        this.minerSectors()
      } else if (this.mode === '4') {
        this.migrateTasks()
      } else if (this.mode === '5') {
        this.storeMachines()
      }
    },
    // 查看详情workerSectors
    operateDetial(value) {
      this.visible = true
      this.getModalTableData(value.IP)
      // this.$router.push(`/workerSectors?IP=${value.IP}&minerid=${this.minerid}`)
    },
    // 任务数量搜索
    sectorsCountCheckout(e) {
      const fromatStr = 'YYYY-MM-DD HH:mm:ss'
      const startTime = this.moment(e[0]).format(fromatStr)
      const endTime = this.moment(e[1]).format(fromatStr)
      if (new Date(endTime).getMonth() - new Date(startTime).getMonth() > 2) {
        this.$message.error('筛选月份间隔不得超过两个月')
        return false
      }
      this.sectorsCountSearch = {
        start_time: startTime,
        end_time: endTime
      }
      this.sectorsCount()
    },
    // 任务时长搜索
    taskCostscheckout(e) {
      const fromatStr = 'YYYY-MM-DD HH:mm:ss'
      const startTime = this.moment(e[0]).format(fromatStr)
      const endTime = this.moment(e[1]).format(fromatStr)
      if (new Date(endTime).getMonth() - new Date(startTime).getMonth() > 2) {
        this.$message.error('筛选月份间隔不得超过两个月')
        return false
      }
      this.taskCostsSearch = {
        start_time: startTime,
        end_time: endTime
      }
      this.taskCosts()
    },
    // 获取每天完成的任务数量
    sectorsCount() {
      this.sectorsCountList = []
      const params = {
        minerid: this.minerid,
        ...this.sectorsCountSearch
      }
      sectorsCount(params).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.sectorsCountList = result.data.sectors_count
          if (!this.sectorsCountList) {
            return
          }
          this.$refs.chart_line_one.initChart(this.sectorsCountList[0].DateTime, this.sectorsCountList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },

    // 获取任务时长moment('00:00:01', 'HH:mm:ss')
    taskCosts() {
      this.taskCostsList = []
      const params = {
        minerid: this.minerid,
        ...this.taskCostsSearch
      }
      taskCosts(params).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.taskCostsList = result.data.task_costs
          if (!this.taskCostsList) {
            return
          }
          this.$refs.chart_line_tow.initChart(this.taskCostsList[0].DateTime, this.taskCostsList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 节点详情
    sectorsState() {
      sectorsState({ minerid: this.minerid }).then((res) => {
        const result = res.data
        if (result.code === 200) {
          this.machineCount = result.data.machine_count
          this.sectorState = result.data.sector_state
          this.sectorSize = result.data.sector_size
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // tab切换
    listChange(e) {
      // console.log(e.target, '511515')
      if (this.loading === true) return
      // this.initTable()
      if (this.mode === '1') {
        this.workerList()
      } else if (this.mode === '2') {
        this.deadline()
      } else if (this.mode === '0') {
        this.workerPower()
      } else if (this.mode === '3') {
        this.minerSectors()
      } else if (this.mode === '4') {
        this.migrateTasks()
      } else if (this.mode === '5') {
        this.storeMachines()
      }
    },
    // 处理表格翻页
    workerListChange(pagination) {
      this.page.page = pagination.pageNumber
      this.page.size = pagination.pageSize
      if (this.mode === '0') {
        this.workerPower()
      } else if (this.mode === '1') {
        this.workerList()
      } else if (this.mode === '3') {
        this.minerSectors()
      } else if (this.mode === '4') {
        this.migrateTasks()
      } else if (this.mode === '5') {
        this.storeMachines()
      }
    },
    // 存储机列表
    storeMachines() {
      if (this.loading === true) return
      this.initTable()
      this.loading = true
      let params = {}
      params = {
        ...this.generateParams(),
        ...this.filter,
        minerid: this.minerid
      }
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      storeMachines(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.machines
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 迁移任务列表
    migrateTasks() {
      if (this.loading === true) return
      this.initTable()
      this.loading = true
      let params = {}
      params = {
        ...this.generateParams(),
        ...this.filter,
        minerid: this.minerid
      }
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      migrateTasks(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.tasks
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 扇区列表
    minerSectors() {
      // console.log()
      if (this.loading === true) return
      this.initTable()
      this.loading = true
      let params = {}
      params = {
        ...this.generateParams(),
        ...this.filter
      }
      this.pagination = false
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      minerSectors(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.sectors
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 机器算例列表
    workerPower() {
      if (this.loading === true) return
      this.initTable()
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
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.worker_tasks
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 机器列表
    workerList() {
      if (this.loading === true) return
      this.initTable()
      this.loading = true
      let params = {}
      params = {
        ...this.generateParams(),
        ...this.filter
      }
      params.sort_field = this.sort.sort_field
      params.sort_order = this.sort.sort_order
      this.pagination = false
      workerList(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.worker_tasks
          this.page.total = result.data.total
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 获取deadline表格数据
    deadline() {
      if (this.loading === true) return
      this.initTable()
      this.loading = true
      const params = this.generateParams()
      delete params.page
      delete params.size
      this.pagination = true
      wdpostDeadlines(params).then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.deadlines
        } else {
          this.$message.error(result.msg)
        }
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
<style lang="less">
  .card-list {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    flex-wrap: wrap;
    .node-detail {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      ::after {
        display: none;
      }
      .detail-item {
        min-width: 48%;
      }
    }
  }
</style>
