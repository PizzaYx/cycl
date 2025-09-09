"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_segmented_control = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_component_uni_segmented_control + _easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "request",
  setup(__props) {
    const pets = common_vendor.ref([]);
    const current = common_vendor.ref(0);
    const classify = [{ key: "all", value: "全部" }, { key: "dog", value: "狗" }, { key: "cat", value: "猫" }];
    const values = common_vendor.computed(() => classify.map((item) => item.value));
    function onClickItem(e) {
      current.value = e.currentIndex;
      pets.value = [];
      network();
    }
    function onRefresh() {
      common_vendor.index.startPullDownRefresh();
    }
    function onTop() {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
    }
    function onPreview(index) {
      let urls = pets.value.map((item) => item.url);
      common_vendor.index.previewImage({
        current: index,
        urls
      });
    }
    function network() {
      common_vendor.index.showNavigationBarLoading();
      common_vendor.index.request({
        url: "https://tea.qingnian8.com/tools/petShow",
        data: {
          size: 2,
          tpe: classify[current.value].key
        },
        method: "GET",
        header: {
          "access-Key": "yx963852741"
        }
      }).then((res) => {
        if (res.data.errCode === 0) {
          pets.value = [...pets.value, ...res.data.data];
          common_vendor.index.__f__("log", "at pages/test/request.vue:95", pets.value);
        } else if (res.data.errCode === 400) {
          common_vendor.index.showToast({
            title: res.data.errMsg,
            icon: "none",
            duration: 2e3
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("log", "at pages/test/request.vue:104", err);
      }).finally(() => {
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.hideNavigationBarLoading();
      });
    }
    common_vendor.onReachBottom(() => {
      network();
    });
    common_vendor.onPullDownRefresh(() => {
      pets.value = [];
      current.value = 0;
      network();
    });
    network();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onClickItem),
        b: common_vendor.p({
          current: current.value,
          values: values.value,
          styleType: "button",
          activeColor: "#2d7cdc"
        }),
        c: common_vendor.f(pets.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => onPreview(index), item._id),
            c: common_vendor.t(item.content),
            d: common_vendor.t(item.author),
            e: item._id
          };
        }),
        d: common_vendor.p({
          type: "refreshempty",
          size: "26",
          color: "#888"
        }),
        e: common_vendor.o(onRefresh),
        f: common_vendor.p({
          type: "arrow-up",
          size: "26",
          color: "#888"
        }),
        g: common_vendor.o(onTop),
        h: common_vendor.p({
          status: "loading"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eb721ad5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/test/request.js.map
