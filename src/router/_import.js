
export default file => {
  return map[file] || map['dashboard']
}

const map = {
  template: () => import('@/views/template/index'),
  theme: () => import('@/views/theme/index'),
  system: () => import('@/views/system/user'),
  dashboard: () => import('@/views/dashboard/index'),
  user: () => import('@/views/system/user'),
  role: () => import('@/views/system/role'),
  menuList: () => import('@/views/system/menuList'),
  addMenu: () => import('@/views/system/addMenu'),
  nestedMenu1: () => import('@/views/nested/menu1/index'),
  nestedMenu11: () => import('@/views/nested/menu1/menu1-1'),
  nestedMenu12: () => import('@/views/nested/menu1/menu1-2'),
  nestedMenu121: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  nestedMenu122: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  nestedMenu13: () => import('@/views/nested/menu1/menu1-3'),
  nestedMenu2: () => import('@/views/nested/menu2/index')
}
