<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="资源名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(0)">查 询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-document-add" @click="addAction()">新 增</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list"
      row-key="actionId"
      :border="true"
      :stripe="true"
      :tree-props="{ children:'children', hasChildren: 'hasChildren'}"
      @row-click="editAction"
    >
      <el-table-column
        fixed
        header-align="center"
        align="left"
        prop="name"
        label="资源名称"
      />

      <el-table-column
        align="center"
        prop="url"
        label="资源路径"
      />
      <el-table-column
        align="left"
        header-align="center"
        prop="description"
        label="注释"
      />
      <el-table-column
        align="center"
        prop="status"
        label="状态"
      >
        <template slot-scope="{row}">
          <span v-if="row.status=== 1">正常</span>
          <span v-else-if="row.status=== 0">冻结</span>
          <span v-else>未知</span>
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
      <div class="drawer-head"><label>{{ isNewEdit === true ? '添加资源' : '修改资源' }}</label><span class="drawer-head-span" /></div>
      <div class="drawer-body">
        <el-form ref="dataForm" class="drawer-form-content" :rules="rules" :model="temp" label-width="80px">
          <div class="drawer-form-title"><label>资源信息</label></div>
          <el-row v-show="true">
            <el-col>
              <el-input
                v-model="temp.actionId"
                type="hidden"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="父类资源" label-width="100px" prop="parentId">
                <el-cascader
                  v-model="temp.parentId"
                  placeholder="选择所属父类资源"
                  :clearable="true"
                  :multiple="false"
                  :options="selectAction"
                  :props="{ checkStrictly: true,expandTrigger:'hover',emitPath:false}"
                  :show-all-levels="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资源名称" label-width="100px" prop="name">
                <el-input
                  v-model="temp.name"
                  placeholder="填写资源名称"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="资源路径" label-width="100px" prop="url">
                <el-input
                  v-model="temp.url"
                  placeholder="填写资源路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注释" label-width="100px" prop="description">
                <el-input
                  v-model="temp.description"
                  placeholder="填写注释"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="资源状态" label-width="100px" prop="status">
                <el-switch
                  v-model="temp.status"
                  active-value="1"
                  inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="正常"
                  inactive-text="冻结"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>
        </el-form>
      </div>

      <div class="drawer-foot">
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-edit" @click="saveOrUpdateAction()">保 存</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="danger" icon="el-icon-delete" :disabled="disabled" @click="delAction()">删 除</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="warning" icon="el-icon-close" @click="cancelForm">关 闭</el-button>
          </el-col>
        </el-row>

      </div>

    </el-drawer>
  </div>
</template>
<script>
import { actionList, saveOrUpdateAction, deleteAction } from '@/api/action'
import { selectAction } from '@/api/common'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Action',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      dialog: false,
      loading: false,
      listQuery: {
        name: '',
        page: 1,
        size: 5
      },
      total: 0,
      list: [],
      temp: {
        actiond: undefined,
        parentId: undefined,
        name: '',
        url: '',
        description: '',
        status: '1'
      },
      rules: {
        name: [{ required: true, message: '请填写资源名称', trigger: 'blur' }],
        url: [{ required: true, message: '请填写资源路径', trigger: 'blur' }]
      },
      disabled: true,
      selectAction: [],
      isNewEdit: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.openLoading()
      actionList(this.listQuery).then(response => {
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
        actiond: undefined,
        parentId: undefined,
        name: '',
        url: '',
        description: '',
        status: '1'
      }
    },
    addAction() {
      if (this.isNewEdit === false) {
        this.isNewEdit = true
        this.resetTemp()
      }
      this.loadSelectAction()
      this.dialog = true
      this.disabled = true
    },
    saveOrUpdateAction(done) {
      console.log('save', this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定要提交表单吗？')
            .then(_ => {
              this.openLoading()
              this.timer = setTimeout(() => {
                saveOrUpdateAction(this.temp).then(resp => {
                  if (resp.code === 200) {
                    this.$refs.drawer.handleClose()
                    this.resetTemp()
                    this.getList()
                  }
                  this.$message({
                    message: resp.code === 200 ? '保存成功！' : resp.message,
                    type: resp.code === 200 ? 'success' : 'error'
                  })
                })
                // 动画关闭需要一定的时间
                setTimeout(() => {
                  this.closeLoading()
                }, 1000)
              }, 1000)
            })
            .catch(_ => {})
        }
      })
    },
    loadSelectAction() {
      selectAction().then(resp => {
        this.selectAction = resp.data
      })
    },
    editAction(row, event, column) {
      console.log('row', row)
      this.loadSelectAction()
      this.isNewEdit = false
      this.temp.actionId = row.actionId
      this.temp.parentId = row.parentId
      this.temp.name = row.name
      this.temp.url = row.url
      this.temp.status = String(row.status)
      this.temp.description = row.description

      console.log('temp', this.temp)
      this.dialog = true
      if (row.children) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    delAction() {
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.openLoading()
          this.timer = setTimeout(() => {
            deleteAction({ actionId: this.temp.actionId, parentId: this.temp.parentId }).then(resp => {
              if (resp.code === 200) {
                this.$refs.drawer.handleClose()
                this.resetTemp()
                this.getList()
              }
              this.$message({
                message: resp.code === 200 ? '删除成功！' : '删除失败！',
                type: resp.code === 200 ? 'success' : 'error'
              })
            })
            setTimeout(() => {
              this.closeLoading()
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
