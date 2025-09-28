"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_l_signature2 = common_vendor.resolveComponent("l-signature");
  (_easycom_uni_icons2 + _easycom_l_signature2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_l_signature = () => "../../uni_modules/lime-signature/components/l-signature/l-signature.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_l_signature)();
}
const _sfc_main = {
  __name: "shSignature",
  setup(__props) {
    const contractId = common_vendor.ref("");
    const contractTitle = common_vendor.ref("合同签名");
    const statusBarHeight = common_vendor.ref(0);
    const navBarHeight = common_vendor.ref(44);
    const menuButtonInfo = common_vendor.ref({});
    const useFixedHeight = common_vendor.ref(false);
    const penColor = common_vendor.ref("black");
    const penSize = common_vendor.ref(3);
    const openSmooth = common_vendor.ref(true);
    const signatureRef = common_vendor.ref(null);
    const uploadHeaders = utils_config.createUploadHeaders();
    const navBarStyle = common_vendor.computed(() => {
      let totalHeight;
      if (useFixedHeight.value) {
        totalHeight = 88;
        common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:73", "使用固定高度测试:", totalHeight);
      } else {
        if (menuButtonInfo.value.top) {
          totalHeight = menuButtonInfo.value.top + menuButtonInfo.value.height;
        } else {
          totalHeight = statusBarHeight.value + navBarHeight.value;
        }
      }
      return {
        height: totalHeight + "px",
        "--nav-bar-height": totalHeight + "px"
      };
    });
    const statusBarStyle = common_vendor.computed(() => {
      if (menuButtonInfo.value.top) {
        const top = menuButtonInfo.value.top;
        return {
          position: "absolute",
          top: top + "px",
          left: "0",
          right: "0",
          height: menuButtonInfo.value.height + "px"
        };
      } else {
        return {
          height: navBarHeight.value + "px"
        };
      }
    });
    const navContentStyle = common_vendor.computed(() => {
      if (menuButtonInfo.value.top) {
        const top = menuButtonInfo.value.top;
        return {
          position: "absolute",
          top: top + "px",
          left: "0",
          right: "0",
          height: menuButtonInfo.value.height + "px"
        };
      } else {
        return {
          height: navBarHeight.value + "px"
        };
      }
    });
    const initNavBar = () => {
      try {
        const systemInfo = common_vendor.index.getSystemInfoSync();
        statusBarHeight.value = systemInfo.statusBarHeight || 0;
        const menuButton = common_vendor.index.getMenuButtonBoundingClientRect();
        if (menuButton) {
          menuButtonInfo.value = menuButton;
          navBarHeight.value = menuButton.height;
        } else {
          navBarHeight.value = 44;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:153", "获取系统信息失败:", error);
        statusBarHeight.value = 20;
        navBarHeight.value = 44;
      }
    };
    common_vendor.onLoad((options) => {
      contractId.value = options.contractId || "";
      contractTitle.value = options.title || "合同签名";
      initNavBar();
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:171", "签名页面卸载");
    });
    const clearSignature = () => {
      if (signatureRef.value) {
        try {
          signatureRef.value.clear();
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/syContract/shSignature.vue:180", "清空签名失败:", error);
        }
      }
    };
    const undoSignature = () => {
      if (signatureRef.value) {
        try {
          signatureRef.value.undo();
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/syContract/shSignature.vue:191", "撤销签名失败:", error);
        }
      }
    };
    const saveSignature = () => {
      if (!signatureRef.value) {
        common_vendor.index.showToast({
          title: "签名组件未加载",
          icon: "none"
        });
        return;
      }
      signatureRef.value.canvasToTempFilePath({
        success: (res) => {
          if (res.isEmpty) {
            common_vendor.index.showToast({
              title: "请先进行签名",
              icon: "none"
            });
            return;
          }
          common_vendor.index.showLoading({
            title: "上传签名中..."
          });
          common_vendor.index.uploadFile({
            url: utils_config.uploadUrl,
            filePath: res.tempFilePath,
            name: "file",
            header: uploadHeaders.value,
            success: (uploadRes) => {
              common_vendor.index.hideLoading();
              try {
                const response = JSON.parse(uploadRes.data);
                if (response.code === 200 && response.url) {
                  common_vendor.index.showToast({
                    title: "签名保存成功",
                    icon: "success"
                  });
                  common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:237", "签名上传成功:", uploadRes);
                  setTimeout(() => {
                    common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:240", "===== shSignature.vue 准备返回 =====");
                    common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:241", "执行uni.navigateBack，delta: 1");
                    common_vendor.index.navigateBack({
                      delta: 1,
                      success: () => {
                        common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:245", "shSignature.vue uni.navigateBack 成功");
                        common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:247", "发送signatureUpdated事件");
                        common_vendor.index.$emit("signatureUpdated", {
                          partyB: response.url
                        });
                      },
                      fail: (err) => {
                        common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:253", "shSignature.vue uni.navigateBack 失败:", err);
                      }
                    });
                  }, 1500);
                } else {
                  throw new Error(response.message || "上传失败");
                }
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:261", "解析上传响应失败:", error);
                common_vendor.index.showToast({
                  title: "上传失败，请重试",
                  icon: "none"
                });
              }
            },
            fail: (error) => {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:270", "上传签名失败:", error);
              common_vendor.index.showToast({
                title: "上传失败，请重试",
                icon: "none"
              });
            }
          });
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:279", "保存签名失败:", error);
          common_vendor.index.showToast({
            title: "保存签名失败",
            icon: "none"
          });
        }
      });
    };
    const cancelSignature = () => {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确定要取消签名吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateBack();
          }
        }
      });
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.s(statusBarStyle.value),
        b: common_vendor.p({
          type: "left",
          size: "20",
          color: "#000"
        }),
        c: common_vendor.o(back),
        d: common_vendor.t(contractTitle.value),
        e: common_vendor.s(navContentStyle.value),
        f: common_vendor.s(navBarStyle.value),
        g: common_vendor.sr(signatureRef, "0634d544-1", {
          "k": "signatureRef"
        }),
        h: common_vendor.p({
          penColor: penColor.value,
          penSize: penSize.value,
          openSmooth: openSmooth.value,
          openSmooth: true
        }),
        i: common_vendor.o(clearSignature),
        j: common_vendor.o(undoSignature),
        k: common_vendor.o(saveSignature),
        l: common_vendor.o(cancelSignature)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0634d544"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/shSignature.js.map
