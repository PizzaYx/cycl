"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + TimeRangePicker + _easycom_uni_load_more)();
}
const TimeRangePicker = () => "../../components/TimeRangePicker/TimeRangePicker.js";
const _sfc_main = {
  __name: "shStatistics",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const bucketCount = common_vendor.ref(0);
    const totalWeight = common_vendor.ref(0);
    const statisticsConfig = [
      {
        image: "/static/shd/tjleft.png",
        number: bucketCount,
        title: "垃圾桶数"
      },
      {
        image: "/static/shd/tjright.png",
        number: totalWeight,
        title: "总重量"
      }
    ];
    const getStatusClass = (status) => {
      switch (status) {
        case 0:
          return "processing";
        case 1:
          return "completed";
        case 2:
          return "cancelled";
      }
    };
    const handleViewDetails = (item) => {
      common_vendor.index.__f__("log", "at pages/merchant/shStatistics.vue:158", "查看详情按钮被点击", item);
      common_vendor.index.navigateTo({
        url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId =${item.merchantId}`
      });
    };
    const getStatusText = (status) => {
      switch (status) {
        case 0:
        case "0":
          return "待收运";
        case 1:
        case "1":
          return "已完成";
        case 2:
        case "2":
          return "无法收运";
        default:
          return "无法收运";
      }
    };
    const getToStatistics = async () => {
      var _a;
      const params = {
        merchantId: ((_a = userStore.merchant) == null ? void 0 : _a.id) || 448
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
          merchantId: ((_a = userStore.merchant) == null ? void 0 : _a.id) || 448
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
        common_vendor.index.__f__("error", "at pages/merchant/shStatistics.vue:275", "获取数据失败:", error);
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
    const showStatusPicker = () => {
      const itemList = statusOptions.value.map((item, index) => {
        const isSelected = selectedStatus.value === item.value;
        return isSelected ? `✓ ${item.text}` : item.text;
      });
      common_vendor.index.showActionSheet({
        itemList,
        success: (res) => {
          const selectedOption = statusOptions.value[res.tapIndex];
          onStatusChange(selectedOption.value);
        },
        fail: (err) => {
          onStatusChange(null);
        }
      });
    };
    const onStatusChange = (value) => {
      selectedStatus.value = value;
      resetPageAndReload();
    };
    const onTimeChange = (value) => {
      common_vendor.index.__f__("log", "at pages/merchant/shStatistics.vue:348", "时间变化:", value);
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
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "商户收运统计"
        }),
        c: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        d: common_vendor.o(showStatusPicker),
        e: common_vendor.o(onTimeChange),
        f: common_vendor.o(($event) => selectedTimeRange.value = $event),
        g: common_vendor.p({
          modelValue: selectedTimeRange.value
        }),
        h: common_vendor.f(statisticsConfig, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.number),
            c: common_vendor.t(item.title),
            d: index
          };
        }),
        i: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        j: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(getStatusText(item.status)),
            c: common_vendor.n(getStatusClass(item.status)),
            d: common_vendor.t(item.appointmentTime ?? "暂无"),
            e: common_vendor.t(item.arrivalTime ?? "暂无"),
            f: common_vendor.t(item.estimateWeight + " kg"),
            g: common_vendor.t(item.weight ? item.weight + " kg" : "暂无"),
            h: common_vendor.t(item.estimateBucketNum ? item.estimateBucketNum + " 个" : "暂无"),
            i: common_vendor.t(item.bucketNum ? item.bucketNum + " 个" : "暂无"),
            j: common_vendor.o(($event) => handleViewDetails(item), index),
            k: "5f21cbbb-3-" + i0,
            l: index
          };
        }),
        k: common_vendor.p({
          size: "mini"
        }),
        l: common_vendor.p({
          status: loadingStatus.value,
          ["content-text"]: {
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了"
          }
        })
      } : loadingStatus.value !== "loading" ? {} : {}, {
        m: loadingStatus.value !== "loading"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f21cbbb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shStatistics.js.map
