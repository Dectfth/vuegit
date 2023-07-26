<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    width="580"
    :show-close="false"
    top="60px"
    class="product-edit-modal"
    :before-close="handleClose"
  >
    <div slot="title" class="edit-title">
      <div>{{ modalTitle }}</div>
    </div>
    <div style="text-align: right;color: #D8D8D8;">
      <i class="el-icon-refresh"></i> <span>同步间隔：1 day 最新同步：</span>
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
      :class="{ previewFoot: isPreview }"
    >
      <el-button size="large">
        取消
      </el-button>
      <el-button
        type="primary"
        size="large"
      >
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      modalTitle: '商品详情',
      site: '',
      formData: {
        url: '',
        img: '',
        name: '',
        SKU: '',
        checked: undefined,
        isActive: undefined,
        Tags: {},
        activities: {},
        grading: '',
        updateTime: ''
      },
      dialogVisible: false
    }
  },
  computed: {

  },
  mounted() {

  },

  methods: {
    show(item) {
      if (item) {
        this.formData = {
          ...item
          // Tags: item.Tags.map((e) => {
          //   return { ...e }
          // }),
          // activities: item.activities.map((e) => {
          //   return { ...e }
          // })
        }
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['elForm'].clearValidate()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>
<style lang="scss" scoped>

.dialog-footer{
  display: flex;
  justify-content: space-between;
}
</style>
