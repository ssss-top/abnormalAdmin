<template>
  <page-header-wrapper>
    <!-- 表格数据过滤器 -->
    <a-card size="small" :bordered="false">
      <!-- <table-filter :settings="filterSettings" @submit="filterTableData" /> -->
      <!-- 表格 开始 -->
      <div style="margin-top: 20px">
        <BaseTable
          ref="table"
          :columns="tableColumns"
          :data="tableData"
          class="page-base-table"
          :fixed-width="true"
          :loading="loading"
          :if-hide-pagination="true"
        >

          <a-popover v-if="record.listText" slot="LuckyValue" slot-scope="record" placement="bottom">
            <template slot="content">
              <BaseTable
                ref="table"
                :columns="ableColumnsPopover"
                :data="record.listText"
                class="page-base-table"
                :fixed-width="true"
                :loading="loading"
                :if-hide-pagination="true"
              />
            </template>
            <a-button>{{ record.text }}</a-button>
          </a-popover>
          <span v-else>{{ record.text }} </span>
        </BaseTable>
      </div>
      <!-- 表格 结束 -->
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { minerList } from '@/api/login'
import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    BaseTable
  },
  data() {
    return {
      filterSettings: [],
      ableColumnsPopover: [],

      // 表格-列
      tableColumns: [],
      // 表格-数据
      tableData: [],
      loading: false
    }
  },
  created() {
    this.initTable()
    this.getTableData()
  },
  methods: {

    initTable() {
      this.filterSettings = [
        {
          label: '矿工ID',
          key: 'Miner',
          type: 'input',
          placeholder: '请输入矿工ID',
          style: 'width:200px'
        },

        {
          label: '是否密封',
          key: 'Sealing',
          type: 'select',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '否',
              value: false
            },
            {
              label: '是',
              value: true
            }]
        }
      ]
      this.ableColumnsPopover = [
        {
          title: '矿工号',
          dataIndex: 'MinerID',
          key: 'MinerID',
          align: 'center'
        },
        {
          title: '孤块高度',
          dataIndex: 'Height',
          key: 'Height',
          align: 'center'
        },
        {
          title: '孤块哈希',
          dataIndex: 'CID',
          key: 'CID',
          align: 'center'
        },
        {
          title: '出块时间',
          dataIndex: 'MineTime',
          key: 'MineTime',
          align: 'center'
        }
      ]
      this.tableColumns = [
        {
          title: '集群名称',
          dataIndex: 'Cluster',
          key: 'Cluster',
          align: 'center'
        },
        {
          title: '公司名称',
          dataIndex: 'Company',
          key: 'Company',
          align: 'center'
        },

        {
          title: '幸运值（24h）',
          dataIndex: 'LuckyValue24h',
          key: 'LuckyValue24h',
          align: 'center',
          scopedSlots: { customRender: 'LuckyValue24h' },
          slotName: 'LuckyValue',
          listKey: 'OrphanBlock24h'
        },
        {
          title: '幸运值（7d）',
          dataIndex: 'LuckyValue7d',
          key: 'LuckyValue7d',
          align: 'center',
          scopedSlots: { customRender: 'LuckyValue7d' },
          slotName: 'LuckyValue',
          listKey: 'OrphanBlock7d'
        },
        {
          title: '幸运值（30d）',
          dataIndex: 'LuckyValue30d',
          key: 'LuckyValue30d',
          align: 'center'
        },

        {
          title: '矿工号',
          dataIndex: 'Miner',
          key: 'Miner',
          align: 'center'
        },
        {
          title: '有效算力',
          dataIndex: 'RawPowerStr',
          key: 'RawPowerStr',
          align: 'center'
        },
        {
          title: '新增算力',
          dataIndex: 'PowerGrowthStr',
          key: 'PowerGrowthStr',
          align: 'center'
        }, {
          title: '增量算力',
          dataIndex: 'PowerDeltaStr',
          key: 'PowerDeltaStr',
          align: 'center'
        },
        {
          title: '错误证明',
          dataIndex: 'FaultCount',
          key: 'FaultCount',
          align: 'center'
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
        }
      ]
    },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      // const params = this.generateParams()
      minerList().then((res) => {
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.miners
        } else {
          this.$message.error(result.msg)
        }
      })
    }

  }
}
</script>
