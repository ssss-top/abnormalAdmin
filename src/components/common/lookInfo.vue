<template>
  <div class="users">
    <div v-for="(item,index) in setting" :key="index" class="user-info">
      <label>{{ item.key }}</label>：<span>{{ data[item.label] || '--' }}</span>
    </div>
  </div>
</template>

<script>
// import {
//   // getmerchantdetail,
//   getUserDetail
// } from '@/api/advManagement.js'

export default {
  props: {

    // 数据
    data: {
      type: Object,
      default: null
    },
    // 配置项
    setting: {
      type: Array,
      default: null
    }
  },
  data: function() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.user-info{
  margin:10px 0;
  display: flex;
  label{
    color:rgba(0,0,0,.3);
  }
  span{
    flex: 1;
    text-align: right;
    font-size: 16px;
  }
}

</style>
