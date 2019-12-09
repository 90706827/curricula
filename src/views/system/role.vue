<template>
  <div class="app-container">
    <!-- 搜索啊 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="角色" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(1)">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <!-- 角色列表 -->
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="名字" prop="name" />
      <el-table-column width="180" label="标识" prop="ename" />
      <el-table-column width="180" label="描述" prop="description" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column width="250" label="操作" lass-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button type="primary" effect="dark" size="small" @click="handleUpdate(row)">编辑</el-button>
            <el-button type="danger" effect="dark" size="small" @click="handleDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="handleFilter" />
    <!-- 增加，修改 -->
    <el-dialog title="增加" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名字" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="标识" prop="ename">
          <el-input v-model="temp.ename" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :data="menuAllTree"
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
import { roleList, roleSave, roleUpdate, roleRemove, getMenuAllTree, getRoleMenuList } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Role',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      listQuery: {
        name: '',
        page: 1,
        pageSize: 20
      },
      total: 0,
      list: [],
      menuId: 0,
      menuAllTree: [],
      menuListChecked: [],
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        ename: '',
        description: '',
        menuList: []
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        ename: [{ required: true, message: '请填写标识', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      roleList(this.listQuery).then(resp => {
        // this.list = resp.data.rows
        // this.total = resp.data.total
        // this.listQuery.page = resp.data.page
        // this.listQuery.size = resp.data.size
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getMenuAllTree() {
      getMenuAllTree().then(resp => {
        this.menuAllTree = resp.data
      })
    },
    handleFilter(page) {
      if (page) {
        this.listQuery.page = page
      }
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        ename: '',
        description: '',
        menuList: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.getMenuAllTree()
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
          this.temp.menuList = this.$refs.tree.getCheckedKeys()
          roleSave(this.temp).then(resp => {
            if (resp.code === 200) {
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
      const { id, name, ename, description } = row
      this.temp = { id, name, ename, description }
      this.getMenuAllTree()
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        getRoleMenuList({ id: id }).then(resp => {
          this.$refs.tree.setCheckedKeys(resp.data)
        })
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.menuList = this.$refs.tree.getCheckedKeys()
          roleUpdate(this.temp).then(resp => {
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
    load(tree, treeNode, resolve) {
      this.listQuery.id = tree.id
      roleList(this.listQuery).then(resp => {
        resolve(resp.data)
      })
    },
    handleDelete(row) {
      const tip = `${row.name} 删除`
      this.$confirm(tip, '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list = []
        roleRemove({ id: row.id }).then(resp => {
          this.getList()
          this.$message({
            message: resp.message,
            type: resp.success ? 'success' : 'info'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    }
  }
}
</script>
