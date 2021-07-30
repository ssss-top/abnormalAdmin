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

          <!-- <a-popover v-if="record.listText" slot="LuckyValue" slot-scope="record" placement="bottom">
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
          <span v-else>{{ record.text }} </span> -->
          <span slot="text" slot-scope="record" :class="record.record.IsCurrent===true?'red':''">{{ record.text }}</span>
        </BaseTable>
      </div>

    </a-card>
  </page-header-wrapper>
</template>
<script>
import { wdpostDeadlines } from '@/api/login'
import BaseTable from '@/components/common/baseTable.vue'
export default {
  components: {
    // Pagination
    BaseTable
  },
  data() {
    return {
      // filterSettings: [],
      tableColumns: [],
      tableData: [],
      loading: false,
      minerid: ''
    }
  },
  created() {
    this.minerid = this.$route.query.minerid
    if (!this.minerid) {
      this.$router.push('/minerList')
      return false
    }
    // console.log(this.$route.query, '6556')
    this.initTable()
    this.getTableData()
  },
  methods: {

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
    // 处理表格翻页
    handleTableChange(pagination) {
      // this.selectedRowKeys = []
      // this.popupFormValue.BoxIdList = []
      // this.$set(this.popupFormValue, 'BoxIdList', [])
      this.page = pagination.pageNumber
      this.size = pagination.pageSize
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      if (this.loading === true) return
      this.loading = true
      // const params = this.generateParams()
      const params = {
        minerid: this.minerid
        // page: this.page,
        // size: this.size
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
    }

  }
}
</script>
