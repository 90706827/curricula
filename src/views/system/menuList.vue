<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="菜单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(0)" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(0)">查 询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-document-add" @click="addMenu()">新 增</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%; height: 100%"
      row-key="menuId"
      border=""
      :stripe="true"
      :tree-props="{ children:'children', hasChildren: 'hasChildren'}"
      @row-click="editMenu"
    >
      <el-table-column
        fixed
        header-align="center"
        align="left"
        prop="title"
        label="菜单名称"
        width="200"
      />
      <el-table-column
        align="center"
        prop="icon"
        label="图标"
        width="60"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="菜单标识"
        width="120"
      />
      <el-table-column
        align="center"
        prop="path"
        label="菜单路径"
        width="120"
      />
      <el-table-column
        align="left"
        header-align="center"
        prop="redirect"
        label="重定向"
        width="250"
      />
      <el-table-column
        align="center"
        prop="component"
        label="视图标识"
        width="180"
      />
      <el-table-column
        align="center"
        prop="sort"
        label="顺序"
        width="60"
      />
      <el-table-column
        align="center"
        prop="hidden"
        label="显示类型"
        width="80"
      >
        <template slot-scope="{row}">
          <span v-if="row.hidden=== 'false'">显示</span>
          <span v-else-if="row.hidden=== 'true'">隐藏</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="状态"
        width="80"
      >
        <template slot-scope="{row}">
          <span v-if="row.status=== 1">正常</span>
          <span v-else-if="row.status=== 0">冻结</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        header-align="center"
        prop="description"
        label="描述"
        width="250"
      />
    </el-table>
    <!-- 分页 -->
    <pagination
      :v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="handleFilter"
    />
    <!-- 新增 -->
    <el-drawer
      ref="drawer"
      :before-close="handleClose"
      :visible.sync="dialog"
      :show-close="false"
      size="50%"
      :with-header="false"
      direction="rtl"
    >
      <div class="drawer-head"><label>添加菜单</label><span class="drawer-head-span" /></div>
      <div class="drawer-body">
        <el-form ref="dataForm" class="drawer-form-content" :rules="rules" :model="temp" label-width="80px">
          <div class="drawer-form-title"><label>菜单信息</label></div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="父类菜单" label-width="100px" prop="parentId">
                <el-cascader
                  v-model="temp.parentId"
                  placeholder="选择所属父类菜单"
                  :multiple="false"
                  :options="selectMenu"
                  :props="{ checkStrictly: true,expandTrigger:'hover',emitPath:false}"
                  :show-all-levels="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标" label-width="100px" prop="icon">

                <el-button type="primary" :icon="temp.icon" @click="vcloak()">选择图标</el-button>
                <el-input
                  v-model="temp.icon"
                  :hidden="true"
                  placeholder="填写菜单图标"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称" label-width="100px" prop="title">
                <el-input
                  v-model="temp.title"
                  placeholder="填写菜单名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单路径" label-width="100px" prop="path">
                <el-input
                  v-model="temp.path"
                  placeholder="填写菜单路径"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单标识" label-width="100px" prop="name">
                <el-input
                  v-model="temp.name"
                  placeholder="填写菜单标识"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单视图" label-width="100px" prop="component">
                <el-input
                  v-model="temp.component"
                  placeholder="填写菜单视图"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="重定路径" label-width="100px" prop="redirect">
                <el-input
                  v-model="temp.redirect"
                  placeholder="填写重定向路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单排序" label-width="100px" prop="sort">
                <el-input
                  v-model="temp.sort"
                  type="number"
                  placeholder="填写菜单排序"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单隐藏" label-width="100px" prop="hidden">
                <el-switch
                  v-model="temp.hidden"
                  active-value="false"
                  inactive-value="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单状态" label-width="100px" prop="status">
                <el-switch
                  v-model="temp.status"
                  active-value="1"
                  inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" label-width="100px" prop="description">
                <el-input
                  v-model="temp.description"
                  placeholder="填写备注信息"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="temp.menuId"
                placeholder="菜单ID"
              />
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="drawer-foot">
        <el-row :gutter="20">
          <el-col :span="5"><span>&nbsp;</span></el-col>
          <el-col :span="5">
            <el-button type="primary" icon="el-icon-edit" :loading="loading" @click="saveOrUpdateMenu()">保 存</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="danger" icon="el-icon-delete" :disabled="disabled" @click="delMenu()">删 除</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="warning" icon="el-icon-close" @click="cancelForm">关 闭</el-button>
          </el-col>
          <el-col :span="4"><span>&nbsp;</span></el-col>
        </el-row>

      </div>
    </el-drawer>
  </div>
</template>
<script>
import { menuList, menuChildList, saveOrUpdateMenu, deleteMenu } from '@/api/system'
import { selectMenu } from '@/api/common'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'MenuList',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      dialog: false,
      listLoading: false,
      loading: false,
      listQuery: {
        title: '',
        page: 1,
        size: 5
      },
      total: 0,
      list: [],
      temp: {
        menuId: undefined,
        parentId: undefined,
        path: '',
        redirect: '',
        component: '',
        hidden: 'false',
        name: '',
        title: '',
        icon: '',
        sort: '',
        description: '',
        status: '1'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请填写菜单路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请填写菜单图标', trigger: 'blur' }],
        name: [{ required: true, message: '请填写菜单标识', trigger: 'blur' }],
        component: [{ required: true, message: '请填写菜单视图', trigger: 'blur' }]
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '80px',
      activeName: 'first',
      disabled: true,
      selectMenu: [],
      isNewEdit: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // new Promise((resolve, reject) => {
      menuList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.total
        this.listQuery.page = response.data.page
        this.listQuery.size = response.data.size
        // resolve()
      }).catch(() => {
        // reject(error)
      })
      // })
      this.listLoading = false
    },
    load(tree, treeNode, resolve) {
      console.log('table:', tree.menuId, treeNode)
      const menuId = tree.menuId
      menuChildList({ parentId: menuId }).then(resp => {
        console.log('menuChildList:', resp.data)
        resolve(resp.data)
      })
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
        menuId: undefined,
        parentId: undefined,
        path: '',
        redirect: '',
        component: '',
        hidden: 'false',
        name: '',
        title: '',
        icon: '',
        sort: '',
        description: '',
        status: '1'
      }
    },
    addMenu() {
      if (this.isNewEdit === false) {
        this.isNewEdit = true
        this.resetTemp()
      }
      this.loadSelectMenu()
      this.dialog = true
      this.disabled = true
    },
    saveOrUpdateMenu(done) {
      console.log('save', this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.loading) {
            return
          }
          this.$confirm('确定要提交表单吗？')
            .then(_ => {
              this.loading = true
              this.timer = setTimeout(() => {
                saveOrUpdateMenu(this.temp).then(resp => {
                  console.log('saveOrUpdateMenur', resp)
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
                // 动画关闭需要一定的时间
                setTimeout(() => {
                  this.loading = false
                }, 1000)
              }, 1000)
            })
            .catch(_ => {})
        }
      })
    },
    loadSelectMenu() {
      selectMenu().then(resp => {
        this.selectMenu = resp.data
      })
    },
    editMenu(row, event, column) {
      console.log('row', row)
      this.isNewEdit = false
      this.temp.menuId = row.menuId
      this.temp.parentId = row.parentId
      this.temp.path = row.path
      this.temp.redirect = row.redirect
      this.temp.component = row.component
      this.temp.hidden = row.hidden
      this.temp.name = row.name
      this.temp.title = row.title
      this.temp.icon = row.icon
      this.temp.sort = row.sort
      this.temp.description = row.description
      this.temp.status = row.status

      this.loadSelectMenu()
      this.dialog = true
      if (row.children) {
        console.log('disabled')
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    delMenu() {
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.listLoading = true
          this.timer = setTimeout(() => {
            deleteMenu({ menuId: this.temp.menuId, parentId: this.temp.parentId }).then(resp => {
              if (resp.code === 200) {
                this.$refs.drawer.handleClose()
                this.resetTemp()
                this.dialogFormVisible = false
                this.getList()
              }
              this.$message({
                message: resp.code === 200 ? '删除成功！' : '删除失败！',
                type: resp.code === 200 ? 'success' : 'error'
              })
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1000)
          }, 2000)
        })
        .catch(_ => {})
    },
    handleClose(done) {
      done()
    },
    cancelForm() {
      this.$confirm('确定要关闭吗？')
        .then(_ => {
          this.resetTemp()
          // this.listLoading = false
          this.dialog = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>

    @import "~@/styles/oneself.scss";

</style>
