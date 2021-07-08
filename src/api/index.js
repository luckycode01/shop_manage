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
// export const reqLogin = loginForm => request.post('login',  loginForm )
// export const reqLogin = loginForm => request.post('login',  loginForm )
// export const reqLogin = loginForm => request.post('login',  loginForm )
// export const reqLogin = loginForm => request.post('login',  loginForm )
// export const reqLogin = loginForm => request.post('login',  loginForm )
// export const reqLogin = loginForm => request.post('login',  loginForm )
