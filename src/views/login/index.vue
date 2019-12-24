<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名/登录手机/邮箱"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          prefix-icon="el-icon-user"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          name="password"
          auto-complete="on"
          show-password
          prefix-icon="el-icon-key"
        />
      </el-form-item>

      <input
        ref="key"
        v-model="loginForm.key"
        name="key"
        type="hidden"
      >
      <el-row :gutter="10">
        <el-col :span="4" style="width: 60%">
          <el-form-item prop="verCode">
            <el-input
              ref="verCode"
              v-model="loginForm.verCode"
              placeholder="验证码"
              style="width:70%"
              name="verCode"
              type="text"
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
        </el-col>
        <el-col style="width:35%;" :span="4" :offset="1">
          <el-image
            style="width:100%; height: 47px;padding-top: 2px"
            :src="verCodeImg"
            @click="getVerCode"
          /></el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button
            :loading="loading"
            style="width:100%;margin-bottom:30px;"
            type="primary"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-link target="_blank" @click="forget">忘记密码？</el-link>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-link target="_blank" @click="register">没有帐号?去注册</el-link>
        </el-col>
      </el-row>
    </el-form>
    <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          Or connect with
        </el-button>
     <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog> -->
    <div class="foot">北京科技有限公司</div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  components: { },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (/^1[0-9]{10}$/.test(value)) {
        callback()
      } else if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
        callback()
      } else if (/^\w{6,20}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入用户名/登录手机/邮箱！'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (/(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}/.test(value)) {
        callback()
      } else {
        callback(new Error('密码由8至20位字母，数字，特殊字符组成！'))
      }
    }
    const validateVerCode = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入验证码！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '18310768225',
        password: 'abcd-123',
        key: '',
        verCode: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verCode: [{ required: true, trigger: 'blur', validator: validateVerCode }]
      },
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      verCodeImg: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else if (this.loginForm.verCode === '') {
      this.$refs.verCode.focus()
    }
    this.getVerCode()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(response => {
              console.log('code', response.code)
              if (response.code === 700) {
                Message({
                  message: response.message,
                  type: 'warning',
                  duration: 5 * 1000
                })
                this.getVerCode()
              }
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    forget() {
      this.$router.push({ path: 'forget', query: this.otherQuery })
    },
    register() {
      this.$router.push({ path: 'register', query: this.otherQuery })
    },
    getVerCode() {
      this.$store
        .dispatch('user/verCode')
        .then(response => {
          this.loginForm.key = response.key
          this.verCodeImg = response.verCode
        })
        .catch(e => {
          console.error(e)
        })
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/login.scss";
</style>
