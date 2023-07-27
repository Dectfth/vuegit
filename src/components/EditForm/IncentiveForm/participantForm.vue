<template>
  <div>
    <el-form v-if="participantForm.active_type == '1'" ref="participantForm" :model="participantForm" :rules="participantRules" label-position="left" label-width="130px" class="demo-Form demo-participantForm">
      <span class="partition">推荐者Referrer</span>
      <el-form-item label="前置订单限制" required class="frontLimit">
        <el-switch v-model="participantForm.sharer_before_order_limit" prop="sharer_before_order_limit" style="margin-right: 5px;"></el-switch>
        <div :style=" { color: participantForm.sharer_before_order_limit ? '#2B7DE1' : '#DCDFE6' }">{{ participantForm.sharer_before_order_limit ? '开启' : '关闭' }}</div>
        <div v-if="participantForm.sharer_before_order_limit" style="margin-left: 20px;">
          <el-checkbox v-model="participantForm.sharer_order_date_flag" label="时间"></el-checkbox>
          <el-checkbox v-model="participantForm.sharer_sku_flag" label="商品"></el-checkbox>
          <el-checkbox v-model="participantForm.sharer_quantity_flag" label="件数"></el-checkbox>
          <el-checkbox v-model="participantForm.sharer_amount_flag" label="金额"></el-checkbox>
        </div>
      </el-form-item>
      <div v-if="participantForm.sharer_before_order_limit">
        <el-form-item v-if="participantForm.sharer_order_date_flag" label="下单时间" prop="sharer_order_date">
          <el-date-picker
            v-model="participantForm.sharer_order_date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="participantForm.sharer_sku_flag" label="商品SKU" prop="sharer_sku">
          <el-input v-model="participantForm.sharer_sku" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="participantForm.sharer_quantity_flag" label="商品数量" prop="sharer_quantity">
          <el-input v-model.number="participantForm.sharer_quantity" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="participantForm.sharer_amount_flag" label="金额" prop="sharer_amount">
          <el-input v-model.number="participantForm.sharer_amount" clearable></el-input>
        </el-form-item>
      </div>
      <span class="partition">被推荐者Referral</span>
      <el-form-item label="含推荐者自身" required class="frontLimit">
        <el-switch v-model="participantForm.recommender_contains_self" prop="recommender_contains_self" style="margin-right: 5px;"></el-switch>
        <div :style=" { color: participantForm.recommender_contains_self ? '#2B7DE1' : '#DCDFE6' }">{{ participantForm.recommender_contains_self ? '是' : '否' }}</div>
      </el-form-item>
      <el-form-item label="触发动作" prop="recommender_trigger_event">
        <el-select v-model="participantForm.recommender_trigger_event" placeholder="请选择触发动作">
          <el-option
            v-for="(op, index) in triggerEventOptions"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参与次数" prop="recommender_join_times">
        <el-select v-model="participantForm.recommender_join_times" placeholder="请选择参与次数">
          <el-option
            v-for="(op, index) in recommenderJoinTimesOptions"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标商品限制" required class="frontLimit">
        <el-switch v-model="participantForm.recommender_target_item_limit" prop="recommender_target_item_limit" style="margin-right: 5px;"></el-switch>
        <div :style=" { color: participantForm.recommender_target_item_limit ? '#2B7DE1' : '#DCDFE6' }">{{ participantForm.recommender_target_item_limit ? '开启' : '关闭' }}</div>
        <div v-if="participantForm.recommender_target_item_limit" style="margin-left: 20px;">
          <el-checkbox v-model="participantForm.recommender_order_date_flag" label="时间"></el-checkbox>
          <el-checkbox v-model="participantForm.recommender_sku_flag" label="商品"></el-checkbox>
          <el-checkbox v-model="participantForm.recommender_quantity_flag" label="件数"></el-checkbox>
          <el-checkbox v-model="participantForm.recommender_amount_flag" label="金额"></el-checkbox>
        </div>
      </el-form-item>
      <div v-if="participantForm.recommender_target_item_limit">
        <el-form-item v-if="participantForm.recommender_order_date_flag" label="下单时间" prop="recommender_order_date">
          <el-date-picker
            v-model="participantForm.recommender_order_date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="participantForm.recommender_sku_flag" label="商品SKU" prop="recommender_sku">
          <el-input v-model="participantForm.recommender_sku" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="participantForm.recommender_quantity_flag" label="商品数量" prop="recommender_quantity">
          <el-input v-model.number="participantForm.recommender_quantity" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="participantForm.recommender_amount_flag" label="金额" prop="recommender_order_threshold_amount">
          <el-input v-model.number="participantForm.recommender_order_threshold_amount" clearable></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-form v-if="groupparticipantForm.active_type == '2'" ref="participantForm" :model="groupparticipantForm" :rules="groupparticipantRules" label-position="left" label-width="130px" class="demo-Form demo-participantForm">
      <span class="partition">团长Captain</span>
      <el-form-item label="预下单限制" prop="captain_before_order_limit" required>
        <el-select v-model="groupparticipantForm.captain_before_order_limit" placeholder="是否前置订单限制" clearable>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="groupparticipantForm.captain_before_order_limit">
        <el-form-item
          label="开团次数限制"
          prop="captain_group_times"
          class="inputform"
        >
          <el-input-number v-model="groupparticipantForm.captain_group_times" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item
          label="单次购买件数"
          prop="captain_single_purchase_quantity"
          class="inputform"
        >
          <el-input-number v-model="groupparticipantForm.captain_single_purchase_quantity" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item
          label="成团等待时间"
          prop="captain_wait_time_for_group"
          class="inputform"
        >
          <el-input-number v-model="groupparticipantForm.captain_wait_time_for_group" placeholder="请输入内容" :min="0">
          </el-input-number>
          <div>(分钟 Minutes)</div>
        </el-form-item>
      </div>
      <span class="partition">团员Member</span>
      <el-form-item label="预下单限制" prop="member_before_order_limit" required>
        <el-select v-model="groupparticipantForm.member_before_order_limit" placeholder="预下单限制" clearable>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="groupparticipantForm.member_before_order_limit">

        <el-form-item
          label="购买次数限制"
          prop="member_purchase_times"
          class="inputform"
          required
        >
          <el-input-number v-model="groupparticipantForm.member_purchase_times" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item
          label="单次购买件数"
          prop="member_single_purchase_quantity"
          class="inputform"
          required
        >
          <el-input-number v-model="groupparticipantForm.member_single_purchase_quantity" :min="0"></el-input-number>
        </el-form-item>
        <span class="partition">综合</span>
        <el-form-item label="模拟成团" prop="simulation_group" required>
          <el-select v-model="groupparticipantForm.simulation_group" placeholder="是否模拟成团" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- captain_group_times:'',
        captain_single_purchase_quantity:'',  //团长单次购买数量限制
        captain_wait_time_for_group:'',  //成团等待时间 -->
    </el-form>

  </div>
</template>

<script>
import { recommenderTriggerEvent, recommenderJoinTimes } from '@/utils/parameters'

export default {
  data() {
    return {

      triggerEventOptions: [],
      recommenderJoinTimesOptions: [],
      participantForm: {
        sharer_before_order_limit: false,
        sharer_order_date_flag: '',
        sharer_quantity_flag: '',
        sharer_sku_flag: '',
        sharer_amount_flag: '',
        sharer_sku: '',
        sharer_quantity: '',
        sharer_amount: '',
        sharer_order_date: '',
        recommender_contains_self: false,
        recommender_order_date_flag: '',
        recommender_quantity_flag: '',
        recommender_sku_flag: '',
        recommender_amount_flag: '',
        recommender_trigger_event: [],
        recommender_join_times: [],
        recommender_target_item_limit: false,
        recommender_sku: '',
        recommender_quantity: '',
        recommender_order_threshold_amount: '',
        recommender_order_date: ''
      },
      participantRules: {
        frontOrderLimit: [
          { required: true, trigger: 'change' }
        ],
        sharer_sku: [
          { required: true, message: '请输入商品SKU', trigger: 'blur' }
        ],
        sharer_quantity: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', min: 1, message: '请输入正确且大于0的数字', trigger: 'blur' }
        ],
        sharer_amount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', min: 1, message: '请输入正确且大于0的数字', trigger: 'blur' }
        ],
        sharer_order_date: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ],
        recommender_join_times: [
          { required: true, message: '请至少选择一个参与次数', trigger: 'blur' }
        ],
        recommender_contains_self: [
          { required: true, trigger: 'change' }
        ],
        recommender_trigger_event: [
          { required: true, message: '请选择触发动作', trigger: 'blur' }
        ],
        recommender_sku: [
          { required: true, message: '请输入商品SKU', trigger: 'blur' }
        ],
        recommender_quantity: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', min: 1, message: '请输入正确且大于0的数字', trigger: 'blur' }
        ],
        recommender_order_threshold_amount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', min: 1, message: '请输入正确且大于0的数字', trigger: 'blur' }
        ],
        recommender_order_date: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      groupparticipantForm: {
        active_type: '',
        captain_before_order_limit: '',
        captain_group_times: '',
        captain_single_purchase_quantity: '', // 团长单次购买数量限制
        captain_wait_time_for_group: '', // 成团等待时间
        member_single_purchase_quantity: '', // 团员单次购买数量限制
        simulation_group: '', // 模拟成团
        member_purchase_times: ''
      },
      groupparticipantRules: {
        sharer_order_date: [
          { required: true, trigger: 'change' }
        ],
        captain_group_times: [
          { required: true, message: '请输入团长开团次数限制' }
        ],
        captain_single_purchase_quantity: [
          { required: true, message: '请输入团长单次购买数量限制', trigger: 'blur' }
        ],
        captain_wait_time_for_group: [
          { required: true, message: '请输入成团等待时间', trigger: 'blur' }
        ]

      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.triggerEventOptions = this.initOptions(recommenderTriggerEvent)
      this.recommenderJoinTimesOptions = this.initOptions(recommenderJoinTimes)
    },
    initOptions(El) {
      const outputEL = Object.keys(El).map((key) => {
        const value = El[key]
        return {
          label: value,
          value: key * 1
        }
      })
      return outputEL
    },
    conlog() {
      console.log('participantForm', this.participantForm)
    },
    getActiveType(type) {
      console.log('typepartic', type)
      this.groupparticipantForm.active_type = type
      this.participantForm.active_type = type
    },
    pushData() {
      this.participantForm = {
        ...this.participantForm,
        recommender_trigger_event: this.participantForm.recommender_trigger_event * 1,
        recommender_join_times: this.participantForm.recommender_join_times * 1
      }
      return this.participantForm
    },
    getData(data) {
      if (data) {
        if (data.active_type === '1') {
          this.participantForm = {
            active_type: data.active_type,
            sharer_before_order_limit: data.sharer_before_order_limit,
            sharer_order_date_flag: data.sharer_order_date_flag,
            sharer_quantity_flag: data.sharer_quantity_flag,
            sharer_sku_flag: data.sharer_sku_flag,
            sharer_amount_flag: data.sharer_amount_flag,
            sharer_sku: data.sharer_sku,
            sharer_quantity: data.sharer_quantity,
            sharer_amount: data.sharer_amount,
            sharer_order_date: data.sharer_order_date,
            recommender_contains_self: data.recommender_contains_self,
            recommender_order_date_flag: data.recommender_order_date_flag,
            recommender_quantity_flag: data.recommender_quantity_flag,
            recommender_sku_flag: data.recommender_sku_flag,
            recommender_amount_flag: data.recommender_amount_flag,
            recommender_trigger_event: data.recommender_trigger_event,
            recommender_join_times: data.recommender_join_times,
            recommender_target_item_limit: data.recommender_target_item_limit,
            recommender_sku: data.recommender_sku,
            recommender_quantity: data.recommender_quantity,
            recommender_order_threshold_amount: data.recommender_order_threshold_amount,
            recommender_order_date: data.recommender_order_date
          }
        } else {
          this.groupparticipantForm = {
            active_type: data.active_type,
            captain_before_order_limit: data.active_type,
            captain_group_times: data.captain_group_times,
            captain_single_purchase_quantity: data.captain_single_purchase_quantity, // 团长单次购买数量限制
            captain_wait_time_for_group: data.captain_wait_time_for_group, // 成团等待时间
            member_single_purchase_quantity: data.member_single_purchase_quantity, // 团员单次购买数量限制
            simulation_group: data.simulation_group, // 模拟成团
            member_purchase_times: data.member_purchase_times
          }
        }
        console.log('this.participantForm', this.participantForm)
      }
    }
  }
}
</script>
