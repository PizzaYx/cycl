"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_badge2 + _component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_badge + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "sfsyRecord",
  setup(__props) {
    const tabs = [{ key: "3", value: "历史记录" }, { key: "0", value: "待处理" }, { key: "1", value: "已完成" }];
    const currentTab = common_vendor.ref(0);
    const currentStatusKey = common_vendor.computed(() => parseInt(tabs[currentTab.value].key));
    const searchKeyword = common_vendor.ref("");
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
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:160", "页面显示时刷新数据");
      getDriverNotConfirmNum();
      getNetwork();
    });
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
    const handleCancel = (item) => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:194", "取消任务:", item);
      common_vendor.index.showModal({
        title: "确认取消",
        content: "是否确认取消当前任务？",
        success: async (res) => {
          var _a;
          if (res.confirm) {
            await api_apis.apiGetnoNeedCollect({
              id: item.id,
              driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
            }).then((res2) => {
              if (res2.code === 200) {
                common_vendor.index.showToast({
                  title: res2.msg || "操作成功",
                  icon: "success"
                });
                clearSearch();
              } else {
                common_vendor.index.showToast({
                  title: res2.msg || "操作失败",
                  icon: "error"
                });
              }
            });
          }
        }
      });
    };
    const handleViewDetails = (item) => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:226", "查看详情按钮被点击", item);
      common_vendor.index.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${item.id}&driverId=${item.driverId}`
      });
    };
    const handleConfirmTransport = async (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:235", "收运:", task.id);
      if (task.weight > 0 && task.bucketNum > 0) {
        common_vendor.index.showModal({
          title: "确认收运完成",
          content: "是否确认收运完成？",
          success: async (res) => {
            var _a;
            if (res.confirm) {
              await api_apis.apiGetdriverConfirmPlan({
                id: task.id,
                driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
              }).then((res2) => {
                if (res2.code === 200) {
                  common_vendor.index.showToast({
                    title: res2.msg || "操作成功",
                    icon: "success"
                  });
                  clearSearch();
                } else {
                  common_vendor.index.showToast({
                    title: res2.msg || "操作失败",
                    icon: "error"
                  });
                }
              });
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请先进行 收运上报 操作",
          icon: "none"
        });
        return;
      }
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
        common_vendor.index.__f__("error", "at pages/collection/sfsyRecord.vue:337", "获取数据失败:", error);
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
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:373", "重置页码和重新加载数据");
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
          return common_vendor.e({
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(getStatusText(item.status)),
            c: common_vendor.n(getStatusClass(item.status)),
            d: common_vendor.t(item.appointmentTime ?? "暂无"),
            e: common_vendor.t(item.arrivalTime ?? "暂无"),
            f: common_vendor.t(item.estimateWeight ? item.estimateWeight + "kg" : "暂无"),
            g: common_vendor.t(item.weight ? item.weight + "kg" : "暂无"),
            h: common_vendor.t(item.estimateBucketNum ? item.estimateBucketNum + "个" : "暂无"),
            i: common_vendor.t(item.bucketNum ? item.bucketNum + "个" : "暂无"),
            j: common_vendor.t(item.address ?? "暂无"),
            k: item.status == 0 || item.status == "0"
          }, item.status == 0 || item.status == "0" ? {
            l: common_vendor.o(($event) => handleCancel(item), index),
            m: "3d541e56-4-" + i0,
            n: common_vendor.p({
              size: "mini",
              type: "default"
            }),
            o: common_vendor.o(($event) => handleConfirmTransport(item), index),
            p: "3d541e56-5-" + i0,
            q: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : {
            r: common_vendor.o(($event) => handleViewDetails(item), index),
            s: "3d541e56-6-" + i0,
            t: common_vendor.p({
              size: "mini",
              type: "default"
            })
          }, {
            v: index
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d541e56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfsyRecord.js.map
