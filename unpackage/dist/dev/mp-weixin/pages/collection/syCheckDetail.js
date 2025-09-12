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
  __name: "syCheckDetail",
  setup(__props) {
    const planId = common_vendor.ref("");
    const driverId = common_vendor.ref("");
    const driverName = common_vendor.ref("");
    const status = common_vendor.ref();
    const merchantName = common_vendor.ref("");
    const weight = common_vendor.ref(0);
    const bucketNum = common_vendor.ref(0);
    const address = common_vendor.ref("");
    const registrationNumber = common_vendor.ref("");
    const img = common_vendor.ref([]);
    const time = common_vendor.ref("");
    const statusText = common_vendor.computed(() => {
      switch (status.value) {
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
      switch (status.value) {
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
    common_vendor.onLoad((options) => {
      if (options.planId)
        planId.value = options.planId;
      if (options.driverId)
        driverId.value = options.driverId;
      common_vendor.index.__f__("log", "at pages/collection/syCheckDetail.vue:98", "接收到的参数:", options);
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
        driverName.value = res.data.driverName || "";
        status.value = res.data.status;
        merchantName.value = res.data.merchantName || "";
        if (res.data.status === 1) {
          weight.value = res.data.weight || 0;
          bucketNum.value = res.data.bucketNum || 0;
        } else {
          weight.value = res.data.estimateWeight || 0;
          bucketNum.value = res.data.estimateBucketNum || 0;
        }
        address.value = res.data.address || "";
        registrationNumber.value = res.data.registrationNumber || "";
        img.value = res.data.img ? res.data.img.split(",") : [];
        if (res.data.status === 1) {
          time.value = res.data.arrivalTime || "";
        } else {
          time.value = res.data.appointmentTime || "";
        }
      }
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        urls: img.value,
        current: index
      });
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
          title: "收运记录"
        }),
        c: common_vendor.t(driverName.value),
        d: common_vendor.t(statusText.value),
        e: common_vendor.n(statusClass.value),
        f: common_vendor.t(time.value),
        g: common_vendor.t(merchantName.value),
        h: common_vendor.t(status.value === 1 ? "收运重量" : "预估重量"),
        i: common_vendor.t(weight.value),
        j: common_vendor.t(status.value === 1 ? "收运桶数" : "预估桶数"),
        k: common_vendor.t(bucketNum.value),
        l: common_vendor.t(address.value),
        m: common_vendor.t(registrationNumber.value),
        n: common_vendor.f(img.value, (item, index, i0) => {
          return {
            a: index,
            b: item,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-63deb992"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syCheckDetail.js.map
