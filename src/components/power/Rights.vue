<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限列表 -->
    <el-card>
      <el-table :data='rightsList' border stripe>
        <el-table-column label='#' type="index"></el-table-column>
        <el-table-column label='权限名称' prop="authName"></el-table-column>
        <el-table-column label='路径' prop="path"></el-table-column>
        <el-table-column label='权限等级' prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { reqGetRightList } from "../../api"
export default {
  data() {
    return {
      rightsList: []
    }
  },

  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const res = await reqGetRightList();
      if (res.meta.status !== 200) return this.$message.error("权限列表获取失败")
      this.$message.success("权限列表获取成功");
      this.rightsList = res.data;
    }
  },
}
</script>

<style scoped>
/* .el-breadcrumb{
  font-size:16px;
} */
</style>
