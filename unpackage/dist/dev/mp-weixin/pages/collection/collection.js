"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  (_easycom_uni_icons2 + _component_uni_button)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "collection",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const yyNum = common_vendor.ref(0);
    const syNum = common_vendor.ref(0);
    const dqNum = common_vendor.ref(0);
    const allOrderList = common_vendor.ref([]);
    const refreshing = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      try {
        const userInfo = await userStore.ensureUserInfo();
        if (userInfo === null) {
          common_vendor.index.__f__("log", "at pages/collection/collection.vue:149", "用户未登录，已跳转到登录页");
          return;
        }
        getMerchantStatistics();
        getMerchantSydList();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:157", "页面初始化失败:", error);
      }
    });
    common_vendor.onShow(async () => {
      common_vendor.index.__f__("log", "at pages/collection/collection.vue:162", "页面显示时刷新数据");
      getMerchantStatistics();
      getMerchantSydList();
    });
    const getMerchantStatistics = async () => {
      var _a;
      const res = await api_apis.apiGetDriverTodayStatistics({
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        dqNum.value = res.data.confirmNum;
        yyNum.value = res.data.weightNum;
        syNum.value = res.data.notConfirmNum;
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
    const getMerchantSydList = async () => {
      var _a;
      const res = await api_apis.apiGetDriverPlanPage({
        pageNum: 1,
        pageSize: 5,
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        allOrderList.value = res.data.list;
      } else {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:218", "收运端首页收运明细失败", res.msg);
      }
    };
    const getUserInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/user"
      });
    };
    const handleCancel = (item) => {
      common_vendor.index.__f__("log", "at pages/collection/collection.vue:234", "取消任务:", item);
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
      common_vendor.index.__f__("log", "at pages/collection/collection.vue:266", "查看详情按钮被点击", item);
      common_vendor.index.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${item.id}&driverId=${item.driverId}`
      });
    };
    const handleConfirmTransport = async (task) => {
      common_vendor.index.__f__("log", "at pages/collection/collection.vue:275", "收运上报:", task);
      common_vendor.index.navigateTo({
        url: `/pages/collection/syReport?carId=${task.carId}&driverId=${task.driverId}&merchantId=${task.merchantId}&planId=${task.id}&merchantName=${task.merchantName}`
      });
    };
    const quickActions = common_vendor.ref([
      {
        id: "appointment",
        name: "今日收运",
        icon: "/static/ssd/syleft.png",
        url: "/pages/collection/sfDetails"
        // 今日详情
      },
      {
        id: "records",
        name: "工单统计",
        icon: "/static/ssd/sydright.png",
        url: "/pages/collection/syStatistics"
        // 统计页面
      }
    ]);
    const handleQuickAction = (action) => {
      if (action.url) {
        common_vendor.index.navigateTo({
          url: action.url,
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/collection/collection.vue:307", "页面跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面暂未开放",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "功能开发中",
          icon: "none"
        });
      }
    };
    const onRefresh = async () => {
      refreshing.value = true;
      try {
        await userStore.fetchUserInfo();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:330", "刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      } finally {
        refreshing.value = false;
      }
    };
    const goToSydAllList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/collection/sfsyRecord"
      });
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_assets._imports_4,
        b: common_vendor.t(common_vendor.unref(userStore).userSFAvatar),
        c: common_vendor.t(common_vendor.unref(userStore).nickName || "未登录"),
        d: common_vendor.t(((_a = common_vendor.unref(userStore).sfmerchant) == null ? void 0 : _a.registrationNumber) || "未设置车牌"),
        e: common_vendor.p({
          type: "right",
          size: "30rpx"
        }),
        f: common_vendor.o(getUserInfo),
        g: common_vendor.t(yyNum.value),
        h: common_vendor.t(syNum.value),
        i: common_vendor.t(dqNum.value),
        j: common_vendor.f(quickActions.value, (action, index, i0) => {
          return {
            a: action.icon,
            b: common_vendor.t(action.name),
            c: action.id,
            d: common_vendor.o(($event) => handleQuickAction(action), action.id)
          };
        }),
        k: common_vendor.o(goToSydAllList),
        l: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        m: common_vendor.f(allOrderList.value, (item, index, i0) => {
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
            m: "cd17183b-1-" + i0,
            n: common_vendor.p({
              size: "mini",
              type: "default"
            }),
            o: common_vendor.o(($event) => handleConfirmTransport(item), index),
            p: "cd17183b-2-" + i0,
            q: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : {
            r: common_vendor.o(($event) => handleViewDetails(item), index),
            s: "cd17183b-3-" + i0,
            t: common_vendor.p({
              size: "mini",
              type: "default"
            })
          }, {
            v: index
          });
        })
      } : {}, {
        n: refreshing.value,
        o: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cd17183b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/collection.js.map
