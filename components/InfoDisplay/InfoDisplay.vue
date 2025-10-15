<!-- 信息展示组件 -->
<template>
    <view class="info-content" :class="{
        'no-top-border': !showTopBorder,
        'no-bottom-border': !showBottomBorder
    }">
        <view v-for="field in fields" :key="field.key" class="info-item"
            :class="{ 'address-item': field.key === 'address' && enableAddressNavigation }"
            @tap="field.key === 'address' && enableAddressNavigation ? handleAddressClick(field) : null">
            <text class="label">{{ field.label }}:</text>
            <view class="value-container">
                <text class="value">{{ getFieldValue(field) }}</text>
                <uni-icons v-if="field.key === 'address' && enableAddressNavigation" type="location-filled" size="16"
                    color="#07C160" class="location-icon"></uni-icons>
            </view>
        </view>
    </view>
</template>

<script>
/**
 * 信息展示组件
 * 
 * 功能说明：
 * - 统一展示订单相关信息字段
 * - 自动格式化重量和数量字段
 * - 提供统一的样式和布局
 * - 支持动态控制边框显示
 * - 支持地址导航功能（可选）
 * 
 * 使用场景：
 * - 收运端首页订单信息展示
 * - 收运记录页面订单信息展示
 * - 收运统计页面订单信息展示
 * - 商户端详情页面信息展示
 * 
 * 字段格式化规则：
 * - weight/estimateWeight: 使用formatWeight格式化，显示为"X.Xkg"
 * - bucketNum/estimateBucketNum/deliveryCount: 使用formatNum格式化，显示为"X个"
 * - 其他字段: 显示原值或"暂无"
 * 
 * 边框控制：
 * - showTopBorder: true (默认) - 显示上边框
 * - showTopBorder: false - 不显示上边框
 * - showBottomBorder: true (默认) - 显示下边框
 * - showBottomBorder: false - 不显示下边框
 * 
 * 地址导航功能：
 * - enableAddressNavigation: true - 启用地址导航功能
 * - enableAddressNavigation: false (默认) - 不启用地址导航功能
 * 
 * @author 系统
 * @version 1.3.0
 */

import { formatWeight, formatNum } from '@/utils/orderUtils'

export default {
    name: 'InfoDisplay',
    props: {
        /**
         * 字段配置数组
         * @type {Array}
         * @description 每个字段对象包含key、label、value属性
         * @required true
         * @example
         * [
         *   { key: 'appointmentTime', label: '预估时间', value: '2024-01-01 10:00' },
         *   { key: 'estimateWeight', label: '预估重量', value: 12.5 }
         * ]
         */
        fields: {
            type: Array,
            required: true
        },
        /**
         * 是否显示上边框
         * @type {Boolean}
         * @description 控制组件上边框的显示，默认为true
         * @default true
         */
        showTopBorder: {
            type: Boolean,
            default: true
        },
        /**
         * 是否显示下边框
         * @type {Boolean}
         * @description 控制组件下边框的显示，默认为true
         * @default true
         */
        showBottomBorder: {
            type: Boolean,
            default: true
        },
        /**
         * 是否启用地址导航功能
         * @type {Boolean}
         * @description 控制地址字段是否显示定位图标和点击导航功能，默认为false
         * @default false
         */
        enableAddressNavigation: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        /**
         * 获取字段显示值
         * 根据字段类型进行相应的格式化处理
         * 
         * @param {Object} field - 字段对象
         * @param {String} field.key - 字段标识
         * @param {*} field.value - 字段值
         * @returns {String} 格式化后的显示值
         */
        getFieldValue(field) {
            // 根据字段key判断处理方式
            if (field.key === 'weight' || field.key === 'estimateWeight') {
                return formatWeight(field.value)
            } else if (field.key === 'bucketNum' || field.key === 'estimateBucketNum' || field.key === 'deliveryCount') {
                return formatNum(field.value)
            } else {
                // 其他字段显示"暂无"
                return field.value || '暂无'
            }
        },
        /**
         * 处理地址点击事件
         * 显示导航选择弹窗
         * 
         * @param {Object} field - 地址字段对象
         */
        handleAddressClick(field) {
            if (field.key === 'address' && this.enableAddressNavigation) {
                // 获取完整的任务数据，包含经纬度信息
                const taskData = this.getTaskDataFromField(field)
                this.showNavigationActionSheet(field.value, taskData)
            }
        },
        /**
         * 从字段中获取任务数据
         * 这里需要从父组件传递完整的任务数据
         * 
         * @param {Object} field - 字段对象
         * @returns {Object} 任务数据
         */
        getTaskDataFromField(field) {
            // 如果字段有 taskData 属性，直接返回
            if (field.taskData) {
                return field.taskData
            }
            // 否则返回空对象，后续可以通过其他方式获取
            return {}
        },
        /**
         * 显示导航选择操作表
         * 
         * @param {String} address - 地址
         * @param {Object} taskData - 任务数据，包含经纬度信息
         */
        showNavigationActionSheet(address, taskData = {}) {
            // 统一使用 wx.openLocation API 打开地图导航
            this.openLocation(address, taskData)
        },
        /**
         * 打开地图导航（统一使用 wx.openLocation）
         * 
         * @param {String} address - 地址
         * @param {Object} taskData - 任务数据，包含经纬度信息
         */
        openLocation(address, taskData = {}) {
            console.log('打开地图导航，地址:', address, '任务数据:', taskData)

            // 检查是否有经纬度信息
            if (taskData.lat && taskData.lon) {
                const lat = parseFloat(taskData.lat)
                const lon = parseFloat(taskData.lon)
                console.log('使用经纬度导航:', lat, lon)

                // 使用 wx.openLocation 打开地图
                wx.openLocation({
                    latitude: lat,
                    longitude: lon,
                    name: taskData.merchantName || '目标位置',
                    address: address,
                    scale: 18
                })
            } else {
                console.log('没有经纬度信息，无法导航')
                uni.showToast({
                    title: '地址信息不完整，无法导航',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.info-content {
    padding: 20rpx 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;

    // 无上边框样式
    &.no-top-border {
        border-top: none;
    }

    // 无下边框样式
    &.no-bottom-border {
        border-bottom: none;
    }

    .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .label {
            font-size: 26rpx;
            color: rgba(61, 61, 61, 0.50);
            width: 180rpx;
            flex-shrink: 0;
            line-height: 1.2;
        }

        .value-container {
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
        }

        .value {
            font-size: 26rpx;
            color: rgba(61, 61, 61, 1);
            flex: 1;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 0;
        }

        .location-icon {
            margin-left: 6rpx;
            flex-shrink: 0;
        }

        &.address-item {
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            &:active {
                background-color: transparent !important;
                -webkit-tap-highlight-color: transparent !important;
            }
        }
    }
}
</style>