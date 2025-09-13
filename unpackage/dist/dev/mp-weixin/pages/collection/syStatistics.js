"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_load_more)();
}
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
        number: merchantCount,
        title: "商家数量"
      },
      {
        image: "/static/shd/tjright.png",
        number: totalWeight,
        title: "总重量"
      },
      {
        image: "/static/ssd/sytj1.png",
        number: syount,
        title: "已收运"
      },
      {
        image: "/static/shd/tjleft.png",
        number: nosyount,
        title: "未收运"
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
    const getStatusText = (status) => {
      switch (status) {
        case 0:
        case "0":
          return "进行中";
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
    const searchKeyword = common_vendor.ref("");
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
        driverId: ((_a = userStore.driverId) == null ? void 0 : _a.id) || 5
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
          driverId: ((_a = userStore.driverId) == null ? void 0 : _a.id) || 5
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
        common_vendor.index.__f__("error", "at pages/collection/syStatistics.vue:244", "获取数据失败:", error);
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
      common_vendor.index.__f__("log", "at pages/collection/syStatistics.vue:302", "重置页码和重新加载数据");
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
            b: common_vendor.t(item.number),
            c: common_vendor.t(item.title),
            d: index
          };
        }),
        k: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        l: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(getStatusText(item.status)),
            c: common_vendor.n(getStatusClass(item.status)),
            d: common_vendor.t(item.appointmentTime ?? "暂无"),
            e: common_vendor.t(item.arrivalTime ?? "暂无"),
            f: common_vendor.t(item.estimateWeight + "kg"),
            g: common_vendor.t(item.weight ? item.weight + "kg" : "暂无"),
            h: common_vendor.t(item.estimateBucketNum ? item.estimateBucketNum + "个" : "暂无"),
            i: common_vendor.t(item.bucketNum ? item.bucketNum + "个" : "暂无"),
            j: common_vendor.t(item.address ?? "暂无"),
            k: index
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
