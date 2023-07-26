<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="630"
    :show-close="false"
    top="60px"
    class="product-edit-modal"
    :before-close="handleClose"
  >
    <div slot="title" class="edit-title">
      <div>
        <el-tag v-if="parent_id" effect="dark">
          {{ parent_id }}
        </el-tag>
        {{ modalTitle }}
      </div>
      <div class="switch-title">
        <el-switch
          v-model="formData.active"
          active-color="#00BC4B"
          inactive-color="#EEEEEE"
          :width="48"
        />
        <div
          class="switch-label"
          style="color: #00BC4B;"
        >
          Active
        </div>
      </div>
    </div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="基础信息" description="配置 1"></el-step>
      <el-step title="参与者配置" description="配置 2"></el-step>
      <el-step title="奖励规则配置" description="配置 3"></el-step>
      <el-step title="限制与通知" description="配置 4"></el-step>
    </el-steps>

    <div v-show="active === id_basic" class="tableContainer">
      <BasicForm ref="BasicForm" />
    </div>
    <div v-show="active === id_participant" class="tableContainer">
      <ParticipantForm ref="ParticipantForm" />
    </div>
    <div v-show="active === id_rewardRules" class="tableContainer">
      <RewardRulesForm ref="RewardRulesForm" />
    </div>
    <div v-show="active === id_limitNotice" class="tableContainer">
      <LimitNoticeForm ref="LimitNoticeForm" />
    </div>

    <div
      style="
          margin: 12px 0;
          height: 1px;
          background-color: #eeeeee;
          width: 100%;
        "
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <div>
        <el-button
          type="info"
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          v-if="active > 0"
          @click="configurePre"
        >
          上一步
        </el-button>
      </div>
      <div>
        <el-button
          v-if="active < 3"
          type="primary"
          @click="next"
        >
          下一步
        </el-button>
        <el-button
          v-if="active === 3 && !isEdit"
          type="primary"
          @click="configureSubmit"
        >
          创建
        </el-button>
        <el-button
          v-if="active === 3 && isEdit"
          type="primary"
          @click="updateSubmit"
        >
          更新
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import BasicForm from '@/components/EditForm/IncentiveForm/basicForm.vue'
import ParticipantForm from '@/components/EditForm/IncentiveForm/participantForm.vue'
import RewardRulesForm from '@/components/EditForm/IncentiveForm/rewardRulesForm.vue'
import LimitNoticeForm from '@/components/EditForm/IncentiveForm/limitNoticeForm.vue'
import { getActive, addActive } from '@/api/activities'
export default {
  components: {
    BasicForm,
    ParticipantForm,
    RewardRulesForm,
    LimitNoticeForm
  },
  data() {
    return {
      modalTitle: '创建激励活动',
      dialogVisible: false,
      isEdit: false,
      active: 0,
      id_basic: 0,
      id_participant: 1,
      id_rewardRules: 2,
      id_limitNotice: 3,
      parent_id: '',
      formData: {
        active: true
      },
      DataForm: '',
      data_basicForm: '',
      data_participantForm: '',
      data_rewardRulesForm: '',
      data_limitNoticeForm: ''
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    show(item) {
      if (item) {
        if (item.isEdit) {
          this.isPreview = item.isPreview
          this.modalTitle = item.active_name
          this.parent_id = item.parent_id
        }
      } else {
        this.isEdit = false
      }
      this.dialogVisible = true
    },
    edit(para) {
      const id = para.id
      this.isEdit = para.isEdit
      console.log('this.isEdit', this.isEdit)
      if (id) {
        getActive(id).then((res) => {
          console.log('editdata', res)
          this.$refs.BasicForm.getData(res.data)
          this.$refs.ParticipantForm.getData(res.data)
          this.$refs.RewardRulesForm.getData(res.data)
          this.$refs.LimitNoticeForm.getData(res.data)
        })
      } else {
        console.log('1221212')
      }
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    configurePre() {
      this.active--
    },
    next() {
      if (this.active === 0) {
        this.$refs.BasicForm.conlog()
        this.$refs.BasicForm.$refs['basicForm'].validate(valid => {
          if (valid) {
            // console.log('表单basicForm验证通过')
            this.data_basicForm = this.$refs.BasicForm.pushData()
            console.log('this.data_basicForm', this.data_basicForm)
            this.active++
          } else {
            console.log('表单basicForm验证失败')
          }
        })
      } else if (this.active === 1) {
        this.$refs.ParticipantForm.conlog()
        this.$refs.ParticipantForm.$refs['participantForm'].validate(valid => {
          if (valid) {
            // console.log('表单participantForm验证通过')
            this.data_participantForm = this.$refs.ParticipantForm.pushData()
            console.log('this.data_participantForm', this.data_participantForm)
            this.active++
          } else {
            console.log('表单participantForm验证失败')
          }
        })
      } else if (this.active === 2) {
        this.$refs.RewardRulesForm.conlog()
        this.$refs.RewardRulesForm.$refs['rewardRulesForm'].validate(valid => {
          if (valid) {
            // console.log('表单rewardRulesForm验证通过')
            this.data_rewardRulesForm = this.$refs.RewardRulesForm.pushData()
            console.log('this.data_rewardRulesForm', this.data_rewardRulesForm)
            this.active++
          } else {
            console.log('表单rewardRulesForm验证失败')
          }
        })
      }
    },
    configureSubmit() {
      this.$refs.LimitNoticeForm.conlog()
      this.$refs.LimitNoticeForm.$refs['limitNoticeForm'].validate(valid => {
        if (valid) {
          // console.log('表单LimitNoticeForm验证通过')
          this.data_limitNoticeForm = this.$refs.LimitNoticeForm.pushData()
          console.log('this.data_limitNoticeForm', this.data_limitNoticeForm)
          console.log('提交')
          // this.active++
          this.DataForm = {
            ...this.data_basicForm,
            ...this.data_participantForm,
            ...this.data_rewardRulesForm,
            ...this.data_limitNoticeForm
          }
          console.log('this.DataForm', this.DataForm)
          addActive(this.DataForm).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.dialogVisible = false
          })
        } else {
          console.log('表单LimitNoticeForm验证失败')
        }
      })
    },
    updateSubmit() {
      console.log('更新')
    },
    cancel() {
      this.$confirm('将会丢失已配置的数据，确认取消?')
        .then((_) => {
          this.dialogVisible = false
          this.active = 0
        })
        .catch((_) => { })
    },
    handleClose(done) {
      this.$confirm('将会丢失已配置的数据，确认关闭？')
        .then((_) => {
          this.active = 0
          done()
        })
        .catch((_) => { })
    }
  }
}
</script>
<style lang="scss" scoped>
  .edit-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch-title {
      display: flex;
      width: 100px;
      align-items: center;
      .switch-label {
        text-align: right;
        font-size: 14px;
        margin-left: 10px;
        font-weight: 500;
      }
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: space-between;
  }
  .tableContainer{
    padding: 10px;
    margin-top: 20px;
  }
</style>
<style lang="scss">
  .frontLimit .el-form-item__content{
    display: flex;
    align-items: center;
  }
  .partition{
    display: block;
    color: #ADADAD;
    font-size: 12px;
    margin-bottom: 12px;
  }
</style>
