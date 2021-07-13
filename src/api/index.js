import request from './request'

// 登录请求
export const reqLogin = loginForm => request.post('login', loginForm)
// 获取左边菜单请求
export const reqMenus = () => request.get('menus')
// 获取用户信息列表信息
export const reqUsers = userList => request.get('users', { params: userList })
//添加用户
export const reqAddUser = addFrom => request.post('users', addFrom)
// 改变用户状态
export const reqChangeState = (id, state) =>
  request.put(`users/${id}/state/${state}`)
// 根据Id查看用户信息
export const reqSearchUser = id => request.get(`users/${id}`)
// 编辑用户信息提交
export const reqEditUserInfo = (id, args) => request.put(`users/${id}`, args)
// 删除用户
export const reqDeleteUser = id => request.delete('users/' + id)
// 获取权限列表
export const reqGetRightList = () => request.get('rights/list')
// 所有权限列表——树形
export const reqGetRightTree = () => request.get('rights/tree')
// 获取角色列表
export const reqGetRolesList = () => request.get('roles')
// 角色授权
export const reqRoleEmpower = (roleId, rids) =>
  request.post(`roles/${roleId}/rights`, rids)
// 删除角色指定权限
export const reqDeleteRight = (roleId, rightId) =>
  request.delete(`roles/${roleId}/rights/${rightId}`)
// 分配角色请求
export const reqSetRole = (id, rid) => request.put(`users/${id}/role`, rid)
// 添加角色
export const reqAddRole = roleInfo => request.post('roles', roleInfo)
// 编辑角色   根据 ID 查询角色
export const reqSearchRoleId = id => request.get('roles/' + id)
//
//编辑角色提交
export const reqSubRoleInfo = (id, roleInfo) =>
  request.put('roles/' + id, roleInfo)
//删除角色
export const reqDeleteRole = id => request.delete('roles/' + id)
