<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(0)">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addUser">
        添加
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      :data="list"
      row-key="userId"
      @row-click="editUser"
    >
      <el-table-column
        align="center"
        label="头像"
        prop="photo"
      >
        <template slot-scope="{row}">
          <el-image
            style="width:40px; height:40px;"
            :src="row.photo"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名"
        prop="username"
      />
      <el-table-column
        align="center"
        label="昵称"
        prop="nickname"
      />
      <el-table-column
        align="center"
        label="手机"
        prop="phone"
      />
      <el-table-column
        align="center"
        label="状态"
        prop="status"
      >
        <template slot-scope="{row}">
          <span v-if="row.status=== '0'">待激活</span>
          <span v-else-if="row.status=== '1'">正常</span>
          <span v-else-if="row.status=== '2'">冻结</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="性别"
        prop="gender"
      >
        <template slot-scope="{row}">
          <span v-if="row.gender=== 1">男</span>
          <span v-else-if="row.gender=== 0">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="邮箱"
        prop="email"
      />
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="handleFilter"
    />
    <!-- 增加修改 -->
    <el-drawer
      ref="drawer"
      :before-close="handleClose"
      :visible.sync="dialog"
      :show-close="false"
      size="50%"
      :with-header="false"
      direction="rtl"
    >
      <div class="drawer-head"><label>{{ isNewEdit === true ? '添加用户' : '修改用户' }}</label><span class="drawer-head-span" /></div>
      <div class="drawer-body">
        <el-form ref="dataForm" class="drawer-form-content" :rules="rules" :model="temp" label-width="80px">
          <el-row :gutter="20">
            <el-avatar style="margin:40px" shape="circle" :size="100" :src="temp.photo" />
            <el-input
              v-model="temp.userId"
              type="hidden"
            />
            <el-input
              v-model="temp.photo"
              type="hidden"
            />
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名称" label-width="100px" prop="username">
                <el-input
                  v-model="temp.username"
                  placeholder="填写用户名"
                  :disabled="isNewEdit===false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称" label-width="100px" prop="nickname">
                <el-input
                  v-model="temp.nickname"
                  placeholder="填写昵称"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机号码" label-width="100px" prop="phone">
                <el-input
                  v-model="temp.phone"
                  placeholder="填写手机号码"
                  :disabled="isNewEdit===false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" label-width="100px" prop="gender">
                <el-select v-model="temp.gender" placeholder="请选择性别">
                  <el-option
                    v-for="item in gender"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电子邮箱" label-width="100px" prop="email">
                <el-input
                  v-model="temp.email"
                  placeholder="填写电子邮箱"
                  :disabled="isNewEdit===false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" label-width="100px" prop="status">
                <el-select v-model="temp.status" placeholder="请选择状态">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="isNewEdit" :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户密码" label-width="100px" prop="password">
                <el-input
                  v-model="temp.password"
                  type="password"
                  placeholder="用户密码"
                  show-password
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>
          <el-row>
            <el-form-item label="用户角色" label-width="100px" prop="roles">
              <el-checkbox-group v-model="temp.roles">
                <el-checkbox v-for="role in roleList" :key="role.value" :label="role.value">{{ role.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>

        </el-form>
      </div>

      <div class="drawer-foot">
        <el-row :gutter="20">
          <el-col :span="5"><span>&nbsp;</span></el-col>
          <el-col :span="5"><span>&nbsp;</span></el-col>
          <el-col :span="5">
            <el-button type="primary" icon="el-icon-edit" @click="saveOrUpdateRole()">保 存</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="warning" icon="el-icon-close" @click="cancelForm">关 闭</el-button>
          </el-col>
          <el-col :span="5"><span>&nbsp;</span></el-col>
          <el-col :span="5"><span>&nbsp;</span></el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { findUserRole } from '@/api/user'
import { userList, saveOrUpdateRole } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'User',
  directives: { waves },
  components: { Pagination },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value && value.length > 0) {
        if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确邮箱！'))
        }
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (/^\w{6,20}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入用户名/登录手机/邮箱！'))
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (/^1[0-9]{10}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入用户名/登录手机/邮箱！'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (this.isNewEdit === true) {
        if (/(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}/.test(value)) {
          callback()
        } else {
          callback(new Error('密码由8至20位字母，数字，特殊字符组成！'))
        }
      } else {
        callback()
      }
    }

    return {
      gender: [{ value: 1, label: '男' }, { value: 2, label: '女' }],
      status: [{ value: 0, label: '待激活' }, { value: 1, label: '正常' }, { value: 2, label: '冻结' }],
      loading: true,
      dialog: false,
      disabled: false,
      isNewEdit: false,
      listQuery: {
        username: '',
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      roleList: [],
      temp: {
        userId: '',
        username: '',
        nickname: '',
        password: 'abcd-123',
        gender: 1,
        status: 0,
        photo: 'http://www.images.xiaoke.com/default/head6.jpg',
        email: '',
        phone: '',
        roles: []
      },
      rules: {
        username: [{ required: true, message: '用户名称', validator: validateUsername }],
        phone: [{ required: true, message: '手机号码', validator: validatePhone }],
        email: [{ validator: validateEmail }],
        nickname: [{ required: true, message: '用户昵称' }],
        password: [{ validator: validatePassword }],
        roles: [{ required: true, message: '用户角色' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.openLoading()
      userList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listQuery.page = response.data.page
        this.listQuery.size = response.data.size
      })
      this.closeLoading()
    },
    handleFilter(page) {
      if (page) {
        this.listQuery.page = page.page
        this.listQuery.size = page.limit
      }
      this.getList()
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
        nickname: '',
        username: '',
        password: 'abcd-123',
        gender: 1,
        status: 0,
        photo: 'http://www.images.xiaoke.com/default/head6.jpg',
        email: '',
        phone: '',
        roles: []
      }
    },
    findUserRole(userId) {
      findUserRole({ userId: userId }).then(response => {
        this.roleList = response.data.roleList
        this.temp.roles = response.data.userRoleList
      })
    },
    addUser() {
      if (this.isNewEdit === false) {
        this.resetTemp()
        this.findUserRole()
        this.isNewEdit = true
      }
      this.dialog = true
      this.disabled = true
    },
    editUser(row, event, column) {
      this.findUserRole(row.userId)
      this.temp.userId = row.userId
      this.temp.nickname = row.nickname
      this.temp.username = row.username
      this.temp.gender = row.gender
      this.temp.photo = row.photo
      this.temp.email = row.email
      this.temp.phone = row.phone
      this.dialog = true
      this.isNewEdit = false
    },
    saveOrUpdateRole() {
      console.log('save', this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定要提交表单吗？')
            .then(_ => {
              this.openLoading()
              console.log('temp:', this.temp)
              this.timer = setTimeout(() => {
                console.log('temp:', this.temp)
                saveOrUpdateRole(this.temp).then(resp => {
                  if (resp.code === 200) {
                    this.$refs.drawer.handleClose()
                    this.resetTemp()
                    this.dialogFormVisible = false
                    this.getList()
                  }
                  this.$message({
                    message: resp.code === 200 ? '保存成功！' : resp.message,
                    type: resp.code === 200 ? 'success' : 'error'
                  })
                })
                setTimeout(() => {
                  this.closeLoading()
                }, 1000)
              }, 1000)
            })
            .catch(_ => {})
        }
      })
    },
    handleClose(done) {
      done()
    },
    cancelForm() {
      this.$confirm('确定要关闭吗？')
        .then(_ => {
          this.resetTemp()
          this.dialog = false
        })
    },
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    closeLoading() {
      this.loading.close()
    }
  }
}
</script>

<style lang="scss" scoped>

    @import "~@/styles/oneself.scss";

</style>
