"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "contractWebview",
  setup(__props) {
    const webviewUrl = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      const token = common_vendor.index.getStorageSync("access_token") || "";
      const merchantId = options.merchantId || "";
      webviewUrl.value = `${utils_config.CONTRACT_DOWNLOAD_URL}/#/about?token=${encodeURIComponent(token)}&merchantId=${encodeURIComponent(merchantId)}`;
      common_vendor.index.__f__("log", "at pages/syContract/contractWebview/contractWebview.vue:18", "webview URL:", webviewUrl.value);
    });
    const onMessage = (e) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/syContract/contractWebview/contractWebview.vue:23", "webview message:", e.detail);
      const data = (_a = e.detail) == null ? void 0 : _a.data;
      if (!data || data.length === 0)
        return;
      const lastData = data[data.length - 1];
      if (lastData.imageBase64) {
        saveBase64ToAlbum(lastData.imageBase64);
      } else if (lastData.downloadUrl) {
        saveUrlToAlbum(lastData.downloadUrl);
      }
    };
    const saveBase64ToAlbum = (base64Data) => {
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const fs = common_vendor.index.getFileSystemManager();
      const filePath = `${common_vendor.wx$1.env.USER_DATA_PATH}/contract_${Date.now()}.png`;
      fs.writeFile({
        filePath,
        data: base64,
        encoding: "base64",
        success: () => {
          saveToAlbum(filePath);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/syContract/contractWebview/contractWebview.vue:53", "写入文件失败:", err);
          common_vendor.index.showToast({ title: "保存失败", icon: "none" });
        }
      });
    };
    const saveUrlToAlbum = (url) => {
      common_vendor.index.showLoading({ title: "正在下载..." });
      common_vendor.index.downloadFile({
        url,
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.statusCode === 200) {
            saveToAlbum(res.tempFilePath);
          } else {
            common_vendor.index.showToast({ title: "下载失败", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "下载失败", icon: "none" });
        }
      });
    };
    const saveToAlbum = (filePath) => {
      common_vendor.index.showLoading({ title: "正在保存..." });
      common_vendor.index.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "已保存到相册", icon: "success" });
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          if (err.errMsg.includes("auth deny") || err.errMsg.includes("authorize:fail")) {
            common_vendor.index.showModal({
              title: "提示",
              content: "需要保存图片的权限，请在设置中打开相册授权",
              success: (modalRes) => {
                if (modalRes.confirm) {
                  common_vendor.index.openSetting();
                }
              }
            });
          } else {
            common_vendor.index.showToast({ title: "保存失败", icon: "none" });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: webviewUrl.value,
        b: common_vendor.o(onMessage, "f8")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-33a399a4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/syContract/contractWebview/contractWebview.js.map
