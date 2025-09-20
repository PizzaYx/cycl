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
    const showMerchantSelector = common_vendor.computed(() => {
      return authStatus.value === "none" || authStatus.value === "rejected";
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
    common_vendor.ref([]);
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
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:354", "===== 开始验证营业执照 =====");
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:355", "验证营业执照 - 完整数据:", JSON.stringify(value));
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:356", "验证营业执照 - 数据类型:", typeof value);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:357", "验证营业执照 - 是否数组:", Array.isArray(value));
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:358", "验证营业执照 - 原始值:", value);
              if (value === void 0 || value === null) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:362", "验证失败: 值为 undefined 或 null");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (!Array.isArray(value)) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:369", "验证失败: 不是数组，类型为:", typeof value);
                callback("请至少上传1张营业执照");
                return false;
              }
              if (value.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:376", "验证失败: 数组为空");
                callback("请至少上传1张营业执照");
                return false;
              }
              const validFiles = value.filter((file, index) => {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:383", `检查文件${index}:`, JSON.stringify(file));
                if (!file) {
                  common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:385", `文件${index}: 文件对象为空`);
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
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:400", `文件${index}检查结果:`, {
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
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:411", `文件${index}是否有效:`, isValid);
                return isValid;
              });
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:415", "有效文件数量:", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:416", "有效文件详情:", validFiles.map((f) => ({ url: f.url, path: f.path, name: f.name })));
              if (validFiles.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:419", "验证失败: 没有有效文件");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (validFiles.length > 3) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:426", "验证失败: 文件数量超过限制");
                callback("最多只能上传3张图片");
                return false;
              }
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:431", "验证成功: 有效文件数量", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:432", "===== 验证营业执照结束 =====");
              return true;
            },
            errorMessage: "请至少上传1张营业执照"
          }
        ]
      }
    };
    const uploadHeaders = utils_config.createUploadHeaders().value;
    const submitting = common_vendor.ref(false);
    const merchantList = common_vendor.ref([]);
    const searchKeyword = common_vendor.ref("");
    const showMerchantPopup = common_vendor.ref(false);
    const filteredMerchantList = common_vendor.computed(() => {
      if (!searchKeyword.value) {
        return merchantList.value;
      }
      const keyword = searchKeyword.value.toLowerCase().trim();
      if (!keyword) {
        return merchantList.value;
      }
      return merchantList.value.filter((merchant) => {
        return merchant.name.toLowerCase().includes(keyword);
      });
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:470", "商户认证页面加载完成");
      loadAuthStatus();
      loadMerchantList();
    });
    const loadAuthStatus = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:480", "开始加载认证状态...");
        const result = await api_apis.apiGetMerchantCheck({
          userid: userStore.userId
        });
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:487", "获取认证状态API返回:", result);
        if (result.code === 200 && result.data) {
          merchantData.value = result.data;
          fillFormData(result.data);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:496", "认证状态加载成功, 状态:", result.data);
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:498", "用户尚未提交认证申请");
          merchantData.value = null;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:503", "加载认证状态失败:", error);
        merchantData.value = null;
      }
    };
    const fillFormData = (data) => {
      var _a, _b;
      if (!data)
        return;
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:513", "开始数据回显:", data);
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
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:534", "===== 开始图片回显 =====");
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:535", "服务器返回的img字段:", data.img);
        const imageUrls = data.img.split(",").filter((url) => url.trim());
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:538", "解析后的图片URLs:", imageUrls);
        formData.licenseImages = imageUrls.map((url, index) => {
          const trimmedUrl = url.trim();
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:542", `回显第${index + 1}个图片URL:`, trimmedUrl);
          return {
            url: trimmedUrl,
            path: trimmedUrl,
            name: "营业执照"
          };
        });
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:550", "回显后的formData.licenseImages:", formData.licenseImages);
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:551", "===== 图片回显完成 =====");
      }
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:554", "数据回显完成:", formData);
    };
    const loadMerchantList = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:560", "开始加载商户列表...");
        const result = await api_apis.apiSelectMerchantList();
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:562", "获取商户列表API返回:", result);
        if (result.code === 200 && result.data) {
          merchantList.value = result.data.map((item, index) => ({
            id: item.id || index,
            // 使用返回的id或索引作为key
            name: item.name
          }));
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:570", "商户列表加载成功，数量:", merchantList.value.length);
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:572", "获取商户列表失败");
          merchantList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:576", "加载商户列表失败:", error);
        merchantList.value = [];
      }
    };
    const showMerchantList = () => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:583", "点击选择按钮");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:584", "merchantList.value:", merchantList.value);
      if (merchantList.value.length === 0) {
        common_vendor.index.showToast({
          title: "商户列表为空",
          icon: "none"
        });
        return;
      }
      showMerchantPopup.value = true;
    };
    const closeMerchantList = () => {
      showMerchantPopup.value = false;
      searchKeyword.value = "";
    };
    const selectMerchant = (merchant) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:605", "选择商户:", merchant);
      formData.merchantName = merchant.name;
      closeMerchantList();
    };
    const uploadFileManually = (file, fileIndex = null) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:635", "开始手动上传文件:", file);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:636", "文件路径:", file.tempFilePath || file.path);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:637", "上传URL:", utils_config.uploadUrl);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:638", "请求头:", uploadHeaders);
      common_vendor.index.uploadFile({
        url: utils_config.uploadUrl,
        filePath: file.tempFilePath || file.path,
        name: "file",
        header: uploadHeaders,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:646", "手动上传成功:", res);
          const response = JSON.parse(res.data);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:649", "服务器响应:", response);
          if (response.code === 200 && response.url) {
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:652", "===== 文件上传成功处理 =====");
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:653", "服务器返回的URL:", response.url);
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:654", "当前formData.licenseImages:", formData.licenseImages);
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:655", "要更新的文件:", file);
            let targetIndex = fileIndex;
            if (targetIndex === null || targetIndex === void 0) {
              targetIndex = formData.licenseImages.findIndex((f) => {
                return f === file || f.name && file.name && f.name === file.name || f.uuid && file.uuid && f.uuid === file.uuid || f.tempFilePath && file.tempFilePath && f.tempFilePath === file.tempFilePath;
              });
            }
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:668", "目标文件索引:", targetIndex);
            if (targetIndex !== -1 && targetIndex < formData.licenseImages.length) {
              const oldFile = formData.licenseImages[targetIndex];
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:672", "更新前的文件:", oldFile);
              formData.licenseImages[targetIndex] = {
                ...file,
                url: response.url,
                fileName: response.fileName,
                newFileName: response.newFileName,
                originalFilename: response.originalFilename,
                response
              };
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:683", "更新后的文件:", formData.licenseImages[targetIndex]);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:684", "更新后的formData.licenseImages:", formData.licenseImages);
            } else {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:686", "未找到有效的文件索引，尝试替换最后一个文件");
              const lastIndex = formData.licenseImages.length - 1;
              if (lastIndex >= 0) {
                formData.licenseImages[lastIndex] = {
                  ...file,
                  url: response.url,
                  fileName: response.fileName,
                  newFileName: response.newFileName,
                  originalFilename: response.originalFilename,
                  response
                };
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:698", "替换最后一个文件后的formData.licenseImages:", formData.licenseImages);
              } else {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:700", "数组为空，添加新文件");
                formData.licenseImages.push({
                  ...file,
                  url: response.url,
                  fileName: response.fileName,
                  newFileName: response.newFileName,
                  originalFilename: response.originalFilename,
                  response
                });
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:709", "添加后的formData.licenseImages:", formData.licenseImages);
              }
            }
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:712", "===== 文件上传成功处理完成 =====");
            setTimeout(() => {
              if (formRef.value) {
                formRef.value.validateField("licenseImages");
              }
            }, 100);
          } else {
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:721", "上传失败，服务器返回:", response);
            common_vendor.index.showToast({
              title: "文件上传失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:729", "手动上传失败:", err);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:730", "错误详情:", JSON.stringify(err));
          common_vendor.index.showToast({
            title: "文件上传失败",
            icon: "none"
          });
        }
      });
    };
    const onFileSelect = (res) => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:741", "===== 文件选择事件 =====");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:742", "选择文件:", res);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:743", "tempFiles:", res.tempFiles);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:744", "tempFilePaths:", res.tempFilePaths);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:745", "选择前formData.licenseImages:", formData.licenseImages);
      if (res.tempFiles && res.tempFiles.length > 0) {
        formData.licenseImages = [...formData.licenseImages, ...res.tempFiles];
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:751", "手动更新后formData.licenseImages:", formData.licenseImages);
        const newFileIndex = formData.licenseImages.length - 1;
        uploadFileManually(res.tempFiles[0], newFileIndex);
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.validateField("licenseImages");
          }
        }, 100);
      }
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:765", "===== 文件选择事件结束 =====");
    };
    const openLocationPicker = () => {
      common_vendor.index.chooseLocation({
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:795", "选择位置成功:", res);
          formData.latitude = res.latitude.toString();
          formData.longitude = res.longitude.toString();
          formData.locationName = res.name || res.address || "已选择位置";
          common_vendor.index.showToast({
            title: "位置选择成功",
            icon: "success"
          });
        },
        fail: function(err) {
          common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:806", "选择位置失败:", err);
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
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:825", "表单验证失败:", error);
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
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:844", "===== 开始处理图片数据 =====");
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:845", "formData.licenseImages:", formData.licenseImages);
          imageUrls = formData.licenseImages.map((file, index) => {
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:848", `处理第${index + 1}个文件:`, file);
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:849", `文件类型:`, typeof file);
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:850", `文件URL:`, file.url);
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:851", `文件路径:`, file.path);
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:852", `文件响应:`, file.response);
            if (typeof file === "string") {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:856", `使用字符串值:`, file);
              return file;
            } else if (file.url) {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:859", `使用URL:`, file.url);
              return file.url;
            } else if (file.path) {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:862", `使用路径:`, file.path);
              return file.path;
            } else {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:865", `使用原始值:`, file);
              return file;
            }
          });
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:870", "最终图片URLs:", imageUrls);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:871", "===== 图片数据处理完成 =====");
        }
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:874", "123", userStore.merchant);
        const submitData = {
          userid: userStore.userId,
          id: userStore.merchant.id,
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
          // ，多张图片用逗号分隔
        };
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:891", "提交修改认证数据:", submitData);
        let result;
        if (authStatus.value === "rejected") {
          result = await api_apis.apiPostEditMerchantCheck(submitData);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:898", "修改认证API返回:", result);
          common_vendor.index.showToast({
            title: "修改提交成功",
            icon: "success"
          });
        } else {
          result = await api_apis.apiPostMerchantCheck(submitData);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:906", "认证提交API返回:", result);
          common_vendor.index.showToast({
            title: "认证申请提交成功",
            icon: "success"
          });
        }
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
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:928", "提交认证失败:", error);
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
        v: showMerchantSelector.value
      }, showMerchantSelector.value ? {
        w: common_vendor.o(showMerchantList),
        x: isReadOnly.value
      } : {}, {
        y: common_vendor.p({
          label: "商户名称",
          name: "merchantName",
          required: true
        }),
        z: common_vendor.o(($event) => formData.address = $event),
        A: common_vendor.p({
          placeholder: "请输入详细地址",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.address
        }),
        B: common_vendor.p({
          label: "商户地址",
          name: "address",
          required: true
        }),
        C: common_vendor.o(($event) => formData.appcode = $event),
        D: common_vendor.p({
          localdata: appCodeOptions,
          placeholder: "请选择区域",
          clear: false,
          disabled: isReadOnly.value,
          modelValue: formData.appcode
        }),
        E: common_vendor.p({
          label: "所属区域",
          name: "appcode",
          required: true
        }),
        F: formData.latitude && formData.longitude
      }, formData.latitude && formData.longitude ? {
        G: common_vendor.t(formData.locationName || "已选择位置"),
        H: common_vendor.t(formData.longitude),
        I: common_vendor.t(formData.latitude)
      } : {}, {
        J: common_vendor.p({
          type: "location",
          size: "20",
          color: "#999"
        }),
        K: common_vendor.o(($event) => !isReadOnly.value && openLocationPicker()),
        L: isReadOnly.value ? 1 : "",
        M: common_vendor.p({
          label: "商户位置",
          name: "latitude",
          required: true
        }),
        N: common_vendor.o(($event) => formData.contactPerson = $event),
        O: common_vendor.p({
          placeholder: "请输入联系人姓名",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.contactPerson
        }),
        P: common_vendor.p({
          label: "联系人",
          name: "contactPerson",
          required: true
        }),
        Q: common_vendor.o(($event) => formData.contactPhone = $event),
        R: common_vendor.p({
          placeholder: "请输入联系电话",
          type: "number",
          maxlength: "11",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.contactPhone
        }),
        S: common_vendor.p({
          label: "联系电话",
          name: "contactPhone",
          required: true
        }),
        T: common_vendor.o(($event) => formData.bucketCount = $event),
        U: common_vendor.p({
          placeholder: "请输入垃圾桶数量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.bucketCount
        }),
        V: common_vendor.p({
          label: "需要垃圾桶数(个)",
          name: "bucketCount",
          required: true
        }),
        W: common_vendor.o(($event) => formData.estimatedWeight = $event),
        X: common_vendor.p({
          placeholder: "请输入预估垃圾重量",
          type: "number",
          clearable: false,
          disabled: isReadOnly.value,
          modelValue: formData.estimatedWeight
        }),
        Y: common_vendor.p({
          label: "预估垃圾重量",
          name: "estimatedWeight",
          required: true
        }),
        Z: common_vendor.o(onFileSelect),
        aa: common_vendor.o(_ctx.onUploadProgress),
        ab: common_vendor.o(($event) => formData.licenseImages = $event),
        ac: common_vendor.p({
          ["file-mediatype"]: "image",
          mode: "grid",
          limit: 3,
          ["auto-upload"]: false,
          ["upload-url"]: common_vendor.unref(utils_config.uploadUrl),
          header: common_vendor.unref(uploadHeaders),
          disabled: isReadOnly.value,
          ["file-extname"]: "jpg,jpeg,png",
          ["max-size"]: 20971520,
          ["return-type"]: "array",
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
      } : {}, {
        am: showMerchantPopup.value
      }, showMerchantPopup.value ? common_vendor.e({
        an: common_vendor.o(closeMerchantList),
        ao: common_vendor.o(($event) => searchKeyword.value = $event),
        ap: common_vendor.p({
          placeholder: "搜索商户名称",
          clearable: true,
          modelValue: searchKeyword.value
        }),
        aq: common_vendor.f(filteredMerchantList.value, (merchant, k0, i0) => {
          return {
            a: common_vendor.t(merchant.name),
            b: merchant.id,
            c: common_vendor.o(($event) => selectMerchant(merchant), merchant.id)
          };
        }),
        ar: filteredMerchantList.value.length === 0
      }, filteredMerchantList.value.length === 0 ? {} : {}, {
        as: common_vendor.o(() => {
        }),
        at: common_vendor.o(closeMerchantList)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-edea1fd9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shCertification.js.map
