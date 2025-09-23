"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_l_signature2 = common_vendor.resolveComponent("l-signature");
  (_easycom_uni_nav_bar2 + _easycom_l_signature2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_l_signature = () => "../../uni_modules/lime-signature/components/l-signature/l-signature.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_l_signature)();
}
const _sfc_main = {
  __name: "shSignature",
  setup(__props) {
    const contractId = common_vendor.ref("");
    const contractTitle = common_vendor.ref("合同签名");
    const penColor = common_vendor.ref("black");
    const penSize = common_vendor.ref(3);
    const openSmooth = common_vendor.ref(true);
    const signatureRef = common_vendor.ref(null);
    const uploadHeaders = utils_config.createUploadHeaders();
    common_vendor.onLoad((options) => {
      contractId.value = options.contractId || "";
      contractTitle.value = options.title || "合同签名";
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:49", "签名页面卸载");
    });
    const clearSignature = () => {
      if (signatureRef.value) {
        try {
          signatureRef.value.clear();
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/syContract/shSignature.vue:58", "清空签名失败:", error);
        }
      }
    };
    const undoSignature = () => {
      if (signatureRef.value) {
        try {
          signatureRef.value.undo();
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/syContract/shSignature.vue:69", "撤销签名失败:", error);
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
                  common_vendor.index.__f__("log", "at pages/syContract/shSignature.vue:116", "签名上传成功:", uploadRes);
                  setTimeout(() => {
                    common_vendor.index.navigateBack({
                      delta: 1,
                      success: () => {
                        common_vendor.index.$emit("signatureUpdated", {
                          partyB: response.url
                        });
                      }
                    });
                  }, 1500);
                } else {
                  throw new Error(response.message || "上传失败");
                }
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:133", "解析上传响应失败:", error);
                common_vendor.index.showToast({
                  title: "上传失败，请重试",
                  icon: "none"
                });
              }
            },
            fail: (error) => {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:142", "上传签名失败:", error);
              common_vendor.index.showToast({
                title: "上传失败，请重试",
                icon: "none"
              });
            }
          });
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/syContract/shSignature.vue:151", "保存签名失败:", error);
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
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: contractTitle.value
        }),
        c: common_vendor.sr(signatureRef, "0634d544-1", {
          "k": "signatureRef"
        }),
        d: common_vendor.p({
          penColor: penColor.value,
          penSize: penSize.value,
          openSmooth: openSmooth.value,
          openSmooth: true
        }),
        e: common_vendor.o(clearSignature),
        f: common_vendor.o(undoSignature),
        g: common_vendor.o(saveSignature),
        h: common_vendor.o(cancelSignature)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0634d544"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/shSignature.js.map
