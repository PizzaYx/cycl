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
      common_vendor.index.__f__("log", "at pages/index/index.vue:135", "打开协议:", type);
      if (type === "user") {
        common_vendor.index.navigateTo({
          url: "/pages/user/agreement"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/user/privacyPolicy"
        });
      }
    };
    const formData = common_vendor.reactive({
      account: "",
      password: ""
    });
    const passwordVisible = common_vendor.ref(false);
    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };
    const handleRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/register"
      });
    };
    const handleLogin = () => {
      if (!formData.account) {
        common_vendor.index.showToast({
          title: "请输入账号",
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
          const userInfo = await fetchUserInfo();
          if (!userInfo) {
            common_vendor.index.hideLoading();
            return;
          }
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: activeTab.value ? "/pages/collection/collection" : "/pages/merchant/merchant"
            });
          }, 100);
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: res.msg || "登录失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/index/index.vue:275", "登录请求失败:", err);
      } finally {
      }
    };
    const fetchUserInfo = async () => {
      try {
        const result = await userStore.fetchUserInfo(true);
        if (!result) {
          throw new Error("获取用户信息失败");
        }
        const { userInfo, userType } = result;
        const expectedType = activeTab.value === 0 ? "1" : "2";
        if (userType !== expectedType) {
          const currentTypeText = activeTab.value === 0 ? "商户端" : "收运端";
          const actualTypeText = userType === "1" ? "商户端" : "收运端";
          return new Promise((resolve) => {
            common_vendor.index.showModal({
              title: "用户类型不匹配",
              content: `您当前选择的是${currentTypeText}，但该账号是${actualTypeText}用户，请重新选择正确的入口`,
              showCancel: false,
              confirmText: "重新选择",
              success: () => {
                activeTab.value = userType === "1" ? 0 : 1;
                common_vendor.index.__f__("log", "at pages/index/index.vue:304", "切换后的activeTab:", activeTab.value);
                common_vendor.index.__f__("log", "at pages/index/index.vue:307", "已切换到正确入口，请重新点击登录");
                resolve(null);
              }
            });
          });
        }
        return userInfo;
      } catch (error) {
        if (error.message === "用户类型不匹配") {
          return null;
        }
        return null;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_4,
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
        k: !passwordVisible.value,
        l: formData.password,
        m: common_vendor.o(($event) => formData.password = $event.detail.value),
        n: common_vendor.o(togglePasswordVisibility),
        o: common_vendor.p({
          type: passwordVisible.value ? "eye" : "eye-filled",
          size: "20",
          color: "rgba(61, 61, 61, 0.5)"
        }),
        p: common_vendor.o(handleLogin),
        q: activeTab.value === 0
      }, activeTab.value === 0 ? {
        r: common_vendor.o(handleRegister)
      } : {}, {
        s: common_vendor.o(toggleAgreement),
        t: common_vendor.p({
          type: agreed.value ? "circle-filled" : "circle",
          size: "22",
          color: agreed.value ? "rgba(7, 193, 96, 1)" : "rgba(19, 19, 19, 0.5)"
        }),
        v: common_vendor.o(($event) => openAgreement("user")),
        w: common_vendor.o(($event) => openAgreement("privacy"))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
