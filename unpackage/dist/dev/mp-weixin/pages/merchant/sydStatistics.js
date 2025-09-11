"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/request.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_datetime_picker2 + _component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_datetime_picker + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "sydStatistics",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const bucketCount = common_vendor.ref(13);
    const totalWeight = common_vendor.ref(414);
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
    const selectedStatus = common_vendor.ref("");
    const selectedTimeRange = common_vendor.ref([]);
    const statusOptions = common_vendor.ref([
      { value: "0", text: "待收运" },
      { value: "1", text: "已完成" },
      { value: "2", text: "无需收运" }
    ]);
    const back = () => {
      common_vendor.index.navigateBack({
        delta: 1
      });
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
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
          status: tabs[currentTab.value].key
          // 使用tabs中的key值
        };
        if (selectedStatus.value !== "") {
          params.filterStatus = selectedStatus.value;
        }
        if (selectedTimeRange.value && selectedTimeRange.value.length === 2) {
          params.startTime = selectedTimeRange.value[0];
          params.endTime = selectedTimeRange.value[1];
        }
        const res = await apiGetMerchantStatistics(params);
        if (pageNum.value === 1) {
          allOrderList.value = res.data.records || [];
          common_vendor.index.stopPullDownRefresh();
        } else {
          allOrderList.value = [...allOrderList.value, ...res.data.records || []];
        }
        if (res.data.records && res.data.records.length < 10) {
          loadingStatus.value = "nomore";
        } else {
          loadingStatus.value = "more";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/sydStatistics.vue:215", "获取数据失败:", error);
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
      currentTab.value = 0;
      pageNum.value = 1;
      getNetwork();
    });
    const datetimePicker = common_vendor.ref(null);
    const showStatusPicker = () => {
      common_vendor.index.showActionSheet({
        itemList: statusOptions.value.map((item) => item.text),
        success: (res) => {
          const selectedOption = statusOptions.value[res.tapIndex];
          onStatusChange(selectedOption.value);
        }
      });
    };
    const onStatusChange = (value) => {
      selectedStatus.value = value;
      resetPageAndReload();
    };
    const onTimeChange = (value) => {
      selectedTimeRange.value = value;
      resetPageAndReload();
    };
    const resetPageAndReload = () => {
      allOrderList.value = [];
      pageNum.value = 1;
      getNetwork();
    };
    const getCurrentDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hour = String(now.getHours()).padStart(2, "0");
      const minute = String(now.getMinutes()).padStart(2, "0");
      const second = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };
    common_vendor.onMounted(() => {
      pageNum.value = 1;
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
          title: "收运统计"
        }),
        c: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        d: common_vendor.o(showStatusPicker),
        e: common_vendor.sr(datetimePicker, "2e2a962a-2", {
          "k": "datetimePicker"
        }),
        f: common_vendor.o(onTimeChange),
        g: common_vendor.o(($event) => selectedTimeRange.value = $event),
        h: common_vendor.p({
          type: "datetimerange",
          rangeSeparator: "至",
          start: "2020-01-01 00:00:00",
          end: getCurrentDateTime(),
          border: false,
          modelValue: selectedTimeRange.value
        }),
        i: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
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
          return common_vendor.e({
            a: common_vendor.t(item.shopName),
            b: common_vendor.t(item.status),
            c: common_vendor.n(item.status === "预约中" ? "booking" : item.status === "进行中" ? "processing" : "completed"),
            d: common_vendor.t(item.deliveryCount),
            e: common_vendor.t(item.weight),
            f: common_vendor.t(item.carInfo),
            g: common_vendor.t(item.time),
            h: item.status !== "已完成"
          }, item.status !== "已完成" ? {
            i: "2e2a962a-4-" + i0,
            j: common_vendor.p({
              size: "mini"
            })
          } : {}, {
            k: common_vendor.t(item.status === "预约中" ? "确认收运" : item.status === "进行中" ? "完成收运" : "查看详情"),
            l: "2e2a962a-5-" + i0,
            m: common_vendor.p({
              size: "mini",
              type: item.status === "预约中" ? "primary" : "default"
            }),
            n: index
          });
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2e2a962a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydStatistics.js.map
