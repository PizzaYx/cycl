"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_file_picker2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_file_picker)();
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
    const onFileSelect = (e) => {
      common_vendor.index.__f__("log", "at pages/user/user.vue:86", "选择文件:", e);
    };
    const onUploadSuccess = (e) => {
      common_vendor.index.__f__("log", "at pages/user/user.vue:91", "上传成功:", e);
      if (e.tempFilePaths && e.tempFilePaths.length > 0) {
        avatarUrl.value = e.tempFilePaths[0];
      }
    };
    const onUploadFail = (e) => {
      common_vendor.index.__f__("log", "at pages/user/user.vue:99", "上传失败:", e);
      common_vendor.index.showToast({
        title: "上传失败",
        icon: "none"
      });
    };
    const getStatusClass = () => {
      const status = userStore.merchantStatus;
      switch (status) {
        case 1:
          return "status-success";
        case 0:
          return "status-pending";
        case 2:
          return "status-failed";
        default:
          return "status-default";
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
        k: common_vendor.t(common_vendor.unref(userStore).merchantStatusText),
        l: common_vendor.n(getStatusClass()),
        m: common_vendor.sr(filePicker, "0f7520f0-2", {
          "k": "filePicker"
        }),
        n: common_vendor.o(onFileSelect),
        o: common_vendor.o(onUploadSuccess),
        p: common_vendor.o(onUploadFail),
        q: common_vendor.p({
          ["file-mediatype"]: "image",
          mode: "grid",
          limit: 1
        }),
        r: common_vendor.o(handleSave)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
