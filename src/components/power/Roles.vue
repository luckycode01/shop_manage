<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 ，角色列表 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bd-bottom', index1 ? '' : 'bd-top', 'row-center']" v-for="(item, index1) in scope.row.children" :key="item.id">
              <!-- 渲染一级菜单 -->
              <el-col :span="5">
                <el-tag size="mini">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级菜单 -->
              <el-col :span="19">
                <el-row :class="[index2 ? 'bd-top' : '', 'row-center']" v-for="(item, index2) in item.children" :key="item.id">
                  <!-- 二级菜单 -->
                  <el-col :span="6">
                    <el-tag size="mini" type="success">{{
                      item.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单 -->
                  <el-col :span="18">
                    <el-tag size="mini" type="warning" v-for="item in item.children" :key="item.id" closable @close="deleteRightById(scope.row, item.id)">{{ item.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
            <!-- 分配权限 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="closeAddRoleDialog">
      <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="addRoleFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close='closeEditDialog'>
      <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="addRoleFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限分配对话框 -->
    <el-dialog title="配置权限" :visible.sync="setRightDialogVisible" width="50%" @close="checkedKeys = []">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="rightsProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="checkedKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqGetRolesList,
  reqDeleteRight,
  reqGetRightTree,
  reqRoleEmpower,
  reqAddRole,
  reqSearchRoleId,
  reqSubRoleInfo,
  reqDeleteRole,
} from '../../api'
export default {
  data() {
    return {
      // 添加角色数据表单
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 表单验证
      addRoleFormRules: {
        roleName: {
          required: true, //必填项
          message: '请输入分类名称',
          trigger: 'blur', //失去焦点时验证
        },
      },
      // 查询的角色数据
      editRoleForm: {},
      // 获取角色数据
      rolesList: [],
      // 是否显示添加对话框
      addRoleDialogVisible: false,
      // 是否显示编辑对话框
      editRoleDialogVisible: false,
      // 是否显示删除对话框
      deleteRoleDialogVisible: false,
      //控制配置权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      rightsProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的权限Id值
      checkedKeys: [],
      //当前将要分配角色的Id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色数据
    async getRolesList() {
      const res = await reqGetRolesList()
      if (res.meta.status !== 200) return this.$message.error('角色获取失败')
      this.$message.success('角色获取成功')
      this.rolesList = res.data
    },
    // 删除权限
    async deleteRightById(role, rightId) {
      // 确认是否删除
      const confirmRes = await this.$confirm(
        '是否永久删除该用户,该操作不可逆是否继续',
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') return this.$message.info('您已取消删除')
      // 调用函数发送请求
      const res = await reqDeleteRight(role.id, rightId)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      role.children = res.data
    },
    // 分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const res = await reqGetRightTree()
      if (res.meta.status !== 200)
        return this.$message.error('权限列表获取失败')
      this.$message.success(res.meta.msg)
      this.rightsList = res.data
      this.setRightDialogVisible = true
      // 获取默认权限id，调用getLeafKeys函数
      this.getLeafKeys(role, this.checkedKeys)
    },
    // 获取三级权限的id（递归）
    getLeafKeys(node, arr) {
      // 如果没有子节点了，说明为三级权限
      if (!node.children) return arr.push(node.id)
      // 如果还有子节点，遍历子节点，递归调用，
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 分配权限按钮事件
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const keyStr = keys.join(',')
      const res = await reqRoleEmpower(this.roleId, { rids: keyStr })
      if (res.meta.status !== 200) return this.$message.error('权限更新失败')
      this.$message.success(res.meta.msg)
      // 关闭对话框
      this.setRightDialogVisible = false
      // 刷新列表
      this.getRolesList()
    },
    // 编辑角色对话框
    async showEditRoleDialog(role) {
      const res = await reqSearchRoleId(role.id)
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.$message.success(res.meta.msg)
      //将查询的数据保存
      this.editRoleForm = res.data
      // 打开编辑对话框
      this.editRoleDialogVisible = true
    },
    //点击确认编辑并更新角色
    async editRole() {
      const { roleName, roleDesc } = this.editRoleForm
      if (!roleDesc || !roleName)
        return this.$message.error('输入角色以及角色描述有误')
      // 发送编辑角色请求
      const res = await reqSubRoleInfo(this.editRoleForm.roleId, {
        roleName,
        roleDesc,
      })
      if (res.meta.status !== 200) return this.$message.error('角色修改失败')
      this.$message.success(res.meta.msg)
      // 关闭对话框
      this.editRoleDialogVisible = false
      // 修改角色后刷新列表
      this.getRolesList()
    },
    closeEditDialog() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 删除角色
    async deleteRole(role) {
      const confirmData = await this.$confirm(
        `是否删除角色'${role.roleName}'`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmData !== 'confirm') return this.$message.info('您已取消删除')
      // 发送请求，删除角色
      const res = await reqDeleteRole(role.id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success(res.meta.msg)
      // 删除刷新列表
      this.getRolesList()
    },
    // 确定添加角色
    async addRole() {
      const { roleName, roleDesc } = this.addRoleForm
      if (!roleDesc || !roleName) {
        this.addRoleForm = {
          roleName: '',
          roleDesc: '',
        }
        return this.$message.error('请输入角色以及角色描述')
      }
      const res = await reqAddRole({ roleName, roleDesc })
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')

      this.$message.success(res.meta.msg)
      // 关闭对话框
      this.addRoleDialogVisible = false
      // 添加角色后刷新列表
      this.getRolesList()
    },
    // 监视添加角色对话框关闭
    closeAddRoleDialog() {
      // 重置表单
      this.$refs.addRoleFormRef.resetFields()
    },
  },
}
</script>

<style scoped>
.bd-top {
  border-top: 1px solid #eeeeee;
}
.bd-bottom {
  border-bottom: 1px solid #eeeeee;
}
.el-tag {
  margin: 7px;
}
.row-center {
  display: flex;
  align-items: center;
}
</style>
