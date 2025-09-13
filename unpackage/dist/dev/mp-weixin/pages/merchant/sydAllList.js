"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
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
  __name: "sydAllList",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const selectedStatus = common_vendor.ref("");
    const selectedTimeRange = common_vendor.ref([]);
    const statusOptions = common_vendor.ref([
      { value: 0, text: "待确认" },
      { value: 1, text: "已完成" },
      { value: 2, text: "无需收运" }
    ]);
    const getStatusText = (status) => {
      common_vendor.index.__f__("log", "at pages/merchant/sydAllList.vue:134", 123);
      switch (status) {
        case 0:
        case "0":
          return "待确认";
        case 1:
        case "1":
          return "已完成";
        case 2:
        case "2":
          return "无需收运";
        default:
          return "未知状态";
      }
    };
    const getStatusClass = (status) => {
      switch (status) {
        case 0:
        case "0":
          return "booking";
        case 1:
        case "1":
          return "completed";
        case 2:
        case "2":
          return "processing";
        default:
          return "completed";
      }
    };
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
          merchantId: ((_a = userStore.merchant) == null ? void 0 : _a.id) ?? 448
        };
        if (selectedStatus.value !== "") {
          params.status = selectedStatus.value;
        }
        if (selectedTimeRange.value && selectedTimeRange.value.length === 2) {
          params.startTime = selectedTimeRange.value[0];
          params.endTime = selectedTimeRange.value[1];
        }
        const res = await api_apis.apiGetPlanAllPage(params);
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
        common_vendor.index.__f__("error", "at pages/merchant/sydAllList.vue:223", "获取数据失败:", error);
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
          title: "收运记录"
        }),
        c: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        d: common_vendor.o(showStatusPicker),
        e: common_vendor.sr(datetimePicker, "b6e750bc-2", {
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
        j: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        k: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(getStatusText(item.status)),
            c: common_vendor.n(getStatusClass(item.status)),
            d: common_vendor.t(item.deliveryCount ?? 0),
            e: common_vendor.t(item.estimateWeight ?? 0),
            f: common_vendor.t(item.weight ?? 0),
            g: common_vendor.t(item.registrationNumber ?? "暂无"),
            h: common_vendor.t(item.appointmentTime ?? "暂无"),
            i: common_vendor.t(item.arrivalTime ?? "暂无"),
            j: item.status != 0
          }, item.status != 0 ? {
            k: "b6e750bc-4-" + i0,
            l: common_vendor.p({
              size: "mini",
              type: "default"
            })
          } : {}, {
            m: index
          });
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6e750bc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydAllList.js.map
