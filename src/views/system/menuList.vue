<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="菜单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column fixed="right" align="center" width="140" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button type="primary" effect="dark" size="small" @click="handleCreate(row)">编辑</el-button>
          </el-button-group>
        </template>
      </el-table-column>
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
        <el-form class="drawer-form-content" :rules="rules" :model="temp" label-width="80px">
          <div class="drawer-form-title"><label>菜单信息</label></div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="父类菜单" label-width="100px" prop="parentId">
                <el-cascader
                  v-model="temp.parentId"
                  :multiple="false"
                  :options="selectMenu"
                  :props="{ checkStrictly: true,expandTrigger:'hover',emitPath:false}"
                  :show-all-levels="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="is-required" label="菜单路径" label-width="100px" prop="path">
                <el-input v-model="temp.path" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="is-required" label="菜单名称" label-width="100px" prop="title">
                <el-input v-model="temp.title" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="is-required" label="菜单图标" label-width="100px" prop="icon">
                <el-input v-model="temp.icon" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item class="is-required" label="菜单标识" label-width="100px" prop="name">
                <el-input v-model="temp.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="is-required" label="菜单视图" label-width="100px" prop="component">
                <el-input v-model="temp.component" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="重定路径" label-width="100px" prop="redirect">
                <el-input v-model="temp.redirect" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单排序" label-width="100px" prop="sort">
                <el-input v-model="temp.sort" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单隐藏" label-width="100px" prop="name">
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
                <el-input v-model="temp.description" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-input v-model="temp.menuId" />
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="drawer-foot">
        <el-row :gutter="20">
          <el-col :span="5"><span>&nbsp;</span></el-col>
          <el-col :span="5">
            <el-button type="primary" icon="el-icon-edit" :loading="listLoading" @click="saveMenu()">{{ listLoading ? '提交中 ...' : '保 存' }}</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="danger" icon="el-icon-delete" :disabled="disabled" @click="cancelForm">删 除</el-button>
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
import { menuList, menuChildList } from '@/api/system'
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
        hidden: '',
        name: '',
        title: '',
        icon: '',
        sort: '',
        description: '',
        status: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: '显示标题', trigger: 'blur' }],
        path: [{ required: true, message: '请求路径', trigger: 'blur' }]
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
      selectMenu: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      new Promise((resolve, reject) => {
        menuList(this.listQuery).then(response => {
          this.list = response.data.content
          console.log('list', this.list)
          this.total = response.data.total
          console.log('total', this.total)
          this.listQuery.page = response.data.page
          this.listQuery.size = response.data.size
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
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
      this.loadSelectMenu()
      this.dialog = true
    },
    saveMenu() {
      // $refs.drawer.closeDrawer()
      console.log('save', this.temp)
    },
    loadSelectMenu() {
      selectMenu().then(resp => {
        console.log('selectMenu:', resp.data)

        this.selectMenu = resp.data
      })
    },
    handleCreate(row) {
      console.log('row', row)
      // this.$router.push({ path: '/system/menu/addMenu' })
      // this.loadSelectMenu()
      // this.resetTemp()
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleUpdate() {

    },
    handleDelete() {

    },
    handleClose(done) {
      if (this.listLoading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.listLoading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.listLoading = false
            }, 100)
          }, 1000)
        })
        .catch(_ => {})
    },
    handleClick() {

    },
    cancelForm() {
      this.listLoading = false
      this.dialog = false
      clearTimeout(this.timer)
    }
  }
}
</script>
<style lang="scss" scoped>

    @import "~@/styles/oneself.scss";

</style>
