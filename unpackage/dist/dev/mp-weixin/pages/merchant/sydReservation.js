"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "sydReservation",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const props = common_vendor.ref({
      id: null,
      status: null
    });
    common_vendor.onLoad((options) => {
      props.value.id = options.id ? parseInt(options.id) : null;
      props.value.status = options.status ? parseInt(options.status) : null;
      common_vendor.index.__f__("log", "at pages/merchant/sydReservation.vue:134", "接收到的参数:", props.value);
    });
    const isReadOnly = common_vendor.computed(() => {
      return authStatus.value === "pending" || authStatus.value === "approved";
    });
    const formData = common_vendor.reactive({
      merchantName: "",
      address: "",
      contactPerson: "",
      contactPhone: "",
      bucketCount: "",
      estimatedWeight: "",
      estimatedTime: "",
      estimatedRemarks: ""
    });
    const minDate = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      return now.toISOString().slice(0, 19).replace("T", " ");
    });
    const maxDate = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const max = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
      return max.toISOString().slice(0, 19).replace("T", " ");
    });
    const currentStep = common_vendor.computed(() => {
      const status = props.value.status;
      switch (status) {
        case 0:
          return 2;
        case 1:
          return 3;
        case 2:
          return 1;
        default:
          return 1;
      }
    });
    const authStatus = common_vendor.computed(() => {
      const status = props.value.status;
      switch (status) {
        case 0:
          return "pending";
        case 1:
          return "approved";
        case 2:
          return "rejected";
        default:
          return "none";
      }
    });
    const formRef = common_vendor.ref();
    const formRules = {
      bucketCount: {
        rules: [
          { required: true, errorMessage: "请输入垃圾桶数量" },
          {
            validateFunction: function(rule, value, data, callback) {
              if (value && (isNaN(value) || parseInt(value) <= 0)) {
                callback("垃圾桶数量必须大于0");
              }
              return true;
            }
          }
        ]
      },
      estimatedWeight: {
        rules: [
          { required: true, errorMessage: "请输入预估垃圾重量" },
          {
            validateFunction: function(rule, value, data, callback) {
              if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                callback("预估垃圾重量必须大于0");
              }
              return true;
            }
          }
        ]
      },
      estimatedTime: {
        rules: [
          { required: true, errorMessage: "请选择预约时间" }
        ]
      },
      estimatedRemarks: {
        rules: [
          { required: true, errorMessage: "请输入备注说明" }
        ]
      }
    };
    const submitting = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      await userStore.ensureUserInfo();
      if (props.value.status !== null)
        ;
      fillFormData(null);
    });
    const fillFormData = (data) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      common_vendor.index.__f__("log", "at pages/merchant/sydReservation.vue:270", "开始数据回显:", data, "用户信息:", userStore.userInfo);
      formData.merchantName = ((_a = userStore.merchant) == null ? void 0 : _a.name) || ((_b = userStore.userInfo) == null ? void 0 : _b.name) || "";
      formData.address = ((_c = userStore.merchant) == null ? void 0 : _c.address) || ((_d = userStore.userInfo) == null ? void 0 : _d.address) || "";
      formData.contactPerson = ((_e = userStore.merchant) == null ? void 0 : _e.contactTruename) || ((_f = userStore.userInfo) == null ? void 0 : _f.contactTruename) || "";
      formData.contactPhone = ((_g = userStore.merchant) == null ? void 0 : _g.contactTel) || ((_h = userStore.userInfo) == null ? void 0 : _h.contactTel) || "";
      if (data) {
        formData.bucketCount = ((_i = data.bucketNum) == null ? void 0 : _i.toString()) || "";
        formData.estimatedWeight = ((_j = data.trashWeight) == null ? void 0 : _j.toString()) || "";
        formData.estimatedTime = data.estimatedTime || "";
        formData.estimatedRemarks = data.estimatedRemarks || "";
      }
      common_vendor.index.__f__("log", "at pages/merchant/sydReservation.vue:286", "数据回显完成:", formData);
    };
    const validateForm = async () => {
      try {
        return await formRef.value.validate();
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/merchant/sydReservation.vue:295", "表单验证失败:", error);
        return false;
      }
    };
    const submitAuth = async () => {
      var _a;
      const isValid = await validateForm();
      if (!isValid) {
        return;
      }
      submitting.value = true;
      try {
        const submitData = {
          merchantId: ((_a = userStore.merchant) == null ? void 0 : _a.id) ?? 448,
          // 用户ID
          name: formData.merchantName,
          // 商户名称
          address: formData.address,
          // 地址
          contactTruename: formData.contactPerson,
          // 联系人姓名
          contactTel: formData.contactPhone,
          // 联系电话
          bucketNum: parseInt(formData.bucketCount),
          // 预计桶数量
          trashWeight: parseInt(formData.estimatedWeight),
          // 预估垃圾重量
          appointmentTime: formData.estimatedTime,
          // 预约时间
          explain: formData.estimatedRemarks
          // 备注说明
        };
        const result = await api_apis.apiPostaddPlanTemporary(submitData);
        common_vendor.index.__f__("log", "at pages/merchant/sydReservation.vue:324", "预约提交API返回:", submitData);
        if (result && result.code === 200) {
          common_vendor.index.showToast({
            title: "预约申请提交成功",
            icon: "success"
          });
          props.value.status = 0;
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1e3);
        } else {
          common_vendor.index.showToast({
            title: (result == null ? void 0 : result.msg) || "提交失败，请重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/sydReservation.vue:349", "提交认证失败:", error);
        common_vendor.index.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "临时预约"
        }),
        c: currentStep.value <= 1
      }, currentStep.value <= 1 ? {} : {}, {
        d: currentStep.value >= 1 ? 1 : "",
        e: currentStep.value > 1 ? 1 : "",
        f: currentStep.value > 1 ? 1 : "",
        g: currentStep.value <= 2
      }, currentStep.value <= 2 ? {} : {}, {
        h: currentStep.value >= 2 ? 1 : "",
        i: currentStep.value > 2 ? 1 : "",
        j: currentStep.value > 2 ? 1 : "",
        k: currentStep.value >= 3 ? 1 : "",
        l: isReadOnly.value
      }, isReadOnly.value ? common_vendor.e({
        m: authStatus.value === "pending"
      }, authStatus.value === "pending" ? {
        n: common_vendor.p({
          type: "info",
          size: "16",
          color: "#ff9500"
        })
      } : authStatus.value === "approved" ? {
        p: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#07c160"
        })
      } : {}, {
        o: authStatus.value === "approved"
      }) : {}, {
        q: authStatus.value === "rejected"
      }, authStatus.value === "rejected" ? {
        r: common_vendor.p({
          type: "closeempty",
          size: "16",
          color: "#ff4444"
        })
      } : {}, {
        s: common_vendor.o(($event) => formData.merchantName = $event),
        t: common_vendor.p({
          placeholder: "请输入商户名称",
          clearable: false,
          disabled: true,
          modelValue: formData.merchantName
        }),
        v: common_vendor.p({
          label: "商户名称",
          name: "merchantName",
          required: true
        }),
        w: common_vendor.o(($event) => formData.address = $event),
        x: common_vendor.p({
          placeholder: "请输入详细地址",
          clearable: false,
          disabled: true,
          modelValue: formData.address
        }),
        y: common_vendor.p({
          label: "商户地址",
          name: "address",
          required: true
        }),
        z: common_vendor.o(($event) => formData.contactPhone = $event),
        A: common_vendor.p({
          placeholder: "请输入联系电话",
          type: "number",
          maxlength: "11",
          clearable: false,
          disabled: true,
          modelValue: formData.contactPhone
        }),
        B: common_vendor.p({
          label: "联系电话",
          name: "contactPhone",
          required: true
        }),
        C: common_vendor.o(($event) => formData.bucketCount = $event),
        D: common_vendor.p({
          placeholder: "请输入垃圾桶数量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.bucketCount
        }),
        E: common_vendor.p({
          label: "需要垃圾桶数(个)",
          name: "bucketCount",
          required: true
        }),
        F: common_vendor.o(($event) => formData.estimatedWeight = $event),
        G: common_vendor.p({
          placeholder: "请输入预估垃圾重量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedWeight
        }),
        H: common_vendor.p({
          label: "预估垃圾重量",
          name: "estimatedWeight",
          required: true
        }),
        I: common_vendor.o(($event) => formData.estimatedTime = $event),
        J: common_vendor.p({
          type: "date",
          start: minDate.value,
          end: maxDate.value,
          placeholder: "请选择预约时间",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedTime
        }),
        K: common_vendor.p({
          label: "预约时间",
          name: "estimatedTime",
          required: true
        }),
        L: common_vendor.o(($event) => formData.estimatedRemarks = $event),
        M: common_vendor.p({
          placeholder: "请输入其他要说明的信息",
          type: "text",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedRemarks
        }),
        N: common_vendor.p({
          label: "备注说明",
          name: "estimatedRemarks",
          required: true
        }),
        O: common_vendor.sr(formRef, "309cc59a-4", {
          "k": "formRef"
        }),
        P: common_vendor.p({
          modelValue: formData,
          rules: formRules,
          ["label-position"]: "top"
        }),
        Q: isReadOnly.value ? 1 : "",
        R: authStatus.value === "none" || authStatus.value === "rejected"
      }, authStatus.value === "none" || authStatus.value === "rejected" ? {
        S: common_vendor.t(authStatus.value === "rejected" ? "重新提交" : "提交"),
        T: common_vendor.o(submitAuth),
        U: submitting.value
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-309cc59a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydReservation.js.map
