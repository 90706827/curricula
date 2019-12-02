<template>
  <el-dropdown trigger="click" @command="selectRole">
    <div>
      <svg-icon class-name="size-icon" icon-class="user" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.code" :disabled="roleCode===item.code" :command="item.code">
        {{ item.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'RolesChange',
  data() {
    return {
      sizeOptions: [],
      roleCode: ''
    }
  },
  computed: {
    role() {
      // console.log('token', this.$store.getters.token)
      // console.log('avatar', this.$store.getters.avatar)
      // console.log('name', this.$store.getters.name)
      // console.log('introduction', this.$store.getters.introduction)
      // console.log('roles', this.$store.getters.roles)
      // console.log('role', this.$store.getters.role)
      // console.log('permission_routes', this.$store.getters.permission_routes)

      const role = this.$store.getters.role
      console.log('加载时角色：', role)

      return role
    }
  },
  mounted() {
    this.initRoleOptions()
  },
  methods: {
    initRoleOptions() {
      this.sizeOptions = this.$store.getters.roles
      this.roleCode = this.$store.getters.role
      console.log('roles', this.sizeOptions)
      console.log('roleCode', this.roleCode)
    },
    selectRole(role) {
      this.roleCode = role
      this.$router.push('/')
      this.$store.dispatch('user/changeRoles', role)
      this.$message({
        message: '切换角色成功！',
        type: 'success'
      })
      // this.$nextTick(() => {
      //   this.$router.replace({
      //     path: '/redirect=dashboard'
      //   })
      // })
      // setTimeout(() => {

      // }, 2000)
    }
  }

}
</script>
