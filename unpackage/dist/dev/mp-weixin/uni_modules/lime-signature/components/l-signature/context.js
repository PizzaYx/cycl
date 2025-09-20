"use strict";
const common_vendor = require("../../../../common/vendor.js");
common_vendor.index.getSystemInfoSync().uniPlatform;
const uniContext = (canvasId, context) => {
  let ctx = common_vendor.index.createCanvasContext(canvasId, context);
  if (!ctx.uniDrawImage) {
    ctx.uniDrawImage = ctx.drawImage;
    ctx.drawImage = (image, ...agrs) => {
      ctx.uniDrawImage(image.src, ...agrs);
    };
  }
  if (!ctx.getImageData) {
    ctx.getImageData = (x, y, width, height) => {
      return new Promise((resolve, reject) => {
        if (context.proxy)
          context = context.proxy;
        common_vendor.index.canvasGetImageData({
          canvasId,
          x,
          y,
          width: parseInt(width),
          height: parseInt(height),
          success(res) {
            resolve(res);
          },
          fail(error) {
            reject(error);
          }
        }, context);
      });
    };
  } else {
    ctx._getImageData = ctx.getImageData;
    ctx.getImageData = (x, y, width, height) => {
      return new Promise((resolve, reject) => {
        ctx._getImageData({
          x,
          y,
          width: parseInt(width),
          height: parseInt(height),
          success(res) {
            resolve(res);
          },
          fail(error) {
            reject(error);
          }
        });
      });
    };
  }
  return ctx;
};
class Image {
  constructor() {
    this.currentSrc = null;
    this.naturalHeight = 0;
    this.naturalWidth = 0;
    this.width = 0;
    this.height = 0;
    this.tagName = "IMG";
  }
  onerror() {
  }
  onload() {
  }
  set src(src) {
    this.currentSrc = src;
    common_vendor.index.getImageInfo({
      src,
      success: (res) => {
        this.naturalWidth = this.width = res.width;
        this.naturalHeight = this.height = res.height;
        this.onload();
      },
      fail: () => {
        this.onerror();
      }
    });
  }
  get src() {
    return this.currentSrc;
  }
}
const createImage = () => {
  return new Image();
};
const toDataURL = (canvasId, context, options = {}) => {
  return new Promise((resolve, reject) => {
    let {
      canvas,
      width,
      height,
      destWidth = 0,
      destHeight = 0,
      x = 0,
      y = 0,
      preferToDataURL
    } = options;
    const {
      pixelRatio
    } = common_vendor.index.getSystemInfoSync();
    const params = {
      ...options,
      canvasId,
      id: canvasId,
      canvas,
      success: (res) => {
        resolve(res.tempFilePath || res.filePath);
      },
      fail: (err) => {
        reject(err);
      }
    };
    if (canvas && canvas.toDataURL && preferToDataURL) {
      let next = true;
      common_vendor.index.getSystemInfoSync().platform == "devtools";
      if ((x || y) && next) {
        const offCanvas = common_vendor.index.createOffscreenCanvas({
          type: "2d"
        });
        const ctx = offCanvas.getContext("2d");
        const destWidth2 = Math.floor(width * pixelRatio);
        const destHeight2 = Math.floor(height * pixelRatio);
        offCanvas.width = destWidth2;
        offCanvas.height = destHeight2;
        const image = canvas.createImage();
        image.onload = () => {
          ctx.drawImage(
            image,
            Math.floor(x * pixelRatio),
            Math.floor(y * pixelRatio),
            destWidth2,
            destHeight2,
            0,
            0,
            destWidth2,
            destHeight2
          );
          const tempFilePath = offCanvas.toDataURL();
          resolve(tempFilePath);
          if (params.success) {
            params.success({
              tempFilePath
            });
          }
        };
        image.src = canvas.toDataURL();
      } else {
        const tempFilePath = canvas.toDataURL();
        resolve(tempFilePath);
        if (params.success) {
          params.success({
            tempFilePath
          });
        }
      }
    } else if (canvas && canvas.toTempFilePath) {
      canvas.toTempFilePath(params);
    } else {
      common_vendor.index.canvasToTempFilePath(params, context);
    }
  });
};
exports.createImage = createImage;
exports.toDataURL = toDataURL;
exports.uniContext = uniContext;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-signature/components/l-signature/context.js.map
