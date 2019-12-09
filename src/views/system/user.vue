<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(1)">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="头像" prop="photo">
        <template slot-scope="{row}">
          <el-image
            style="width:40px; height:40px;"
            :src="row.photo"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="昵称" prop="nickname" />
      <el-table-column align="center" label="手机" prop="phone" />
      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="{row}">
          <span v-if="row.gender=== 1">男</span>
          <span v-else-if="row.gender=== 0">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="生日" prop="birth" />
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="{row}">
          <span v-if="row.status=== '1'">正常</span>
          <span v-else-if="row.status=== '0'">冻结</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="250" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button type="primary" effect="dark" size="small" @click="handleUpdate(row)">编辑</el-button>
            <el-button type="danger" effect="dark" size="small" @click="handleDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="handleFilter" />
    <!-- 增加，修改-->
    <el-dialog title="标题" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :data="roleAllList"
            show-checkbox
            highlight-current
            node-key="id"
            :props="{children: 'children', label: 'name'}"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userSave, userUpdate, userRemove, getRoleAllList, getUserRoleList } from '@/api/user'
import { userList } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'User',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      listQuery: {
        username: '',
        page: 0,
        size: 10
      },
      total: 0,
      list: [],
      roleAllList: [],
      roleListChecked: [],
      temp: {
        id: undefined,
        username: '',
        email: '',
        phone: '',
        roleList: []
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        username: [{ required: true, message: '用户名称', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      new Promise((resolve, reject) => {
        userList(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalPages
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
      this.listLoading = false
      // userList(this.listQuery).then(response => {
      //   this.list = response.data.content
      //   this.total = response.data.totalPages
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.1 * 1000)
      // })
    },
    getRoleAllList() {
      getRoleAllList().then(resp => {
        this.roleAllList = resp.data
      })
    },
    handleFilter() {
      this.listQuery.page = 0
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        email: '',
        phone: '',
        roleList: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.getRoleAllList()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.roleList = this.$refs.tree.getCheckedKeys()
          userSave(this.temp).then(resp => {
            if (resp.success) {
              this.getList()
              this.dialogFormVisible = false
            }
            this.$message({
              message: resp.message,
              type: resp.success ? 'success' : 'info'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      const { id, username, phone, email } = row
      this.temp = { id, username, phone, email }
      this.getRoleAllList()
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        getUserRoleList({ id: id }).then(resp => {
          this.$refs.tree.setCheckedKeys(resp.data)
        })
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.roleList = this.$refs.tree.getCheckedKeys()
          userUpdate(this.temp).then(resp => {
            if (resp.success) {
              this.getList()
              this.dialogFormVisible = false
            }
            this.$message({
              message: resp.message,
              type: resp.success ? 'success' : 'info'
            })
          })
        }
      })
    },
    handleDelete(row) {
      const tip = `${row.username} ${this.$t('table.delete')}`
      this.$confirm(tip, this.$t('table.prompt'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        this.list = []
        userRemove({ id: row.id }).then(resp => {
          this.getList()
          this.$message({
            message: resp.message,
            type: resp.success ? 'success' : 'info'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('table.cancel')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
