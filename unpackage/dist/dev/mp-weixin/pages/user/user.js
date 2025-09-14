"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons)();
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
    const handleSave = () => {
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
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
        e: common_vendor.t(common_vendor.unref(userStore).userAvatar)
      }, {
        f: common_vendor.p({
          type: "camera-filled",
          size: "32rpx",
          color: "#fff"
        }),
        g: common_vendor.o(handleAvatarClick),
        h: common_vendor.t(common_vendor.unref(userStore).nickName || "未设置"),
        i: common_vendor.t(common_vendor.unref(userStore).userName || "未设置"),
        j: common_vendor.t(common_vendor.unref(userStore).userTypeText),
        k: common_vendor.o(handleSave)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
