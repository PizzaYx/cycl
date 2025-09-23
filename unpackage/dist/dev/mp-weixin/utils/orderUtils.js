"use strict";
function formatWeight(weight) {
  const numValue = weight === null || weight === void 0 ? 0 : parseFloat(weight);
  return `${numValue.toFixed(1)}kg`;
}
function formatNum(num) {
  const numValue = num === null || num === void 0 ? 0 : parseInt(num);
  return `${numValue}个`;
}
exports.formatNum = formatNum;
exports.formatWeight = formatWeight;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/orderUtils.js.map
