"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_file_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_file_picker + _easycom_uni_forms)();
}
const uploadUrl = "http://192.168.0.118:8089/api/merchantapi/webupload";
const _sfc_main = {
  __name: "certification",
  setup(__props) {
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
    common_vendor.computed(() => {
      switch (authStatus.value) {
        case "pending":
          return "认证中";
        case "approved":
          return "已认证";
        case "rejected":
        case "none":
          return "未认证";
        default:
          return "未认证";
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
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:326", "===== 开始验证营业执照 =====");
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:327", "验证营业执照 - 完整数据:", JSON.stringify(value));
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:328", "验证营业执照 - 数据类型:", typeof value);
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:329", "验证营业执照 - 是否数组:", Array.isArray(value));
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:330", "验证营业执照 - 原始值:", value);
              if (value === void 0 || value === null) {
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:334", "验证失败: 值为 undefined 或 null");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (!Array.isArray(value)) {
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:341", "验证失败: 不是数组，类型为:", typeof value);
                callback("请至少上传1张营业执照");
                return false;
              }
              if (value.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:348", "验证失败: 数组为空");
                callback("请至少上传1张营业执照");
                return false;
              }
              const validFiles = value.filter((file, index) => {
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:355", `检查文件${index}:`, JSON.stringify(file));
                if (!file) {
                  common_vendor.index.__f__("log", "at pages/merchant/certification.vue:357", `文件${index}: 文件对象为空`);
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
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:372", `文件${index}检查结果:`, {
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
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:383", `文件${index}是否有效:`, isValid);
                return isValid;
              });
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:387", "有效文件数量:", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:388", "有效文件详情:", validFiles.map((f) => ({ url: f.url, path: f.path, name: f.name })));
              if (validFiles.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:391", "验证失败: 没有有效文件");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (validFiles.length > 3) {
                common_vendor.index.__f__("log", "at pages/merchant/certification.vue:398", "验证失败: 文件数量超过限制");
                callback("最多只能上传3张图片");
                return false;
              }
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:403", "验证成功: 有效文件数量", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/certification.vue:404", "===== 验证营业执照结束 =====");
              return true;
            },
            errorMessage: "请至少上传1张营业执照"
          }
        ]
      }
    };
    const uploadHeaders = common_vendor.computed(() => {
      const accessToken = common_vendor.index.getStorageSync("access_token");
      return {
        "authorization": accessToken ? `Bearer ${accessToken}` : ""
      };
    });
    const submitting = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:428", "商户认证页面加载完成");
      loadAuthStatus();
    });
    const loadAuthStatus = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:436", "开始加载认证状态...");
        const result = await api_apis.apiGetMerchantCheck({
          userid: userStore.userId
        });
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:443", "获取认证状态API返回:", result);
        if (result.code === 200 && result.data) {
          merchantData.value = result.data;
          fillFormData(result.data);
          common_vendor.index.__f__("log", "at pages/merchant/certification.vue:452", "认证状态加载成功, 状态:", result.data.status);
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/certification.vue:454", "用户尚未提交认证申请");
          merchantData.value = null;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/certification.vue:459", "加载认证状态失败:", error);
        merchantData.value = null;
      }
    };
    const fillFormData = (data) => {
      var _a, _b;
      if (!data)
        return;
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:469", "开始数据回显:", data);
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
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:498", "数据回显完成:", formData);
    };
    const onUploadSuccess = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:505", "===== 文件上传成功事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:506", "上传成功回调参数:", res);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:507", "tempFiles:", res.tempFiles);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:508", "tempFilePaths:", res.tempFilePaths);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:509", "当前formData.licenseImages:", formData.licenseImages);
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:514", "延迟后的formData.licenseImages:", formData.licenseImages);
        if (formRef.value) {
          formRef.value.validateField("licenseImages");
        }
      }, 200);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:520", "===== 文件上传成功事件结束 =====");
    };
    const onUploadFail = (err) => {
      common_vendor.index.__f__("error", "at pages/merchant/certification.vue:525", "文件上传失败:", err);
      common_vendor.index.showToast({
        title: "文件上传失败",
        icon: "none"
      });
    };
    const onFileSelect = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:534", "===== 文件选择事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:535", "选择文件:", res);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:536", "tempFiles:", res.tempFiles);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:537", "tempFilePaths:", res.tempFilePaths);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:538", "选择前formData.licenseImages:", formData.licenseImages);
      if (res.tempFiles && res.tempFiles.length > 0) {
        formData.licenseImages = [...formData.licenseImages, ...res.tempFiles];
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:544", "手动更新后formData.licenseImages:", formData.licenseImages);
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.validateField("licenseImages");
          }
        }, 100);
      }
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:554", "===== 文件选择事件结束 =====");
    };
    const onUploadProgress = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:559", "上传进度:", res);
    };
    const onFileDelete = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:564", "===== 文件删除事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:565", "文件删除:", res);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:566", "删除前formData.licenseImages:", formData.licenseImages);
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:570", "删除后formData.licenseImages:", formData.licenseImages);
        if (formRef.value) {
          formRef.value.validateField("licenseImages");
        }
      }, 100);
      common_vendor.index.__f__("log", "at pages/merchant/certification.vue:575", "===== 文件删除事件结束 =====");
    };
    const openLocationPicker = () => {
      common_vendor.index.chooseLocation({
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/merchant/certification.vue:582", "选择位置成功:", res);
          formData.latitude = res.latitude.toString();
          formData.longitude = res.longitude.toString();
          formData.locationName = res.name || res.address || "已选择位置";
          common_vendor.index.showToast({
            title: "位置选择成功",
            icon: "success"
          });
        },
        fail: function(err) {
          common_vendor.index.__f__("error", "at pages/merchant/certification.vue:593", "选择位置失败:", err);
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
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:612", "表单验证失败:", error);
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
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:660", "提交认证数据:", submitData);
        const result = await api_apis.apiPostMerchantCheck(submitData);
        common_vendor.index.__f__("log", "at pages/merchant/certification.vue:664", "认证提交API返回:", result);
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
        common_vendor.index.__f__("error", "at pages/merchant/certification.vue:686", "提交认证失败:", error);
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
        a: currentStep.value <= 1
      }, currentStep.value <= 1 ? {} : {}, {
        b: currentStep.value >= 1 ? 1 : "",
        c: currentStep.value > 1 ? 1 : "",
        d: currentStep.value > 1 ? 1 : "",
        e: currentStep.value <= 2
      }, currentStep.value <= 2 ? {} : {}, {
        f: currentStep.value >= 2 ? 1 : "",
        g: currentStep.value > 2 ? 1 : "",
        h: currentStep.value > 2 ? 1 : "",
        i: currentStep.value >= 3 ? 1 : "",
        j: isReadOnly.value
      }, isReadOnly.value ? common_vendor.e({
        k: authStatus.value === "pending"
      }, authStatus.value === "pending" ? {
        l: common_vendor.p({
          type: "info",
          size: "16",
          color: "#ff9500"
        })
      } : authStatus.value === "approved" ? {
        n: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#07c160"
        })
      } : {}, {
        m: authStatus.value === "approved"
      }) : {}, {
        o: authStatus.value === "rejected"
      }, authStatus.value === "rejected" ? {
        p: common_vendor.p({
          type: "closeempty",
          size: "16",
          color: "#ff4444"
        })
      } : {}, {
        q: common_vendor.o(($event) => formData.merchantName = $event),
        r: common_vendor.p({
          placeholder: "请输入商户名称",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.merchantName
        }),
        s: common_vendor.p({
          label: "商户名称",
          name: "merchantName",
          required: true
        }),
        t: common_vendor.o(($event) => formData.address = $event),
        v: common_vendor.p({
          placeholder: "请输入详细地址",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.address
        }),
        w: common_vendor.p({
          label: "商户地址",
          name: "address",
          required: true
        }),
        x: common_vendor.o(($event) => formData.appcode = $event),
        y: common_vendor.p({
          localdata: appCodeOptions,
          placeholder: "请选择区域",
          clear: false,
          disabled: isReadOnly.value,
          modelValue: formData.appcode
        }),
        z: common_vendor.p({
          label: "所属区域",
          name: "appcode",
          required: true
        }),
        A: formData.latitude && formData.longitude
      }, formData.latitude && formData.longitude ? {
        B: common_vendor.t(formData.locationName || "已选择位置"),
        C: common_vendor.t(formData.longitude),
        D: common_vendor.t(formData.latitude)
      } : {}, {
        E: common_vendor.p({
          type: "location",
          size: "20",
          color: "#999"
        }),
        F: common_vendor.o(($event) => !isReadOnly.value && openLocationPicker()),
        G: isReadOnly.value ? 1 : "",
        H: common_vendor.p({
          label: "商户位置",
          name: "latitude",
          required: true
        }),
        I: common_vendor.o(($event) => formData.contactPerson = $event),
        J: common_vendor.p({
          placeholder: "请输入联系人姓名",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.contactPerson
        }),
        K: common_vendor.p({
          label: "联系人",
          name: "contactPerson",
          required: true
        }),
        L: common_vendor.o(($event) => formData.contactPhone = $event),
        M: common_vendor.p({
          placeholder: "请输入联系电话",
          type: "number",
          maxlength: "11",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.contactPhone
        }),
        N: common_vendor.p({
          label: "联系电话",
          name: "contactPhone",
          required: true
        }),
        O: common_vendor.o(($event) => formData.bucketCount = $event),
        P: common_vendor.p({
          placeholder: "请输入垃圾桶数量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.bucketCount
        }),
        Q: common_vendor.p({
          label: "需要垃圾桶数(个)",
          name: "bucketCount",
          required: true
        }),
        R: common_vendor.o(($event) => formData.estimatedWeight = $event),
        S: common_vendor.p({
          placeholder: "请输入预估垃圾重量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedWeight
        }),
        T: common_vendor.p({
          label: "预估垃圾重量",
          name: "estimatedWeight",
          required: true
        }),
        U: common_vendor.o(onFileSelect),
        V: common_vendor.o(onUploadProgress),
        W: common_vendor.o(onUploadSuccess),
        X: common_vendor.o(onUploadFail),
        Y: common_vendor.o(onFileDelete),
        Z: common_vendor.o(($event) => formData.licenseImages = $event),
        aa: common_vendor.p({
          ["file-mediatype"]: "image",
          mode: "grid",
          limit: 3,
          ["auto-upload"]: true,
          ["upload-url"]: uploadUrl,
          header: uploadHeaders.value,
          disabled: isReadOnly.value,
          ["file-extname"]: "jpg,jpeg,png",
          ["max-size"]: 20971520,
          modelValue: formData.licenseImages
        }),
        ab: !isReadOnly.value
      }, !isReadOnly.value ? {} : {}, {
        ac: common_vendor.p({
          label: "营业执照上传",
          name: "licenseImages",
          required: true
        }),
        ad: common_vendor.sr(formRef, "ea607af1-3", {
          "k": "formRef"
        }),
        ae: common_vendor.p({
          modelValue: formData,
          rules: formRules,
          ["label-position"]: "top"
        }),
        af: isReadOnly.value ? 1 : "",
        ag: authStatus.value === "none" || authStatus.value === "rejected"
      }, authStatus.value === "none" || authStatus.value === "rejected" ? {
        ah: common_vendor.t(authStatus.value === "rejected" ? "重新提交" : "提交认证"),
        ai: common_vendor.o(submitAuth),
        aj: submitting.value
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ea607af1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/certification.js.map
