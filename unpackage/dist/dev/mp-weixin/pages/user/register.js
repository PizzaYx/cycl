"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const formData = common_vendor.ref({
      account: "",
      password: "",
      confirmPassword: ""
    });
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const handleRegister = () => {
      if (!formData.value.account) {
        common_vendor.index.showToast({
          title: "请输入账号",
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
      if (formData.value.password !== formData.value.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "注册成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "注册"
        }),
        c: formData.value.account,
        d: common_vendor.o(($event) => formData.value.account = $event.detail.value),
        e: formData.value.password,
        f: common_vendor.o(($event) => formData.value.password = $event.detail.value),
        g: formData.value.confirmPassword,
        h: common_vendor.o(($event) => formData.value.confirmPassword = $event.detail.value),
        i: common_vendor.o(handleRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fd534bf9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/register.js.map
