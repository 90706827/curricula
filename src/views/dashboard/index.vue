<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import visitorDashboard from './visitor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, visitorDashboard },
  data() {
    return {
      currentRole: 'visitorDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    console.log('is admin visitor:', this.role)
    if (this.role === 'admin') {
      this.currentRole = 'adminDashboard'
    }
  }
}
</script>
