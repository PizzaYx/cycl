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
        label: "商家名称:",
        value: pageData.value.merchantName
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
        value: pageData.value.bucketNum + "个"
      },
      {
        label: "收运地址:",
        value: pageData.value.address ?? "暂无"
      },
      {
        label: "车牌号:",
        value: pageData.value.registrationNumber ?? "暂无"
      }
    ]);
    common_vendor.onLoad((options) => {
      if (options.planId)
        planId.value = options.planId;
      if (options.driverId)
        driverId.value = options.driverId;
      common_vendor.index.__f__("log", "at pages/collection/syCheckDetail.vue:130", "接收到的参数:", options);
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
          img: data.img ? data.img.split(",") : [],
          appointmentTime: data.appointmentTime,
          arrivalTime: data.arrivalTime,
          address: data.address
        };
      }
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        urls: pageData.value.img,
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
          title: "收运记录详细"
        }),
        c: common_vendor.t(pageData.value.driverName),
        d: common_vendor.t(statusText.value),
        e: common_vendor.n(statusClass.value),
        f: common_vendor.f(infoList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: index
          };
        }),
        g: common_vendor.f(pageData.value.img, (item, index, i0) => {
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
