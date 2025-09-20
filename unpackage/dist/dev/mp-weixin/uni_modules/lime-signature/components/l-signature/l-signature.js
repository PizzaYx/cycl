"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeSignature_components_lSignature_utils = require("./utils.js");
const uni_modules_limeSignature_components_lSignature_signature = require("./signature.js");
const uni_modules_limeSignature_components_lSignature_context = require("./context.js");
const uni_modules_limeSignature_components_lSignature_props = require("./props.js");
const _sfc_main = {
  props: uni_modules_limeSignature_components_lSignature_props.props,
  // emits: ['change'],
  data() {
    return {
      canvasWidth: null,
      canvasHeight: null,
      offscreenWidth: null,
      offscreenHeight: null,
      useCanvas2d: true,
      show: true,
      offscreenStyles: "",
      showMask: false,
      showOffscreen: false,
      isPC: false,
      isCanvasEmpty: true
    };
  },
  computed: {
    canvasId() {
      return `lime-signature${this._.uid}`;
    },
    offscreenId() {
      return this.canvasId + "offscreen";
    },
    offscreenSize() {
      const {
        offscreenWidth,
        offscreenHeight
      } = this;
      return this.landscape ? [offscreenHeight, offscreenWidth] : [offscreenWidth, offscreenHeight];
    },
    canvasStyle() {
      const {
        canvasWidth,
        canvasHeight,
        backgroundColor
      } = this;
      return {
        width: canvasWidth && canvasWidth + "px",
        height: canvasHeight && canvasHeight + "px",
        background: backgroundColor
      };
    },
    param() {
      const {
        penColor,
        penSize,
        backgroundColor,
        backgroundImage,
        landscape,
        boundingBox,
        openSmooth,
        minLineWidth,
        maxLineWidth,
        minSpeed,
        maxWidthDiffRate,
        maxHistoryLength,
        disableScroll,
        disabled
      } = this;
      return JSON.parse(JSON.stringify({
        penColor,
        penSize,
        backgroundColor,
        backgroundImage,
        landscape,
        boundingBox,
        openSmooth,
        minLineWidth,
        maxLineWidth,
        minSpeed,
        maxWidthDiffRate,
        maxHistoryLength,
        disableScroll,
        disabled
      }));
    }
  },
  created() {
    const {
      platform
    } = common_vendor.index.getSystemInfoSync();
    this.isPC = /windows|mac/.test(platform);
    this.useCanvas2d = this.type == "2d" && uni_modules_limeSignature_components_lSignature_utils.canIUseCanvas2d() && !this.isPC;
    this.showMask = this.isPC;
  },
  async mounted() {
    if (this.beforeDelay) {
      await uni_modules_limeSignature_components_lSignature_utils.sleep(this.beforeDelay);
    }
    const config = await this.getContext();
    this.signature = new uni_modules_limeSignature_components_lSignature_signature.W(config);
    this.canvasEl = this.signature.canvas.get("el");
    this.offscreenWidth = this.canvasWidth = this.signature.canvas.get("width");
    this.offscreenHeight = this.canvasHeight = this.signature.canvas.get("height");
    this.stopWatch = this.$watch("param", (v) => {
      this.signature.pen.setOption(v);
    }, {
      immediate: true
    });
  },
  beforeUnmount() {
    this.stopWatch && this.stopWatch();
    this.signature.destroy();
    this.signature = null;
    this.show = false;
  },
  methods: {
    checkAndEmitEmptyStatus() {
      setTimeout(() => {
        var _a;
        const isEmpty = ((_a = this.signature) == null ? void 0 : _a.isEmpty()) ?? true;
        if (isEmpty != this.isCanvasEmpty) {
          this.isCanvasEmpty = isEmpty;
          this.$emit("change", isEmpty);
        }
      }, 0);
    },
    redo() {
      if (this.signature) {
        this.signature.redo();
      }
      this.checkAndEmitEmptyStatus();
    },
    restore() {
      this.redo();
    },
    undo() {
      if (this.signature)
        this.signature.undo();
      this.checkAndEmitEmptyStatus();
    },
    clear() {
      if (this.signature)
        this.signature.clear();
      this.checkAndEmitEmptyStatus();
    },
    isEmpty() {
      return this.signature.isEmpty();
    },
    async canvasToMaskPath(param = {}) {
      const isEmpty = this.isEmpty();
      this.showOffscreen = true;
      let width = this.signature.canvas.get("width");
      let height = this.signature.canvas.get("height");
      let pixelRatio = this.pixelRatio || common_vendor.index.getSystemInfoSync().pixelRatio;
      if (this.useCanvas2d) {
        this.offscreenWidth = width * pixelRatio;
        this.offscreenHeight = height * pixelRatio;
      } else {
        this.offscreenWidth = width;
        this.offscreenHeight = height;
      }
      await uni_modules_limeSignature_components_lSignature_utils.sleep(100);
      const context = common_vendor.index.createCanvasContext("offscreen", this);
      const size = Math.max(this.offscreenWidth, this.offscreenHeight);
      const success = (success2) => param.success && param.success(success2);
      const fail = (fail2) => param.fail && param.fail(fail2);
      this.signature.pen.getMaskedImageData((imageData) => {
        let canvasPutImageData = (options, comp) => {
          if (common_vendor.index.canvasPutImageData) {
            common_vendor.index.canvasPutImageData(options, comp);
          } else if (context.putImageData) {
            context.putImageData(options);
          }
        };
        canvasPutImageData({
          canvasId: "offscreen",
          x: 0,
          y: 0,
          width,
          height,
          data: imageData,
          fail(err) {
            fail(err);
          },
          success: (re) => {
            uni_modules_limeSignature_components_lSignature_context.toDataURL("offscreen", this, param).then((res) => {
              context.restore();
              context.clearRect(0, 0, size, size);
              this.offscreenWidth = width;
              this.offscreenHeight = height;
              this.showOffscreen = false;
              success({
                tempFilePath: res,
                isEmpty
              });
            });
          }
        }, this);
      });
    },
    canvasToTempFilePath(param = {}) {
      const isEmpty = this.isEmpty();
      const useCanvas2d = this.useCanvas2d;
      const success = (success2) => param.success && param.success(success2);
      const fail = (err) => param.fail && param.fail(err);
      const {
        canvas
      } = this.signature.canvas.get("el");
      const {
        backgroundColor,
        landscape,
        boundingBox
      } = this;
      let width = this.signature.canvas.get("width");
      let height = this.signature.canvas.get("height");
      let x = 0;
      let y = 0;
      const devtools = common_vendor.index.getSystemInfoSync().platform == "devtools";
      let preferToDataURL = this.preferToDataURL;
      let scale = 1;
      const canvasToTempFilePath = async (image) => {
        const createCanvasContext = () => {
          const useOffscreen = useCanvas2d && !!common_vendor.index.createOffscreenCanvas && preferToDataURL;
          if (useOffscreen && !devtools) {
            const offCanvas = common_vendor.index.createOffscreenCanvas({
              type: "2d"
            });
            offCanvas.width = this.offscreenSize[0] * scale;
            offCanvas.height = this.offscreenSize[1] * scale;
            const context = offCanvas.getContext("2d");
            return [context, offCanvas];
          } else {
            const context = common_vendor.index.createCanvasContext("offscreen", this);
            return [context];
          }
        };
        if (boundingBox && !this.isPC || landscape || backgroundColor && !uni_modules_limeSignature_components_lSignature_utils.isTransparent(
          backgroundColor
        )) {
          this.showOffscreen = true;
          await uni_modules_limeSignature_components_lSignature_utils.sleep(100);
          const [context, offCanvas] = createCanvasContext();
          context.save();
          context.setTransform(1, 0, 0, 1, 0, 0);
          if (landscape) {
            context.translate(0, width * scale);
            context.rotate(-Math.PI / 2);
          }
          if (backgroundColor && !uni_modules_limeSignature_components_lSignature_utils.isTransparent(backgroundColor)) {
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, width, height);
          }
          if (offCanvas) {
            const img = canvas.createImage();
            img.src = image;
            img.onload = () => {
              context.drawImage(img, 0, 0, width * scale, height * scale);
              const tempFilePath = offCanvas.toDataURL();
              this.showOffscreen = false;
              success({
                tempFilePath,
                isEmpty
              });
            };
          } else {
            context.drawImage(image, 0, 0, width * scale, height * scale);
            context.draw(false, () => {
              uni_modules_limeSignature_components_lSignature_context.toDataURL("offscreen", this, param).then((res) => {
                const size = Math.max(width, height);
                context.restore();
                context.clearRect(0, 0, size, size);
                this.showOffscreen = false;
                success({
                  tempFilePath: res,
                  isEmpty
                });
              });
            });
          }
        } else {
          success({
            tempFilePath: image,
            isEmpty
          });
        }
      };
      const next = async () => {
        if (this.offscreenWidth != width || this.offscreenHeight != height) {
          this.offscreenWidth = width;
          this.offscreenHeight = height;
          await uni_modules_limeSignature_components_lSignature_utils.sleep(100);
        }
        const param2 = {
          x,
          y,
          width,
          height,
          canvas: useCanvas2d ? canvas : null,
          preferToDataURL
        };
        uni_modules_limeSignature_components_lSignature_context.toDataURL(this.canvasId, this, param2).then(canvasToTempFilePath).catch(fail);
      };
      if (boundingBox && !this.isPC) {
        this.signature.getContentBoundingBox(async (res) => {
          this.offscreenWidth = width = res.width;
          this.offscreenHeight = height = res.height;
          x = res.startX;
          y = res.startY;
          next();
        });
      } else {
        next();
      }
    },
    getContext() {
      return uni_modules_limeSignature_components_lSignature_utils.getRect(`#${this.canvasId}`, {
        context: this,
        type: this.useCanvas2d ? "fields" : "boundingClientRect"
      }).then((res) => {
        if (res) {
          let {
            width,
            height,
            node: canvas,
            left,
            top,
            right
          } = res;
          let pixelRatio = this.pixelRatio ?? common_vendor.index.getSystemInfoSync().pixelRatio;
          let context;
          if (canvas) {
            context = canvas.getContext("2d");
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
          } else {
            pixelRatio = 1;
            context = uni_modules_limeSignature_components_lSignature_context.uniContext(this.canvasId, this);
            canvas = {
              getContext: (type) => type == "2d" ? context : null,
              createImage: uni_modules_limeSignature_components_lSignature_context.createImage,
              toDataURL: () => uni_modules_limeSignature_components_lSignature_context.toDataURL(this.canvasId, this),
              requestAnimationFrame: uni_modules_limeSignature_components_lSignature_utils.requestAnimationFrame
            };
          }
          context.clearRect(0, 0, width, height);
          return {
            left,
            top,
            right,
            width,
            height,
            context,
            canvas,
            pixelRatio
          };
        }
      });
    },
    getTouch(e) {
      if (this.isPC && this.canvasRect) {
        e.touches = e.touches.map((item) => {
          return {
            ...item,
            x: item.clientX - this.canvasRect.left,
            y: item.clientY - this.canvasRect.top
          };
        });
      }
      return e;
    },
    touchStart(e) {
      if (!this.canvasEl)
        return;
      this.isStart = true;
      if (this.isPC) {
        uni_modules_limeSignature_components_lSignature_utils.getRect(`#${this.canvasId}`, {
          context: this
        }).then((res) => {
          this.canvasRect = res;
          this.canvasEl.dispatchEvent("touchstart", uni_modules_limeSignature_components_lSignature_utils.wrapEvent(this.getTouch(e)));
        });
        return;
      }
      this.canvasEl.dispatchEvent("touchstart", uni_modules_limeSignature_components_lSignature_utils.wrapEvent(e));
    },
    touchMove(e) {
      if (!this.canvasEl || !this.isStart && this.canvasEl)
        return;
      this.canvasEl.dispatchEvent("touchmove", uni_modules_limeSignature_components_lSignature_utils.wrapEvent(this.getTouch(e)));
    },
    touchEnd(e) {
      if (!this.canvasEl)
        return;
      this.isStart = false;
      this.canvasEl.dispatchEvent("touchend", uni_modules_limeSignature_components_lSignature_utils.wrapEvent(e));
      this.checkAndEmitEmptyStatus();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.show
  }, $data.show ? common_vendor.e({
    b: $data.useCanvas2d
  }, $data.useCanvas2d ? {
    c: $options.canvasId,
    d: _ctx.disableScroll,
    e: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    f: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    g: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args))
  } : {
    h: _ctx.disableScroll,
    i: $options.canvasId,
    j: $options.canvasId,
    k: $data.canvasWidth,
    l: $data.canvasHeight,
    m: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    n: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    o: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args)),
    p: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    q: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    r: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args))
  }, {
    s: $data.showOffscreen
  }, $data.showOffscreen ? {
    t: common_vendor.s("width:" + $options.offscreenSize[0] + "px;height:" + $options.offscreenSize[1] + "px"),
    v: $options.offscreenSize[0],
    w: $options.offscreenSize[1]
  } : {}, {
    x: $data.showMask
  }, $data.showMask ? {
    y: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    z: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    A: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args))
  } : {}, {
    B: common_vendor.s($options.canvasStyle),
    C: common_vendor.s(_ctx.styles)
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-signature/components/l-signature/l-signature.js.map
