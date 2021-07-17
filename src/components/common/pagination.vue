<template>
  <div class="table-footer">
    <a-pagination
      v-if="!ifHidePagination"
      show-size-changer
      show-quick-jumper
      :default-current="defaultCurrent"
      :default-page-size="pageSize"
      :total="itemTotal"
      :show-total="total => `总共 ${total} 条`"
      :current="current"
      @showSizeChange="onShowSizeChange"
      @change="onPgaeChange"
    />
    <slot name="footer-left" />
  </div>
</template>
<script>
export default {
  props: {
    itemTotal: {
      type: Number,
      default: null
    },
    defaultCurrent: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    // 是否隐藏 分页
    ifHidePagination: {
      type: Boolean,
      default: null
    },
    current: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // pageSize: 10
    }
  },
  methods: {
    onPgaeChange(pageNumber) {
      this.$emit('pageChange', { pageNumber, pageSize: this.pageSize })
    },
    onShowSizeChange(pageNumber, pageSize) {
      this.pageSize = pageSize
      this.$emit('pageChange', { pageNumber, pageSize })
    }
  }
}
</script>
<style lang="less">
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  margin-top: 24px;
}
</style>
