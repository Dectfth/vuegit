<template>
  <div>
    <el-form v-if="active_type == '1'" ref="rewardRulesForm" :model="rewardRulesForm" :rules="rewardRulesRules" label-position="left" label-width="130px" class="demo-Form demo-rewardRulesForm">
      <span class="partition">奖励对象Target</span>
      <el-form-item label="奖励对象" prop="fission_award_object_type">
        <el-select v-model="rewardRulesForm.fission_award_object_type" placeholder="请选择奖励对象">
          <el-option
            v-for="(op, index) in awardObjectTypeOption"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="rewardRulesForm.fission_award_object_type == '1' || rewardRulesForm.fission_award_object_type == '3'">
        <span class="partition">分享者奖励 Referrer Reward</span>
        <el-table
          ref="awardCountTable"
          :data="awardCountData"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            property="segment_number"
            label="分段"
            width="50"
          >
          </el-table-column>
          <el-table-column label="次数规则（后含）">
            <template #header>
              <span>次数规则（后含）</span>
              <br>
              <span>（示例：1-3（含））</span>
            </template>
            <el-table-column
              property="award_times_start"
              width="80"
            >
            </el-table-column>
            <el-table-column
              property="award_times_end"
              width="80"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            property="award_type"
            label="奖励类型"
          >
            <template slot-scope="scope">
              {{ showAwardTypeOption(scope.row.award_type) }}
            </template>
          </el-table-column>
          <el-table-column
            property="award_matching"
            label="奖励匹配"
          >
            <template slot-scope="scope">
              {{ showAwardMatchingOption(scope.row.award_matching) }}
            </template>
          </el-table-column>
          <el-table-column
            property="single_award_value"
            label="单次奖励(Num/%)"
          >
          </el-table-column>
          <el-table-column
            width="50"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color: #ADADAD;"
                @click.native.prevent="deleteRow(scope.$index, awardCountData)"
              >
                <i class="el-icon-close"></i>
              </el-button>
            </template>
          </el-table-column>
          <template slot="append">
            <tr v-show="addNewStatus" class="custom-row">
              <td width="50"><div class="cell"> {{ addNew.segment_number }}</div></td>
              <td width="80">
                <el-input v-model="addNew.award_times_start" placeholder=""></el-input>
              </td>
              <td width="80">
                <el-input v-model="addNew.award_times_end" placeholder=""></el-input>
              </td>
              <td>
                <el-select v-model="addNew.award_type" placeholder="请选择奖励类型">
                  <el-option
                    v-for="item in rewardTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="addNew.award_matching" placeholder="请选择奖励匹配">
                  <el-option
                    v-for="item in rewardMatchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="addNew.single_award_value" placeholder=""></el-input>
              </td>
              <td width="50" style="text-align: center;">
                <el-button type="text" @click="saveAdd">保存</el-button>
              </td>
            </tr>
          </template>
        </el-table>
        <div class="awardCountFooter">
          <div>
            <el-button type="text" @click="addAwardCount">
              <i class="el-icon-plus"></i>新增奖励
            </el-button>
          </div>
        </div>
        <el-form-item label="发放方式" prop="sharer_award_distribute_type">
          <el-select v-model="rewardRulesForm.sharer_award_distribute_type" placeholder="请选择发放方式" clearable>
            <el-option
              v-for="(op, index) in awardDistributeTypeOption"
              :key="index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="rewardRulesForm.fission_award_object_type == '2' || rewardRulesForm.fission_award_object_type == '3'">
        <span class="partition">被分享者奖励 Referral Reward</span>
        <el-form-item label="奖励类型" prop="recommender_award_type" class="frontLimit">
          <el-select v-model="rewardRulesForm.recommender_award_type" placeholder="请选择奖励类型" clearable>
            <el-option
              v-for="(op, index) in awardTypeOption"
              :key="index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
          <div v-if="rewardRulesForm.recommender_award_type == 3" style="margin-left: 20px;">
            <el-checkbox v-model="rewardRulesForm.recommender_single_coupon_code" label="每人独立Coupon Code"></el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="recommender_coupon_name">
          <el-input v-model="rewardRulesForm.recommender_coupon_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="游客优惠Code" prop="recommender_tourists_coupon_code">
          <el-input v-model="rewardRulesForm.recommender_tourists_coupon_code" clearable></el-input>
        </el-form-item>
        <el-form-item label="优惠券规则" prop="recommender_coupon_rule_explain">
          <el-input v-model="rewardRulesForm.recommender_coupon_rule_explain" clearable></el-input>
        </el-form-item>
        <el-form-item label="折扣" prop="recommender_discount_value" class="rebates-switch">
          <el-input v-model.number="rewardRulesForm.recommender_discount_value" clearable></el-input>
          <el-switch
            v-model="rewardRulesForm.recommender_discount_unit"
            active-text="%"
            inactive-text="$"
            active-color="#2B7DE1"
            inactive-color="#2B7DE1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="订单金额门槛" prop="recommender_order_threshold_amount" class="rebates-switch">
          <el-input v-model.number="rewardRulesForm.recommender_order_threshold_amount" clearable></el-input>
          <span>$</span>
        </el-form-item>
        <el-form-item label="商品SKU" required class="frontLimit">
          <el-switch v-model="rewardRulesForm.recommender_target_item_limit" prop="recommender_target_item_limit" style="margin-right: 5px;"></el-switch>
          <div :style=" { color: rewardRulesForm.recommender_target_item_limit ? '#2B7DE1' : '#DCDFE6' }">{{ rewardRulesForm.recommender_target_item_limit ? '是' : '否' }}</div>
          <el-form-item v-if="rewardRulesForm.recommender_target_item_limit" prop="productSKU">
            <el-input
              v-model="rewardRulesForm.recommender_award_sku"
              clearable
              style="margin-left: 20px;"
              placeholder="请输入SKU"
            >
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="奖励有效期" prop="recommender_award_time" required>
          <el-date-picker
            v-model="rewardRulesForm.recommender_award_time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <el-form v-if="active_type == '2'" ref="rewardRulesForm" :model="groupRulesForm" :rules="groupRulesRules" label-position="left" label-width="130px" class="demo-Form demo-rewardRulesForm">
      <span class="partition">奖励对象Target成团</span>
      <el-form-item label="奖励对象" prop="group_award_object_type">
        <el-select v-model="groupRulesForm.group_award_object_type" placeholder="请选择奖励对象">
          <el-option
            v-for="(op, index) in awardObjectTypeOption"
            :key="index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="团员人数"
        prop="group_people_number"
        class="inputform"
        required
      >
        <el-input v-model.number="groupRulesForm.group_people_number"></el-input>
      </el-form-item>

      <el-form-item label="团长奖励发放" prop="captain_award_distribute_type" required>
        <el-select v-model="groupRulesForm.captain_award_distribute_type" placeholder="请选择团长奖励发放">
          <el-option label="拼团成功后发放" :value="1"></el-option>
          <el-option label="xxx" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="groupRulesForm.group_award_object_type == '1' || groupRulesForm.group_award_object_type == '3'">
        <span class="partition">团长奖励 Captain Reward</span>
        <el-form-item label="奖励类型" prop="captain_award_type" required>
          <el-select v-model="groupRulesForm.captain_award_type" placeholder="请选择奖励类型">
            <el-option label="Discount" :value="1"></el-option>
            <el-option label="cash" :value="2"></el-option>
            <el-option label="coupon" :value="3"></el-option>
            <el-option label="discount" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券叠加" prop="captain_coupon_is_overlay" required>
          <el-select v-model="groupRulesForm.captain_coupon_is_overlay" placeholder="优惠券是否叠加">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" prop="captain_discount_value" class="rebates-switch" required>
          <el-input v-model.number="groupRulesForm.captain_discount_value" clearable></el-input>
          <el-switch
            v-model="groupRulesForm.captain_discount_unit"
            active-text="%"
            inactive-text="$"
            active-color="#2B7DE1"
            inactive-color="#2B7DE1"
          >
          </el-switch>
        </el-form-item>
      </div>

      <div v-if="groupRulesForm.group_award_object_type == '2' || groupRulesForm.group_award_object_type == '3' ">
        <span class="partition"> 团员奖励 Member Reward</span>
        <el-form-item label="奖励类型" prop="member_award_type" required>
          <el-select v-model="groupRulesForm.member_award_type" placeholder="请选择团员奖励类型">
            <el-option label="Discount" :value="1"></el-option>
            <el-option label="cash" :value="2"></el-option>
            <el-option label="coupon" :value="3"></el-option>
            <el-option label="discount" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" prop="member_discount_value" class="rebates-switch" required>
          <el-input v-model="groupRulesForm.member_discount_value" clearable></el-input>
          <el-switch
            v-model="groupRulesForm.member_discount_unit"
            active-text="%"
            inactive-text="$"
            active-color="#2B7DE1"
            inactive-color="#2B7DE1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="优惠券叠加" prop="member_coupon_is_overlay" required>
          <el-select v-model="groupRulesForm.member_coupon_is_overlay" placeholder="优惠券是否叠加">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>

</template>

<script>
import { sharerAwardDistributeType, awardObjectType, awardType, awardMatching } from '@/utils/parameters'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      isAdd: false,
      value1: true,
      active_type: '',
      awardObjectTypeOption: [],
      awardDistributeTypeOption: [],
      awardTypeOption: [],
      addNewStatus: false,
      addNew: {
        segment_number: '',
        award_times_start: '',
        award_times_end: '',
        award_type: '',
        award_matching: '',
        single_award_value: ''
      },
      rewardTypeOptions: [
        {
          label: 'credit',
          value: 1
        },
        {
          label: 'cash',
          value: 2
        },
        {
          label: 'coupon',
          value: 3
        },
        {
          label: 'discount',
          value: 4
        }
      ],
      rewardMatchOptions: [
        {
          label: '固定金额',
          value: 1
        },
        {
          label: '商品价格比例',
          value: 2
        }
      ],
      awardCountData: [],
      rewardRulesForm: {
        fission_award_object_type: '',
        sharer_award_distribute_type: '',
        recommender_award_type: '',
        recommender_single_coupon_code: '',
        recommender_target_item_limit: false,
        recommender_coupon_name: '',
        recommender_tourists_coupon_code: '',
        recommender_coupon_rule_explain: '',
        recommender_order_threshold_amount: '',
        recommender_discount_unit: false,
        recommender_discount_value: '',
        recommender_award_sku: '',
        recommender_award_time: '',
        active_type: '',
        sharer_award_rules: []
      },
      rewardRulesRules: {
        fission_award_object_type: [
          { required: true, trigger: 'blur' }
        ],
        sharer_award_distribute_type: [
          { required: true, message: '请选择发放方式', trigger: 'change' }
        ],
        recommender_award_type: [
          { required: true, message: '请选择奖励类型', trigger: 'change' }
        ],
        recommender_single_coupon_code: [
          { required: true, trigger: 'blur' }
        ],
        recommender_target_item_limit: [
          { required: true, trigger: 'blur' }
        ],
        recommender_coupon_name: [
          { required: true, message: '请输入优惠券名字', trigger: 'blur' }
        ],
        recommender_tourists_coupon_code: [
          { required: true, message: '请输入游客优惠Code', trigger: 'blur' }
        ],
        recommender_coupon_rule_explain: [
          { required: true, message: '请输入优惠券使用规则', trigger: 'blur' }
        ],
        recommender_discount_value: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
          { type: 'number', min: 1, message: '数量不能为0', trigger: 'blur' }
        ],
        recommender_order_threshold_amount: [
          { required: true, message: '请输入订单金额门槛', trigger: 'blur' },
          { type: 'number', min: 1, message: '数量不能为0', trigger: 'blur' }
        ],
        recommender_award_sku: [
          { required: true, message: '请输入商品SKU', trigger: 'change' }
        ],
        recommender_award_time: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      groupRulesForm: {
        active_type: '',
        group_award_object_type: '', // 成团奖励对象类型：1推荐人，2被推荐人，3双方
        group_people_number: '', // 团员人数
        captain_award_distribute_type: '', // 团长奖励发放：1拼团成功后发放 2xxx
        captain_award_type: '', // 团长奖励类型1-credit,2-cash,3-coupon,4-discount
        captain_coupon_is_overlay: '', // 团长优惠券是否叠加 0:否|1:是
        captain_discount_unit: '', // 团长折扣单位
        captain_discount_value: '', // number团长折扣值
        member_award_type: '', // 团员奖励类型1Discount,2xxx
        member_discount_unit: '', // 团员折扣值
        member_coupon_is_overlay: '' // 团员优惠券叠加
      },
      groupRulesRules: {
        group_award_object_type: [
          { required: true, message: '请选择奖励对象', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.awardObjectTypeOption = this.initOptions(awardObjectType)
      this.awardDistributeTypeOption = this.initOptions(sharerAwardDistributeType)
      this.awardTypeOption = this.initOptions(awardType)
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
    showAwardTypeOption(index) {
      return awardType[index]
    },
    showAwardMatchingOption(index) {
      return awardMatching[index]
    },
    log() {
      console.log('...groupRulesFormtype', this.groupRulesForm.active_type)
      console.log('...rewardRulesFormtype', this.rewardRulesForm.active_type)
    },
    conlog() {
      console.log('rewardRulesForm', this.rewardRulesForm)
      console.log('groupRulesForm', this.groupRulesForm)
    },
    getActiveType(type) {
      console.log('type', type)
      this.active_type = type
      this.groupRulesForm.active_type = type
      this.rewardRulesForm.active_type = type
    },
    pushData() {
      if (this.active_type === 1) {
        this.rewardRulesForm = {
          ...this.rewardRulesForm,
          fission_award_object_type: this.rewardRulesForm.fission_award_object_type * 1,
          sharer_award_distribute_type: this.rewardRulesForm.sharer_award_distribute_type * 1,
          recommender_award_type: this.rewardRulesForm.recommender_award_type * 1,
          recommender_discount_unit: this.rewardRulesForm.recommender_discount_unit ? 1 : 2,
          sharer_award_rules: this.awardCountData
        }
        return this.rewardRulesForm
      } else {
        this.groupRulesForm = {
          ...this.groupRulesForm,
          group_award_object_type: this.groupRulesForm.group_award_object_type * 1,
          captain_discount_unit: this.groupRulesForm.captain_discount_unit ? 1 : 2,
          member_discount_unit: this.groupRulesForm.member_discount_unit ? 1 : 2
        }
        return this.groupRulesForm
      }
    },
    getData(data) {
      console.log('dat--------a', data)
      if (data.active_type === 1) {
        this.rewardRulesForm = {
          active_type: data.active_type,
          fission_award_object_type: data.fission_award_object_type,
          sharer_award_distribute_type: data.sharer_award_distribute_type,
          recommender_award_type: data.recommender_award_type,
          recommender_single_coupon_code: data.recommender_single_coupon_code,
          recommender_target_item_limit: data.recommender_target_item_limit,
          recommender_coupon_name: data.recommender_coupon_name,
          recommender_tourists_coupon_code: data.recommender_tourists_coupon_code,
          recommender_coupon_rule_explain: data.recommender_coupon_rule_explain,
          recommender_order_threshold_amount: data.recommender_order_threshold_amount,
          recommender_award_sku: data.recommender_award_sku,
          recommender_discount_unit: data.recommender_discount_unit,
          recommender_discount_value: data.recommender_discount_value * 1,
          recommender_award_time: [this.transferDate(data.recommender_award_effective_time, data.active_time_zone), this.transferDate(data.recommender_award_expired_time, data.active_time_zone)]
        }
        this.active_type = this.rewardRulesForm.active_type
        this.awardCountData = data.sharer_award_rules

        console.log('this.rewardRulesForm', this.rewardRulesForm)
      } else if (data.active_type === 2) {
        this.groupRulesForm = {
          active_type: data.active_type * 1,
          group_award_object_type: data.group_award_object_type,
          group_people_number: data.group_people_number, // 团员人数
          captain_award_distribute_type: data.captain_award_distribute_type, // 团长奖励发放：1拼团成功后发放 2xxx
          captain_award_type: data.captain_award_type, // 团长奖励类型1Discount,2xxx
          captain_coupon_is_overlay: data.captain_coupon_is_overlay, // 团长优惠券是否叠加 0:否|1:是
          captain_discount_unit: data.captain_discount_unit, // number团长折扣单位
          captain_discount_value: data.captain_discount_value, // number团长折扣值
          member_award_type: data.member_award_type, // 团员奖励
          member_discount_unit: data.member_discount_unit, // 团员折扣
          member_coupon_is_overlay: data.member_coupon_is_overlay // 团员优惠券叠加
        }
        this.active_type = this.groupRulesForm.active_type

        console.log(this.groupRulesForm, '..........this.groupRulesForm')
      }
    },
    deleteRow(index, rows) {
      this.$confirm('确认删除？')
        .then((_) => {
          rows.splice(index, 1)
        })
        .catch((_) => { })
    },
    addAwardCount() {
      // this.isAdd = true
      if (this.addNewStatus) return
      this.addNew.segment_number = `#${this.awardCountData.length + 1}`
      this.addNewStatus = true
      // this.addAwardCountData.index = `#${this.awardCountData.length + 1}`
    },
    saveAdd() {
      const obj = JSON.parse(JSON.stringify(this.addNew))
      this.awardCountData.push(obj)
      console.log('this.awardCountData', this.awardCountData)
      this.addNewStatus = false
      Object.keys(this.addNew).forEach((key) => {
        this.addNew[key] = ''
      })
    },
    transferDate(itemTime, active_time_zone) {
      const currentTimeZone = dayjs().utcOffset() / 60
      const timezoneUnit = 3600000
      // 服务器保存的是先减去当前时区再加上时区的时间
      // 本地显示的是先减去选择的时间再加上当前时区
      const timeZoneNum = this.getNum(active_time_zone) * -timezoneUnit
      const currentTimeZoneNum = currentTimeZone * timezoneUnit
      const transferTime = dayjs(
        itemTime * 1000 - timeZoneNum + currentTimeZoneNum
      ).format('YYYY-MM-DD HH:mm:ss')
      console.log('transferTime', transferTime)
      return transferTime
    },
    // 截取字符串中的数字包含正负号
    getNum(str) {
      const reg = /-?\d+/g
      const res = str.match(reg)
      return res[0]
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-row::v-deep{
    input {
      // border: none;
    }
  }
  .awardCountFooter{
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .rebates-switch{
    position: relative;
    .el-switch{
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%) scale(1.3);
      .el-switch__core{
        display: none;
      }
    }
    span{
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      color: #ADADAD;
    }
  }
</style>
<style lang="scss">
.rebates-switch{
  .el-switch{
    border-radius: 5px;
    overflow: hidden;
    .el-switch__label{
      margin: 0;
      padding: 0 10px;
      color: #ADADAD;
      background-color: transparent;
      &.is-active{
        color: #FFF;
        background-color: #2B7DE1;
      }
    }
    .el-switch__core{
      display: none;
    }
  }
}
</style>
