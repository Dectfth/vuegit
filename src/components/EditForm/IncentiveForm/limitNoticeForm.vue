<template>
  <el-form ref="limitNoticeForm" :model="limitNoticeForm" :rules="limitNoticeRules" label-position="left" label-width="130px" class="demo-Form demo-limitNoticeForm">
    <span class="partition">限制</span>
    <el-form-item label="奖励审批" prop="is_award_audit">
      <el-select v-model="limitNoticeForm.is_award_audit" placeholder="请选择奖励审批" clearable>
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="参与用户限制" prop="user_limit">
      <el-select v-model="limitNoticeForm.user_limit" placeholder="请选择参与用户限制" clearable>
        <el-option label="注册用户" value="1"></el-option>
        <el-option label="游客" value="2"></el-option>
      </el-select>
    </el-form-item>

    <span class="partition">通知</span>
    <div class="EmailNotice">
      <el-form-item label="参与通知" prop="join_notify_object">
        <el-select v-model="limitNoticeForm.join_notify_object" placeholder="请选择参与通知" clearable>
          <el-option label="是（双方）" value="1"></el-option>
          <el-option label="是（仅分享者）" value="2"></el-option>
          <el-option label="是（仅被分享者）" value="3"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="limitNoticeForm.join_notify_object > 0" prop="join_notify_template_name">
        <el-select v-model="limitNoticeForm.join_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;">
          <el-option
            v-for="(item, key) in participationEmail"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="EmailNotice">
      <el-form-item label="进度通知" prop="progress_notify_object">
        <el-select v-model="limitNoticeForm.progress_notify_object" placeholder="请选择进度通知" clearable>
          <el-option label="推荐方" value="1"></el-option>
          <el-option label="被推荐方" value="2"></el-option>
          <el-option label="双方" value="3"></el-option>
          <el-option label="无" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="limitNoticeForm.progress_notify_object > 0" prop="progress_notify_template_name">
        <el-select v-model="limitNoticeForm.progress_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;">
          <el-option
            v-for="(item, key) in participationEmail"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="EmailNotice">
      <el-form-item label="完成通知" prop="finish_notify_object">
        <el-select v-model="limitNoticeForm.finish_notify_object" placeholder="请选择完成通知" clearable>
          <el-option label="推荐方" value="1"></el-option>
          <el-option label="被推荐方" value="2"></el-option>
          <el-option label="双方" value="3"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="limitNoticeForm.finish_notify_object > 0" prop="finish_notify_template_name">
        <el-select v-model="limitNoticeForm.finish_notify_template_name" placeholder="请选择通知邮件模板" clearable style="margin-left: 15px;">
          <el-option
            v-for="(item, key) in participationEmail"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <!-- <span class="partition">后置触发</span>
    <el-form-item label="完成后触发" prop="completion">
      <el-input v-model="limitNoticeForm.completion" disabled clearable></el-input>
    </el-form-item> -->
  </el-form>
</template>

<script>
import { getEmailTemplatelist } from '@/api/emailTemplate'

export default {
  data() {
    return {
      participationEmail: [
        {
          label: 'Email_SSM_JOIN_Default_1',
          value: 'Email_SSM_JOIN_Default_1'
        },
        {
          label: 'Email_SSM_JOIN_Default_2',
          value: 'Email_SSM_JOIN_Default_2'
        }
      ],
      limitNoticeForm: {
        is_award_audit: '',
        user_limit: '',
        join_notify_object: '',
        join_notify_template_name: '',
        progress_notify_object: '',
        progress_notify_template_name: '',
        finish_notify_object: '',
        finish_notify_template_name: ''
        // completion: '无'
      },
      limitNoticeRules: {
        is_award_audit: [
          { required: true, message: '请至少选择一个奖励审批', trigger: 'blur' }
        ],
        user_limit: [
          { required: true, message: '请至少选择一种用户类型', trigger: 'blur' }
        ],
        join_notify_object: [
          { required: true, message: '请至少选择一个参与通知', trigger: 'change' }
        ],
        join_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ],
        progress_notify_object: [
          { required: true, message: '请至少选择一个进度通知', trigger: 'change' }
        ],
        progress_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ],
        finish_notify_object: [
          { required: true, message: '请至少选择一个进度通知', trigger: 'change' }
        ],
        finish_notify_template_name: [
          { required: true, message: '请至少选择一个邮件模板', trigger: 'change' }
        ]
        // completion: [
        //   { required: true, trigger: 'change' }
        // ]
      }
    }
  },
  mounted() {
    this.getEmail()
  },
  methods: {
    getEmail() {
      const params = {
        size: 30,
        currentPage: 1
      }
      getEmailTemplatelist(params).then((res) => {
        const EmailData = []
        res.data.temps.forEach((item) => {
          EmailData.push({
            label: item.tempName,
            value: item.tempName
          })
        })
        this.participationEmail = EmailData
      })
    },
    conlog() {
      console.log('limitNoticeForm', this.limitNoticeForm)
    },
    pushData() {
      return this.limitNoticeForm
    },
    getData(data) {
      if (!data) return
      this.limitNoticeForm = {
        // ...data
        is_award_audit: data.is_award_audit,
        user_limit: data.user_limit,
        join_notify_object: data.join_notify_object,
        join_notify_template_name: data.join_notify_template_name,
        progress_notify_object: data.progress_notify_object,
        progress_notify_template_name: data.progress_notify_template_name,
        finish_notify_object: data.finish_notify_object,
        finish_notify_template_name: data.finish_notify_template_name
      }
      console.log(this.limitNoticeForm, '.this.limitNoticeForm')
    }
  }
}
</script>
<style lang="scss" scoped>
  .EmailNotice{
    display: flex;
    justify-content: space-between;
  }
</style>
