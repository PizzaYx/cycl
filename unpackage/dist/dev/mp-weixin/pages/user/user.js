"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const avatarUrl = common_vendor.ref("");
    const filePicker = common_vendor.ref(null);
    common_vendor.onMounted(async () => {
      await userStore.ensureUserInfo();
    });
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const handleAvatarClick = () => {
      if (filePicker.value) {
        filePicker.value.chooseFile();
      }
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        confirmText: "退出",
        cancelText: "取消",
        confirmColor: "#ff4444",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
          }
        }
      });
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
          title: "个人信息"
        }),
        c: avatarUrl.value
      }, avatarUrl.value ? {
        d: avatarUrl.value
      } : {
        e: common_vendor.t(common_vendor.unref(userStore).userType == 1 ? common_vendor.unref(userStore).userAvatar : common_vendor.unref(userStore).userSFAvatar)
      }, {
        f: common_vendor.o(handleAvatarClick),
        g: common_vendor.t(common_vendor.unref(userStore).nickName || "未设置"),
        h: common_vendor.t(common_vendor.unref(userStore).userName || "未设置"),
        i: common_vendor.t(common_vendor.unref(userStore).userTypeText),
        j: common_vendor.o(handleLogout)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
