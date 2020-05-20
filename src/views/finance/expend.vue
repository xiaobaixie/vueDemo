<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">支出中心</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-date-picker v-model="queryInfo.startDate" type="date" placeholder="开始日期" value-format="yyyy-MM-dd" />
          -
          <el-date-picker v-model="queryInfo.endDate" type="date" placeholder="结束日期" value-format="yyyy-MM-dd" />
          <el-input placeholder="请输入内容" v-model="queryInfo.expendName" clearable @clear="listExpend">
            <el-button slot="append" icon="el-icon-search" @click="listExpend"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加支出</el-button>
        </el-col>
      </el-row>
      <el-table :data="expendList" stripe height="250" border style="width: 100%" max-height="250" show-summary>
        <el-table-column label="序号" type="index" fixed/>
        <el-table-column label="支出名称" width="100" prop="expendName" />
        <el-table-column label="支出时间" prop="expendDate" :formatter="formatDate" width="100"/>
        <el-table-column label="支出类别" prop="expendType" width="100"/>
        <el-table-column label="支出方式" prop="payerMode" width="120"/>
        <el-table-column label="收款方" prop="payee" />
        <el-table-column label="单价" prop="price" />
        <el-table-column label="数量" prop="amount" />
        <el-table-column label="总金额" prop="totalMoney"/>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="创建时间" prop="createDate" :formatter="formatDate"/>
        <el-table-column label="修改时间" prop="updateDate" :formatter="formatDate"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditDialog(scope.row.expendId)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteExpend(scope.row.expendId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加支出" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="支出名称" prop="expendName">
          <el-input v-model="addForm.expendName"></el-input>
        </el-form-item>
        <el-form-item label="支出时间" prop="expendDate" label-width="200">
            <el-date-picker v-model="addForm.expendDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="支出类别" prop="expendType">
          <el-input v-model="addForm.expendType"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payerMode">
          <el-input v-model="addForm.payerMode"></el-input>
        </el-form-item>
        <el-form-item label="收款方" prop="payee">
          <el-input v-model="addForm.payee"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="addForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="总金额" prop="totalMoney">
          <el-input v-model="addForm.totalMoney"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addExpend">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改支出" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="支出名称" prop="expendName">
          <el-input v-model="editForm.expendName"></el-input>
        </el-form-item>
        <el-form-item label="支出时间" prop="expendDate" label-width="200">
            <el-date-picker v-model="editForm.expendDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="支出类别" prop="expendType">
          <el-input v-model="editForm.expendType"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payerMode">
          <el-input v-model="editForm.payerMode"></el-input>
        </el-form-item>
        <el-form-item label="收款方" prop="payee">
          <el-input v-model="editForm.payee"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="editForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="总金额" prop="totalMoney">
          <el-input v-model="editForm.totalMoney"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateExpend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        startDate: '',
        endDate: '',
        expendName: '',
        pageNum: 1,
        pageSize: 10
      },
      expendList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        expendName: '',
        expendDate: '',
        expendType: '',
        payerMode: '',
        payee: '',
        price: '',
        amount: '',
        totalMoney: '',
        remark: ''
      },
      addFormRules: {
        expendName: [
          {required: true, message: '请输入支出名称', trigger: 'blur'}
        ],
        expendDate: [
          {required: true, message: '请输入支出时间', trigger: 'blur'}
        ]
      },
      editDialogVisible: false,
      editForm: {}
    }
  },
  created () {
    this.listExpend()
  },
  methods: {
    async listExpend () {
      const res = await this.$http.get('/expend/index', {params: this.queryInfo})
      if (res.code !== '00') {
        return this.$msg.error(res.message)
      }
      this.expendList = res.data.list
      this.total = res.data.total
    },
    formatDate (row, column) {
      let date = row[column.property]
      if (date === undefined || date === null) {
        return ''
      }
      return this.moment(date).format('YYYY-MM-DD')
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.listExpend()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.listExpend()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addExpend () {
      this.$http({
        url: '/expend/insert',
        method: 'post',
        data: JSON.stringify(this.addForm)
      }).then(res => {
        if (res.code === '00') {
          this.$msg.success('添加用户成功')
          this.addDialogVisible = false
          this.listExpend()
        } else {
          return this.$msg.error(res.message)
        }
      })
    },
    async showEditDialog (expendId) {
      const res = await this.$http.get('/expend/select?expendId=' + expendId)
      if (res.code !== '00') {
        return this.$msg.error(res.message)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    updateExpend () {
      this.$http({
        url: '/expend/update',
        method: 'post',
        data: JSON.stringify(this.editForm)
      }).then(res => {
        if (res.code === '00') {
          this.$msg.success('修改支出成功')
          this.editDialogVisible = false
          this.listExpend()
        } else {
          return this.$msg.error(res.message)
        }
      })
    },
    deleteExpend (expendId) {
      this.$http({
        url: '/expend/delete',
        method: 'post',
        params: {
          expendId: expendId
        }
      }).then(res => {
        if (res.code === '00') {
          this.$msg.success('删除支出成功')
          this.listExpend()
        } else {
          return this.$msg.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .el-card {
    box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
  }
  .el-table {
    margin-top: 15px;
    font-size: 13px;
  }
  .el-pagination {
    margin-top: 15px;
  }
</style>
