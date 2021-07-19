<template>
  <div :class="wrpCls">
    <!-- 用户帐号操作 -->
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- 选择语言 -->
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
// import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown
    // SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true
    }
  },
  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true
      }
    },
    currentUser() {
      const user = this.$store.state.user
      if (user.account) {
        return user
      } else {
        return { account: '管理员' }
      }
    }
  },
  mounted() {
    // console.log('this.$store.u', this.$store.state)
  }
}
</script>
