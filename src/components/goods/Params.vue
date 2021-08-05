<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意 只允许为三级分类添加参数或属性" type="warning" show-icon :closable=false></el-alert>
      <el-row class="sel-cate">
        <el-col><span>选择商品分类:</span>
          <el-cascader v-model="selectCateKeys" :options="cateList" :props="setProps" clearable @change="handlChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="addDialog">添加参数</el-button>
          <!-- 参数表格 -->
          <el-table :data='manyTabData' border stripe>
            <!--展开行 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <!-- tag标签 -->
                <el-tag closable @close='deleteTag(index,scope.row)' v-for="(item, index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 添加按钮 -->
                <el-input class="input-new-tag add-tag-inp" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column label="# " type='index'></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete " @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="addDialog">添加属性</el-button>
          <!-- 属性表格 -->
          <el-table :data='onlyTabData' border stripe>
            <!--展开 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <!-- tag标签 -->
                <el-tag closable @close='deleteTag(index,scope.row)' v-for="(item, index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 添加按钮 -->
                <el-input class="input-new-tag add-tag-inp" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column label="# " type='index'></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性对话框 -->
    <el-dialog :title="'添加' + textTitle" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数属性对话框 -->
    <el-dialog :title="'修改' + textTitle" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqGetCateList,
  reqGetParamsList,
  reqAddParams,
  reqByIdSearchParams,
  reqSubmitParams,
  reqDeleteParams
} from '@/api'
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 双向数据绑定，保存选择的id
      selectCateKeys: [],
      //级联选择器的配置选项
      setProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // tab中选项卡的name、、激活名称
      activeName: 'many',
      // 保存的是动态参数数据
      manyTabData: [],
      // 静态属性
      onlyTabData: [],
      // 添加对话框显示与隐藏
      addDialogVisible: false,
      // 添加表单
      addForm: {
        attr_name: '',
      },
      //添加参数表单验证规则
      addFormRules: {
        attr_name: {
          required: true, //必填项
          message: '请输参数名称',
          trigger: 'blur', //失去焦点时验证
        },
      },

      // 隐藏显示修改对话框
      editDialogVisible: false,
      // 修改对话框的表单数据
      editForm: {
        attr_name: ''
      },
      // 修改参数表单验证规则
      editFormRules: {
        attr_name: {
          required: true, //必填项
          message: '请输参数名称',
          trigger: 'blur', //失去焦点时验证
        },
      },
      // 输入框的显示与隐藏
      inputVisible: false,
      // 输入框双向数据绑定
      inputValue: '',

    }
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    // 获取所有商品分分类
    async getCateList() {
      const res = await reqGetCateList();
      if (res.meta.status !== 200) return this.$message.error('获取分类失败');
      this.cateList = res.data;

    },
    // 级联选择器中发生变化时触发
    handlChange() {
      this.getParamsData();
    },
    // tab选中时触发
    handleTabClick() {
      this.getParamsData();
    },
    // 获取参数数据
    async getParamsData() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return
      }
      const res = await reqGetParamsList(this.cateId, { sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败');
      //将attr_vals由字符串转为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每一个行添加一个属性，控制输入框的显示隐藏
        item.inputVisible = false
        // 表单双向绑定
        item.inputValue = ''

      })
      if (this.activeName === "many")
        this.manyTabData = res.data;
      else
        this.onlyTabData = res.data;
    },
    // 添加参数或属性对话框
    addDialog() {
      this.addDialogVisible = true;
    },
    // 关闭对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的数据');
        const id = this.cateId;
        const addParamsForm = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
        const res = await reqAddParams(id, addParamsForm);
        if (res.meta.status !== 201) return this.$message.error('添加失败');
        this.$message.success(res.meta.msg);
        this.addDialogVisible = false;
        this.getParamsData();
      })
    },
    // 修改按钮，对话框
    async showEditDialog(params) {
      const res = await reqByIdSearchParams(params.cat_id, params.attr_id, { attr_sel: this.activeName });
      if (res.meta.status !== 200) return this.$message.error('获取参数失败');
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //  监视关闭修改对话框，重置表单
    editDialogClose(params) {
      this.$refs.editFormRef.resetFields();
    },
    // 修改的确定按钮
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('参数填写错误');
        const attrInfo = { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        const res = await reqSubmitParams(this.cateId, this.editForm.attr_id, attrInfo);
        if (res.meta.status !== 200) return this.$message.error('编辑失败');
        this.$message.success(res.meta.msg);
        // 刷新列表
        this.getParamsData();
        // /关闭对话框
        this.editDialogVisible = false;
      });
    },
    // 删除操作
    deleteParams(params) {
      this.$confirm(`是否删除参数 ${params.attr_name} `, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await reqDeleteParams(this.cateId, params.attr_id);
        if (res.meta.status !== 200) return this.$message.error('删除失败');
        this.$message.success('删除成功!');
        this.getParamsData();
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 键盘enter抬起/或失去焦点
    async saveTag(row) {
      const attrInfo = {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' '),
      }
      // 发送请求，添加可选参数
      const res = await reqSubmitParams(this.cateId, row.attr_id, attrInfo);
      if (res.meta.status !== 200) return this.$message.error('添加失败');
      this.$message.success(res.meta.msg);
    },

    handleInputConfirm(row) {
      if (!row.inputValue.trim()) {
        row.inputVisible = false;
        row.inputValue = '';
        return
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveTag(row);
      row.inputVisible = false;
      row.inputValue = '';
    },
    deleteTag(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveTag(row);
    },
    // 点击添加按钮
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },



  },
  computed: {
    // 是否禁用按钮
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 选中的分类id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null
    },
    //对话框的标题
    textTitle() {
      if (this.activeName === 'many') return '动态参数';
      return '静态属性'
    }

  }
}
</script>

<style lang="less" scoped>
.sel-cate {
  margin-top: 15px;
}
.sel-cate span {
  margin-right: 15px;
}
.el-tag {
  margin: 10px;
}
.add-tag-inp {
  width: 100px;
}
</style>
