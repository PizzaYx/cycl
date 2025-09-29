"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (PageHeader + StatusPicker + TimeRangePicker + StatusTag + InfoDisplay + _easycom_uni_load_more)();
}
const TimeRangePicker = () => "../../components/TimeRangePicker/TimeRangePicker.js";
const StatusPicker = () => "../../components/StatusPicker/StatusPicker.js";
const StatusTag = () => "../../components/StatusTag/StatusTag.js";
const InfoDisplay = () => "../../components/InfoDisplay/InfoDisplay.js";
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "shStatistics",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const bucketCount = common_vendor.ref(0);
    const totalWeight = common_vendor.ref(0);
    const statisticsConfig = [
      {
        image: "/static/shd/tjleft.png",
        number: () => bucketCount.value + " 个",
        title: "垃圾桶数"
      },
      {
        image: "/static/shd/tjright.png",
        number: () => totalWeight.value + " kg",
        title: "总重量"
      }
    ];
    const handleViewDetails = (item) => {
      common_vendor.index.__f__("log", "at pages/merchant/shStatistics.vue:119", "查看详情按钮被点击", item);
      common_vendor.index.navigateTo({
        url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId =${item.merchantId}`
      });
    };
    const getInfoFields = (item) => {
      const status = item.status;
      if (status === 0 || status === "0" || status === 2 || status === "2") {
        return [
          {
            key: "appointmentTime",
            label: "预估时间",
            value: item.appointmentTime
          },
          {
            key: "estimateWeight",
            label: "预估重量",
            value: item.estimateWeight
          },
          {
            key: "estimateBucketNum",
            label: "预估桶数",
            value: item.estimateBucketNum
          },
          {
            key: "registrationNumber",
            label: "车辆信息",
            value: item.registrationNumber
          },
          {
            key: "address",
            label: "地址",
            value: item.address
          }
        ];
      }
      if (status === 1 || status === "1") {
        return [
          {
            key: "arrivalTime",
            label: "收运时间",
            value: item.arrivalTime
          },
          {
            key: "weight",
            label: "收运重量",
            value: item.weight
          },
          {
            key: "bucketNum",
            label: "收运桶数",
            value: item.bucketNum
          },
          {
            key: "registrationNumber",
            label: "车辆信息",
            value: item.registrationNumber
          },
          {
            key: "address",
            label: "地址",
            value: item.address
          }
        ];
      }
      return [
        {
          key: "appointmentTime",
          label: "预估时间",
          value: item.appointmentTime
        },
        {
          key: "estimateWeight",
          label: "预估重量",
          value: item.estimateWeight
        },
        {
          key: "estimateBucketNum",
          label: "预估桶数",
          value: item.estimateBucketNum
        },
        {
          key: "registrationNumber",
          label: "车辆信息",
          value: item.registrationNumber
        }
      ];
    };
    const getToStatistics = async () => {
      var _a;
      const params = {
        merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id
      };
      if (selectedStatus.value !== null) {
        params.status = selectedStatus.value;
      }
      if (selectedTimeRange.value && selectedTimeRange.value.length === 2 && selectedTimeRange.value[0] && selectedTimeRange.value[1]) {
        params.startTime = selectedTimeRange.value[0];
        params.endTime = selectedTimeRange.value[1];
      }
      const res = await api_apis.apiGetPlanStatistics(params);
      if (res.code === 200) {
        bucketCount.value = res.data.bucketNum ?? 0;
        totalWeight.value = res.data.weight ?? 0;
      }
    };
    const selectedStatus = common_vendor.ref(null);
    const selectedTimeRange = common_vendor.ref([]);
    const statusOptions = common_vendor.ref([
      { value: 0, text: "待收运" },
      { value: 1, text: "已完成" },
      { value: 2, text: "无需收运" }
    ]);
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const pageNum = common_vendor.ref(1);
    const loadingStatus = common_vendor.ref("more");
    const allOrderList = common_vendor.ref([]);
    const getNetwork = async () => {
      var _a;
      try {
        if (pageNum.value > 1) {
          loadingStatus.value = "loading";
        }
        const params = {
          pageNum: pageNum.value,
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id
        };
        if (selectedStatus.value !== null) {
          params.status = selectedStatus.value;
        }
        if (selectedTimeRange.value && selectedTimeRange.value.length === 2 && selectedTimeRange.value[0] && selectedTimeRange.value[1]) {
          params.startTime = selectedTimeRange.value[0];
          params.endTime = selectedTimeRange.value[1];
        }
        const res = await api_apis.apiGetPlanStatisticsPage(params);
        if (pageNum.value === 1) {
          allOrderList.value = res.data.list || [];
          common_vendor.index.stopPullDownRefresh();
        } else {
          allOrderList.value = [...allOrderList.value, ...res.data.list || []];
        }
        if (res.data.list && res.data.list.length < 10) {
          loadingStatus.value = "nomore";
        } else {
          loadingStatus.value = "more";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shStatistics.vue:312", "获取数据失败:", error);
        common_vendor.index.stopPullDownRefresh();
        loadingStatus.value = "more";
        if (pageNum.value === 1) {
          allOrderList.value = [];
        }
        common_vendor.index.showToast({
          title: "数据加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const onLoadMore = () => {
      if (loadingStatus.value === "nomore")
        return;
      pageNum.value++;
      getNetwork();
    };
    common_vendor.onReachBottom(() => {
      onLoadMore();
    });
    common_vendor.onPullDownRefresh(() => {
      allOrderList.value = [];
      pageNum.value = 1;
      getNetwork();
      getToStatistics();
    });
    const onStatusChange = (value) => {
      selectedStatus.value = value;
      resetPageAndReload();
    };
    const onTimeChange = (value) => {
      common_vendor.index.__f__("log", "at pages/merchant/shStatistics.vue:366", "时间变化:", value);
      selectedTimeRange.value = value;
      resetPageAndReload();
    };
    const resetPageAndReload = () => {
      allOrderList.value = [];
      pageNum.value = 1;
      getNetwork();
      getToStatistics();
    };
    common_vendor.onMounted(() => {
      pageNum.value = 1;
      getToStatistics();
      getNetwork();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "商户收运统计"
        }),
        c: common_vendor.o(onStatusChange),
        d: common_vendor.o(($event) => selectedStatus.value = $event),
        e: common_vendor.p({
          options: statusOptions.value,
          modelValue: selectedStatus.value
        }),
        f: common_vendor.o(onTimeChange),
        g: common_vendor.o(($event) => selectedTimeRange.value = $event),
        h: common_vendor.p({
          modelValue: selectedTimeRange.value
        }),
        i: common_vendor.f(statisticsConfig, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.number()),
            c: common_vendor.t(item.title),
            d: index
          };
        }),
        j: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        k: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: "5f21cbbb-3-" + i0,
            c: common_vendor.p({
              status: item.status
            }),
            d: "5f21cbbb-4-" + i0,
            e: common_vendor.p({
              fields: getInfoFields(item)
            }),
            f: common_vendor.o(($event) => handleViewDetails(item), index),
            g: "5f21cbbb-5-" + i0,
            h: index
          };
        }),
        l: common_vendor.p({
          size: "mini"
        }),
        m: common_vendor.p({
          status: loadingStatus.value,
          ["content-text"]: {
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了"
          }
        })
      } : loadingStatus.value !== "loading" ? {} : {}, {
        n: loadingStatus.value !== "loading"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f21cbbb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shStatistics.js.map
