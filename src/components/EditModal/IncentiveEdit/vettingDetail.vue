<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="630"
    :show-close="false"
    top="60px"
    class="vetting-edit-modal"
    :before-close="handleClose"
  >
    <div
      slot="title"
      class="edit-title"
    >
      <div>{{ modalTitle }}</div>
      <div style="text-align: right;color: #D8D8D8;">
        <i class="el-icon-refresh"></i> <span>同步间隔：1 day 最新同步：</span>
      </div>
    </div>
    <el-form ref="form" :model="form" :label-position="labelPosition" label-width="80px">
      <div class="model-label">审批信息</div>
      <el-form-item label="用户身份">
        <el-input v-model="form.user_role"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-input v-model="form.user_email"></el-input>
      </el-form-item>
      <el-form-item label="激励动作">
        <el-input v-model="form.incentive_action"></el-input>
      </el-form-item>
      <el-form-item label="激励类型">
        <el-input v-model="form.incentive_type"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="form.incentive_state"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.incentive_value"></el-input>
      </el-form-item>
      <div class="model-label">参与活动信息</div>
      <el-form-item label="时间">
        <el-input v-model="form.order_time"></el-input>
      </el-form-item>
      <el-form-item label="订单金额">
        <el-input v-model="form.order_amount"></el-input>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="form.order_no"></el-input>
      </el-form-item>
    </el-form>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <div>
        <el-button
          type="info"
          @click="failpassItem"
        >
          不通过
        </el-button>
        <el-button
          type="info"
          @click="passItem"
        >
          通过
        </el-button>
      </div>
      <div>

        <el-button
          type="primary"
          @click="configureSubmit"
        >
          确认
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      recordsData: [],
      statisticalList: [{ label: 'limit3', value: '123' }], //
      modalTitle: '用户详情',
      labelPosition: 'left', // form位置
      dialogVisible: false,
      form: {
        // active: false
        user_role: '', // 用户角色，1推荐者2被推荐者3双反
        user_email: '', // * 用户邮箱：
        incentive_action: '', // * 激励动作：
        incentive_type: '', // * 激励类型：
        incentive_value: '', // * 激励的次数或金额或其他
        incentive_state: '', // * 状态：
        order_time: '', // * 订单内容时间
        order_amount: '', // * 订单金额
        order_no: '', // * 订单号
        update_time: ''
      }
    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {
    show(row) {
      this.dialogVisible = true
      if (row) {
        this.form = {
          ...this.form,
          user_role: row.user_role, // 用户角色，1推荐者2被推荐者3双反
          user_email: row.user_email, // * 用户邮箱：
          incentive_action: row.incentive_action, // * 激励动作：
          incentive_type: row.incentive_type, // * 激励类型：
          incentive_state: row.incentive_state, // * 状态：
          incentive_value: row.incentive_value, // * 激励的次数或金额或其他
          order_time: row.order_time, // * 订单内容时间
          order_amount: row.order_amount, // * 订单金额
          order_no: row.order_no // * 订单号
        }
      }
    },
    failpassItem() {
    //   this.$emit('addSuccess', '1')
    },
    passItem() {
    //   this.dialogVisible = false
    },
    configureSubmit() {
      console.log('提交')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => { })
    }

  }
}
</script>
<style lang="scss">

.vetting-edit-modal .el-dialog__body {
    padding: 12px 20px;
}
.vetting-edit-modal {
  .el-dialog__header{
    border-bottom: 1px solid #eee;
  }
  .el-dialog__footer{
    border-top: 1px solid #eee;
  }
}
</style>
<style lang="scss"  scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
.model-label {
      margin-bottom: 0;
      margin-left: 24px;
}
.el-input{
    width: 40%;
}
.model-label {
  color: #adadad;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 20px;
  margin-left: 0;
}
</style>
