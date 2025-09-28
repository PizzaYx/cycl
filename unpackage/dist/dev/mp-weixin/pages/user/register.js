"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
if (!Math) {
  PageHeader();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const formData = common_vendor.ref({
      username: "",
      nickname: "",
      password: "",
      confirmPassword: ""
    });
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const validatePhone = (phone) => {
      const phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(phone);
    };
    const handleRegister = () => {
      if (!formData.value.username) {
        common_vendor.index.showToast({
          title: "请输入账号",
          icon: "none"
        });
        return;
      }
      if (!validatePhone(formData.value.username)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (!formData.value.nickname) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none"
        });
        return;
      }
      if (!formData.value.password) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      if (formData.value.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码至少需要6位",
          icon: "none"
        });
        return;
      }
      if (formData.value.password !== formData.value.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中...",
        mask: true
      });
      common_vendor.index.__f__("log", "at pages/user/register.vue:125", "注册参数", formData.value);
      api_apis.apiPostRegister(formData.value).then((res) => {
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
          common_vendor.index.navigateBack();
        } else {
          common_vendor.index.showToast({
            title: res.msg || "注册失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/register.vue:145", "注册失败:", err);
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "注册"
        }),
        c: formData.value.username,
        d: common_vendor.o(($event) => formData.value.username = $event.detail.value),
        e: formData.value.nickname,
        f: common_vendor.o(($event) => formData.value.nickname = $event.detail.value),
        g: formData.value.password,
        h: common_vendor.o(($event) => formData.value.password = $event.detail.value),
        i: formData.value.confirmPassword,
        j: common_vendor.o(($event) => formData.value.confirmPassword = $event.detail.value),
        k: common_vendor.o(handleRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fd534bf9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/register.js.map
