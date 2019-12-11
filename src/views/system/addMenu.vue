<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="菜单名称1" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter()">
        查询A
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 700px; margin-left:50px;">
      <el-row>
        <el-form-item label="菜单ID" label-width="100px" prop="menuId">
          <el-input v-model="temp.menuId" />
        </el-form-item>
        <el-form-item label="父类菜单" label-width="100px" prop="parentId">
          <el-cascader v-model="temp.parentId" placeholder="请选择所属父类菜单" clearable :options="parentList" :show-all-levels="false" />
        </el-form-item>
      </el-row>
      <el-form-item label="菜单路径" label-width="100px" prop="path">
        <el-input v-model="temp.path" />
      </el-form-item>
      <el-form-item label="重定路径" label-width="100px" prop="redirect">
        <el-input v-model="temp.redirect" />
      </el-form-item>
      <el-form-item label="菜单视图" label-width="100px" prop="component">
        <el-input v-model="temp.component" />
      </el-form-item>
      <el-form-item label="菜单隐藏" label-width="100px" prop="hidden">
        <el-input v-model="temp.hidden" />
      </el-form-item>
      <el-form-item label="菜单标识" label-width="100px" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="菜单名称" label-width="100px" prop="title">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="菜单图标" label-width="100px" prop="icon">
        <el-input v-model="temp.icon" />
      </el-form-item>
      <el-form-item label="菜单排序" label-width="100px" prop="sort">
        <el-input v-model="temp.sort" />
      </el-form-item>
      <el-form-item label="备注" label-width="100px" prop="description">
        <el-input v-model="temp.description" />
      </el-form-item>
      <el-form-item label="菜单状态" label-width="100px" prop="status">
        <el-input v-model="temp.status" />
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
      <el-button @click="dialogFormVisible = false">关闭</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </div>
</template>
<script>
import { menuList, menuChildList } from '@/api/system'
import waves from '@/directive/waves'
export default {
  name: 'AddMenu',
  directives: { waves },
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
      this.parentList = [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    },
    handleCreate(id) {
      this.loadParentList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
