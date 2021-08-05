import service from './request'

// 登录请求
export const reqLogin = loginForm => service.post('login', loginForm)
// 获取左边菜单请求
export const reqMenus = () => service.get('menus')
// 获取用户信息列表信息
export const reqUsers = userList => service.get('users', { params: userList })
//添加用户
export const reqAddUser = addFrom => service.post('users', addFrom)
// 改变用户状态
export const reqChangeState = (id, state) =>
  service.put(`users/${id}/state/${state}`)
// 根据Id查看用户信息
export const reqSearchUser = id => service.get(`users/${id}`)
// 编辑用户信息提交
export const reqEditUserInfo = (id, args) => service.put(`users/${id}`, args)
// 删除用户
export const reqDeleteUser = id => service.delete('users/' + id)
// 获取权限列表
export const reqGetRightList = () => service.get('rights/list')
// 所有权限列表——树形
export const reqGetRightTree = () => service.get('rights/tree')
// 获取角色列表
export const reqGetRolesList = () => service.get('roles')
// 角色授权
export const reqRoleEmpower = (roleId, rids) =>
  service.post(`roles/${roleId}/rights`, rids)
// 删除角色指定权限
export const reqDeleteRight = (roleId, rightId) =>
  service.delete(`roles/${roleId}/rights/${rightId}`)
// 分配角色请求
export const reqSetRole = (id, rid) => service.put(`users/${id}/role`, rid)
// 添加角色
export const reqAddRole = roleInfo => service.post('roles', roleInfo)
// 编辑角色   根据 ID 查询角色
export const reqSearchRoleId = id => service.get('roles/' + id)
//编辑角色提交
export const reqSubRoleInfo = (id, roleInfo) =>
  service.put('roles/' + id, roleInfo)
//删除角色
export const reqDeleteRole = id => service.delete('roles/' + id)
// 商品分类数据列表
export const reqGetCateList = queryInfo =>
  service.get('categories', { params: queryInfo })
// 获取分类列表
// export const reqParentCateList = type =>
//   service.get('categories', { params: { type: type } })
// 添加分类
export const reqAddCate = cateFrom => service.post('categories', cateFrom)
// 根据ID查询分类信息
export const reqIdSearchCate = id => service.get('categories/' + id)
// 发送修改请求
export const reqIdEditCate = (id, cat_name) =>
  service.put('categories/' + id, cat_name)
// 删除分类
export const reqDeleteCate = id => service.delete('categories/' + id)

// 参数列表
export const reqGetParamsList = (id, sel) =>
  service.get(`categories/${id}/attributes`, { params: sel })
// 添加参数/属性
export const reqAddParams = (id, addParamsForm) =>
  service.post(`categories/${id}/attributes`, addParamsForm)
// 根据Id查询参数
export const reqByIdSearchParams = (id, attrId, attr_sel) =>
  service.get(`categories/${id}/attributes/${attrId}`, attr_sel)
//编辑提交参数
export const reqSubmitParams = (id, attrId, attrInfo) =>
  service.put(`categories/${id}/attributes/${attrId}`, attrInfo)
// 删除参数
export const reqDeleteParams = (id, attrId) =>
  service.delete(`categories/${id}/attributes/${attrId}`)

// 获取商品列表数据
export const reqGetGoodsList = queryInfo =>
  service.get('goods', { params: queryInfo })
// export const reqAddCate = cateFrom => service.post('categories',cateFrom)
