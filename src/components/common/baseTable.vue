<template>
  <div class="base-table">
    <a-table
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => record[id] || index"
      :pagination="false"
      :scroll="scroll.type!==1?getScroll():{}"
      :default-expand-all-rows="defaultExpandAllRows"
      :loading="loading"
      :row-selection="isSelectable&&{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps,onSelectAll:onSelectAll}"
      @change="tableChange"
    >
      <template v-for="(col,index1) in columns" :slot="col.key" slot-scope="text,record">
        <div :key="col.key" :style="'color:'+col.textColor+(col.style||'')">
          <!-- {{ col }} -->
          <!-- 头像 -->
          <a-avatar v-if="col.type==='logo'" icon="user" :src="text" />
          <!-- 根据值显示不同的tag  -->
          <span v-else-if="col.tags">
            <a-tag
              v-for="(tag,i) in getTags(col.tags,text)"
              :key="i"
              :color="tag.color"
            >{{ tag.label }}</a-tag>
          </span>
          <!-- 插槽 -->
          <span v-else-if="col.slotName">
            <slot
              :col="col"
              :name="col.slotName"
              :text="record[col.key]"
              :listText="col.listKey?record[col.listKey]:''"
              :record="record"
              :index="index1"
            />
          </span>
          <!-- 根据值显示可点击的 tag  -->
          <span v-else-if="col.clickableTags">
            <a-tag
              v-for="(tag,i) in getTags(col.clickableTags,text)"
              :key="i"
              :color="tag.color"
              style="cursor: pointer;"
              @click="changeTag(col.emitName,record,text)"
            >{{ tag.label }}</a-tag>
          </span>

          <!--york----- 显示前面带有点的 文本 -->
          <span v-else-if="col.badges">
            <a-badge
              v-for="(badge,i) in getTags(col.badges,text)"
              :key="i"
              :status="badge.status"
              :text="badge.label"
            />
          </span>

          <!-- 根据值显示  弹窗 tags  -->
          <span v-else-if="col.openTags">
            <a-tag
              v-for="(tag,i) in getTags(col.openTags,text)"
              :key="i"
              :color="tag.color"
              @click="openTag(tag.emitName,record,col.key)"
            >
              {{ tag.label }}
            </a-tag>
          </span>
          <!-- ------ -->
          <!-- 根据值显示不同的文字颜色 -->
          <span v-else-if="col.colorMarks">
            <span
              v-for="(tag,i) in getTags(col.colorMarks,text)"
              :key="i"
              :style="{color:tag.color}"
            >{{ tag.label||text }}</span>
          </span>

          <!-- 显示 所有的 文字 -->
          <span v-else-if="col.type ==='getAllTexts' ">
            <!-- {{ record }} -->
            <a-tag
              v-for="(tag,i) in record[col.key]"
              :key="i"
              class="tagText"
              :style="{color: tag.show_name==='微信'? '#6acd39':tag.show_name==='邮箱'? '#1890ff':''}"
            >{{ tag.show_name }}</a-tag>
          </span>

          <!-- 根据值显示不同的颜色 0/... 红色  1/... 蓝色 其他绿色-->

          <span v-else-if="col.colorMarksByAmount">
            <span :style="{color:getTextColorByAmount(text)}">{{ text }}</span>
          </span>

          <!-- 开关 -->
          <span v-else-if="col.type==='switch'">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="text"
              @change="emitEvent(col.emitName,record,col.key)"
            />
          </span>

          <span v-else-if="col.type==='switch2'">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="(text === 2) ? true : false"
              @change="emitEvent(col.emitName,record)"
            />
          </span>

          <span v-else-if="col.type==='switch3'">
            <a-switch
              checked-children="开"
              un-checked-children="关"
              :checked="(text === 2) ? true : false"
              @change="emitEvent(col.emitName,record)"
            />
          </span>

          <!-- hover 显示用户详情 -->
          <!-- col.textColor 存在则是带颜色的文本，否则是按钮 -->
          <UserPopOver v-else-if="col.type==='showUserInfo'" :user-type="!!col.textColor" :text="text?text.toString():''" />

          <!-- 到账状态显示 -->
          <span
            v-else-if="col.type==='stateDom'"
            style="display:flex;align-items:center;"
          >
            <span v-show="record.recharge_status === 0" style="color: #333">正在进行中</span>
            <span v-show="record.recharge_status === 1 && record.type === 1" style="color: #52c41a">已完成</span>
            <span v-show="record.recharge_status === 1 && record.type === 2">小于最小充币数</span>
            <span v-show="record.recharge_status === 1 && record.type === 3">充币功能已关闭</span>
            <span v-show="record.recharge_status === 1 && record.type === 4">链与币的关系已解除</span>
            <span v-show="record.recharge_status === 1 && record.type === 5">币与链未建立关系</span>
          </span>

          <!-- 点击显示地址详情 -->
          <span
            v-else-if="col.type==='showAddressDetail'&&!col.label"
            style="display:flex;align-items:center;"
          >
            <span
              style="display:inline-block;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{ text }}</span>
            <a-tag @click="showAddressDetail(record)">...</a-tag>
          </span>
          <!-- 点击显示地址详情 chongbi-->
          <span
            v-else-if="col.type==='showAddressDetail1'&&!col.label"
            style="display:flex;align-items:center;"
          >
            <span
              style="display:inline-block;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{ text }}</span>
            <a-tag @click="showAddressDetail1(record)">...</a-tag>
          </span>
          <!-- 点击显示地址详情 tibi-->
          <span
            v-else-if="col.type==='showAddressDetail2'&&!col.label"
            style="display:flex;align-items:center;"
          >
            <span
              style="display:inline-block;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{ text }}</span>
            <a-tag @click="showAddressDetail2(record)">...</a-tag>
          </span>

          <span v-else-if="col.type==='showAddressDetail'&&col.label">
            <span :style="col.style||''" @click="showAddressDetail(record)">{{ col.label }}</span>
          </span>

          <!-- checkbox -->
          <span v-else-if="col.type==='checkbox'">
            <a-checkbox :checked="text" @change="emitEvent(col.emitName,record)" />
          </span>

          <!-- checkbox menu.vue 页面专用-->
          <span v-else-if="col.type==='checkboxMenu'">
            <a-checkbox :checked="text" @change="emitEvent('check',{index:col.index,data:record})" />
          </span>

          <!-- 图片的弹出 york-->
          <span v-else-if="col.type==='picture'">
            <img :src="text" :style="col.style||''" @click="getPics(col.emitName,record, col.key)">
          </span>

          <!-- 显示操作按钮 -->
          <span v-else-if="col.buttons">
            <slot name="operate-slot" :data="record" />
            <template v-for="(tag,i) in getVisibleButtons(col.buttons,record)">
              <a-button
                v-if="(!tag.buttonkey || (tag.buttonkey && $store.state.button.userbutton.indexOf(tag.buttonkey)!==-1))&&(!tag.key||tag.val!==record[tag.key])"
                :key="i"
                size="small"
                :type="tag.type"
                :ghost="tag.ghost"
                @click="emitEvent(tag.emitName,record)"
              >{{ tag.label }}</a-button>
            </template>

          </span>
          <!-- 发起时间 - 时间线 -->
          <a-popover v-else-if="col.type==='timeline'" trigger="click" placement="rightBottom">
            <template slot="content">
              <a-timeline>
                <!-- {{ text }} -->
                <a-timeline-item v-for="(item, index) in text" :key="index" :color="['blue','purple','green','#0285BD','red'][index%4]">
                  <span style="color:#8400ff;font-weight:700;">{{ item.name }}</span>
                  <!-- eslint-disable-next-line -->
                  <span v-html="item.html"></span>
                  <span>{{ item.time }}</span>
                </a-timeline-item>
              </a-timeline>
            </template>
            <span class="color-blue-deep cursor-pointer">{{ record.created_at }}</span>
          </a-popover>
          <!-- moment(record.text).format('YYYY-MM-DD HH:mm:ss') -->
          <span v-else-if="col.type==='formatTime'">{{ moment(record[col.key]).format(format) }}</span>
          <span v-else>
            <slot name="text-slot" :data="record" />
          </span>
        </div>
      </template>
    </a-table>

    <div class="table-footer">
      <a-pagination
        v-if="!ifHidePagination"
        show-size-changer
        show-quick-jumper
        :default-page-size="pageSize"
        :total="itemTotal"
        :show-total="total => `总共 ${total} 条`"
        :current="current"
        @showSizeChange="onShowSizeChange"
        @change="onPgaeChange"
      />
      <slot name="footer-left" />
    </div>
  </div>
</template>

<script>
import UserPopOver from './userInfoPopover'
import * as moment from 'moment'
export default {
  name: 'BaseTable',
  components: {
    UserPopOver
  },
  props: {
    // 主键
    id: {
      type: String,
      default: 'ID'
    },
    scroll: {
      type: Object,
      default: function() {
        return {}
      }
    },

    // 时间格式
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    getCheckboxProps: {
      type: Function,
      default: () => ({
        props: {
          disabled: false
        }
      })
    },
    columns: {
      type: Array,
      default: null
    },
    // 表格数据
    data: {
      type: Array,
      default: null
    },
    // 当前页数
    current: {
      type: Number,
      default: 1
    },
    // 总条数
    itemTotal: {
      type: Number,
      default: null
    },
    // 表单项是否可选
    isSelectable: {
      type: Boolean,
      default: null
    },
    // 是否隐藏 分页
    ifHidePagination: {
      type: Boolean,
      default: null
    },
    // 表头固定配置
    ifFixedHeader: {
      type: Boolean,
      default: null
    },
    defaultExpandAllRows: {
      type: Boolean,
      default: null
    },
    allTexts: {
      type: Object,
      default: null
    },
    // 加载等待
    loading: {
      type: Boolean,
      default: null
    },
    // 宽度
    fixedWidth: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      moment,
      current1: this.current,
      pageSize: 10,
      selectedRowKeys: []
    }
  },
  watch: {
    // current (newVal, oldVal) {
    //   this.ifHidePagination = true
    //   if (newVal !== oldVal) {
    //     this.$nextTick(() => {
    //       this.ifHidePagination = false
    //     })
    //   }
    // },
    pageSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.current1 = 1
      }
    },
    data(newVal, oldVal) {
    }
  },
  methods: {
    // 表格过滤排序字段发生变化
    tableChange(pagination, filters, sorter) {
      this.emitEvent('tableChange', sorter)
    },
    // 选择表单项变化，会发事件
    //  selectedRowKeys 是 index 的数组，具体看情况处理(批量删除的)
    onSelectChange(selectedRowKeys, key) {
      this.selectedRowKeys = selectedRowKeys
      this.emitEvent('selectChange', selectedRowKeys, key)
    },
    // 全选
    onSelectAll(selected, selectedRows, changeRows) {
      this.emitEvent('onSelectAll', selected, selectedRows, changeRows)
    },
    changeTag(eventName, record, key) {
      if (!eventName) {
        return
      }
      this.$emit(eventName, record, key)
      // record[key] = !record[key]
      // record[key] = record[key] === 1 ? 2 : 1
    },
    // york---------tag出现弹窗
    openTag(eventName, record) {
      if (!eventName) {
        return
      }
      this.$emit(eventName, record)
    },
    getPics(eventName, record, key) {
      if (!eventName) {
        return
      }
      this.$emit(eventName, record, key)
    },
    // ---------------------
    // 分页 页面变化
    onPgaeChange(pageNumber, pageSize) {
      // this.current1 = pageNumber
      this.$emit('pageChange', { pageNumber, pageSize: this.pageSize })
    },
    // 分页 每页显示条数变化
    onShowSizeChange(pageNumber, pageSize) {
      // this.current1 = 1
      this.pageSize = pageSize
      // this.current = pageNumber
      this.$emit('pageChange', { pageNumber, pageSize })
    },
    emitEvent(eventName, record, text) {
      if (!eventName) {
        return
      }
      this.$emit(eventName, record, text)
    },
    // 筛选具体哪项
    getTags(tags = [], value) {
      const _tags = []
      tags.forEach(tag => {
        if (tag.value == value) {  // eslint-disable-line
          _tags.push(tag)
        }
      })
      return _tags
    },
    // 显示 多个 text
    getAllTexts(texts = [], value) {
      var _texts = []
      texts.filter(v => {
         if (value.includes(v.value)) {  // eslint-disable-line
          _texts.push(v)
        }
        // return _texts
      })
      return _texts
    },
    getTextColorByAmount(value) {
      if (!value) {
        return
      }
      const beforeAmount = parseInt(value.split('/')[0])
      if (beforeAmount === 0) {
        return '#e65a6b'
      } else if (beforeAmount === 1) {
        return '#5bc6f5'
      } else {
        return '#0cda20'
      }
    },
    getVisibleButtons(buttons = [], row) {
      const result = []
      buttons.forEach(btn => {
        if (!btn.activeKey) {
          result.push(btn)
        }
        if (btn.activeKey && row[btn.activeKey] === btn.activeValue) {
          result.push(btn)
        }
      })
      return result
    },
    showAddressDetail1(record) {
      this.$success({
        width: 700,
        title:
          <div>
            地址详情 <a-tag color='green' style='margin-left:5px;'>充币</a-tag>
          </div>,
        content: (
          <div>
            <div><a-tag color='green'>客户</a-tag>{record.address}
              <a-tag color='#545454' style='margin-left:10px;display:none'>标签：(功能暂时没开启)</a-tag>
            </div>
            <div style='margin-top:20px;'><a-tag color='blue'>哈希</a-tag>{record.hash}</div>
          </div>
        )
      })
    },
    showAddressDetail2(record) {
      this.$success({
        width: 700,
        title:
          <div>
            地址详情 <a-tag color='red' style='margin-left:5px;'>提币</a-tag>
          </div>,
        content: (
          <div>
            <div><a-tag color='red'>客户</a-tag>{record.address}
              <a-tag color='#545454' style='margin-left:10px;display:none'>标签：(功能暂时没开启)</a-tag>
            </div>
            <div style='margin-top:20px;'><a-tag color='blue'>哈希</a-tag>{record.hash}</div>
          </div>
        )
      })
    },
    showAddressDetail(record) {
      // console.log(record, 'jjjj')
      this.$success({
        width: 600,
        // JSX support
        title:
          <div>
            地址详情 <a-tag color='green' style='margin-left:5px;'>充币</a-tag>
          </div>,
        // content: (
        //   <div>
        //     <div><a-tag color="green">平台</a-tag>{record.fromAddress} <a-tag color="#545454" style='margin-left:10px;'>标签：1456556CCCVs</a-tag></div>
        //     <div style='margin-top:6px;'><a-tag color="pink">客户</a-tag>{record.toAddress} <a-tag color="#545454" style='margin-left:10px;'>标签</a-tag>
        //     </div>
        //     <div style='margin-top:20px;'><a-tag color="blue">哈希</a-tag>{record.hash}</div>
        //   </div>
        // )
        content: (
          <div>
            <div><a-tag color='green'>平台</a-tag>{record.url}
              <a-tag color='#545454' style='margin-left:10px;'>标签：(功能暂时没开启)</a-tag>
            </div>
            <div style='margin-top:20px;'><a-tag color='blue'>哈希</a-tag>{record.hash}</div>
          </div>
        )
      })
    },
    // 固定表头的配置
    getScroll() {
      const screenWidth = document.body.offsetWidth
      const width = screenWidth - 350
      if (!this.ifFixedHeader && this.fixedWidth) {
        return { x: width }
      }
      const screenHeight = document.body.offsetHeight
      const height = screenHeight - 260
      if (this.ifFixedHeader && this.fixedWidth) {
        return { y: height, x: width }
      }
      if (this.ifFixedHeader && !this.fixedWidth) {
        return { y: height }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-btn + .ant-btn {
  margin-left: 12px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  margin-top: 24px;
}
.tagText{
  margin-right:10px;
  // border: 1px solid #333;
}
</style>
