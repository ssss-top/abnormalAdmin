<template>
  <!-- <a-popover trigger="hover" placement="rightBottom"> -->
  <!-- <a-tooltip trigger="click" placement="rightBottom" > -->
  <a-popover trigger="click" placement="rightBottom" class="userInfo">
    <div slot="content" class="users">
      <div class="user-info">
        <label>用户UID：</label>{{ merchantInfo.user_id || '--' }}
      </div>
      <div class="user-info">
        <label>上级UID：</label>{{ merchantInfo.pid || '--' }}
      </div>
      <div class="user-info">
        <label>真实姓名：</label>{{ merchantInfo.real_name || '--' }}
      </div>
      <div class="user-info">
        <label>手机：</label>{{ merchantInfo.phone || '--' }}
      </div>
      <div class="user-info">
        <label>用户分组：</label>{{ merchantInfo.user_group_name || '--' }}
      </div>
      <div class="user-info">
        <label>用户等级：</label>{{ merchantInfo.user_level_name || '--' }}
      </div>
      <div class="user-info">
        <label>用户标签：</label>{{ merchantInfo.lable_names || '--' }}
      </div>
    </div>
    <!-- <span>{{ text }}</span> -->
    <span v-if="userType" @click="merchantClick(text)">{{ text || '未知ID' }}</span>
    <a-button v-else @click="merchantClick(text)">{{ text || '未知ID' }}</a-button>

  </a-popover>
  <!-- </a-tooltip> -->
</template>

<script>
// import {
//   // getmerchantdetail,
//   getUserDetail
// } from '@/api/advManagement.js'

export default {
  props: {
    text: {
      type: String,
      default: null
    },
    userType: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      merchantInfo: {
        user_id: '',
        real_name: '',
        phone: '',
        pid: '',
        user_group_name: '',
        user_level_name: '',
        lable_names: ''
      }
    }
  },
  methods: {
    // 商户弹窗
    merchantClick(data) {
      console.log(data, 'kk')
      // var dataT = {
      //   user_id: data
      // }
      // getUserDetail(dataT).then(res => {
      //   if (res.code === 0) {
      //     console.log(res, 'res2')
      //     const _res = res.data[0]
      //     this.merchantInfo.pid = _res.pid
      //     this.merchantInfo.real_name = _res.real_name
      //     this.merchantInfo.user_id = _res.user_id
      //     this.merchantInfo.user_group_name = _res.user_group_name
      //     this.merchantInfo.user_level_name = _res.user_level_name
      //     this.merchantInfo.phone = _res.phone
      //     this.merchantInfo.lable_names = _res.lable_names.map(v => {
      //       return v[1]
      //     }).join(',')
      //     console.log(this.merchantInfo.lable_names, '009')
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
      // getmerchantdetail(dataT).then(res => {
      //   if (res.code === 0) {
      //     console.log(res.user_id, 'res1')
      //     const _res = res.data
      //     this.merchantInfo.user_id = _res.user_id
      //     this.merchantInfo.phone = _res.phone
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
    }
  }
}
</script>
<style lang="less" scoped>
.user-info{
  margin:10px 0;
  // color:rgba(0,0,0,.3);
  // background-color:rgba(0,0,0,.3);
}
// .userInfo{
//   background-color: orchid;
//   color:#fff;
// }
// .users{
//   background-color: rgba(0,0,0,.3);
//   color:#fff;
// }
.ant-popover-inner-content{
  background-color:rebeccapurple !important;
  color: #fff;
}
.ant-popover-inner-content {
    padding:30px;
    color: rgba(0, 0, 0, 0.65);
}
</style>
