"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_badge2 + _component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_badge + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "sydChecklist",
  setup(__props) {
    const tabs = ["预约中", "进行中", "已完成"];
    const currentTab = common_vendor.ref(0);
    const bookingBadgeText = common_vendor.ref("11");
    const processingBadgeText = common_vendor.ref("123");
    const allOrderList = common_vendor.ref([
      // 预约中数据
      {
        id: 1,
        shopName: "川味小厨(总店)",
        status: "预约中",
        deliveryCount: "5",
        weight: "451kg",
        carInfo: "川A3D47M",
        time: "2025-08-20 14:30-15:30"
      },
      {
        id: 2,
        shopName: "老北京烤鸭店",
        status: "预约中",
        deliveryCount: "3",
        weight: "210kg",
        carInfo: "川B5H29N",
        time: "2025-08-21 10:00-11:00"
      },
      {
        id: 3,
        shopName: "兰州拉面",
        status: "预约中",
        deliveryCount: "4",
        weight: "320kg",
        carInfo: "川C1D2E3",
        time: "2025-08-21 14:00-15:00"
      },
      {
        id: 4,
        shopName: "黄焖鸡米饭",
        status: "预约中",
        deliveryCount: "2",
        weight: "180kg",
        carInfo: "川D4F5G6",
        time: "2025-08-21 16:00-17:00"
      },
      // 进行中数据
      {
        id: 5,
        shopName: "湘菜馆",
        status: "进行中",
        deliveryCount: "7",
        weight: "625kg",
        carInfo: "川C8K45P",
        time: "2025-08-20 09:15-10:15"
      },
      {
        id: 6,
        shopName: "粤式茶餐厅",
        status: "进行中",
        deliveryCount: "4",
        weight: "312kg",
        carInfo: "川D1M67Q",
        time: "2025-08-20 13:45-14:45"
      },
      {
        id: 7,
        shopName: "日式料理",
        status: "进行中",
        deliveryCount: "6",
        weight: "480kg",
        carInfo: "川E2N3O4",
        time: "2025-08-21 11:30-12:30"
      },
      // 已完成数据
      {
        id: 8,
        shopName: "东北饺子王",
        status: "已完成",
        deliveryCount: "6",
        weight: "523kg",
        carInfo: "川E3R89S",
        time: "2025-08-19 16:30-17:30"
      },
      {
        id: 9,
        shopName: "重庆小面",
        status: "已完成",
        deliveryCount: "2",
        weight: "156kg",
        carInfo: "川F6T23U",
        time: "2025-08-19 11:20-12:20"
      },
      {
        id: 10,
        shopName: "新疆羊肉串",
        status: "已完成",
        deliveryCount: "8",
        weight: "742kg",
        carInfo: "川G9Y56V",
        time: "2025-08-18 15:40-16:40"
      },
      {
        id: 11,
        shopName: "韩式烤肉",
        status: "已完成",
        deliveryCount: "5",
        weight: "420kg",
        carInfo: "川H7U8I9",
        time: "2025-08-18 12:00-13:00"
      },
      {
        id: 12,
        shopName: "意大利餐厅",
        status: "已完成",
        deliveryCount: "3",
        weight: "280kg",
        carInfo: "川J1K2L3",
        time: "2025-08-17 18:30-19:30"
      }
    ]);
    const orderList = common_vendor.computed(() => {
      if (currentTab.value === 0) {
        return allOrderList.value.filter((item) => item.status === "预约中");
      } else if (currentTab.value === 1) {
        return allOrderList.value.filter((item) => item.status === "进行中");
      } else {
        return allOrderList.value.filter((item) => item.status === "已完成");
      }
    });
    const handleTabClick = (index) => {
      currentTab.value = index;
    };
    const loadingStatus = common_vendor.ref("more");
    const onLoadMore = () => {
      if (loadingStatus.value === "nomore")
        return;
      loadingStatus.value = "loading";
      setTimeout(() => {
        loadingStatus.value = "more";
      }, 1500);
    };
    common_vendor.onReachBottom(() => {
      onLoadMore();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab),
            b: tab === "预约中"
          }, tab === "预约中" ? {
            c: "888270ea-0-" + i0,
            d: common_vendor.p({
              type: "error",
              text: bookingBadgeText.value,
              dot: false,
              absolute: "rightTop",
              offset: [-5, -12]
            })
          } : {}, {
            e: tab === "进行中"
          }, tab === "进行中" ? {
            f: "888270ea-1-" + i0,
            g: common_vendor.p({
              type: "error",
              text: processingBadgeText.value,
              dot: true,
              absolute: "rightTop",
              offset: [-5, -12]
            })
          } : {}, {
            h: currentTab.value === index
          }, currentTab.value === index ? {} : {}, {
            i: index,
            j: currentTab.value === index ? 1 : "",
            k: common_vendor.o(($event) => handleTabClick(index), index)
          });
        }),
        b: common_vendor.f(orderList.value, (item, index, i0) => {
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
            i: "888270ea-2-" + i0,
            j: common_vendor.p({
              size: "mini"
            })
          } : {}, {
            k: common_vendor.t(item.status === "预约中" ? "确认收运" : item.status === "进行中" ? "完成收运" : "查看详情"),
            l: "888270ea-3-" + i0,
            m: common_vendor.p({
              size: "mini",
              type: item.status === "预约中" ? "primary" : "default"
            }),
            n: index
          });
        }),
        c: common_vendor.p({
          status: loadingStatus.value,
          ["content-text"]: {
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了"
          }
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-888270ea"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydChecklist.js.map
