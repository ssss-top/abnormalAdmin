<template>
  <div class="table_page_header">
    <!-- 表格数据过滤器 开始 -->
    <div class="table_filter">
      <div>
        <!-- 表单 -->
        <a-form-model :model="form" layout="inline">
          <!-- 表单项 -->
          <a-form-model-item v-for="item in settings" :key="item.key" :label="item.label">
            <!-- 选择框 -->
            <a-select
              v-if="item.type === 'select'"
              v-model="form[item.key]"
              allow-clear
              style="min-width:100px"
              :style="item.style"
              :options="item.options"
              :placeholder="item.placeholder || ''"
              @change="onSelectChange"
            />
            <!-- 时间范围选择 -->
            <a-range-picker
              v-if="item.type === 'daterange'"
              v-model="form[item.key]"
              allow-clear
              :style="item.style"
              :format="item.format"
              :value-format="item.valueFormat"
            />
            <!-- 普通文本输入框 -->
            <a-input
              v-else-if="item.type === 'input'"
              v-model="form[item.key]"
              allow-clear
              :style="item.style"
              :placeholder="item.placeholder || ''"
            />
            <a-textarea
              v-else-if="item.type === 'textarea'"
              v-model="form[item.key]"
              :placeholder="item.placeholder || ''"
              :style="item.style"
              :rows="4"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <!-- 查询按钮 -->
      <a-button type="primary" @click="submit">
        查询
      </a-button>
    </div>
    <!-- 表格数据过滤器  结束 -->
    <!-- 右边插槽 -->
    <div style="padding-left:15px">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    settings: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    settings: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.handleDefaultValue()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 提交查询操作
    submit() {
      this.$emit('submit', this.form)
    },
    // 同步defaultValue到表单
    handleDefaultValue() {
      this.settings.forEach(item => {
        if (item.defaultValue !== undefined) {
          this.form[item.key] = item.defaultValue
        }
      })
    },
    // 选择完 强制更新
    onSelectChange(e) {
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
.table_page_header,
.table_filter {
  display: flex;
  align-items: center;
}
</style>
