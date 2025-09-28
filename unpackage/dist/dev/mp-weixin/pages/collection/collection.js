"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + DriverStatusTag + InfoDisplay + DriverOrderActions + AbnormalReportModal)();
}
const InfoDisplay = () => "../../components/InfoDisplay/InfoDisplay.js";
const DriverStatusTag = () => "../../components/DriverStatusTag/DriverStatusTag.js";
const DriverOrderActions = () => "../../components/DriverOrderActions/DriverOrderActions.js";
const AbnormalReportModal = () => "../../components/AbnormalReportModal/AbnormalReportModal.js";
const _sfc_main = {
  __name: "collection",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const yyNum = common_vendor.ref(0);
    const syNum = common_vendor.ref(0);
    const dqNum = common_vendor.ref(0);
    const progressPercentage = common_vendor.computed(() => {
      const total = dqNum.value + syNum.value;
      if (total === 0)
        return 0;
      return Math.round(dqNum.value / total * 100);
    });
    const allOrderList = common_vendor.ref([]);
    const refreshing = common_vendor.ref(false);
    const showAbnormalModal = common_vendor.ref(false);
    const currentOrderData = common_vendor.ref(null);
    common_vendor.watch(progressPercentage, () => {
      common_vendor.nextTick$1(() => {
        drawProgressArc();
      });
    }, { immediate: false });
    common_vendor.onShow(async () => {
      await userStore.fetchUserInfo();
      await getMerchantStatistics();
      await getMerchantSydList();
      drawProgressArc();
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
        }
      ];
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
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:233", "收运端首页收运明细失败", res.msg);
      }
    };
    const getUserInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/user"
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
            common_vendor.index.__f__("error", "at pages/collection/collection.vue:270", "页面跳转失败:", err);
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
        await getMerchantStatistics();
        await getMerchantSydList();
        drawProgressArc();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:295", "刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      } finally {
        refreshing.value = false;
      }
    };
    const handleRefresh = async () => {
      try {
        await getMerchantStatistics();
        await getMerchantSydList();
        drawProgressArc();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:315", "刷新数据失败:", error);
      }
    };
    const handleAbnormalReport = (orderData) => {
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
    const goToSydAllList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/collection/sfsyRecord"
      });
    };
    const drawProgressArc = () => {
      const query = common_vendor.index.createSelectorQuery();
      query.select("#progressArc").fields({ node: true, size: true }).exec((res) => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
          const width = res[0].width;
          const height = res[0].height;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
          const centerX = width / 2;
          const centerY = height * 0.73;
          const radius = Math.min(width, height) / 2;
          ctx.clearRect(0, 0, width, height);
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
          ctx.strokeStyle = "rgba(7, 193, 96, 0.10)";
          ctx.lineWidth = 10;
          ctx.lineCap = "round";
          ctx.stroke();
          const progressAngle = Math.PI * (progressPercentage.value / 100);
          if (progressPercentage.value > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + progressAngle, false);
            ctx.strokeStyle = "rgba(7, 193, 96, 1)";
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
            ctx.stroke();
            const endAngle = Math.PI + progressAngle;
            const endX = centerX + radius * Math.cos(endAngle);
            const endY = centerY + radius * Math.sin(endAngle);
            ctx.beginPath();
            ctx.arc(endX, endY, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgba(7, 193, 96, 1)";
            ctx.fill();
          }
        } else {
          setTimeout(() => {
            drawProgressArc();
          }, 100);
        }
      });
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(common_vendor.unref(userStore).userSFAvatar),
        c: common_vendor.t(common_vendor.unref(userStore).nickName || "未登录"),
        d: common_vendor.t(((_a = common_vendor.unref(userStore).sfmerchant) == null ? void 0 : _a.registrationNumber) || "未设置车牌"),
        e: common_vendor.p({
          type: "right",
          size: "35rpx"
        }),
        f: common_vendor.o(getUserInfo),
        g: common_vendor.t(syNum.value),
        h: common_vendor.t(yyNum.value),
        i: common_vendor.t(dqNum.value),
        j: common_vendor.f(quickActions.value, (action, index, i0) => {
          return {
            a: action.icon,
            b: common_vendor.t(action.name),
            c: action.id,
            d: common_vendor.o(($event) => handleQuickAction(action), action.id)
          };
        }),
        k: common_vendor.p({
          type: "right",
          size: "16",
          color: "rgba(19, 19, 19, 0.50)"
        }),
        l: common_vendor.o(goToSydAllList),
        m: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        n: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: "cd17183b-2-" + i0,
            c: common_vendor.p({
              status: item.status
            }),
            d: "cd17183b-3-" + i0,
            e: common_vendor.p({
              fields: getInfoFields(item)
            }),
            f: common_vendor.o(handleRefresh, index),
            g: common_vendor.o(handleAbnormalReport, index),
            h: "cd17183b-4-" + i0,
            i: common_vendor.p({
              status: item.status,
              ["order-data"]: item
            }),
            j: index
          };
        })
      } : {}, {
        o: refreshing.value,
        p: common_vendor.o(onRefresh),
        q: common_vendor.o(closeAbnormalModal),
        r: common_vendor.o(handleAbnormalSuccess),
        s: common_vendor.p({
          show: showAbnormalModal.value,
          ["order-data"]: currentOrderData.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cd17183b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/collection.js.map
