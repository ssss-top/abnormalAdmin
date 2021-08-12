<template>
  <!-- 表格数据过滤器 -->

  <div class="tables">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <table-filter style=" margin-bottom: 8px" :settings="filterSettings" @submit="filterTableData">
      <a-button type="primary" @click="restart">重试</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="remove">删除</a-button>
    </table-filter>
    <!-- 表格 开始 -->
    <BaseTable
      :id="'Number'"
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
      @selectChange="onSelectChange"
      @tableChange="tableChange"
      @pageChange="pageChange"
    >
      <span slot="text" slot-scope="record" :class="record.record.IsCurrent === true ? 'red' : ''">{{ record.text }}</span>
      <!-- slotName: 'toFixed' -->
      <span slot="toFixed" slot-scope="record">{{ record.text?Number(record.text).toFixed(2):'0' }}</span>
    </BaseTable>
  </div>

</template>
<script>
import {
  minerSectors,
  sectorsCommands,
  minerSectorsTypes
} from '@/api/api'

import BaseTable from '@/components/common/baseTable.vue'
import * as moment from 'moment'
export default {
  components: {
    BaseTable
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
      minerSectorsList: [],
      sectorsList: [],
      dataArr: [],
      filterSettings: [],
      filter: {},
      moment,
      tableColumns: [],
      tableData: [],
      loading: false,
      sort: {
        sort_field: '',
        sort_order: ''
      },
      page: {
        page: 1,
        size: 10,
        total: 10
      },
      removeCmd: [],
      retryCmd: []

    }
  },

  created() {
    this.minerSectorsTypes()
    this.getTableData()
  },
  methods: {

    // 表格配置
    initTable() {
      this.filterSettings = [
        {
          label: 'IP',
          key: 'ip',
          type: 'input',
          placeholder: 'IP',
          style: 'width:200px'
        },
        {
          label: '扇区号',
          key: 'number',
          type: 'input',
          placeholder: '扇区号',
          style: 'width:200px'
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
          key: 'IP',
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
      ]
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
        }
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

    // 筛选
    filterTableData(e) {
      this.sectorsList = []
      this.$refs.table.selectedRowKeys = []
      this.page.page = 1
      this.filter = { ...e }
      if (e.time && e.time.length) {
        this.filter.start_time = this.moment(e.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.end_time = this.moment(e.time[1]).format('YYYY-MM-DD HH:mm:ss')
        delete this.filter.time
      }
      this.getTableData()
    },

    // 选择
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, '11111111')
      this.sectorsList = selectedRowKeys
      // const arr = []
      // selectedRowKeys.forEach(element => {
      //   console.log(element)
      // })
      // let arr = []
      // this.dataArr.push(...selectedRows)
      // arr = this.Es6duplicate(this.dataArr, 'Number')
      // if (selectedRowKeys.length <= 0) {
      //   // this.cancelList.push(...selectedRows)
      //   arr.forEach((e, index) => {
      //     selectedRowKeys.forEach(item => {
      //       if (e.Number === item) {
      //         delete arr[index]
      //       }
      //     })
      //   })
      // }
      // console.log(arr, '6666666666666666666666666666')
      // this.sectorsList = arr.filter(d => d)

      // console.log(this.sectorsList, '5555555555555555555555555555555555555555555555')
      // console.log('ES6去重', this.Es6duplicate(this.dataArr, 'Number'))
      // this.sectorsList.push()
      // this.changList = selectedRowKeys
    },
    Es6duplicate(arr, type) {
      if (arr.length === 0) {
        return arr
      } else {
        if (type) {
          var obj = {}
          var newArr = arr.reduce((cur, next) => {
            obj[next.Number] ? '' : obj[next.Number] = true && cur.push(next)
            return cur
          }, [])
          return newArr
        } else {
          return Array.from(new Set(arr))
        }
      }
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
      minerSectors(params).then((res) => {
        this.initTable()
        this.loading = false
        const result = res.data
        if (result.code === 200) {
          this.tableData = result.data.sectors
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

