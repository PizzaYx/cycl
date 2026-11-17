"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (PageHeader + _easycom_uni_icons)();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
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
    const navigateToChangePassword = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/changePassword"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back, "85"),
        b: common_vendor.p({
          title: "个人信息"
        }),
        c: avatarUrl.value
      }, avatarUrl.value ? {
        d: avatarUrl.value
      } : {
        e: common_vendor.t(common_vendor.unref(userStore).userType == 1 ? common_vendor.unref(userStore).userAvatar : common_vendor.unref(userStore).userSFAvatar)
      }, {
        f: common_vendor.o(handleAvatarClick, "61"),
        g: common_vendor.t(common_vendor.unref(userStore).nickName || "未设置"),
        h: common_vendor.t(common_vendor.unref(userStore).userName || "未设置"),
        i: common_vendor.t(common_vendor.unref(userStore).userTypeText),
        j: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        k: common_vendor.o(navigateToChangePassword, "93"),
        l: common_vendor.o(handleLogout, "6c")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
