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
      <el-row>
        <div class="title-container">
          <h3 class="title">用户注册</h3>
        </div>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="phone">
            <el-input
              ref="phone"
              v-model="loginForm.phone"
              placeholder="手机号码"
              name="phone"
              type="text"
              tabindex="1"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="14">
          <el-form-item prop="verCode">
            <el-input
              ref="verCode"
              v-model="loginForm.verCode"
              maxlength="6"
              placeholder="验证码"
              name="verCode"
              type="text"
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
        </el-col>
        <el-col style="width:35%;height:70px;" :span="4" :offset="1">
          <el-button
            style="width:100%;margin-top:7px;"
            type="primary"
            :round="true"
            :loading="loading"
            @click="sendTelCode()"
          >{{ count }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              name="password"
              show-password
              prefix-icon="el-icon-key"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="rePassword">
            <el-input
              ref="rePassword"
              v-model="loginForm.rePassword"
              type="password"
              placeholder="重复密码"
              name="rePassword"
              show-password
              prefix-icon="el-icon-key"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button
            :loading="saveLoading"
            style="width:100%;margin-bottom:30px;"
            type="primary"
            @click.native.prevent="forget"
          >确  定</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-link target="_blank" @click="login">返回登录</el-link>
        </el-col>
      </el-row>
    </el-form>
    <div class="foot">北京科技有限公司</div>

  </div>
</template>

<script>

export default {
  name: 'Register',
  components: { },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (/^1[0-9]{10}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入手机号码！'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (/(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}/.test(value)) {
        callback()
      } else {
        callback(new Error('密码由8至20位字母，数字，特殊字符组成！'))
      }
    }
    const validateRsPassword = (rule, value, callback) => {
      if (value !== this.loginForm.password) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
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
        phone: '18310768225',
        password: 'abcd-123',
        rePassword: 'abcd-123',
        verCode: '123456'
      },
      rules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRsPassword }],
        verCode: [{ required: true, trigger: 'blur', validator: validateVerCode }]
      },
      loading: false,
      verCodeLoading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      saveLoading: false,
      disabled: false,
      count: '验证码'
    }
  },
  created() {
  },
  mounted() {
    if (this.loginForm.phone === '') {
      this.$refs.phone.focus()
    } else if (this.loginForm.verCode === '') {
      this.$refs.verCode.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else if (this.loginForm.rePassword === '') {
      this.$refs.rePassword.focus()
    }
  },
  destroyed() {
  },
  methods: {
    forget() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.saveLoading = true
          this.$store.dispatch('user/register', this.loginForm)
            .then((resp) => {
              if (resp.code === 200) {
                this.$message({
                  message: '用户注册成功！',
                  type: 'success'
                })
                this.$router.push({ path: 'login' })
              }
              setTimeout(() => {
                this.saveLoading = false
              }, 2000)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login() {
      this.$router.push({ path: 'login' })
    },
    sendTelCode() {
      this.$refs.loginForm.validateField('phone', error => {
        if (error === '') {
          this.$store
            .dispatch('user/sendTelCode', { phone: this.loginForm.phone, type: '2' })
            .then(response => {
              if (response.code === 200) {
                var i = 119
                var timer = setInterval(() => {
                  this.count = ' (' + i + ')'
                  i--
                }, 1000)
                this.count = ' (120)'
                this.loading = true
                setTimeout(() => {
                  clearInterval(timer)
                  this.loading = false
                  this.count = '验证码'
                }, 120000)
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
 @import "~@/styles/login.scss";
</style>
