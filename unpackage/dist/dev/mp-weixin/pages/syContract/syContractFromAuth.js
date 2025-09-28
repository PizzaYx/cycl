"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_mp_html2 = common_vendor.resolveComponent("mp-html");
  _easycom_mp_html2();
}
const _easycom_mp_html = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
if (!Math) {
  (PageHeader + _easycom_mp_html)();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "syContractFromAuth",
  setup(__props) {
    const tempId = common_vendor.ref("");
    const contractData = common_vendor.ref({});
    const hasContract = common_vendor.ref(false);
    const existingContent = common_vendor.ref("");
    const existingStartTime = common_vendor.ref("");
    const existingEndTime = common_vendor.ref("");
    const isReadOnly = common_vendor.ref(false);
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
    common_vendor.onLoad((options) => {
      tempId.value = options.tempId || "";
      hasContract.value = options.hasContract === "true";
      existingContent.value = options.content ? decodeURIComponent(options.content) : "";
      existingStartTime.value = options.startTime || "";
      existingEndTime.value = options.endTime || "";
      isReadOnly.value = options.isReadOnly === "true";
      if (hasContract.value && existingContent.value) {
        loadExistingContract();
      } else {
        loadContractForAuth();
      }
      loadSignatures();
    });
    const loadExistingContract = () => {
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:78", "===== 加载已存在的合同内容 =====");
      contractContent.value = decodeHtmlEntities(existingContent.value);
      contractData.value = {
        content: existingContent.value,
        createTime: existingStartTime.value,
        endTime: existingEndTime.value,
        id: ""
        // ID暂时为空
      };
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:89", "已存在合同内容加载完成:", contractContent.value);
    };
    const loadContractForAuth = async () => {
      var _a;
      try {
        const merchantResult = await api_apis.apiGetMerchantCovenant({
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id
        });
        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:103", "找到商户合同，直接显示");
          contractContent.value = decodeHtmlEntities(merchantResult.data.content);
          contractData.value = merchantResult.data;
        } else {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:108", "未找到商户合同，获取模板进入编辑模式");
          await loadCovenantTemplate();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContractFromAuth.vue:112", "加载商户合同失败，尝试获取模板:", error);
        await loadCovenantTemplate();
      }
    };
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
        common_vendor.index.__f__("error", "at pages/syContract/syContractFromAuth.vue:130", "加载合同模板失败:", error);
        contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">加载合同模板失败</div>';
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
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:154", "===== 开始更新合同签名 =====");
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:155", "当前签名数据:", signatures.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:156", "当前合同内容:", contractContent.value);
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
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:183", "更新后的合同内容:", contractContent.value);
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:184", "===== 合同签名更新完成 =====");
      }
    };
    const onRichTextTap = (e) => {
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:190", "富文本点击事件触发:", e);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:191", "isReadOnly:", isReadOnly.value);
      if (isReadOnly.value) {
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:195", "只读模式，不跳转签名");
        return;
      }
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:200", "可编辑模式，跳转签名");
      goToSignature();
    };
    const goToSignature = () => {
      common_vendor.index.navigateTo({
        url: `/pages/syContract/shSignature`
      });
    };
    const back = () => {
      if (!signatures.value.partyB) {
        common_vendor.index.navigateBack();
        return;
      }
      prepareReturnData();
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$on("signatureUpdated", (signatureData) => {
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:226", "===== 收到签名更新事件 =====");
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:227", "签名数据:", signatureData);
        signatures.value = signatureData;
        updateContractWithSignature();
      });
    });
    const prepareReturnData = () => {
      const currentDate = /* @__PURE__ */ new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const createTime = `${year}-${month}-${day}`;
      const returnData = {
        content: contractContent.value,
        // 修改后的富文本内容
        createTime,
        // 回显的开始日期
        endTime: contractData.value.endTime,
        // 从result.data获取的结束日期
        id: contractData.value.id
        // 从result.data获取的合同ID
      };
      common_vendor.index.$emit("contractUpdated", returnData);
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "电子合同"
        }),
        c: common_vendor.o(onRichTextTap),
        d: common_vendor.p({
          content: contractContent.value
        }),
        e: !isReadOnly.value
      }, !isReadOnly.value ? {
        f: common_vendor.o(onRichTextTap)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bc950cb2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/syContractFromAuth.js.map
