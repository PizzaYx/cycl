"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (PageHeader + _easycom_uni_icons + DriverStatusTag + InfoDisplay + DriverOrderActions + _easycom_uni_load_more)();
}
const DriverStatusTag = () => "../../components/DriverStatusTag/DriverStatusTag.js";
const DriverOrderActions = () => "../../components/DriverOrderActions/DriverOrderActions.js";
const InfoDisplay = () => "../../components/InfoDisplay/InfoDisplay.js";
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "syStatistics",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const merchantCount = common_vendor.ref(0);
    const totalWeight = common_vendor.ref(0);
    const syount = common_vendor.ref(0);
    const nosyount = common_vendor.ref(0);
    const statisticsConfig = [
      {
        image: "/static/ssd/sytj2.png",
        number: () => merchantCount.value + " 个",
        title: "商家数量"
      },
      {
        image: "/static/shd/tjright.png",
        number: () => totalWeight.value + " kg",
        title: "总重量"
      },
      {
        image: "/static/ssd/sytj1.png",
        number: () => syount.value + " 个",
        title: "已收运"
      },
      {
        image: "/static/shd/tjleft.png",
        number: () => nosyount.value + " 个",
        title: "未收运"
      }
    ];
    const searchKeyword = common_vendor.ref("");
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
          key: "address",
          label: "地址",
          value: item.address
        }
      ];
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const pageNum = common_vendor.ref(1);
    const loadingStatus = common_vendor.ref("more");
    const allOrderList = common_vendor.ref([]);
    const getToStatistics = async () => {
      var _a;
      const res = await api_apis.apiGetDriverPlanStatistics({
        title: searchKeyword.value ?? "",
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        merchantCount.value = res.data.merchantNum ?? 0;
        totalWeight.value = res.data.weightNum ?? 0;
        syount.value = res.data.confirmNum ?? 0;
        nosyount.value = res.data.notConfirmNum ?? 0;
      }
    };
    const getNetwork = async () => {
      var _a;
      try {
        if (pageNum.value > 1) {
          loadingStatus.value = "loading";
        }
        const params = {
          pageNum: pageNum.value,
          driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
        };
        if (searchKeyword.value) {
          params.title = searchKeyword.value;
        }
        const res = await api_apis.apiGetDriverPlanStatisticsPage(params);
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
        common_vendor.index.__f__("error", "at pages/collection/syStatistics.vue:276", "获取数据失败:", error);
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
    });
    const onSearch = () => {
      getToStatistics();
      resetPageAndReload();
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      resetPageAndReload();
    };
    const resetPageAndReload = () => {
      common_vendor.index.__f__("log", "at pages/collection/syStatistics.vue:334", "重置页码和重新加载数据");
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
          title: "收运端统计"
        }),
        c: common_vendor.p({
          type: "search",
          size: "24",
          color: "#999"
        }),
        d: common_vendor.o(onSearch),
        e: searchKeyword.value,
        f: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        g: searchKeyword.value
      }, searchKeyword.value ? {
        h: common_vendor.o(clearSearch),
        i: common_vendor.p({
          type: "clear",
          size: "20",
          color: "#999"
        })
      } : {}, {
        j: common_vendor.f(statisticsConfig, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.number()),
            c: common_vendor.t(item.title),
            d: index
          };
        }),
        k: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        l: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: "4e0aa4c3-3-" + i0,
            c: common_vendor.p({
              status: item.status
            }),
            d: "4e0aa4c3-4-" + i0,
            e: common_vendor.p({
              fields: getInfoFields(item)
            }),
            f: "4e0aa4c3-5-" + i0,
            g: common_vendor.p({
              status: item.status,
              ["order-data"]: item,
              ["view-only"]: true
            }),
            h: index
          };
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4e0aa4c3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syStatistics.js.map
