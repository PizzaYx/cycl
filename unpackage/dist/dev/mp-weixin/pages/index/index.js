"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_bg_image2 = common_vendor.resolveComponent("bg-image");
  (_easycom_uni_icons2 + _easycom_bg_image2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_bg_image = () => "../../components/bg-image/bg-image.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_bg_image)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const activeTab = common_vendor.ref(0);
    const agreed = common_vendor.ref(false);
    const toggleAgreement = () => {
      agreed.value = !agreed.value;
    };
    const openAgreement = (type) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:71", "打开协议:", type);
    };
    const formData = common_vendor.reactive({
      account: "",
      password: ""
    });
    const handleLogin = () => {
      if (!formData.account) {
        common_vendor.index.showToast({
          title: "请输入手机号码",
          icon: "none"
        });
        return;
      }
      if (formData.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return;
      }
      if (!agreed.value) {
        common_vendor.index.showToast({
          title: "请先同意用户协议和隐私服务",
          icon: "none"
        });
        return;
      }
      loginRequest();
    };
    const loginRequest = async () => {
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      try {
        const res = await api_apis.apiPostLogin({
          username: formData.account,
          password: formData.password
        });
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          await fetchUserInfo();
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: activeTab.value ? "/pages/collection/collection" : "/pages/merchant/merchant"
            });
          }, 1e3);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "登录失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/index/index.vue:166", "登录请求失败:", err);
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const fetchUserInfo = async () => {
      try {
        const userInfoRes = await api_apis.apiGetInfo();
        if (userInfoRes.code === 200) {
          common_vendor.index.setStorageSync("userInfo", userInfoRes.data);
        } else {
          common_vendor.index.__f__("error", "at pages/index/index.vue:180", "获取用户信息失败:", userInfoRes.msg);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:183", "获取用户信息异常:", error);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: activeTab.value === 0
      }, activeTab.value === 0 ? {} : {}, {
        c: activeTab.value === 0 ? 1 : "",
        d: common_vendor.o(($event) => activeTab.value = 0),
        e: activeTab.value === 1
      }, activeTab.value === 1 ? {} : {}, {
        f: activeTab.value === 1 ? 1 : "",
        g: common_vendor.o(($event) => activeTab.value = 1),
        h: formData.account,
        i: common_vendor.o(($event) => formData.account = $event.detail.value),
        j: formData.password,
        k: common_vendor.o(($event) => formData.password = $event.detail.value),
        l: common_vendor.o(handleLogin),
        m: common_vendor.o(toggleAgreement),
        n: common_vendor.p({
          type: agreed.value ? "circle-filled" : "circle",
          size: "24",
          color: agreed.value ? "rgba(7, 193, 96, 1)" : "rgba(19, 19, 19, 0.5)"
        }),
        o: common_vendor.o(($event) => openAgreement("user")),
        p: common_vendor.o(($event) => openAgreement("privacy")),
        q: common_vendor.p({
          height: "442rpx",
          src: "/static/headTopBg.png"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
