<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="权限名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(0)">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addPrivilege">
        添加
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      :data="list"
      border
      row-key="PrivilegeId"
      @row-click="editPrivilege"
    >
      <el-table-column
        align="center"
        label="角色名称"
        prop="name"
      />
      <el-table-column
        align="center"
        label="角色标识"
        prop="ename"
      />
      <el-table-column
        align="center"
        label="备注"
        prop="description"
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
      <div class="drawer-head"><label>{{ isNewEdit === true ? '添加角色' : '修改角色' }}</label><span class="drawer-head-span" /></div>
      <div class="drawer-body">
        <el-form ref="dataForm" class="drawer-form-content" :rules="rules" :model="temp" label-width="80px">
          <div class="drawer-form-title"><label>角色信息</label></div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色名称" label-width="100px" prop="name">
                <el-input
                  v-model="temp.name"
                  placeholder="填写角色名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色标识" label-width="100px" prop="ename">
                <el-input
                  v-model="temp.ename"
                  placeholder="填写角色标识"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" label-width="100px" prop="description">
                <el-input
                  v-model="temp.description"
                  placeholder="填写备注"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="temp.PrivilegeId"
                type="hidden"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="角色权限" label-width="100px" prop="privileges">
              <el-checkbox-group v-model="temp.privileges">
                <el-checkbox v-for="privilege in privilegeList" :key="privilege.value" :label="privilege.value">{{ privilege.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>

        </el-form>
      </div>

      <div class="drawer-foot">
        <el-row type="flex" justify="center">
          <el-col :span="5">
            <el-button type="primary" icon="el-icon-edit" @click="saveOrUpdatePrivilege()">保 存</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="warning" icon="el-icon-close" @click="cancelForm">关 闭</el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { findRolePrivilege } from '@/api/privilege'
import { roleList, saveOrUpdateRole } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Privilege',
  directives: { waves },
  components: { Pagination },
  data() {
    const validateName = (rule, value, callback) => {
      if (value && value.length < 50) {
        callback()
      } else {
        callback(new Error('请填写角色名称，长度小于50位！'))
      }
    }
    const validateEname = (rule, value, callback) => {
      if (/^[a-zA-Z0-9]{1,50}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请填写角色标识，长度小于50位！'))
      }
    }
    const validateDescription = (rule, value, callback) => {
      if (!value || value.length < 50) {
        callback()
      } else {
        callback(new Error('长度小于50位！'))
      }
    }

    return {
      loading: true,
      dialog: false,
      isNewEdit: false,
      listQuery: {
        name: '',
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      privilegeList: [],
      temp: {
        roleId: '',
        name: '',
        ename: '',
        description: '',
        privileges: []
      },
      rules: {
        name: [{ required: true, validator: validateName }],
        ename: [{ required: true, validator: validateEname }],
        description: [{ validator: validateDescription }],
        privileges: [{ required: true, message: '角色权限' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.openLoading()
      roleList(this.listQuery).then(response => {
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
        roleId: undefined,
        name: '',
        ename: '',
        description: '',
        privileges: []
      }
    },
    findRolePrivilege(roleId) {
      findRolePrivilege({ roleId: roleId }).then(response => {
        this.privilegeList = response.data.privilegeList
        this.temp.privileges = response.data.rolePrivilegeList
      })
    },
    addRole() {
      if (this.isNewEdit === false) {
        this.resetTemp()
        this.findRolePrivilege()
        this.isNewEdit = true
      }
      this.dialog = true
    },
    editRole(row, event, column) {
      this.findRolePrivilege(row.roleId)
      this.temp.roleId = row.roleId
      this.temp.name = row.name
      this.temp.ename = row.ename
      this.temp.description = row.description
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
        .catch(_ => {})
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
