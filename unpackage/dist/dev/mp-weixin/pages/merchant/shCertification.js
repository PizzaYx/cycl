"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
const utils_config = require("../../utils/config.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_icons2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_file_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (PageHeader + _easycom_uni_icons + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_file_picker + _easycom_uni_forms)();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
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
    const isContractSigned = common_vendor.computed(() => {
      if (formData.content) {
        return true;
      }
      if (formData.covenantId) {
        return true;
      }
      return false;
    });
    const contractDisplayText = common_vendor.computed(() => {
      if (isContractSigned.value) {
        return "已签名";
      } else {
        return "请点击查看电子合同并签名";
      }
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
      licenseImages: [],
      // 改为数组支持多图上传
      content: "",
      // 合同内容
      startTime: "",
      // 合同开始时间
      endTime: "",
      // 合同结束时间
      tempId: null,
      // 合同模板ID
      covenantId: null
      // 合同ID
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
              if (value === void 0 || value === null) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:402", "验证失败: 值为 undefined 或 null");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (!Array.isArray(value)) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:409", "验证失败: 不是数组，类型为:", typeof value);
                callback("请至少上传1张营业执照");
                return false;
              }
              if (value.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:416", "验证失败: 数组为空");
                callback("请至少上传1张营业执照");
                return false;
              }
              const validFiles = value.filter((file, index) => {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:423", `检查文件${index}:`, JSON.stringify(file));
                if (!file) {
                  common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:425", `文件${index}: 文件对象为空`);
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
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:440", `文件${index}检查结果:`, {
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
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:451", `文件${index}是否有效:`, isValid);
                return isValid;
              });
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:455", "有效文件数量:", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:456", "有效文件详情:", validFiles.map((f) => ({ url: f.url, path: f.path, name: f.name })));
              if (validFiles.length === 0) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:459", "验证失败: 没有有效文件");
                callback("请至少上传1张营业执照");
                return false;
              }
              if (validFiles.length > 3) {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:466", "验证失败: 文件数量超过限制");
                callback("最多只能上传3张图片");
                return false;
              }
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:471", "验证成功: 有效文件数量", validFiles.length);
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:472", "===== 验证营业执照结束 =====");
              return true;
            },
            errorMessage: "请至少上传1张营业执照"
          }
        ]
      },
      content: {
        rules: [
          {
            required: true,
            validateFunction: function(rule, value, data, callback) {
              if (!value) {
                callback("请查看并签署电子合同");
                return false;
              }
              return true;
            },
            errorMessage: "请查看并签署电子合同"
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
    const getSelectedAreaText = () => {
      if (!formData.appcode) {
        return "";
      }
      const selectedOption = appCodeOptions.find((option) => option.value === parseInt(formData.appcode));
      return selectedOption ? selectedOption.text : "";
    };
    const getLocationText = () => {
      if (formData.latitude && formData.longitude) {
        return formData.locationName || `经度: ${formData.longitude}, 纬度: ${formData.latitude}`;
      }
      return "";
    };
    const goToContract = () => {
      const isReadOnly2 = authStatus.value === "pending" || authStatus.value === "approved";
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:547", "===== shCertification.vue 准备跳转到合同页面 =====");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:548", "当前状态:", {
        isReadOnly: isReadOnly2,
        hasContent: !!formData.content,
        content: formData.content
      });
      if (formData.content) {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:556", "===== 传递已签名的合同内容 =====");
        const contractContent = encodeURIComponent(formData.content);
        const startTime = formData.startTime;
        const endTime = formData.endTime;
        let url2 = `/pages/syContract/syContractFromAuth?isReadOnly=${isReadOnly2}&hasContract=true&content=${contractContent}&startTime=${startTime}&endTime=${endTime}`;
        common_vendor.index.navigateTo({
          url: url2,
          success: () => {
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:566", "跳转到合同页面成功，显示已签名合同");
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:569", "跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
        return;
      }
      if (formData.covenantId) {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:581", "===== 跳转到合同页面，合同页面会用商户ID获取合同 =====");
        let url2 = `/pages/syContract/syContractFromAuth?isReadOnly=${isReadOnly2}`;
        common_vendor.index.navigateTo({
          url: url2,
          success: () => {
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:587", "跳转到合同页面成功，合同页面会用商户ID获取合同");
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:590", "跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
        return;
      }
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:601", "===== 跳转到合同页面进行签名 =====");
      let url = `/pages/syContract/syContractFromAuth?isReadOnly=${isReadOnly2}`;
      if (isReadOnly2 && formData.tempId) {
        url += `&tempId=${formData.tempId}`;
      }
      common_vendor.index.navigateTo({
        url,
        success: () => {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:612", "跳转到电子合同页面成功，进行签名");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:615", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const viewLocation = () => {
      if (formData.latitude && formData.longitude) {
        common_vendor.index.openLocation({
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          name: formData.locationName || "商户位置",
          address: formData.locationName || "商户位置",
          success: () => {
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:634", "打开系统地图成功");
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:637", "打开系统地图失败:", err);
            common_vendor.index.showModal({
              title: "商户位置",
              content: `位置名称：${formData.locationName || "已选择位置"}
经度：${formData.longitude}
纬度：${formData.latitude}`,
              showCancel: false,
              confirmText: "确定"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "暂无位置信息",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      loadAuthStatus();
      loadMerchantList();
      common_vendor.index.$on("contractUpdated", (contractData) => {
        if (contractData && contractData.content) {
          formData.content = contractData.content;
          formData.startTime = contractData.createTime;
          formData.endTime = contractData.endTime;
          common_vendor.index.showToast({
            title: "合同签名成功",
            icon: "success"
          });
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:676", "合同数据无效，不更新");
        }
      });
    });
    const loadAuthStatus = async () => {
      try {
        const result = await api_apis.apiGetMerchantCheck({
          userid: userStore.userId
        });
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:689", "获取认证状态API返回:", result);
        if (result.code === 200 && result.data) {
          merchantData.value = result.data;
          fillFormData(result.data);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:698", "认证状态加载成功, 状态:", result.data);
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:700", "用户尚未提交认证申请");
          merchantData.value = null;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:705", "加载认证状态失败:", error);
        merchantData.value = null;
      }
    };
    const fillFormData = (data) => {
      var _a, _b;
      if (!data)
        return;
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:715", "开始数据回显:", data);
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
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:737", "===== 开始图片回显 =====");
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:738", "服务器返回的img字段:", data.img);
        const imageUrls = data.img.split(",").filter((url) => url.trim());
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:741", "解析后的图片URLs:", imageUrls);
        formData.licenseImages = imageUrls.map((url, index) => {
          const trimmedUrl = url.trim();
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:745", `回显第${index + 1}个图片URL:`, trimmedUrl);
          return {
            url: trimmedUrl,
            path: trimmedUrl,
            name: "营业执照"
          };
        });
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:753", "回显后的formData.licenseImages:", formData.licenseImages);
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:754", "===== 图片回显完成 =====");
      }
      if (data.content) {
        formData.content = data.content || "";
        formData.startTime = data.createTime || "";
        formData.endTime = data.endTime || "";
      }
      formData.covenantId = data.covenantId || null;
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:766", "回显covenantId:", formData.covenantId, "原始数据:", data.covenantId);
      formData.tempId = data.tempId || "";
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:771", "数据回显完成:", formData);
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:772", "isContractSigned:", isContractSigned.value);
    };
    const loadMerchantList = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:778", "开始加载商户列表...");
        const result = await api_apis.apiSelectMerchantList();
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:780", "获取商户列表API返回:", result);
        if (result.code === 200 && result.data) {
          merchantList.value = result.data.map((item, index) => ({
            id: item.id || index,
            // 使用返回的id或索引作为key
            name: item.name
          }));
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:788", "商户列表加载成功，数量:", merchantList.value.length);
        } else {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:790", "获取商户列表失败");
          merchantList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:794", "加载商户列表失败:", error);
        merchantList.value = [];
      }
    };
    const showMerchantList = () => {
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:801", "点击选择按钮");
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:802", "merchantList.value:", merchantList.value);
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
      common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:823", "选择商户:", merchant);
      formData.merchantName = merchant.name;
      closeMerchantList();
    };
    const uploadFileManually = (file, fileIndex = null) => {
      common_vendor.index.uploadFile({
        url: utils_config.uploadUrl,
        filePath: file.tempFilePath || file.path,
        name: "file",
        header: uploadHeaders,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:837", "手动上传成功:", res);
          const response = JSON.parse(res.data);
          if (response.code === 200 && response.url) {
            let targetIndex = fileIndex;
            if (targetIndex === null || targetIndex === void 0) {
              targetIndex = formData.licenseImages.findIndex((f) => {
                return f === file || f.name && file.name && f.name === file.name || f.uuid && file.uuid && f.uuid === file.uuid || f.tempFilePath && file.tempFilePath && f.tempFilePath === file.tempFilePath;
              });
            }
            if (targetIndex !== -1 && targetIndex < formData.licenseImages.length) {
              const oldFile = formData.licenseImages[targetIndex];
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:855", "更新前的文件:", oldFile);
              formData.licenseImages[targetIndex] = {
                ...file,
                url: response.url,
                fileName: response.fileName,
                newFileName: response.newFileName,
                originalFilename: response.originalFilename,
                response
              };
            } else {
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
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:877", "替换最后一个文件后的formData.licenseImages:", formData.licenseImages);
              } else {
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:879", "数组为空，添加新文件");
                formData.licenseImages.push({
                  ...file,
                  url: response.url,
                  fileName: response.fileName,
                  newFileName: response.newFileName,
                  originalFilename: response.originalFilename,
                  response
                });
                common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:888", "添加后的formData.licenseImages:", formData.licenseImages);
              }
            }
            common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:891", "===== 文件上传成功处理完成 =====");
            setTimeout(() => {
              if (formRef.value) {
                formRef.value.validateField("licenseImages");
              }
            }, 100);
          } else {
            common_vendor.index.showToast({
              title: "文件上传失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "文件上传失败",
            icon: "none"
          });
        }
      });
    };
    const onFileSelect = (res) => {
      if (res.tempFiles && res.tempFiles.length > 0) {
        formData.licenseImages = [...formData.licenseImages, ...res.tempFiles];
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:922", "手动更新后formData.licenseImages:", formData.licenseImages);
        const newFileIndex = formData.licenseImages.length - 1;
        uploadFileManually(res.tempFiles[0], newFileIndex);
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.validateField("licenseImages");
          }
        }, 100);
      }
    };
    const openLocationPicker = () => {
      common_vendor.index.chooseLocation({
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:943", "选择位置成功:", res);
          formData.latitude = res.latitude.toString();
          formData.longitude = res.longitude.toString();
          formData.locationName = res.name || res.address || "已选择位置";
          common_vendor.index.showToast({
            title: "位置选择成功",
            icon: "success"
          });
        },
        fail: function(err) {
          common_vendor.index.__f__("error", "at pages/merchant/shCertification.vue:954", "选择位置失败:", err);
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
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:973", "表单验证失败:", error);
        return false;
      }
    };
    const submitAuth = async () => {
      var _a;
      const isValid = await validateForm();
      if (!isValid) {
        return;
      }
      submitting.value = true;
      try {
        let imageUrls = [];
        if (formData.licenseImages && formData.licenseImages.length > 0) {
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:992", "===== 开始处理图片数据 =====");
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:993", "formData.licenseImages:", formData.licenseImages);
          imageUrls = formData.licenseImages.map((file, index) => {
            if (typeof file === "string") {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:999", `使用字符串值:`, file);
              return file;
            } else if (file.url) {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1002", `使用URL:`, file.url);
              return file.url;
            } else if (file.path) {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1005", `使用路径:`, file.path);
              return file.path;
            } else {
              common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1008", `使用原始值:`, file);
              return file;
            }
          });
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1013", "最终图片URLs:", imageUrls);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1014", "===== 图片数据处理完成 =====");
        }
        const submitData = {
          userid: userStore.userId,
          id: ((_a = userStore.merchant) == null ? void 0 : _a.id) || "",
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
          img: imageUrls.join(","),
          // 多张图片用逗号分隔
          tempId: formData.tempId,
          // 合同模板ID
          content: formData.content,
          // 合同内容
          startTime: formData.startTime,
          // 合同开始时间
          endTime: formData.endTime,
          // 合同结束时间
          covenantId: formData.covenantId
          // 合同ID
        };
        common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1038", "提交修改认证数据:", submitData);
        let result;
        if (authStatus.value === "rejected") {
          result = await api_apis.apiPostEditMerchantCheck(submitData);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1045", "修改认证API返回:", result);
          common_vendor.index.showToast({
            title: "修改提交成功",
            icon: "success"
          });
        } else {
          result = await api_apis.apiPostMerchantCheck(submitData);
          common_vendor.index.__f__("log", "at pages/merchant/shCertification.vue:1053", "认证提交API返回:", result);
          common_vendor.index.showToast({
            title: "认证提交成功",
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
        s: isReadOnly.value,
        t: formData.merchantName,
        v: common_vendor.o(($event) => formData.merchantName = $event.detail.value),
        w: !isReadOnly.value
      }, !isReadOnly.value ? {
        x: common_assets._imports_0$1,
        y: common_vendor.o(showMerchantList)
      } : {}, {
        z: common_vendor.p({
          label: "商户名称",
          name: "merchantName",
          required: !isReadOnly.value
        }),
        A: isReadOnly.value,
        B: formData.address,
        C: common_vendor.o(($event) => formData.address = $event.detail.value),
        D: common_vendor.p({
          label: "商户地址",
          name: "address",
          required: !isReadOnly.value
        }),
        E: isReadOnly.value
      }, isReadOnly.value ? {
        F: getSelectedAreaText()
      } : {
        G: common_vendor.w(({
          selectedItems
        }, s0, i0) => {
          return common_vendor.e({
            a: selectedItems.length > 0
          }, selectedItems.length > 0 ? {
            b: common_vendor.t(selectedItems[0].text)
          } : {}, {
            c: i0,
            d: s0
          });
        }, {
          name: "selected",
          path: "G",
          vueId: "edea1fd9-8,edea1fd9-7"
        }),
        H: common_vendor.o(($event) => formData.appcode = $event),
        I: common_vendor.p({
          localdata: appCodeOptions,
          mode: "selector",
          clear: false,
          modelValue: formData.appcode
        })
      }, {
        J: common_vendor.p({
          label: "所属区域",
          name: "appcode",
          required: !isReadOnly.value
        }),
        K: getLocationText()
      }, getLocationText() ? {
        L: common_vendor.t(getLocationText())
      } : {
        M: common_vendor.t(isReadOnly.value ? "点击查看位置" : "点击选择商户位置")
      }, {
        N: common_vendor.o(($event) => isReadOnly.value ? viewLocation() : openLocationPicker()),
        O: common_assets._imports_0$1,
        P: common_vendor.o(($event) => isReadOnly.value ? viewLocation() : openLocationPicker()),
        Q: common_vendor.p({
          label: "商户位置",
          name: "latitude",
          required: !isReadOnly.value
        }),
        R: isReadOnly.value,
        S: formData.contactPerson,
        T: common_vendor.o(($event) => formData.contactPerson = $event.detail.value),
        U: common_vendor.p({
          label: "联系人",
          name: "contactPerson",
          required: !isReadOnly.value
        }),
        V: isReadOnly.value,
        W: formData.contactPhone,
        X: common_vendor.o(($event) => formData.contactPhone = $event.detail.value),
        Y: common_vendor.p({
          label: "联系电话",
          name: "contactPhone",
          required: !isReadOnly.value
        }),
        Z: isReadOnly.value,
        aa: formData.bucketCount,
        ab: common_vendor.o(($event) => formData.bucketCount = $event.detail.value),
        ac: common_vendor.p({
          label: "需要垃圾桶数(个)",
          name: "bucketCount",
          required: !isReadOnly.value
        }),
        ad: isReadOnly.value,
        ae: formData.estimatedWeight,
        af: common_vendor.o(($event) => formData.estimatedWeight = $event.detail.value),
        ag: common_vendor.p({
          label: "预估垃圾重量(kg)",
          name: "estimatedWeight",
          required: !isReadOnly.value
        }),
        ah: common_vendor.o(onFileSelect),
        ai: common_vendor.o(($event) => formData.licenseImages = $event),
        aj: common_vendor.p({
          ["file-mediatype"]: "image",
          mode: "grid",
          limit: 3,
          ["auto-upload"]: false,
          ["upload-url"]: common_vendor.unref(utils_config.uploadUrl),
          header: common_vendor.unref(uploadHeaders),
          readonly: isReadOnly.value,
          ["del-icon"]: !isReadOnly.value,
          ["file-extname"]: "jpg,jpeg,png",
          ["max-size"]: 20971520,
          ["return-type"]: "array",
          modelValue: formData.licenseImages
        }),
        ak: !isReadOnly.value
      }, !isReadOnly.value ? {} : {}, {
        al: common_vendor.p({
          label: "营业执照上传",
          name: "licenseImages",
          required: !isReadOnly.value
        }),
        am: isContractSigned.value
      }, isContractSigned.value ? {} : {
        an: common_vendor.t(contractDisplayText.value),
        ao: common_vendor.n(isReadOnly.value ? "contract-placeholder-readonly" : "contract-placeholder")
      }, {
        ap: common_vendor.o(($event) => goToContract()),
        aq: common_assets._imports_0$1,
        ar: common_vendor.o(($event) => goToContract()),
        as: common_vendor.p({
          label: "电子合同",
          name: "content",
          required: !isReadOnly.value
        }),
        at: common_vendor.sr(formRef, "edea1fd9-4", {
          "k": "formRef"
        }),
        av: common_vendor.p({
          modelValue: formData,
          rules: formRules,
          ["label-position"]: "top"
        }),
        aw: isReadOnly.value ? 1 : "",
        ax: authStatus.value === "none" || authStatus.value === "rejected"
      }, authStatus.value === "none" || authStatus.value === "rejected" ? {
        ay: common_vendor.t(authStatus.value === "rejected" ? "重新提交" : "提交认证"),
        az: common_vendor.o(submitAuth),
        aA: submitting.value
      } : {}, {
        aB: showMerchantPopup.value
      }, showMerchantPopup.value ? common_vendor.e({
        aC: common_vendor.o(closeMerchantList),
        aD: searchKeyword.value,
        aE: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        aF: common_vendor.f(filteredMerchantList.value, (merchant, k0, i0) => {
          return {
            a: common_vendor.t(merchant.name),
            b: merchant.id,
            c: common_vendor.o(($event) => selectMerchant(merchant), merchant.id)
          };
        }),
        aG: filteredMerchantList.value.length === 0
      }, filteredMerchantList.value.length === 0 ? {} : {}, {
        aH: common_vendor.o(() => {
        }),
        aI: common_vendor.o(closeMerchantList)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-edea1fd9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/shCertification.js.map
