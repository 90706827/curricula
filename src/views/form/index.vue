<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="重复密码" prop="rePassword">
        <el-input v-model="ruleForm.rePassword" type="password" show-password autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="ruleForm.mobile" />
      </el-form-item>
      <el-form-item label="身份证号码" prop="peopleID">
        <el-input v-model="ruleForm.peopleID" />
      </el-form-item>
      <el-form-item label="车牌号" prop="carId">
        <el-input v-model="ruleForm.carId" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>

      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery" />
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Form',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.rePassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        rePassword: '',
        mobile: '',
        peopleID: '',
        carId: '',
        email: '',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z]w{1,4}$/, message: '以字母开头，长度在2-5之间， 只能包含字符、数字和下划线' }
        ],
        name: [
          { required: true, pattern: /^[\u4E00-\u9FA5]+$/, message: '用户名只能为中文' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 6 到 20 个字符' },
          { pattern: /^(\w){8,20}$/, message: '只能输入6-20个字母、数字、下划线' }
        ],
        rePassword: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: function(rule, value, callback) {
            if (/^1[34578]\d{9}$/.test(value) === false) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        peopleID: [
          { required: true, message: '请输入身份证ID', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确' }
        ],
        carId: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { pattern: /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/,
            message: '常规格式：京A88888' }
        ],
        email: [{
          required: true, // 是否必填
          message: '请输入邮箱地址', // 错误提示信息
          trigger: 'blur'// 检验方式（blur为鼠标点击其他地方，）
        },
        {
          type: 'email', // 要检验的类型（number，email，date等）
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']// （change为检验的字符变化的时候）
        }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否确认提交', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            if (valid) {
              this.$message({
                message: '成功',
                type: 'success'
              })
            }
          }).catch(() => {
            /**
               * 点击了取消按钮
               */
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields() // 移除校验结果并重置字段值
      this.$refs[formName].clearValidate() // 移除校验结果
    }
  }
}
</script>

<style scoped>

</style>
