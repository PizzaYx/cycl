"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const utils_orderUtils = require("../../utils/orderUtils.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  (_easycom_uni_nav_bar + DriverStatusTag)();
}
const DriverStatusTag = () => "../../components/DriverStatusTag/DriverStatusTag.js";
const _sfc_main = {
  __name: "syCheckDetail",
  setup(__props) {
    const planId = common_vendor.ref("");
    const driverId = common_vendor.ref("");
    const pageData = common_vendor.ref({
      // driverName: '', //司机名称
      // status: null, //状态 0 进行中 1.已完成 2.无法收运 
      // merchantName: '', //商家名称
      // weight: 0.0, //重量
      // bucketNum: 0, //桶数
      // address: '', //地址 
      // registrationNumber: '', //车牌号
      // img: [], //照片数组
      // time: '', // 收运时间
      // estimateTime: '' // 预估时间
    });
    const infoList = common_vendor.computed(() => [
      {
        label: "商家名称:",
        value: pageData.value.merchantName ?? "暂无"
      },
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
        value: utils_orderUtils.formatWeight(pageData.value.estimateWeight)
      },
      {
        label: "收运重量:",
        value: utils_orderUtils.formatWeight(pageData.value.weight)
      },
      {
        label: "预估桶数:",
        value: utils_orderUtils.formatNum(pageData.value.estimateBucketNum)
      },
      {
        label: "收运桶数:",
        value: utils_orderUtils.formatNum(pageData.value.bucketNum)
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
        value: pageData.value.remark ?? "暂无"
      }
    ]);
    common_vendor.onLoad((options) => {
      if (options.planId)
        planId.value = options.planId;
      if (options.driverId)
        driverId.value = options.driverId;
      common_vendor.index.__f__("log", "at pages/collection/syCheckDetail.vue:103", "接收到的参数:", options);
    });
    common_vendor.onMounted(() => {
      getSyCheckDetail();
    });
    const getSyCheckDetail = async () => {
      const res = await api_apis.apiGetDriverPlanById({
        driverId: driverId.value,
        id: planId.value
      });
      if (res.code === 200) {
        const data = res.data;
        pageData.value = {
          driverName: data.driverName,
          status: data.status,
          merchantName: data.merchantName,
          estimateWeight: data.estimateWeight || 0,
          weight: data.weight || 0,
          estimateBucketNum: data.estimateBucketNum || 0,
          bucketNum: data.bucketNum || 0,
          registrationNumber: data.registrationNumber,
          appointmentTime: data.appointmentTime,
          arrivalTime: data.arrivalTime,
          address: data.address,
          remark: data.remark
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
          title: "收运记录详细"
        }),
        c: common_vendor.t(pageData.value.driverName),
        d: common_vendor.p({
          status: pageData.value.status
        }),
        e: common_vendor.f(infoList.value, (item, index, i0) => {
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-63deb992"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syCheckDetail.js.map
