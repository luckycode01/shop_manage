<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
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
        <el-table-column label="操作">
          <template slot-scope="">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" size="mini" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">

      <el-form ref="addFromRef" :model="addFrom" :rules="addFromRules" label-width="70px">
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

  </div>

</template>
<script>
export default {
  data() {
    const cheakEmail = (rule, value, cb) => {
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (emailReg.test(value)) {
        return cb();
      }

      cb(new Error("邮箱不合法"))
    };
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

      // 是否显示对话框
      addDialogVisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 验证规则
      addFromRules: {
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
      }

    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo });
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
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        console.log(userinfo);
        return this.$message.error(res.meta.msg);
      }

      this.$message.success(res.meta.msg);
    },
    // 关闭对话框对表单重置
    closeAddDialog() {
      this.$refs.addFromRef.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return this.$message.error('用户信息输入有误请检查后重新提交');
        const { data: res } = await this.$http.post('users', this.addFrom);
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
        getUserList();

      })
    }

  }

}
</script>
<style scoped>
</style>
