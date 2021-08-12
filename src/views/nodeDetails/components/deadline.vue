<template>
  <!-- 表格数据过滤器 -->
  <div class="tables">
    <div class="title">
      <span>{{ title }}</span>
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
      :if-hide-pagination="true"
    >
      <span slot="text" slot-scope="record" :class="record.record.IsCurrent === true ? 'red' : ''">{{ record.text }}</span>
      <span slot="IP" slot-scope="record" style="text-decoration: underline; cursor: pointer" @click="showIp(record)">{{
        record.text
      }}</span>
      <!-- slotName: 'toFixed' -->
      <span slot="toFixed" slot-scope="record">{{ record.text?Number(record.text).toFixed(2):'0' }}</span>
    </BaseTable>
  </div>

</template>
<script>
import {
  wdpostDeadlines
} from '@/api/api'

import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    BaseTable
    // BaseFormPopup
  },
  props: {
    minerid: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      pagination: false,
      tableColumns: [],
      tableData: [],
      loading: false
    }
  },

  created() {
    this.initTable()
    this.getTableData()
  },
  methods: {

    // 表格配置
    initTable() {
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
    },

    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      this.loading = true
      const params = {
        minerid: this.minerid
      }
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
        minerid: this.minerid
      }
      // Object.assign(params)
      return params
    }
  }
}
</script>

