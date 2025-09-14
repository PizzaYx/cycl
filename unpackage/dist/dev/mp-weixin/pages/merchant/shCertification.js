"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
const utils_config = require("../../utils/config.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_file_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_file_picker + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "shCertification",
  setup(__props) {
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const userStore = stores_user.useUserStore();
    const merchantData = common_vendor.ref(null);
    const currentStep = common_vendor.computed(() => {
      var _a;
      const status = (_a = merchantData.value) == null ? void 0 : _a.status;
      switch (status) {
        case 0:
          return 2;
        case 1:
          return 3;
        case 2:
          return 1;
        default:
          return 1;
      }
    });
    const authStatus = common_vendor.computed(() => {
      var _a;
      const status = (_a = merchantData.value) == null ? void 0 : _a.status;
      switch (status) {
        case 0:
          return "pending";
        case 1:
          return "approved";
        case 2:
          return "rejected";
        default:
          return "none";
      }
    });
    const isReadOnly = common_vendor.computed(() => {
      return authStatus.value === "pending" || authStatus.value === "approved";
    });
    const formData = common_vendor.reactive({
      merchantName: "",
      address: "",
      contactPerson: "",
      contactPhone: "",
      bucketCount: "",
      estimatedWeight: "",
      appcode: "",
      // 区域代码
      latitude: "",
      // 纬度
      longitude: "",
      // 经度
      locationName: "",
      // 选择的位置名称（用于显示）
      licenseImages: []
      // 改为数组支持多图上传
    });
    const appCodeOptions = [
      { value: 1, text: "普兴" },
      { value: 2, text: "兴义" },
      { value: 3, text: "安西" },
      { value: 4, text: "五津" },
      { value: 5, text: "花桥" },
      { value: 6, text: "永商" },
      { value: 7, text: "花源" }
    ];
    const formRef = common_vendor.ref();
    const formRules = {
      merchantName: {
        rules: [
          { required: true, errorMessage: "请输入商户名称" }
        ]
      },
      address: {
        rules: [
          { required: true, errorMessage: "请输入商户地址" }
        ]
      },
      appcode: {
        rules: [
          { required: true, errorMessage: "请选择所属区域" },
          {
            validateFunction: function(rule, value, data, callback) {
              const validValues = appCodeOptions.map((option) => option.value);
              if (value && !validValues.includes(parseInt(value))) {
                callback("请选择有效的区域");
                return false;
              }
              return true;
            }
          }
        ]
      },
      contactPerson: {
        rules: [
          { required: true, errorMessage: "请输入联系人姓名" }
        ]
      },
      contactPhone: {
        rules: [
          { required: true, errorMessage: "请输入联系电话" },
          { pattern: /^1[3-9]\d{9}$/, errorMessage: "请输入正确的手机号码" }
        ]
      },
      bucketCount: {
        rules: [
          { required: true, errorMessage: "请输入垃圾桶数量" },
          {
            validateFunction: function(rule, value, data, callback) {
              if (value && (isNaN(value) || parseInt(value) <= 0)) {
                callback("垃圾桶数量必须大于0");
              }
              return true;
            }
          }
        ]
      },
      estimatedWeight: {
        rules: [
          { required: true, errorMessage: "请输入预估垃圾重量" },
          {
            validateFunction: function(rule, value, data, callback) {
              if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                callback("预估垃圾重量必须大于0");
              }
              return true;
            }
          }
        ]
      },
      latitude: {
        rules: [
          { required: true, errorMessage: "请选择商户位置坐标" },
          {
            validateFunction: function(rule, value, data, callback) {
              if (value && (isNaN(value) || parseFloat(value) < -90 || parseFloat(value) > 90)) {
                callback("纬度值必须在-90到90之间");
                return false;
              }
              return true;
            }
          }
        ]
      },
      longitude: {
        rules: [
          { required: true, errorMessage: "请选择商户位置坐标" },
          {
            validateFunction: function(rule, value, data, callback) {
              if (value && (isNaN(value) || parseFloat(value) < -180 || parseFloat(value) > 180)) {
                callback("经度值必须在-180到180之间");
                return false;
              }
              return true;
            }
          }
        ]
      },
      licenseImages: {
        rules: [
          {
            required: true,
            validateFunction: function(rule, value, data, callback) {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:320", "===== 开始验证营业执照 =====");
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:321", "验证营业执照 - 完整数据:", JSON.stringify(value));
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:322", "验证营业执照 - 数据类型:", typeof value);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:323", "验证营业执照 - 是否数组:", Array.isArray(value));
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:324", "验证营业执照 - 原始值:", value);
              if (value === void 0 || value === null) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:328", "验证失败: 值为 undefined 或 null");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (!Array.isArray(value)) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:335", "验证失败: 不是数组，类型为:", typeof value);
                callback("请至少上传1张营业执照");
                return false;
              }
              if (value.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:342", "验证失败: 数组为空");
                callback("请至少上传1张营业执照");
                return false;
              }
              const validFiles = value.filter((file, index) => {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:349", `检查文件${index}:`, JSON.stringify(file));
                if (!file) {
                  common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:351", `文件${index}: 文件对象为空`);
                  return false;
                }
                const hasUrl = file.url && file.url.trim();
                const hasPath = file.path && file.path.trim();
                const hasResponse = file.response && file.response.url;
                const isString = typeof file === "string" && file.trim();
                const hasFileId = file.fileID || file.id;
                const hasName = file.name;
                const hasSize = file.size;
                const hasTempFilePath = file.tempFilePath;
                const hasFile = file.file;
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:366", `文件${index}检查结果:`, {
                  hasUrl,
                  hasPath,
                  hasResponse,
                  isString,
                  hasFileId,
                  hasName,
                  hasSize,
                  hasTempFilePath,
                  hasFile,
                  url: file.url,
                  path: file.path,
                  name: file.name,
                  size: file.size,
                  tempFilePath: file.tempFilePath,
                  file: file.file
                });
                const isValid = hasUrl || hasPath || hasResponse || isString || hasFileId || hasName || hasTempFilePath || hasFile;
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:377", `文件${index}是否有效:`, isValid);
                return isValid;
              });
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:381", "有效文件数量:", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:382", "有效文件详情:", validFiles.map((f) => ({ url: f.url, path: f.path, name: f.name })));
              if (validFiles.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:385", "验证失败: 没有有效文件");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (validFiles.length > 3) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:392", "验证失败: 文件数量超过限制");
                callback("最多只能上传3张图片");
                return false;
              }
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:397", "验证成功: 有效文件数量", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:398", "===== 验证营业执照结束 =====");
              return true;
            },
            errorMessage: "请至少上传1张营业执照"
          }
        ]
      }
    };
    const uploadHeaders = utils_config.createUploadHeaders();
    const submitting = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:415", "商户认证页面加载完成");
      loadAuthStatus();
    });
    const loadAuthStatus = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:423", "开始加载认证状态...");
        const result = await api_apis.apiGetMerchantCheck({
          userid: userStore.userId
        });
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:430", "获取认证状态API返回:", result);
        if (result.code === 200 && result.data) {
          merchantData.value = result.data;
          fillFormData(result.data);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:439", "认证状态加载成功, 状态:", result.data.status);
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:441", "用户尚未提交认证申请");
          merchantData.value = null;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:446", "加载认证状态失败:", error);
        merchantData.value = null;
      }
    };
    const fillFormData = (data) => {
      var _a, _b;
      if (!data)
        return;
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:456", "开始数据回显:", data);
      formData.merchantName = data.name || "";
      formData.address = data.address || "";
      formData.appcode = data.appcode || "";
      formData.contactPerson = data.contactTruename || "";
      formData.contactPhone = data.contactTel || "";
      formData.bucketCount = ((_a = data.bucketNum) == null ? void 0 : _a.toString()) || "";
      formData.estimatedWeight = ((_b = data.trashWeight) == null ? void 0 : _b.toString()) || "";
      if (data.lat && data.lon) {
        formData.latitude = data.lat.toString();
        formData.longitude = data.lon.toString();
        formData.locationName = "已选择位置";
      }
      if (data.img) {
        const imageUrls = data.img.split(",").filter((url) => url.trim());
        formData.licenseImages = imageUrls.map((url) => ({
          url: url.trim(),
          path: url.trim(),
          name: "营业执照"
        }));
      }
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:485", "数据回显完成:", formData);
    };
    const onUploadSuccess = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:492", "===== 文件上传成功事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:493", "上传成功回调参数:", res);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:494", "tempFiles:", res.tempFiles);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:495", "tempFilePaths:", res.tempFilePaths);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:496", "当前formData.licenseImages:", formData.licenseImages);
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:501", "延迟后的formData.licenseImages:", formData.licenseImages);
        if (formRef.value) {
          formRef.value.validateField("licenseImages");
        }
      }, 200);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:507", "===== 文件上传成功事件结束 =====");
    };
    const onUploadFail = (err) => {
      common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:512", "文件上传失败:", err);
      common_vendor.index.showToast({
        title: "文件上传失败",
        icon: "none"
      });
    };
    const onFileSelect = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:521", "===== 文件选择事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:522", "选择文件:", res);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:523", "tempFiles:", res.tempFiles);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:524", "tempFilePaths:", res.tempFilePaths);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:525", "选择前formData.licenseImages:", formData.licenseImages);
      if (res.tempFiles && res.tempFiles.length > 0) {
        formData.licenseImages = [...formData.licenseImages, ...res.tempFiles];
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:531", "手动更新后formData.licenseImages:", formData.licenseImages);
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.validateField("licenseImages");
          }
        }, 100);
      }
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:541", "===== 文件选择事件结束 =====");
    };
    const onUploadProgress = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:546", "上传进度:", res);
    };
    const onFileDelete = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:551", "===== 文件删除事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:552", "文件删除:", res);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:553", "删除前formData.licenseImages:", formData.licenseImages);
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:557", "删除后formData.licenseImages:", formData.licenseImages);
        if (formRef.value) {
          formRef.value.validateField("licenseImages");
        }
      }, 100);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:562", "===== 文件删除事件结束 =====");
    };
    const openLocationPicker = () => {
      common_vendor.index.chooseLocation({
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:569", "选择位置成功:", res);
          formData.latitude = res.latitude.toString();
          formData.longitude = res.longitude.toString();
          formData.locationName = res.name || res.address || "已选择位置";
          common_vendor.index.showToast({
            title: "位置选择成功",
            icon: "success"
          });
        },
        fail: function(err) {
          common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:580", "选择位置失败:", err);
          if (err.errMsg && err.errMsg.includes("cancel")) {
            return;
          }
          common_vendor.index.showToast({
            title: "位置选择失败",
            icon: "none"
          });
        }
      });
    };
    const validateForm = async () => {
      try {
        const result = await formRef.value.validate();
        return true;
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:599", "表单验证失败:", error);
        return false;
      }
    };
    const submitAuth = async () => {
      const isValid = await validateForm();
      if (!isValid) {
        return;
      }
      submitting.value = true;
      try {
        let imageUrls = [];
        if (formData.licenseImages && formData.licenseImages.length > 0) {
          imageUrls = formData.licenseImages.map((file) => {
            if (typeof file === "string") {
              return file;
            } else if (file.url) {
              return file.url;
            } else if (file.path) {
              return file.path;
            } else {
              return file;
            }
          });
        }
        const submitData = {
          userid: userStore.userId,
          name: formData.merchantName,
          // 商户名称
          address: formData.address,
          // 地址
          appcode: formData.appcode,
          // 区域代码
          lat: parseFloat(formData.latitude),
          // 纬度
          lon: parseFloat(formData.longitude),
          // 经度
          contactTruename: formData.contactPerson,
          // 联系人姓名
          contactTel: formData.contactPhone,
          // 联系电话
          bucketNum: parseInt(formData.bucketCount),
          // 预计桶数量
          trashWeight: parseFloat(formData.estimatedWeight),
          // 预估垃圾重量
          img: imageUrls.join(",")
          // 法人证照片，多张图片用逗号分隔
        };
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:647", "提交认证数据:", submitData);
        const result = await api_apis.apiPostMerchantCheck(submitData);
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:651", "认证提交API返回:", result);
        common_vendor.index.showToast({
          title: "认证申请提交成功",
          icon: "success"
        });
        merchantData.value = {
          ...submitData,
          status: 0,
          // 待审核状态
          updateTime: (/* @__PURE__ */ new Date()).toLocaleString()
        };
        if (userStore.userInfo) {
          userStore.updateUserInfo({
            merchant: merchantData.value
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:673", "提交认证失败:", error);
        common_vendor.index.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
      } finally {
        submitting.value = false;
      }
    };
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
          title: "商户认证"
        }),
        c: currentStep.value <= 1
      }, currentStep.value <= 1 ? {} : {}, {
        d: currentStep.value >= 1 ? 1 : "",
        e: currentStep.value > 1 ? 1 : "",
        f: currentStep.value > 1 ? 1 : "",
        g: currentStep.value <= 2
      }, currentStep.value <= 2 ? {} : {}, {
        h: currentStep.value >= 2 ? 1 : "",
        i: currentStep.value > 2 ? 1 : "",
        j: currentStep.value > 2 ? 1 : "",
        k: currentStep.value >= 3 ? 1 : "",
        l: isReadOnly.value
      }, isReadOnly.value ? common_vendor.e({
        m: authStatus.value === "pending"
      }, authStatus.value === "pending" ? {
        n: common_vendor.p({
          type: "info",
          size: "16",
          color: "#ff9500"
        })
      } : authStatus.value === "approved" ? {
        p: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#07c160"
        })
      } : {}, {
        o: authStatus.value === "approved"
      }) : {}, {
        q: authStatus.value === "rejected"
      }, authStatus.value === "rejected" ? {
        r: common_vendor.p({
          type: "closeempty",
          size: "16",
          color: "#ff4444"
        })
      } : {}, {
        s: common_vendor.o(($event) => formData.merchantName = $event),
        t: common_vendor.p({
          placeholder: "请输入商户名称",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.merchantName
        }),
        v: common_vendor.p({
          label: "商户名称",
          name: "merchantName",
          required: true
        }),
        w: common_vendor.o(($event) => formData.address = $event),
        x: common_vendor.p({
          placeholder: "请输入详细地址",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.address
        }),
        y: common_vendor.p({
          label: "商户地址",
          name: "address",
          required: true
        }),
        z: common_vendor.o(($event) => formData.appcode = $event),
        A: common_vendor.p({
          localdata: appCodeOptions,
          placeholder: "请选择区域",
          clear: false,
          disabled: isReadOnly.value,
          modelValue: formData.appcode
        }),
        B: common_vendor.p({
          label: "所属区域",
          name: "appcode",
          required: true
        }),
        C: formData.latitude && formData.longitude
      }, formData.latitude && formData.longitude ? {
        D: common_vendor.t(formData.locationName || "已选择位置"),
        E: common_vendor.t(formData.longitude),
        F: common_vendor.t(formData.latitude)
      } : {}, {
        G: common_vendor.p({
          type: "location",
          size: "20",
          color: "#999"
        }),
        H: common_vendor.o(($event) => !isReadOnly.value && openLocationPicker()),
        I: isReadOnly.value ? 1 : "",
        J: common_vendor.p({
          label: "商户位置",
          name: "latitude",
          required: true
        }),
        K: common_vendor.o(($event) => formData.contactPerson = $event),
        L: common_vendor.p({
          placeholder: "请输入联系人姓名",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.contactPerson
        }),
        M: common_vendor.p({
          label: "联系人",
          name: "contactPerson",
          required: true
        }),
        N: common_vendor.o(($event) => formData.contactPhone = $event),
        O: common_vendor.p({
          placeholder: "请输入联系电话",
          type: "number",
          maxlength: "11",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.contactPhone
        }),
        P: common_vendor.p({
          label: "联系电话",
          name: "contactPhone",
          required: true
        }),
        Q: common_vendor.o(($event) => formData.bucketCount = $event),
        R: common_vendor.p({
          placeholder: "请输入垃圾桶数量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.bucketCount
        }),
        S: common_vendor.p({
          label: "需要垃圾桶数(个)",
          name: "bucketCount",
          required: true
        }),
        T: common_vendor.o(($event) => formData.estimatedWeight = $event),
        U: common_vendor.p({
          placeholder: "请输入预估垃圾重量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedWeight
        }),
        V: common_vendor.p({
          label: "预估垃圾重量",
          name: "estimatedWeight",
          required: true
        }),
        W: common_vendor.o(onFileSelect),
        X: common_vendor.o(onUploadProgress),
        Y: common_vendor.o(onUploadSuccess),
        Z: common_vendor.o(onUploadFail),
        aa: common_vendor.o(onFileDelete),
        ab: common_vendor.o(($event) => formData.licenseImages = $event),
        ac: common_vendor.p({
          ["file-mediatype"]: "image",
          mode: "grid",
          limit: 3,
          ["auto-upload"]: true,
          ["upload-url"]: common_vendor.unref(utils_config.uploadUrl),
          header: common_vendor.unref(uploadHeaders),
          disabled: isReadOnly.value,
          ["file-extname"]: "jpg,jpeg,png",
          ["max-size"]: 20971520,
          modelValue: formData.licenseImages
        }),
        ad: !isReadOnly.value
      }, !isReadOnly.value ? {} : {}, {
        ae: common_vendor.p({
          label: "营业执照上传",
          name: "licenseImages",
          required: true
        }),
        af: common_vendor.sr(formRef, "edea1fd9-4", {
          "k": "formRef"
        }),
        ag: common_vendor.p({
          modelValue: formData,
          rules: formRules,
          ["label-position"]: "top"
        }),
        ah: isReadOnly.value ? 1 : "",
        ai: authStatus.value === "none" || authStatus.value === "rejected"
      }, authStatus.value === "none" || authStatus.value === "rejected" ? {
        aj: common_vendor.t(authStatus.value === "rejected" ? "重新提交" : "提交认证"),
        ak: common_vendor.o(submitAuth),
        al: submitting.value
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-edea1fd9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shCertification.js.map
