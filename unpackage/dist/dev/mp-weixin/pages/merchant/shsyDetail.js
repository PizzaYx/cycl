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
    const getRecordStatusText = () => {
      switch (pageData.value.status) {
        case 0:
          return "进行中";
        case 1: {
          if (pageData.value.merchantConfirm) {
            return "已完成";
          } else {
            return "待确认";
          }
        }
        case 2:
          return "无需收运";
        default:
          return "未知状态";
      }
    };
    const getStatusClass = () => {
      switch (pageData.value.status) {
        case 0:
          return "processing";
        case 1: {
          if (pageData.value.merchantConfirm) {
            return "completed";
          } else {
            return "pending";
          }
        }
        case 2:
          return "cancelled";
        default:
          return "";
      }
    };
    const infoList = common_vendor.computed(() => [
      {
        label: "预估时间:",
        value: pageData.value.appointmentTime ? pageData.value.appointmentTime : "暂无"
      },
      {
        label: "收运时间:",
        value: pageData.value.arrivalTime ? pageData.value.arrivalTime : "暂无"
      },
      {
        label: "预估重量:",
        value: pageData.value.estimateWeight ? pageData.value.estimateWeight + " kg" : "暂无"
      },
      {
        label: "收运重量:",
        value: pageData.value.weight ? pageData.value.weight + " kg" : "暂无"
      },
      {
        label: "预估桶数:",
        value: pageData.value.estimateBucketNum ? pageData.value.estimateBucketNum + " 个" : "暂无"
      },
      {
        label: "收运桶数:",
        value: pageData.value.bucketNum ? pageData.value.bucketNum + " 个" : "暂无"
      },
      {
        label: "收运地址:",
        value: pageData.value.address ? pageData.value.address : "暂无"
      },
      {
        label: "车牌号:",
        value: pageData.value.registrationNumber ?? "暂无"
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
      common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:130", "接收到的参数:", options);
      common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:131", "解析后的参数:", { merchantId: merchantId.value, id: id.value });
      getSyCheckDetail();
    });
    common_vendor.onMounted(() => {
    });
    const getSyCheckDetail = async () => {
      common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:146", "获取收运记录详情", merchantId.value, id.value);
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
          estimateWeight: data.estimateWeight,
          weight: data.weight,
          estimateBucketNum: data.estimateBucketNum,
          bucketNum: data.bucketNum,
          registrationNumber: data.registrationNumber,
          img: data.img ? data.img.split(",") : [],
          appointmentTime: data.appointmentTime,
          arrivalTime: data.arrivalTime,
          address: data.address,
          explain: data.explain,
          merchantConfirm: data.merchantConfirm
        };
        common_vendor.index.__f__("log", "at pages/merchant/shsyDetail.vue:174", "获取收运记录详情成功", pageData.value);
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
          title: "收运详细"
        }),
        c: common_vendor.t(pageData.value.merchantName),
        d: common_vendor.t(getRecordStatusText()),
        e: common_vendor.n(getStatusClass()),
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
