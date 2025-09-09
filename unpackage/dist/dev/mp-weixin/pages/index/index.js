"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const activeTab = common_vendor.ref(0);
    const agreed = common_vendor.ref(false);
    const userStore = stores_user.useUserStore();
    const toggleAgreement = () => {
      agreed.value = !agreed.value;
    };
    const openAgreement = (type) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:81", "打开协议:", type);
    };
    const formData = common_vendor.reactive({
      account: "",
      password: ""
    });
    const handleRegister = () => {
      common_vendor.index.showToast({
        title: "注册功能待实现",
        icon: "none"
      });
    };
    const handleForgotPassword = () => {
      common_vendor.index.showToast({
        title: "忘记密码功能待实现",
        icon: "none"
      });
    };
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
          await fetchUserInfo();
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
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
        common_vendor.index.__f__("error", "at pages/index/index.vue:197", "登录请求失败:", err);
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const fetchUserInfo = async () => {
      try {
        await userStore.fetchUserInfo();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:208", "获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败，请稍后重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: activeTab.value === 0
      }, activeTab.value === 0 ? {} : {}, {
        d: activeTab.value === 0 ? 1 : "",
        e: common_vendor.o(($event) => activeTab.value = 0),
        f: activeTab.value === 1
      }, activeTab.value === 1 ? {} : {}, {
        g: activeTab.value === 1 ? 1 : "",
        h: common_vendor.o(($event) => activeTab.value = 1),
        i: formData.account,
        j: common_vendor.o(($event) => formData.account = $event.detail.value),
        k: formData.password,
        l: common_vendor.o(($event) => formData.password = $event.detail.value),
        m: activeTab.value === 0
      }, activeTab.value === 0 ? {
        n: common_vendor.o(handleForgotPassword)
      } : {}, {
        o: common_vendor.o(handleLogin),
        p: activeTab.value === 0
      }, activeTab.value === 0 ? {
        q: common_vendor.o(handleRegister)
      } : {}, {
        r: common_vendor.o(toggleAgreement),
        s: common_vendor.p({
          type: agreed.value ? "circle-filled" : "circle",
          size: "22",
          color: agreed.value ? "rgba(7, 193, 96, 1)" : "rgba(19, 19, 19, 0.5)"
        }),
        t: common_vendor.o(($event) => openAgreement("user")),
        v: common_vendor.o(($event) => openAgreement("privacy"))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
