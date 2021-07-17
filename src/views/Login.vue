<template>
  <div class="main">
    <a-form id="formLogin" ref="formLogin" class="user-layout-login" :form="form" @submit="handleSubmit">
      <!-- <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{
          textAlign: 'center',
          borderBottom: 'unset',
        }"
        @change="handleTabClick"
      > -->
      <!-- <a-tab-pane key="tab1" tab="登录"> -->
      <!-- <a-alert  type="error" showIcon style="margin-bottom: 24px" :message="tabMessage" /> -->
      <!-- 帐号 -->
      <a-form-item>
        <a-input
          v-decorator="[
            'LoginAccount',
            {
              rules: [
                {
                  required: true,
                  message: '请输入帐号',
                },
                {
                  validator: handleUsernameOrEmail,
                },
              ],
              validateTrigger: 'change',
            },
          ]"
          size="large"
          type="text"
          placeholder="帐号："
        >
          <a-icon
            slot="prefix"
            type="user"
            :style="{
              color: 'rgba(0,0,0,.25)',
            }"
          />
        </a-input>
      </a-form-item>
      <!-- 密码 -->
      <a-form-item>
        <a-input-password
          v-decorator="[
            'LoginPassword',
            {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
              validateTrigger: 'blur',
            },
          ]"
          size="large"
          placeholder="密码："
        >
          <a-icon
            slot="prefix"
            type="lock"
            :style="{
              color: 'rgba(0,0,0,.25)',
            }"
          />
        </a-input-password>
      </a-form-item>
      <!-- 谷歌验证码 -->
      <!-- <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="谷歌验证码："
              v-decorator="[
                'google_code',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入谷歌验证码',
                    },
                  ],
                  validateTrigger: 'change',
                },
              ]"
            >
              <a-icon
                slot="prefix"
                type="idcard"
                :style="{
                  color: 'rgba(0,0,0,.25)',
                }"
              />
            </a-input>
          </a-form-item> -->
      <!-- </a-tab-pane> -->
      <!-- 下面这段代码留着，备着以后用 -->
      <!-- <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
          <a-form-item>
            <a-input size="large" type="text" :placeholder="$t('user.login.mobile.placeholder')" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: $t('user.login.mobile.placeholder') }], validateTrigger: 'change'}]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" :placeholder="$t('user.login.mobile.verification-code.placeholder')" v-decorator="['captcha', {rules: [{ required: true, message: $t('user.verification-code.required') }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && $t('user.register.get-verification-code') || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane> -->
      <!-- </a-tabs> -->
      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >登录</a-button>
      </a-form-item>
    </a-form>

    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha> -->
  </div>
</template>

<script>
// import md5 from 'md5'
// import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
// import storage from 'store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { getSmsCaptcha, get2step } from '@/api/login'

export default {
  components: {
    // TwoStepCaptcha
  },
  data() {
    return {
      customActiveKey: 'tab1',
      tabMessage: '',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      // google_code: '',
      LoginAccount: '',
      LoginPassword: '',
      secretKey: ''
    }
  },
  created() {
    // get2step({})
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // 校验用户名或邮箱名
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    // tab切换
    handleTabClick(key) {
      // const a = 1
      this.customActiveKey = key
      // this.form.resetFields()
    },
    // 登录表单提交操作
    handleSubmit(e) {
      // this.$router.push({
      //   path: '/MonitorLog'
      // })
      // storage.set(ACCESS_TOKEN, '2d6e2f6e8e5d6de5d4e54', 7 * 24 * 60 * 60 * 1000)
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        // customActiveKey,
        Login
      } = this
      state.loginBtn = true
      const validateFieldsKey = ['LoginAccount', 'LoginPassword']
      validateFields(
        validateFieldsKey,
        {
          force: true
        },
        (err, values) => {
          if (!err) {
            console.log('login form', values)
            const loginParams = {
              ...values
            }
            Login(loginParams)
              .then((res) => this.loginSuccess(res))
              .catch((err) => this.requestFailed(err))
              .finally((res) => {
                console.log('登录完成', res)
                state.loginBtn = false
              })
          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        }
      )
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    // 登录成功
    loginSuccess(res) {
      console.log('登录成功', res)
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
        this.$router.push({ name: 'analysis' }, () => {
          console.log('onComplete')
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        })
        */
      this.$router.push({
        path: '/'
      })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    }
    // // 登录失败
    // requestFailed (err) {
    //   console.log('登录失败', err)
    //   this.isLoginError = true
    //   const errMsg = err.msg || '请求出现错误，请稍后再试'
    //   this.tabMessage = errMsg
    //   this.$notification['error']({
    //     message: '错误',
    //     description: errMsg,
    //     duration: 4
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
