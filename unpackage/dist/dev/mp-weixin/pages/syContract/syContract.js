"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_mp_html2 = common_vendor.resolveComponent("mp-html");
  (_easycom_uni_nav_bar2 + _easycom_mp_html2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_mp_html = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_mp_html)();
}
const _sfc_main = {
  __name: "syContract",
  setup(__props) {
    const contractId = common_vendor.ref("");
    const contractData = common_vendor.ref({});
    const signatures = common_vendor.ref({
      partyB: ""
      // 乙方签名
    });
    const contractContent = common_vendor.ref(`
<div style="font-size: 16px; line-height: 1.8; color: #333; padding: 20px;">
    <h2 style="text-align: center; margin-bottom: 30px; color: #333;">垃圾收运服务合同</h2>
    
    <p><strong>甲方（商户）：</strong>________________</p>
    <p><strong>乙方（收运方）：</strong>________________</p>
    
    <p style="margin: 20px 0;">根据《中华人民共和国合同法》及相关法律法规，甲乙双方在平等、自愿、协商一致的基础上，就垃圾收运服务事宜达成如下协议：</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第一条 服务内容</h3>
    <p>乙方为甲方提供垃圾收运服务，包括但不限于：</p>
    <ol style="margin: 10px 0; padding-left: 20px;">
        <li>定期上门收集生活垃圾；</li>
        <li>按照环保要求进行分类处理；</li>
        <li>提供收运服务相关证明文件。</li>
    </ol>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第二条 服务时间</h3>
    <p>服务时间：每周一、三、五上午8:00-12:00</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第三条 费用标准</h3>
    <p>服务费用：每月500元，按季度结算。</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第四条 双方权利义务</h3>
    <p><strong>甲方权利：</strong></p>
    <ol style="margin: 10px 0; padding-left: 20px;">
        <li>要求乙方按时提供收运服务；</li>
        <li>对服务质量进行监督。</li>
    </ol>
    
    <p><strong>甲方义务：</strong></p>
    <ol style="margin: 10px 0; padding-left: 20px;">
        <li>按时支付服务费用；</li>
        <li>配合乙方收运工作。</li>
    </ol>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第五条 违约责任</h3>
    <p>任何一方违反本合同约定，应承担相应的违约责任。</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第六条 合同期限</h3>
    <p>本合同自双方签字盖章之日起生效，有效期为一年。</p>
    
    <h3 style="color: #333; margin: 20px 0 10px 0;">第七条 争议解决</h3>
    <p>因本合同引起的争议，双方应友好协商解决；协商不成的，可向有管辖权的人民法院起诉。</p>
    
    <div style="margin-top: 40px;">
        <p><strong>乙方（签字）：</strong><span id="signature-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-block; margin-left: 10px;">点击签名</span></p>
        <p><strong>日期：</strong>________________</p>
    </div>
</div>
`);
    const canSubmit = common_vendor.computed(() => {
      return signatures.value.partyB;
    });
    common_vendor.onLoad((options) => {
      contractId.value = options.id || "";
      loadContractData();
      loadSignatures();
    });
    const loadContractData = async () => {
      try {
        contractData.value = {
          title: "垃圾收运服务合同",
          date: "2024年1月1日",
          content: contractContent.value
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:126", "加载合同数据失败:", error);
        common_vendor.index.showToast({
          title: "加载合同失败",
          icon: "none"
        });
      }
    };
    const loadSignatures = () => {
      signatures.value = {
        partyB: ""
      };
    };
    const updateContractWithSignature = () => {
      if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 150px; max-height: 40px; border-radius: 4px; vertical-align: middle;" alt="乙方签名" />`;
        contractContent.value = contractContent.value.replace(
          '<span id="signature-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-block; margin-left: 10px;">点击签名</span>',
          signatureHtml
        );
      }
    };
    const onRichTextTap = (e) => {
      common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:155", "富文本点击事件触发:", e);
      goToSignature();
    };
    const goToSignature = () => {
      common_vendor.index.navigateTo({
        url: `/pages/syContract/shSignature?contractId=${contractId.value}`
      });
    };
    const goToPreview = () => {
      let content = contractContent.value;
      if (signatures.value.partyB) {
        const signatureHtml = `<img src="${signatures.value.partyB}" style="max-width: 150px; max-height: 40px; border-radius: 4px; vertical-align: middle;" alt="乙方签名" />`;
        content = content.replace(
          '<span id="signature-btn" style="padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; display: inline-block; margin-left: 10px;">点击签名</span>',
          signatureHtml
        );
      }
      common_vendor.index.navigateTo({
        url: `/pages/syContract/syPreview?content=${encodeURIComponent(content)}&title=${encodeURIComponent(contractData.value.title || "垃圾收运服务合同")}`
      });
    };
    const submitContract = () => {
      if (!canSubmit.value) {
        common_vendor.index.showToast({
          title: "请先完成签名",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认提交",
        content: "确定要提交合同吗？提交后将无法修改。",
        success: (res) => {
          if (res.confirm) {
            submitContractToServer();
          }
        }
      });
    };
    const submitContractToServer = async () => {
      try {
        common_vendor.index.showLoading({
          title: "提交中..."
        });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          common_vendor.index.createSelectorQuery().select(".contract-body").fields({
            node: true,
            size: true,
            rect: true
          }).exec(async (res) => {
            if (res[0]) {
              try {
                common_vendor.index.createSelectorQuery().select(".contract-body").boundingClientRect().exec(async (rectRes) => {
                  if (rectRes[0]) {
                    const ctx = common_vendor.index.createCanvasContext("contractCanvas");
                    const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
                    const width = 750 * dpr;
                    const height = 2e3 * dpr;
                    ctx.setFillStyle("#ffffff");
                    ctx.fillRect(0, 0, width, height);
                    ctx.setFillStyle("#333333");
                    ctx.setFontSize(16 * dpr);
                    ctx.setTextAlign("left");
                    ctx.setFontSize(20 * dpr);
                    ctx.fillText("垃圾收运服务合同", 20 * dpr, 50 * dpr);
                    ctx.setFontSize(14 * dpr);
                    const contractText = contractContent.value.replace(/<[^>]*>/g, "");
                    const lines = contractText.split("\n");
                    let y = 100 * dpr;
                    const lineHeight = 25 * dpr;
                    const maxWidth = width - 40 * dpr;
                    lines.forEach((line) => {
                      if (line.trim()) {
                        const words = line.trim().split("");
                        let currentLine = "";
                        let currentY = y;
                        words.forEach((char) => {
                          currentLine += char;
                          if (currentLine.length > 50) {
                            ctx.fillText(currentLine, 20 * dpr, currentY);
                            currentLine = "";
                            currentY += lineHeight;
                          }
                        });
                        if (currentLine) {
                          ctx.fillText(currentLine, 20 * dpr, currentY);
                          currentY += lineHeight;
                        }
                        y = currentY + 10 * dpr;
                      }
                    });
                    if (signatures.value.partyB) {
                      ctx.drawImage(signatures.value.partyB, 20 * dpr, y, 200 * dpr, 80 * dpr);
                    }
                    ctx.draw(false, () => {
                      common_vendor.index.canvasToTempFilePath({
                        canvasId: "contractCanvas",
                        success: async (canvasRes) => {
                          try {
                            await common_vendor.index.saveImageToPhotosAlbum({
                              filePath: canvasRes.tempFilePath,
                              success: () => {
                                common_vendor.index.__f__("log", "at pages/syContract/syContract.vue:305", "合同图片已保存到相册");
                                common_vendor.index.showToast({
                                  title: "合同图片已保存",
                                  icon: "success"
                                });
                              },
                              fail: (error) => {
                                common_vendor.index.__f__("warn", "at pages/syContract/syContract.vue:312", "保存合同图片到相册失败:", error);
                                common_vendor.index.showToast({
                                  title: "保存失败",
                                  icon: "none"
                                });
                              }
                            });
                          } catch (error) {
                            common_vendor.index.__f__("warn", "at pages/syContract/syContract.vue:320", "保存合同图片失败:", error);
                          }
                        },
                        fail: (error) => {
                          common_vendor.index.__f__("warn", "at pages/syContract/syContract.vue:324", "生成合同图片失败:", error);
                          common_vendor.index.showToast({
                            title: "生成图片失败",
                            icon: "none"
                          });
                        }
                      });
                    });
                  }
                });
              } catch (error) {
                common_vendor.index.__f__("warn", "at pages/syContract/syContract.vue:335", "生成合同图片失败:", error);
              }
            }
          });
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/syContract/syContract.vue:340", "保存合同失败:", error);
        }
        setTimeout(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "合同提交成功",
            icon: "success"
          });
          signatures.value = {
            partyB: ""
          };
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }, 2e3);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/syContract/syContract.vue:364", "提交合同失败:", error);
        common_vendor.index.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
      }
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$on("signatureUpdated", (signatureData) => {
        signatures.value = signatureData;
        updateContractWithSignature();
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "合同详情"
        }),
        c: common_vendor.t(contractData.value.title || "垃圾收运服务合同"),
        d: common_vendor.t(contractData.value.date || "2024年1月1日"),
        e: common_vendor.o(onRichTextTap),
        f: common_vendor.p({
          content: contractContent.value
        }),
        g: common_vendor.t(signatures.value.partyB ? "修改签名" : "签名"),
        h: common_vendor.o(goToSignature),
        i: common_vendor.o(goToPreview),
        j: !canSubmit.value,
        k: common_vendor.o(submitContract)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-607e301a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/syContract.js.map
