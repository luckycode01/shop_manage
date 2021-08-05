<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右边 卡片试图区 -->
    <el-card class="box-card">
      <!-- 头部搜索区，添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <el-table :data='userList' border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click='deleteUser(scope.row.id)'></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" size="mini" circle @click='setRole(scope.row)'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 3, 5, 7]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">
      <el-form ref="addFromRef" :model="addFrom" :rules="fromRules" label-width="70px">
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='mobile'>
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close='closeEditDialog'>
      <el-form ref="editFormRef" :rules='fromRules' :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close='setRoleDialogClose'>
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
import {
  reqUsers,
  reqAddUser,
  reqChangeState,
  reqSearchUser,
  reqEditUserInfo,
  reqDeleteUser,
  reqGetRolesList,
  reqSetRole

} from "../../api"

export default {
  data() {
    // 邮件验证
    const cheakEmail = (rule, value, cb) => {
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (emailReg.test(value)) {
        return cb();
      }
      cb(new Error("邮箱不合法"))
    };
    // 手机号验证
    const checkMobile = (rule, value, cb) => {
      const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (phoneReg.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"))
    };
    return {
      queryInfo: {
        query: '',
        pagenum: 1,   //当前页码
        pagesize: 5   //每页显示多少条
      },
      userList: [],
      total: 0,   //数据总条数
      // 是否显示添加用户对话框
      addDialogVisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 验证规则
      fromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名应在3-10个字符之间', trigger: 'blur' }
        ],
        // 密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheakEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ],
      },
      // 是否显示修改用户对话框
      editDialogVisible: false,
      // 查询到的用户数据
      editForm: {},
      //分配角色对话框
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 角色列表
      roleList: [],
      selectRoleId: '',
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const res = await reqUsers(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败');
      }
      this.userList = res.data.users;
      this.total = res.data.total

    },
    //监视每页条数的改变 （pagesize）
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监视pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 改变用户状态change事件
    async userStateChange(userinfo) {
      const res = await reqChangeState(userinfo.id, userinfo.mg_state);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        console.log(userinfo);
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    // 关闭添加用户对话框对表单重置
    closeAddDialog() {
      this.$refs.addFromRef.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return this.$message.error('用户信息输入有误请检查后重新提交');
        const res = await reqAddUser(this.addFrom);
        // 添加失败
        if (res.meta.status !== 201) {
          // return this.$message.error('用户添加失败');
          return this.$message.error(res.meta.msg);
        }
        //添加成功
        this.$message.success('用户添加成功');
        // 关闭对话框
        this.addDialogVisible = false;
        // 重新获取用户列表
        this.getUserList();
      })
    },
    //修改用户新信息
    async showEditDialog(id) {
      const res = await reqSearchUser(id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 关闭后重置修改用户信息对话框表单，
    closeEditDialog() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑用户，点击确定进行校验请求
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('信息编辑有误');
        const { email, mobile } = this.editForm;
        const res = await reqEditUserInfo(this.editForm.id, { email, mobile })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 提示修改成功
        this.$message.success(res.meta.msg);
        // 刷新用户列表
        this.getUserList();
        // 关闭对话框
        this.editDialogVisible = false;
      })
    },
    // 删除用户
    async deleteUser(id) {
      // 确认删除用户
      const confirmData = await this.$confirm('是否永久删除该用户,该操作不可逆是否继续', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err);
      //根据返回值，判断是取消还是确认删除
      if (confirmData !== "confirm") return this.$message.info("您已取消删除");
      // 发送删除请求
      const res = await reqDeleteUser(id);
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success(res.meta.msg);
      // 重新加载用户列表
      this.getUserList();
    },
    // 分配角色
    async setRole(userInfo) {
      this.userInfo = userInfo;
      this.setRoleDialogVisible = true;
      const res = await reqGetRolesList();
      if (res.meta.status !== 200) return this.message.error('角色获取失败');
      this.roleList = res.data;
    },
    // 点击确认按钮，分配 角色
    async saveRoleInfo() {
      if (!this.selectRoleId) return this.$message.error('请选择分配的角色')
      const res = await reqSetRole(this.userInfo.id, { rid: this.selectRoleId });
      if (res.meta.status !== 200) return this.$message.error('更新角色失败');
      this.$message.success(res.meta.msg);
      // 关闭对话框
      this.setRoleDialogVisible = false;
      // 刷新列表
      this.getUserList();
    },
    // 监视对话框是否关闭
    setRoleDialogClose() {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }

}
</script>
<style scoped>
</style>
