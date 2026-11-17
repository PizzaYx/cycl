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
const COMPANY_SEAL_URL = "https://cc.cdlians.tech:8883/upload/2026/08/04/a8NNtrGaRQh882f35874f5fb7a67edfda697970f9c2c_20260804104234A162.png";
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
    const merchantName = common_vendor.ref("");
    const userStore = stores_user.useUserStore();
    const signatures = common_vendor.ref({
      partyB: ""
      // 乙方签名
    });
    const addCompanySeal = () => {
      if (!isReadOnly.value)
        return;
      let content = contractContent.value;
      content = content.replace(/<img[^>]*alt="甲方公章"[^>]*\/?>/g, "");
      const sealImg = `<img src="${COMPANY_SEAL_URL}" style="position: absolute; left: 60%; top: 30%; transform: translate(-50%, -50%); max-width: 120px; max-height: 120px; opacity: 0.85; pointer-events: none;" alt="甲方公章" />`;
      content = content.replace(
        /(收运单位\(甲方\)[\s\S]*?<div[^>]*>)(成都市新津蓉澄净环保科技有限公司)/,
        `$1<span style="position: relative; display: inline-block;">$2${sealImg}</span>`
      );
      contractContent.value = content;
    };
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
      merchantName.value = options.merchantName ? decodeURIComponent(options.merchantName) : "";
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:97", "===== syContractFromAuth 接收到的参数 =====");
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:98", "商户名称:", merchantName.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:99", "是否只读:", isReadOnly.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:100", "是否有合同:", hasContract.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:101", "开始时间(existingStartTime):", existingStartTime.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:102", "结束时间(existingEndTime):", existingEndTime.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:103", "所有参数:", options);
      if (hasContract.value && existingContent.value) {
        loadExistingContract();
      } else {
        loadContractForAuth();
      }
      loadSignatures();
    });
    const loadExistingContract = () => {
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:116", "===== 加载已存在的合同内容 =====");
      contractContent.value = decodeHtmlEntities(existingContent.value);
      contractData.value = {
        content: existingContent.value,
        createTime: existingStartTime.value,
        endTime: existingEndTime.value,
        id: ""
        // ID暂时为空
      };
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:127", "已存在合同内容加载完成:", contractContent.value);
      fillContractTemplate();
    };
    const loadContractForAuth = async () => {
      var _a;
      try {
        const merchantResult = await api_apis.apiGetMerchantCovenant({
          merchantId: (_a = userStore.contractContent) == null ? void 0 : _a.id
        });
        if (merchantResult.code === 200 && merchantResult.data && merchantResult.data.content) {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:144", "找到商户合同，直接显示");
          contractContent.value = decodeHtmlEntities(merchantResult.data.content);
          contractData.value = merchantResult.data;
          fillContractTemplate();
        } else {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:151", "未找到商户合同，获取模板进入编辑模式");
          await loadCovenantTemplate();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContractFromAuth.vue:155", "加载商户合同失败，尝试获取模板:", error);
        await loadCovenantTemplate();
      }
    };
    const loadCovenantTemplate = async () => {
      try {
        const result = await api_apis.apiGetCovenantTemplat();
        if (result.code === 200 && result.data && result.data.content) {
          contractContent.value = decodeHtmlEntities(result.data.content);
          contractData.value = result.data;
          fillContractTemplate();
        } else {
          contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">暂无合同模板</div>';
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContractFromAuth.vue:175", "加载合同模板失败:", error);
        contractContent.value = '<div style="text-align: center; padding: 40px; color: #999;">加载合同模板失败</div>';
      }
    };
    const fillContractTemplate = () => {
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:182", "===== 开始填充合同模板 =====");
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:183", "商户名称:", merchantName.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:184", "开始时间:", existingStartTime.value || contractData.value.createTime);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:185", "结束时间:", existingEndTime.value || contractData.value.endTime);
      let content = contractContent.value;
      content = content.replace(
        /(<div><span style="font-weight: bold; color: #000;">乙方\(餐厨单位\)：<\/span>\s*<div style="margin-top: 4px; border-bottom: 1px solid #333; height: 20px;">)[^<]*(<\/div>)/,
        `$1${merchantName.value || "&nbsp;"}$2`
      );
      content = content.replace(
        /(<div style="font-weight: bold; margin-bottom: 5px;">餐厨单位\(乙方\)：<\/div>\s*<div style="border-bottom: 1px solid #333; height: 30px;">)[^<]*(<\/div>)/,
        `$1${merchantName.value || "&nbsp;"}$2`
      );
      let startTime = existingStartTime.value || contractData.value.createTime || "";
      const endTime = existingEndTime.value || contractData.value.endTime || "";
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:208", "原始开始时间:", startTime);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:209", "原始结束时间:", endTime);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:210", "contractData.value:", contractData.value);
      if (!startTime) {
        startTime = getCurrentDate();
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:215", "使用当前日期作为开始时间:", startTime);
      }
      if (endTime) {
        const startDate = new Date(startTime);
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1;
        const startDay = startDate.getDate();
        const endDate = new Date(endTime);
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth() + 1;
        const endDay = endDate.getDate();
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:232", "解析后的日期:", {
          startYear,
          startMonth,
          startDay,
          endYear,
          endMonth,
          endDay
        });
        const beforeReplace = content;
        let pattern1 = /本合同有效期自\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*40px;\s*text-align:\s*center;">[^<]*<\/span>\s*年\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*月\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*日至\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*40px;\s*text-align:\s*center;">[^<]*<\/span>\s*年\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*月\s*<span style="border-bottom:\s*1px solid #333;\s*display:\s*inline-block;\s*width:\s*25px;\s*text-align:\s*center;">[^<]*<\/span>\s*日止/;
        content = content.replace(
          pattern1,
          `本合同有效期自 <span style="border-bottom: 1px solid #333; display: inline-block; width: 40px; text-align: center;">${startYear}</span>年 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${startMonth}</span>月 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${startDay}</span>日至 <span style="border-bottom: 1px solid #333; display: inline-block; width: 40px; text-align: center;">${endYear}</span>年 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${endMonth}</span>月 <span style="border-bottom: 1px solid #333; display: inline-block; width: 25px; text-align: center;">${endDay}</span>日止`
        );
        if (beforeReplace === content) {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:251", "警告：日期替换未生效，正在打印相关内容以便调试");
          const hasText = content.includes("本合同有效期自");
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:254", '是否包含"本合同有效期自":', hasText);
          if (hasText) {
            const index = content.indexOf("本合同有效期自");
            const excerpt = content.substring(index, index + 500);
            common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:259", "相关HTML片段:", excerpt);
          }
        } else {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:262", "日期替换成功");
        }
      } else {
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:265", "警告：没有结束时间，跳过日期填充");
      }
      contractContent.value = content;
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:269", "===== 合同模板填充完成 =====");
      addCompanySeal();
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
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:293", "===== 开始更新合同签名 =====");
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:294", "当前签名数据:", signatures.value);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:295", "当前合同内容长度:", contractContent.value.length);
      if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 270px; max-height: 80px; vertical-align: middle; cursor: pointer;" alt="乙方签名" />`;
        let content = contractContent.value;
        const beforeReplace = content;
        content = content.replace(
          /<span id="signature-btn"[^>]*>[^<]*<\/span>/g,
          signatureHtml
        );
        content = content.replace(
          /<div id="signature-btn"[^>]*>[^<]*<\/div>/g,
          signatureHtml
        );
        content = content.replace(
          /<img[^>]*alt="乙方签名"[^>]*>/g,
          signatureHtml
        );
        if (beforeReplace !== content) {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:322", "签名替换成功");
        } else {
          common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:324", "警告：签名替换未生效，查找签名按钮位置");
          const signatureBtnIndex = content.indexOf("signature-btn");
          if (signatureBtnIndex > -1) {
            common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:328", "找到 signature-btn 位置:", signatureBtnIndex);
            common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:329", "相关HTML片段:", content.substring(signatureBtnIndex - 50, signatureBtnIndex + 200));
          } else {
            common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:331", "未找到 signature-btn");
          }
        }
        contractContent.value = content;
        const currentDate = getCurrentDate();
        contractContent.value = contractContent.value.replace(
          /<span id="start-date">[^<]*<\/span>/g,
          `<span id="start-date">${currentDate}</span>`
        );
        contractData.value.createTime = currentDate;
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:347", "===== 合同签名更新完成 =====");
      }
    };
    const onRichTextTap = (e) => {
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:353", "富文本点击事件触发:", e);
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:354", "isReadOnly:", isReadOnly.value);
      if (isReadOnly.value) {
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:358", "只读模式，不跳转签名");
        return;
      }
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:363", "可编辑模式，跳转签名");
      goToSignature();
    };
    const goToSignature = () => {
      common_vendor.index.navigateTo({
        url: `/pages/syContract/shSignature`
      });
    };
    const downloadContract = () => {
      var _a;
      const merchantId = ((_a = userStore.currentMerchant) == null ? void 0 : _a.id) || "";
      const url = `/pages/syContract/contractWebview/contractWebview?merchantId=${encodeURIComponent(merchantId)}`;
      common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:378", "跳转webview URL:", url);
      common_vendor.index.navigateTo({
        url
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
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:399", "===== 收到签名更新事件 =====");
        common_vendor.index.__f__("log", "at pages/syContract/syContractFromAuth.vue:400", "签名数据:", signatureData);
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
        a: common_vendor.o(back, "dc"),
        b: common_vendor.p({
          title: "电子合同"
        }),
        c: common_vendor.o(onRichTextTap, "ea"),
        d: common_vendor.p({
          content: contractContent.value
        }),
        e: !isReadOnly.value
      }, !isReadOnly.value ? {
        f: common_vendor.o(onRichTextTap, "66")
      } : {}, {
        g: isReadOnly.value
      }, isReadOnly.value ? {
        h: common_vendor.o(downloadContract, "66")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bc950cb2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/syContractFromAuth.js.map
