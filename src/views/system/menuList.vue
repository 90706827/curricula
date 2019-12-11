<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="菜单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter()">
        查询B
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%"
      row-key="menuId"
      border=""
      :tree-props="{children:'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        fixed
        align="center"
        prop="title"
        label="菜单名称"
        width="140"
      />
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
        align="center"
        prop="redirect"
        label="重定向"
        width="120"
      />
      <el-table-column
        align="center"
        prop="component"
        label="视图标识"
        width="120"
      />
      <el-table-column
        align="center"
        prop="icon"
        label="图标"
        width="120"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="顺序"
        width="120"
      />
      <el-table-column
        align="center"
        prop="description"
        label="描述"
        width="120"
      />
      <el-table-column
        align="center"
        prop="hidden"
        label="显示类型"
        width="120"
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
        width="120"
      >
        <template slot-scope="{row}">
          <span v-if="row.status=== 1">正常</span>
          <span v-else-if="row.status=== 0">冻结</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="140" label="操作" class-name="small-padding fixed-width">
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
  </div>
</template>
<script>
import { menuList, menuChildList } from '@/api/system'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
export default {
  name: 'MenuList',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      listQuery: {
        title: '',
        page: 0,
        size: 10
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
      parentList: []
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
          this.total = response.data.totalPages
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
    handleFilter() {
      this.listQuery.page = 0
      this.getList()
    },
    resetTemp() {
      this.temp = {
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
      }
    },
    loadParentList() {
      this.parentList = []
    },
    handleCreate(id) {
      this.$router.push({ path: '/system/menu/addMenu' })
      // this.loadParentList()
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

    }
  }
}
</script>
<style scoped>

</style>
