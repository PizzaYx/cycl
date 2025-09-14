"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
const _sfc_main = {
  __name: "shsyDetail",
  setup(__props) {
    const merchantId = common_vendor.ref();
    const id = common_vendor.ref();
    const pageData = common_vendor.ref({});
    const statusText = common_vendor.computed(() => {
      switch (pageData.value.status) {
        case 0:
          return "进行中";
        case 1:
          return "已完成";
        case 2:
          return "无法收运";
        default:
          return "";
      }
    });
    const statusClass = common_vendor.computed(() => {
      switch (pageData.value.status) {
        case 0:
          return "processing";
        case 1:
          return "completed";
        case 2:
          return "cancelled";
        default:
          return "";
      }
    });
    const infoList = common_vendor.computed(() => [
      {
        label: "预估时间:",
        value: pageData.value.appointmentTime ?? "暂无"
      },
      {
        label: "收运时间:",
        value: pageData.value.arrivalTime ?? "暂无"
      },
      {
        label: "预估重量:",
        value: pageData.value.estimateWeight + "kg"
      },
      {
        label: "收运重量:",
        value: pageData.value.weight + "kg"
      },
      {
        label: "预估桶数:",
        value: pageData.value.estimateBucketNum + "个"
      },
      {
        label: "收运桶数:",
        value: pageData.value.estimateBucketNum + "个"
      },
      {
        label: "收运地址:",
        value: pageData.value.address ?? "暂无"
      },
      {
        label: "车牌号:",
        value: pageData.value.registrationNumber ?? "暂无"
      },
      {
        label: "其他说明:",
        value: pageData.value.explain
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
      common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:111", "接收到的参数:", options);
      common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:112", "解析后的参数:", { merchantId: merchantId.value, id: id.value });
      getSyCheckDetail();
    });
    common_vendor.onMounted(() => {
    });
    const getSyCheckDetail = async () => {
      common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:127", "获取收运记录详情", merchantId.value, id.value);
      const res = await api_apis.apiGetPlanById({
        merchantId: merchantId.value,
        id: id.value
      });
      if (res.code === 200) {
        const data = res.data;
        pageData.value = {
          driverName: data.driverName,
          status: data.status,
          merchantName: data.merchantName,
          estimateWeight: data.estimateWeight ?? "暂无",
          weight: data.weight ?? "暂无",
          estimateBucketNum: data.estimateBucketNum ?? "暂无",
          bucketNum: data.bucketNum ?? "暂无",
          registrationNumber: data.registrationNumber,
          img: data.img ? data.img.split(",") : [],
          appointmentTime: data.appointmentTime,
          arrivalTime: data.arrivalTime,
          address: data.address,
          explain: data.explain ?? "暂无"
        };
      }
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-af7fb76b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shsyDetail.js.map
