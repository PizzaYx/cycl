"use strict";
const common_vendor = require("../../../../common/vendor.js");
function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10);
    const num2 = parseInt(v2[i], 10);
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}
function gte(version) {
  let { SDKVersion } = common_vendor.index.getSystemInfoSync();
  return compareVersion(SDKVersion, version) >= 0;
}
function canIUseCanvas2d() {
  return gte("2.9.0");
}
const wrapEvent = (e) => {
  if (!e)
    return;
  if (!e.preventDefault) {
    e.preventDefault = function() {
    };
  }
  return e;
};
const requestAnimationFrame = (cb) => {
  setTimeout(cb, 30);
};
function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
function getRect(selector, options = {}) {
  const typeDefault = "boundingClientRect";
  const { context, type = typeDefault } = options;
  return new Promise((resolve, reject) => {
    const dom = common_vendor.index.createSelectorQuery().in(context).select(selector);
    const result = (rect) => {
      if (rect) {
        resolve(rect);
      } else {
        reject();
      }
    };
    if (type == typeDefault) {
      dom[type](result).exec();
    } else {
      dom[type]({
        node: true,
        size: true,
        rect: true
      }, result).exec();
    }
  });
}
function isTransparent(color) {
  if (color === "transparent") {
    return true;
  }
  if (color.startsWith("rgba")) {
    const regex = /\d+(\.\d+)?/g;
    const matches = color.match(regex);
    if (matches !== null) {
      const alpha = parseFloat(matches[3]);
      if (alpha === 0) {
        return true;
      }
    }
  }
  return false;
}
exports.canIUseCanvas2d = canIUseCanvas2d;
exports.getRect = getRect;
exports.isTransparent = isTransparent;
exports.requestAnimationFrame = requestAnimationFrame;
exports.sleep = sleep;
exports.wrapEvent = wrapEvent;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-signature/components/l-signature/utils.js.map
