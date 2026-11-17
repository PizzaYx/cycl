"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Math) {
  PageHeader();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "changePassword",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const formData = common_vendor.ref({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const handleSubmit = () => {
      if (!formData.value.oldPassword) {
        common_vendor.index.showToast({
          title: "请输入旧密码",
          icon: "none"
        });
        return;
      }
      if (!formData.value.newPassword) {
        common_vendor.index.showToast({
          title: "请输入新密码",
          icon: "none"
        });
        return;
      }
      if (formData.value.newPassword.length < 6) {
        common_vendor.index.showToast({
          title: "新密码至少需要6位",
          icon: "none"
        });
        return;
      }
      if (formData.value.newPassword !== formData.value.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的新密码不一致",
          icon: "none"
        });
        return;
      }
      if (!userStore.userName) {
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中...",
        mask: true
      });
      const params = {
        username: userStore.userName,
        oldPassword: formData.value.oldPassword,
        newPassword: formData.value.newPassword
      };
      common_vendor.index.__f__("log", "at pages/user/changePassword.vue:109", "修改密码参数", params);
      api_apis.apiEditPassword(params).then((res) => {
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "修改成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "修改失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/changePassword.vue:128", "修改失败:", err);
        common_vendor.index.showToast({
          title: "修改失败",
          icon: "none"
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back, "85"),
        b: common_vendor.p({
          title: "修改密码"
        }),
        c: formData.value.oldPassword,
        d: common_vendor.o(($event) => formData.value.oldPassword = $event.detail.value, "2a"),
        e: formData.value.newPassword,
        f: common_vendor.o(($event) => formData.value.newPassword = $event.detail.value, "58"),
        g: formData.value.confirmPassword,
        h: common_vendor.o(($event) => formData.value.confirmPassword = $event.detail.value, "91"),
        i: common_vendor.o(handleSubmit, "b1")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fd5dd78"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/changePassword.js.map
