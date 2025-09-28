"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const utils_orderUtils = require("../../utils/orderUtils.js");
if (!Math) {
  PageHeader();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "shyyDetail",
  setup(__props) {
    const merchantId = common_vendor.ref();
    const id = common_vendor.ref();
    const pageData = common_vendor.ref({});
    const statusText = common_vendor.computed(() => {
      switch (pageData.value.status) {
        case 0:
          return "待审核";
        case 1:
          return "审核通过";
        case 2:
          return "未通过";
        default:
          return "";
      }
    });
    const statusClass = common_vendor.computed(() => {
      switch (pageData.value.status) {
        case 0:
          return "booking";
        case 1:
          return "passed";
        case 2:
          return "notpassed";
        default:
          return "";
      }
    });
    const infoList = common_vendor.computed(() => [
      {
        label: "预估时间:",
        value: pageData.value.appointmentTime ? pageData.value.appointmentTime : "暂无"
      },
      {
        label: "预估重量:",
        value: utils_orderUtils.formatWeight(pageData.value.estimateWeight)
      },
      {
        label: "预估桶数:",
        value: utils_orderUtils.formatNum(pageData.value.estimateBucketNum)
      },
      {
        label: "收运地址:",
        value: pageData.value.address ?? "暂无"
      },
      {
        label: "其他说明:",
        value: pageData.value.explain ?? "暂无"
      }
    ]);
    common_vendor.onLoad((options) => {
      if (options.id)
        id.value = options.id;
      if (options.merchantId) {
        merchantId.value = options.merchantId;
      } else if (options["merchantId "]) {
        merchantId.value = options["merchantId "];
      }
      getSyCheckDetail();
    });
    common_vendor.onMounted(() => {
    });
    const getSyCheckDetail = async () => {
      const res = await api_apis.apiGetPlanTemporaryById({
        merchantId: merchantId.value,
        id: id.value
      });
      if (res.code === 200) {
        const data = res.data;
        pageData.value = {
          driverName: data.driverName ?? "",
          status: data.status,
          merchantName: data.merchantName ?? "",
          estimateWeight: data.estimateWeight ?? 0,
          weight: data.weight ?? 0,
          estimateBucketNum: data.estimateBucketNum ?? 0,
          bucketNum: data.bucketNum ?? 0,
          registrationNumber: data.registrationNumber ?? 0,
          img: data.img ? data.img.split(",") : [],
          appointmentTime: data.appointmentTime ?? 0,
          arrivalTime: data.arrivalTime,
          address: data.address ?? "",
          explain: data.explain ?? "暂无"
        };
        common_vendor.index.__f__("log", "at pages/merchant/shyyDetail.vue:133", "获取收运记录详情成功", pageData.value);
      }
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "预约详细"
        }),
        c: common_vendor.t(pageData.value.merchantName),
        d: common_vendor.t(statusText.value),
        e: common_vendor.n(statusClass.value),
        f: common_vendor.f(infoList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-44f007f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shyyDetail.js.map
