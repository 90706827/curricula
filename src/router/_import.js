
import Layout from '@/layout'

export default file => {
  return map[file] || null
}

const map = {
  layout: () => Layout,
  theme: () => import('@/views/theme/index'),
  system: () => import('@/views/system/user'),
  dashboard: () => import('@/views/dashboard/index'),
  user: () => import('@/views/system/user'),
  role: () => import('@/views/system/role'),
  menu: () => import('@/views/system/menu')
}
