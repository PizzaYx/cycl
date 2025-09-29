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
  (PageHeader + InfoDisplay + _easycom_uni_load_more)();
}
const InfoDisplay = () => "../../components/InfoDisplay/InfoDisplay.js";
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "shChecklist",
  setup(__props) {
    const tabs = [{ key: "3", value: "预约中" }, { key: "0", value: "进行中" }, { key: "1", value: "已完成" }];
    const currentTab = common_vendor.ref(0);
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
    const getStatusText = (item) => {
      if (currentTab.value == 0) {
        switch (item.status) {
          case 0:
            return "待审核";
          case 1:
            return "审核通过";
          case 2:
            return "未通过";
          default:
            return "";
        }
      } else {
        switch (item.status) {
          case 0:
            return "进行中";
          case 1:
            return "已完成";
          case 2:
            return "无法收运";
          default:
            return "";
        }
      }
    };
    const getStatusClass = (item) => {
      if (currentTab.value == 0) {
        switch (item.status) {
          case 0:
            return "booking";
          case 1:
            return "passed";
          case 2:
            return "notpassed";
        }
      } else {
        switch (item.status) {
          case 0:
            return "processing";
          case 1:
            return "completed";
          case 2:
            return "cancelled";
          default:
            return "";
        }
      }
    };
    const handleCancel = (item) => {
      common_vendor.index.__f__("log", "at pages/merchant/shChecklist.vue:175", "取消按钮被点击111", item);
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消此预约吗？",
        success: async (res) => {
          var _a;
          common_vendor.index.__f__("log", "at pages/merchant/shChecklist.vue:180", "用户点击了确定按钮", res);
          if (res.confirm) {
            const resdata = await api_apis.apiGetcancelPlanById({
              merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
              id: item.id
            });
            if (resdata.code === 200) {
              common_vendor.index.showToast({
                title: "取消成功",
                icon: "success",
                duration: 2e3
              });
              getNetwork();
              getMerchantNotConfirmNum();
            } else {
              common_vendor.index.showToast({
                title: "取消失败",
                icon: "error",
                duration: 2e3
              });
            }
          } else if (res.cancel) {
            common_vendor.index.__f__("log", "at pages/merchant/shChecklist.vue:209", "取消取消预约");
          }
        }
      });
    };
    const handleViewDetails = (item) => {
      common_vendor.index.__f__("log", "at pages/merchant/shChecklist.vue:216", "查看详情按钮被点击", item);
      if (currentTab.value == 0) {
        common_vendor.index.navigateTo({
          url: `/pages/merchant/shyyDetail?id=${item.id}&merchantId =${item.merchantId}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId =${item.merchantId}`
        });
      }
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
    const handleConfirmTransport = async (item) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/merchant/shChecklist.vue:314", "确认收运按钮被点击", item);
      if (item.arrivalTime == null) {
        common_vendor.index.showToast({
          title: "请等待师傅确认收运完成!",
          icon: "none",
          dduration: 2500
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "确认中..."
        });
        const params = {
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
          id: item.id
        };
        const res = await api_apis.apiGetconfirmPlanById(params);
        if (res.code === 200 || res.success) {
          common_vendor.index.showToast({
            title: "确认收运成功",
            icon: "success"
          });
          allOrderList.value = [];
          pageNum.value = 1;
          getMerchantNotConfirmNum();
          getNetwork();
        } else {
          common_vendor.index.showToast({
            title: res.msg || "确认收运失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shChecklist.vue:354", "确认收运失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      }
    };
    const processingBadgeText = common_vendor.ref(0);
    const getMerchantNotConfirmNum = async () => {
      var _a;
      const res = await api_apis.apiGetMerchantNotConfirmNum({
        merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        processingBadgeText.value = res.data ?? 0;
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
        const res = await api_apis.apiGetPlanPage({
          pageNum: pageNum.value,
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
          status: tabs[currentTab.value].key
          // 使用tabs中的key值
        });
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
        common_vendor.index.__f__("error", "at pages/merchant/shChecklist.vue:417", "获取数据失败:", error);
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
      getMerchantNotConfirmNum();
    });
    common_vendor.onMounted(() => {
      pageNum.value = 1;
      getNetwork();
      getMerchantNotConfirmNum();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "收运清单"
        }),
        c: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.value),
            b: currentTab.value === index
          }, currentTab.value === index ? {} : {}, {
            c: index,
            d: currentTab.value === index ? 1 : "",
            e: common_vendor.o(($event) => handleTabClick(index), index)
          });
        }),
        d: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        e: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(getStatusText(item)),
            c: common_vendor.n(getStatusClass(item)),
            d: "0412d1ef-1-" + i0,
            e: common_vendor.p({
              fields: getInfoFields(item)
            })
          }, currentTab.value == 0 ? common_vendor.e({
            f: item.status == 0
          }, item.status == 0 ? {
            g: common_vendor.o(($event) => handleCancel(item), index),
            h: "0412d1ef-2-" + i0,
            i: common_vendor.p({
              size: "mini",
              type: "default"
            })
          } : {}, {
            j: common_vendor.o(($event) => handleViewDetails(item), index),
            k: "0412d1ef-3-" + i0,
            l: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          }) : currentTab.value == 1 ? common_vendor.e({
            m: getStatusText(item) === "待确认"
          }, getStatusText(item) === "待确认" ? {
            n: common_vendor.o(($event) => handleConfirmTransport(item), index),
            o: "0412d1ef-4-" + i0,
            p: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : {}, {
            q: common_vendor.o(($event) => handleViewDetails(item), index),
            r: "0412d1ef-5-" + i0,
            s: common_vendor.p({
              size: "mini",
              type: "default"
            })
          }) : currentTab.value == 2 ? {
            t: common_vendor.o(($event) => handleViewDetails(item), index),
            v: "0412d1ef-6-" + i0,
            w: common_vendor.p({
              size: "mini",
              type: "default"
            })
          } : {}, {
            x: index
          });
        }),
        f: currentTab.value == 0,
        g: currentTab.value == 1,
        h: currentTab.value == 2,
        i: common_vendor.p({
          status: loadingStatus.value,
          ["content-text"]: {
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了"
          }
        })
      } : loadingStatus.value !== "loading" ? {} : {}, {
        j: loadingStatus.value !== "loading"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0412d1ef"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shChecklist.js.map
