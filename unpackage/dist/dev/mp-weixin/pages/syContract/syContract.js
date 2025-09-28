"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_mp_html2 = common_vendor.resolveComponent("mp-html");
  (_easycom_uni_icons2 + _easycom_mp_html2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_mp_html = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
if (!Math) {
  (PageHeader + _easycom_uni_icons + _easycom_mp_html)();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "syContract",
  setup(__props) {
    const tempId = common_vendor.ref("");
    const contractData = common_vendor.ref({});
    const isReadOnly = common_vendor.ref(false);
    const contractExpired = common_vendor.ref(false);
    const userStore = stores_user.useUserStore();
    const signatures = common_vendor.ref({
      partyB: ""
      // 乙方签名
    });
    const contractContent = common_vendor.ref("");
    const decodeHtmlEntities = (str) => {
      if (!str)
        return "";
      return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    };
    const checkContractExpiry = (endTime) => {
      if (!endTime)
        return false;
      try {
        let endDate;
        if (endTime.includes("年") && endTime.includes("月") && endTime.includes("日")) {
          const match = endTime.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (match) {
            const [, year, month, day] = match;
            endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          }
        } else {
          endDate = new Date(endTime);
        }
        if (!endDate || isNaN(endDate.getTime())) {
          common_vendor.index.__f__("warn", "at pages/syContract/syContract.vue:95", "无法解析合同结束时间:", endTime);
          return false;
        }
        const currentDate = /* @__PURE__ */ new Date();
        currentDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const isExpired = currentDate > endDate;
        common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:104", "合同过期检查:", {
          endTime,
          endDate: endDate.toISOString(),
          currentDate: currentDate.toISOString(),
          isExpired
        });
        return isExpired;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:113", "检查合同过期时间失败:", error);
        return false;
      }
    };
    const canSubmit = common_vendor.computed(() => {
      return signatures.value.partyB;
    });
    common_vendor.onLoad((options) => {
      tempId.value = options.tempId || "";
      isReadOnly.value = options.isReadOnly === "true";
      common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:128", "===== syContract.vue 页面加载 =====");
      common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:129", "接收到的状态参数:", {
        isReadOnly: isReadOnly.value,
        tempId: tempId.value
      });
      loadContractForMerchant();
      loadSignatures();
    });
    const loadCovenantTemplate = async () => {
      try {
        const result = await api_apis.apiGetCovenantTemplat();
        if (result.code === 200 && result.data && result.data.content) {
          contractContent.value = decodeHtmlEntities(result.data.content);
          contractData.value = result.data;
        } else {
          contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">暂无合同模板</div>';
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:153", "加载合同模板失败:", error);
        contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">加载合同模板失败</div>';
      }
    };
    const loadContractForMerchant = async () => {
      var _a;
      try {
        common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:161", "从merchant页面进入，先尝试获取商户合同");
        const merchantResult = await api_apis.apiGetMerchantCovenant({
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id
        });
        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
          const merchantContractData = merchantResult.data;
          const isExpired = checkContractExpiry(merchantContractData.endTime);
          if (isExpired) {
            common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:174", "合同已过期，需要重新编辑");
            contractExpired.value = true;
            await loadCovenantTemplate();
            isReadOnly.value = false;
          } else {
            common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:180", "合同未过期，只读显示");
            contractContent.value = decodeHtmlEntities(merchantContractData.content);
            contractData.value = merchantContractData;
            isReadOnly.value = true;
          }
        } else {
          common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:187", "未找到商户合同，获取模板进入编辑模式");
          await loadCovenantTemplate();
          isReadOnly.value = false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:192", "加载商户合同失败，尝试获取模板:", error);
        await loadCovenantTemplate();
        isReadOnly.value = false;
      }
    };
    const getCurrentDate = () => {
      const currentDate = /* @__PURE__ */ new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const loadSignatures = () => {
      signatures.value = {
        partyB: ""
      };
    };
    const updateContractWithSignature = () => {
      if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 270px; max-height: 80px; vertical-align: middle; cursor: pointer;" alt="乙方签名" />`;
        contractContent.value = contractContent.value.replace(
          /<span id="signature-btn"[^>]*>点击此处签名<\/span>/g,
          signatureHtml
        );
        contractContent.value = contractContent.value.replace(
          /<img[^>]*alt="乙方签名"[^>]*>/g,
          signatureHtml
        );
        const currentDate = getCurrentDate();
        contractContent.value = contractContent.value.replace(
          /<span id="start-date">[^<]*<\/span>/g,
          `<span id="start-date">${currentDate}</span>`
        );
        contractData.value.createTime = currentDate;
      }
    };
    const onRichTextTap = (e) => {
      common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:249", "富文本点击事件触发:", e);
      if (!isReadOnly.value) {
        goToSignature();
      }
    };
    const goToSignature = () => {
      common_vendor.index.navigateTo({
        url: `/pages/syContract/shSignature`
      });
    };
    const submitContract = () => {
      if (!canSubmit.value) {
        common_vendor.index.showToast({
          title: "请先完成签名",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认提交",
        content: "确定要提交合同吗？提交后将无法修改。",
        success: (res) => {
          if (res.confirm) {
            submitContractToServer();
          }
        }
      });
    };
    const submitContractToServer = async () => {
      var _a;
      try {
        common_vendor.index.showLoading({
          title: "提交中..."
        });
        let finalContractContent = contractContent.value;
        if (signatures.value.partyB) {
          const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 300px; max-height: 80px; border-radius: 8px; vertical-align: middle; border: 1px solid #e0e0e0;" alt="乙方签名" />`;
          finalContractContent = finalContractContent.replace(
            '<span id="signature-btn" style="display: inline-block; width: 270px; height: 80px; border: 2px dashed #ccc; border-radius: 8px; margin-left: 10px; text-align: center; line-height: 76px; color: #999; font-size: 16px; cursor: pointer; background: #fafafa; transition: all 0.3s ease;">点击此处签名</span>',
            signatureHtml
          );
          const currentDate = getCurrentDate();
          finalContractContent = finalContractContent.replace(
            '<span id="start-date">________________</span>',
            `<span id="start-date">${currentDate}</span>`
          );
        }
        try {
          const submitData = {
            content: finalContractContent,
            // 富文本内容
            merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
            // 商户ID
            startTime: getCurrentDate(),
            // 开始日期
            endTime: contractData.value.endTime,
            // 结束日期
            tempId: contractData.value.id
            // 合同模板ID
          };
          common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:321", "提交合同数据:", submitData);
          const response = await api_apis.apiAddMerchantCovenant(submitData);
          if (response.code === 200) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "合同提交成功",
              icon: "success"
            });
            signatures.value = {
              partyB: ""
            };
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            throw new Error(response.message || "提交失败");
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:347", "提交合同失败:", error);
          common_vendor.index.showToast({
            title: "提交失败，请重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:356", "提交合同失败:", error);
        common_vendor.index.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
      }
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$on("signatureUpdated", (signatureData) => {
        signatures.value = signatureData;
        updateContractWithSignature();
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "合同详情"
        }),
        c: contractData.value.endTime
      }, contractData.value.endTime ? {
        d: common_vendor.p({
          type: contractExpired.value ? "info" : "calendar",
          size: "16",
          color: contractExpired.value ? "#ff9500" : "rgba(7, 193, 96, 1)"
        }),
        e: common_vendor.t(contractExpired.value ? "您的合同已过期，请重新签署合同" : `您的合同截止到 ${contractData.value.endTime} 到期`),
        f: contractExpired.value ? 1 : ""
      } : {}, {
        g: common_vendor.p({
          content: contractContent.value
        }),
        h: !isReadOnly.value
      }, !isReadOnly.value ? {
        i: common_vendor.o(onRichTextTap)
      } : {}, {
        j: !isReadOnly.value
      }, !isReadOnly.value ? {
        k: common_vendor.o(submitContract),
        l: !canSubmit.value
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-607e301a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/syContract.js.map
