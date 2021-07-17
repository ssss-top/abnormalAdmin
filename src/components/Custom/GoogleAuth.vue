<template>
  <div class="google_auth">
    序列号：{{ googleAuth.secret }}
    <a class="copy-btn" href="javascript:;" @click="copySecret">复制</a>
    <a-popover placement="right" @visibleChange="visibleChange">
      <template slot="content">
        <canvas :id="rand" />
      </template>
      <img src="@/assets/images/QR_icon.png" alt class="qrcode-img">
    </a-popover>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'GoogleAuth',
  data() {
    return {
      googleAuth: {},
      hasRendered: false,
      rand: 0
    }
  },
  created() {
    this.getGoogleAuth()
  },
  activated() {
    this.rand = this.googleAuth.secret + new Date()
  },
  methods: {
    // 获取谷歌验证信息
    getGoogleAuth() {
      this.axios({
        url: '/v1/admin/admin_google',
        method: 'get'
      })
        .then(res => {
          const result = res.data
          if (result.code === 0) {
            this.googleAuth = result.data
            this.rand = this.googleAuth.secret + new Date()
            this.$emit('googleSecret', this.googleAuth.secret)
          } else {
            this.$message.success(`谷歌验证获取失败：${result.msg}`)
            console.log('getRoles.res', result)
          }
        })
        .catch(err => {
          this.$message.success('谷歌验证获取失败：')
          console.log('getRoles.err', err)
        })
    },
    visibleChange(visible) {
      if (!visible) {
        return
      }
      setTimeout(() => {
        this.show = true
        this.createQrCode()
      }, 100)
    },
    createQrCode() {
      if (!this.googleAuth) {
        return
      }
      const ele = document.getElementById(this.rand)
      const s = this.googleAuth.codeurl // `otpauth://totp/?secret=${this.googleAuth.secret}`
      QRCode.toCanvas(ele, s, error => {
        console.log('QRCode.toCanvas error', error)
      })
    },
    copySecret() {
      this.$copyText(`${this.googleAuth.secret}`).then(
        res => {
          console.log(res)
          this.$message.success('复制成功！')
        },
        err => {
          console.log(err)
          this.$message.error('复制失败！')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.google_auth {
  display: flex;
  align-items: center;
  .copy-btn {
    margin: 0 10px;
  }
  .qrcode-img {
    width: 24px;
    height: 24px;
    cursor: 'pointer';
  }
}
</style>
