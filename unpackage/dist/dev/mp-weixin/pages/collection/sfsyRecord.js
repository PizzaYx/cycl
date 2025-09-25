"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_badge2 + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_badge + DriverStatusTag + InfoDisplay + DriverOrderActions + _easycom_uni_load_more + AbnormalReportModal)();
}
const DriverStatusTag = () => "../../components/DriverStatusTag/DriverStatusTag.js";
const InfoDisplay = () => "../../components/InfoDisplay/InfoDisplay.js";
const DriverOrderActions = () => "../../components/DriverOrderActions/DriverOrderActions.js";
const AbnormalReportModal = () => "../../components/AbnormalReportModal/AbnormalReportModal.js";
const _sfc_main = {
  __name: "sfsyRecord",
  setup(__props) {
    const tabs = [{ key: "3", value: "历史记录" }, { key: "0", value: "待处理" }, { key: "1", value: "已完成" }];
    const currentTab = common_vendor.ref(0);
    const currentStatusKey = common_vendor.computed(() => parseInt(tabs[currentTab.value].key));
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
    const userStore = stores_user.useUserStore();
    const back = () => {
      common_vendor.index.navigateBack();
    };
    function handleTabClick(index) {
      currentTab.value = index;
      allOrderList.value = [];
      pageNum.value = 1;
      getNetwork();
    }
    common_vendor.onShow(async () => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:203", "页面显示时刷新数据");
      getDriverNotConfirmNum();
      getNetwork();
    });
    const handleRefresh = async () => {
      try {
        allOrderList.value = [];
        pageNum.value = 1;
        await getNetwork();
        await getDriverNotConfirmNum();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfsyRecord.vue:217", "刷新数据失败:", error);
      }
    };
    const showAbnormalModal = common_vendor.ref(false);
    const currentOrderData = common_vendor.ref(null);
    const handleAbnormalReport = (orderData) => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:227", "异常上报事件", orderData);
      currentOrderData.value = orderData;
      showAbnormalModal.value = true;
    };
    const closeAbnormalModal = () => {
      showAbnormalModal.value = false;
      currentOrderData.value = null;
    };
    const handleAbnormalSuccess = async () => {
      await handleRefresh();
    };
    const bookingBadgeText = common_vendor.ref(0);
    const getDriverNotConfirmNum = async () => {
      var _a;
      const res = await api_apis.apiGetDriverNotConfirmNum({
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        bookingBadgeText.value = res.data ?? 0;
      }
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
          driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id,
          status: currentStatusKey.value
          // 使用当前选中tab对应的整数类型
        };
        if (searchKeyword.value) {
          params.title = searchKeyword.value;
        }
        const res = await api_apis.apiGetDriverPlanPage(params);
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
        common_vendor.index.__f__("error", "at pages/collection/sfsyRecord.vue:309", "获取数据失败:", error);
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
    const onSearch = () => {
      resetPageAndReload();
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      resetPageAndReload();
    };
    const resetPageAndReload = () => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:345", "重置页码和重新加载数据");
      allOrderList.value = [];
      pageNum.value = 1;
      getNetwork();
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
      getDriverNotConfirmNum();
    });
    common_vendor.onMounted(() => {
      pageNum.value = 1;
      getNetwork();
      getDriverNotConfirmNum();
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
          title: "收运记录"
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
        j: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.value),
            b: tab.value === "待处理" && bookingBadgeText.value !== 0
          }, tab.value === "待处理" && bookingBadgeText.value !== 0 ? {
            c: "3d541e56-3-" + i0,
            d: common_vendor.p({
              type: "error",
              text: bookingBadgeText.value,
              ["is-dot"]: false,
              absolute: "rightTop",
              offset: [-5, -12]
            })
          } : {}, {
            e: currentTab.value === index
          }, currentTab.value === index ? {} : {}, {
            f: index,
            g: currentTab.value === index ? 1 : "",
            h: common_vendor.o(($event) => handleTabClick(index), index)
          });
        }),
        k: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        l: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: "3d541e56-4-" + i0,
            c: common_vendor.p({
              status: item.status
            }),
            d: "3d541e56-5-" + i0,
            e: common_vendor.p({
              fields: getInfoFields(item)
            }),
            f: common_vendor.o(handleRefresh, index),
            g: common_vendor.o(handleAbnormalReport, index),
            h: "3d541e56-6-" + i0,
            i: common_vendor.p({
              status: item.status,
              ["order-data"]: item
            }),
            j: index
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
        n: loadingStatus.value !== "loading",
        o: common_vendor.o(closeAbnormalModal),
        p: common_vendor.o(handleAbnormalSuccess),
        q: common_vendor.p({
          show: showAbnormalModal.value,
          ["order-data"]: currentOrderData.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d541e56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfsyRecord.js.map
