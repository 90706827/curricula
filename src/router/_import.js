export default file => {
  return map[file] || map['dashboard']
}

const map = {
  template: () => import('@/views/template/index'),
  system: () => import('@/views/system/user'),
  dashboard: () => import('@/views/dashboard/index'),
  user: () => import('@/views/system/user'),
  role: () => import('@/views/system/role'),
  menu: () => import('@/views/system/menu'),
  privilege: () => import('@/views/system/privilege'),
  action: () => import('@/views/system/action')
}
