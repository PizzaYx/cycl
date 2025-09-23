/**
 * 订单显示工具函数
 */

/**
 * 格式化重量显示
 * @param {number|string|null|undefined} weight - 重量值
 * @returns {string} 重量显示文本，如 "12.5kg" 或 "0.0kg"
 */
export function formatWeight(weight) {
    const numValue = weight === null || weight === undefined ? 0 : parseFloat(weight)
    return `${numValue.toFixed(1)}kg`
}

/**
 * 格式化数量显示
 * @param {number|string|null|undefined} num - 数量值
 * @returns {string} 数量显示文本，如 "5个" 或 "0个"
 */
export function formatNum(num) {
    const numValue = num === null || num === undefined ? 0 : parseInt(num)
    return `${numValue}个`
}

/**
 * 获取时间显示
 * @param {Object} item - 订单项
 * @returns {string} 时间显示文本
 */
export function getTime(item) {
    return item.status === 1 ? item.arrivalTime : item.appointmentTime
}
