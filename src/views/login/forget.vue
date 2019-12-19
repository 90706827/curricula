<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-row>
        <div class="title-container">
          <h3 class="title">找回密码</h3>
        </div>
      </el-row>
      <el-row class="title-container">
        <el-col>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入手机号码"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="14">
          <el-form-item prop="verCode">
            <span class="svg-container">
              <i class="el-icon-key" />
            </span>
            <el-input
              ref="verCode"
              v-model="loginForm.verCode"
              style="width:70%"
              maxlength="6"
              placeholder="验证码"
              name="verCode"
              type="text"
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
          >发送验证码{{ count }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="输入密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="rePassword">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="rePassword"
                v-model="loginForm.rePassword"
                :type="passwordType"
                placeholder="重复输入密码"
                name="rePassword"
                tabindex="2"
                auto-complete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
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
  </div>
</template>

<script>

export default {
  name: 'Forget',
  components: { },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('请输入用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码！'))
      } else {
        callback()
      }
    }
    const validateRsPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请再次输入密码！'))
      } else if (value !== this.loginForm.password) {
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
        username: '',
        password: '',
        rePassword: '',
        verCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRsPassword }],
        verCode: [{ required: true, trigger: 'blur', validator: validateVerCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      verCodeLoading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      saveLoading: false,
      disabled: false,
      count: ''
    }
  },
  created() {
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
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
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    forget() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.saveLoading = true
          this.$store.dispatch('user/forget', this.loginForm)
            .then((resp) => {
              this.$message({
                message: resp.code === 200 ? '修改密码成功！' : '修改密码失败！',
                type: resp.code === 200 ? 'success' : 'error'
              })
              if (resp.code === 200) {
                setTimeout(() => {
                  this.saveLoading = false
                  this.$router.push({ path: 'login' })
                }, 2000)
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login() {
      this.$router.push({
        path: 'login' })
    },
    sendTelCode() {
      this.$store
        .dispatch('user/sendTelCode', this.loginForm.username)
        .then(response => {
          console.log('sendTelCode', response)
          if (response.code === 200) {
            var i = 1
            var timer = setInterval(() => {
              this.count = '(' + i + ')'
              i++
              console.log('clearInterval:', this.count)
            }, 1000)
            this.loading = true
            setTimeout(() => {
              clearInterval(timer)
              this.loading = false
              this.count = ''
              console.log('clearInterval:', this.disabled)
            }, 5000)
          }
        })
        .catch(e => {
          console.error(e)
        })
    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    padding-bottom: 40px;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
 .el-row {
    margin-bottom: 20px;
    height: 50px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    height: 75px;
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
