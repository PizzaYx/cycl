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
  __name: "shReservation",
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
      common_vendor.index.__f__("log", "at pages/merchant/shReservation.vue:141", "接收到的参数:", props.value);
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
    common_vendor.computed(() => {
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
    const getDateTimeText = () => {
      if (formData.estimatedTime) {
        return formatDateTime(formData.estimatedTime);
      }
      return "";
    };
    const formatDateTime = (dateTime) => {
      if (!dateTime)
        return "";
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const openDateTimePicker = () => {
    };
    common_vendor.onMounted(async () => {
      await userStore.ensureUserInfo();
      if (props.value.status !== null)
        ;
      fillFormData(null);
    });
    const fillFormData = (data) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      common_vendor.index.__f__("log", "at pages/merchant/shReservation.vue:296", "开始数据回显:", data, "用户信息:", userStore.userInfo);
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
      common_vendor.index.__f__("log", "at pages/merchant/shReservation.vue:312", "数据回显完成:", formData);
    };
    const validateForm = async () => {
      try {
        return await formRef.value.validate();
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/merchant/shReservation.vue:321", "表单验证失败:", error);
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
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
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
        common_vendor.index.__f__("log", "at pages/merchant/shReservation.vue:350", "预约提交API返回:", submitData);
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
        common_vendor.index.__f__("error", "at pages/merchant/shReservation.vue:375", "提交认证失败:", error);
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
        c: isReadOnly.value
      }, isReadOnly.value ? common_vendor.e({
        d: authStatus.value === "pending"
      }, authStatus.value === "pending" ? {
        e: common_vendor.p({
          type: "info",
          size: "16",
          color: "#ff9500"
        })
      } : authStatus.value === "approved" ? {
        g: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#07c160"
        })
      } : {}, {
        f: authStatus.value === "approved"
      }) : {}, {
        h: authStatus.value === "rejected"
      }, authStatus.value === "rejected" ? {
        i: common_vendor.p({
          type: "closeempty",
          size: "16",
          color: "#ff4444"
        })
      } : {}, {
        j: common_vendor.o(($event) => formData.merchantName = $event),
        k: common_vendor.p({
          clearable: false,
          disabled: true,
          modelValue: formData.merchantName
        }),
        l: common_vendor.p({
          label: "商户名称",
          name: "merchantName"
        }),
        m: common_vendor.o(($event) => formData.address = $event),
        n: common_vendor.p({
          clearable: false,
          disabled: true,
          modelValue: formData.address
        }),
        o: common_vendor.p({
          label: "商户地址",
          name: "address"
        }),
        p: common_vendor.o(($event) => formData.contactPhone = $event),
        q: common_vendor.p({
          type: "number",
          maxlength: "11",
          clearable: false,
          disabled: true,
          modelValue: formData.contactPhone
        }),
        r: common_vendor.p({
          label: "联系电话",
          name: "contactPhone"
        }),
        s: common_vendor.o(($event) => formData.bucketCount = $event),
        t: common_vendor.p({
          placeholder: "请输入垃圾桶数量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.bucketCount
        }),
        v: common_vendor.p({
          label: "需要垃圾桶数(个)",
          name: "bucketCount",
          required: true
        }),
        w: common_vendor.o(($event) => formData.estimatedWeight = $event),
        x: common_vendor.p({
          placeholder: "请输入预估垃圾重量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedWeight
        }),
        y: common_vendor.p({
          label: "预估垃圾重量(kg)",
          name: "estimatedWeight",
          required: true
        }),
        z: isReadOnly.value
      }, isReadOnly.value ? {
        A: common_vendor.p({
          value: getDateTimeText(),
          disabled: true,
          placeholder: "请选择预约时间",
          clearable: false
        })
      } : common_vendor.e({
        B: formData.estimatedTime
      }, formData.estimatedTime ? {
        C: common_vendor.t(formatDateTime(formData.estimatedTime))
      } : {}, {
        D: common_vendor.p({
          type: "calendar",
          size: "20",
          color: "#999"
        }),
        E: common_vendor.o(openDateTimePicker),
        F: common_vendor.o(($event) => formData.estimatedTime = $event),
        G: common_vendor.p({
          type: "date",
          start: minDate.value,
          end: maxDate.value,
          clearable: false,
          modelValue: formData.estimatedTime
        })
      }), {
        H: common_vendor.p({
          label: "预约时间",
          name: "estimatedTime",
          required: true
        }),
        I: common_vendor.o(($event) => formData.estimatedRemarks = $event),
        J: common_vendor.p({
          placeholder: "请输入其他要说明的信息",
          type: "text",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedRemarks
        }),
        K: common_vendor.p({
          label: "备注说明",
          name: "estimatedRemarks",
          required: true
        }),
        L: common_vendor.sr(formRef, "9b099ba5-4", {
          "k": "formRef"
        }),
        M: common_vendor.p({
          modelValue: formData,
          rules: formRules,
          ["label-position"]: "top"
        }),
        N: isReadOnly.value ? 1 : "",
        O: authStatus.value === "none" || authStatus.value === "rejected"
      }, authStatus.value === "none" || authStatus.value === "rejected" ? {
        P: common_vendor.t(authStatus.value === "rejected" ? "重新提交" : "提交"),
        Q: common_vendor.o(submitAuth),
        R: submitting.value
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9b099ba5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shReservation.js.map
