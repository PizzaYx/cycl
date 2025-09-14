<template>
    <view class="container">
        <uni-nav-bar dark :fixed="true" background-color="#fff" status-bar left-icon="left" color="#000" title="收运地图详情"
            @clickLeft="back" />

        <view class="map-container">
            <map id="navigationMap" class="navigation-map" :scale="mapScale" :markers="mapMarkers"
                :polyline="mapPolyline" :show-location="true" :enable-zoom="true" :enable-scroll="true"
                :latitude="mapCenter.latitude" :longitude="mapCenter.longitude"></map>

            <!-- 定位状态提示 -->
            <view class="location-status" v-if="isLocating">
                <uni-icons type="spinner-cycle" size="20" color="#07C160"></uni-icons>
                <text class="status-text">正在定位和规划路线...</text>
            </view>
        </view>

        <view class="bottom-section">
            <view class="driver-info-card">
                <view class="info-item">
                    <view class="avatar">
                        <view class="avatar-text">{{ userStore.userSFAvatar }}</view>
                    </view>
                    <view class="name-info">
                        <text class="label">司机姓名：</text>
                        <text class="value">{{ driverName }}</text>
                    </view>
                    <uni-icons type="location" size="16" color="#00B578"></uni-icons>
                </view>

                <view class="divider"></view>

                <view class="driver-details">
                    <view class="detail-item">
                        <text class="label">车牌号：</text>
                        <text class="value">{{ registrationNumber }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">预估总重量：</text>
                        <text class="value">{{ totalEstimateWeight }}kg</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">垃圾桶数：</text>
                        <text class="value">{{ bucketNum }}个</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">收运日期：</text>
                        <text class="value">{{ currentDate }}</text>
                    </view>
                </view>
            </view>

        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
const userStore = useUserStore()

// 地图相关数据
const mapScale = ref(14) // 提高缩放级别，更清楚显示当前位置
const mapMarkers = ref([])
const mapPolyline = ref([])
const mapCenter = ref({
    latitude: 30.6586, // 成都市中心坐标
    longitude: 104.0647
})

// 接收的参数数据
const taskList = ref([])
const driverName = ref('')
const registrationNumber = ref('')
const bucketNum = ref(0)
const currentDate = ref('')

// 定位相关状态
const isLocating = ref(false)
const currentLocation = ref({
    latitude: 0,
    longitude: 0,
    accuracy: 0
})

// 添加一个标志位，表示数据是否已接收
const isDataReceived = ref(false)

// 计算总预估重量
const totalEstimateWeight = computed(() => {
    return taskList.value.reduce((total, task) => {
        return total + (parseFloat(task.estimateWeight) || 0)
    }, 0).toFixed(1)
})


// 使用UniApp定位
const useUniAppLocation = () => {
    console.log('开始定位...')
    isLocating.value = true

    // 先检查定位权限
    checkLocationPermission()
}

// 检查定位权限
const checkLocationPermission = () => {
    uni.getSetting({
        success: (res) => {
            console.log('获取权限设置:', res.authSetting)

            if (res.authSetting['scope.userLocation'] === false) {
                // 用户拒绝过定位权限，需要引导用户手动开启
                uni.showModal({
                    title: '定位权限',
                    content: '需要获取您的地理位置，请前往设置页面开启定位权限',
                    showCancel: true,
                    confirmText: '去设置',
                    success: (modalRes) => {
                        if (modalRes.confirm) {
                            uni.openSetting({
                                success: (settingRes) => {
                                    if (settingRes.authSetting['scope.userLocation']) {
                                        // 用户开启了权限，重新定位
                                        startUniAppLocation()
                                    } else {
                                        isLocating.value = false
                                    }
                                }
                            })
                        } else {
                            isLocating.value = false
                        }
                    }
                })
            } else {
                // 权限正常或未设置，直接定位
                startUniAppLocation()
            }
        },
        fail: () => {
            // 获取设置失败，直接尝试定位
            startUniAppLocation()
        }
    })
}

// 开始UniApp定位
const startUniAppLocation = () => {
    uni.getLocation({
        type: 'gcj02', // 直接获取GCJ02坐标系的位置
        altitude: false, // 不需要高度信息
        success: (res) => {
            const lat = res.latitude
            const lng = res.longitude

            console.log('定位成功(GCJ02):', lat, lng)

            // 更新当前位置
            currentLocation.value = {
                latitude: lat,
                longitude: lng,
                accuracy: res.accuracy || 100
            }

            // 更新地图中心点
            mapCenter.value.latitude = lat
            mapCenter.value.longitude = lng

            console.log('地图中心点已更新为:', lat, lng)

            // 直接执行，不使用nextTick
            setTimeout(() => {
                // 添加当前位置标记
                addCurrentLocationMarker(lat, lng)

                // 添加任务地点标记
                addTaskMarkers()

                // 绘制路线和规划路径
                planRoute()

                isLocating.value = false

                uni.showToast({
                    title: '定位成功，路线规划完成',
                    icon: 'success'
                })
            }, 100)
        },
        fail: (error) => {
            console.error('定位失败:', error)
            isLocating.value = false

            // 根据错误类型给出不同提示
            let errorMsg = '定位失败'
            if (error.errMsg) {
                if (error.errMsg.includes('auth deny')) {
                    errorMsg = '定位权限被拒绝，请开启定位权限'
                } else if (error.errMsg.includes('location fail')) {
                    errorMsg = '定位服务不可用，请检查手机定位设置'
                } else {
                    errorMsg = '定位失败：' + error.errMsg
                }
            }

            uni.showModal({
                title: '定位失败',
                content: errorMsg,
                showCancel: true,
                confirmText: '重试',
                cancelText: '取消',
                success: (modalRes) => {
                    if (modalRes.confirm) {
                        // 用户选择重试
                        setTimeout(() => {
                            useUniAppLocation()
                        }, 1000)
                    } else {
                        // 使用默认位置（成都市中心）
                        useDefaultLocation()
                    }
                }
            })
        }
    })
}

// 使用默认位置
const useDefaultLocation = () => {
    console.log('使用默认位置（成都市中心）')
    const defaultLat = 30.6586
    const defaultLng = 104.0647

    currentLocation.value = {
        latitude: defaultLat,
        longitude: defaultLng,
        accuracy: 1000
    }

    mapCenter.value.latitude = defaultLat
    mapCenter.value.longitude = defaultLng

    console.log('地图中心点已更新为默认位置:', defaultLat, defaultLng)

    // 直接执行，不使用nextTick
    setTimeout(() => {
        // 添加默认位置标记
        addCurrentLocationMarker(defaultLat, defaultLng)

        // 添加任务地点标记
        addTaskMarkers()

        // 绘制路线和规划路径
        planRoute()

        uni.showToast({
            title: '使用默认位置，路线规划完成',
            icon: 'none'
        })
    }, 100)
}

// 添加当前位置标记
const addCurrentLocationMarker = (lat, lng) => {
    const marker = {
        id: 0, // 使用数字ID
        latitude: lat,
        longitude: lng,
        title: '当前位置',
        iconPath: '/static/ssd/positioning.png',
        width: 30,
        height: 30,
        callout: {
            content: '当前位置',
            color: '#000000',
            fontSize: 12,
            borderRadius: 5,
            bgColor: '#ffffff',
            padding: 5,
            display: 'ALWAYS'
        }
    }

    mapMarkers.value = [marker] // 先清空再添加
}

// 添加任务地点标记
const addTaskMarkers = () => {
    taskList.value.forEach((task, index) => {
        // 这里需要根据实际的地址获取经纬度，暂时使用示例坐标
        // 实际项目中应该调用地理编码API或者任务数据中包含经纬度信息
        const marker = {
            id: index + 1, // 使用数字ID，从1开始（0已被当前位置使用）
            latitude: currentLocation.value.latitude + (index * 0.01), // 基于当前位置的示例坐标偏移
            longitude: currentLocation.value.longitude + (index * 0.01),
            title: task.merchantName,
            iconPath: '/static/ssd/positioning.png',
            width: 25,
            height: 25,
            callout: {
                content: task.merchantName,
                color: '#000000',
                fontSize: 12,
                borderRadius: 5,
                bgColor: '#ffffff',
                padding: 5,
                display: 'ALWAYS'
            }
        }

        mapMarkers.value.push(marker)
    })
}

// 绘制路线
const drawRoute = () => {
    if (mapMarkers.value.length < 2) {
        console.log('标记数量不足，无法绘制路线')
        return
    }

    // 构建路线点（从当前位置到各个任务点）
    const points = mapMarkers.value.map(marker => ({
        latitude: marker.latitude,
        longitude: marker.longitude
    }))

    // 创建路线
    const polyline = {
        points: points,
        color: '#07c160',
        width: 4,
        arrowLine: true
    }

    mapPolyline.value = [polyline]
    console.log('路线已绘制:', mapPolyline.value)
}

// 简化的路线规划（不使用天地图API）
const planRoute = () => {
    console.log('开始路线规划...')

    if (mapMarkers.value.length < 2) {
        console.log('标记数量不足，无法绘制路线')
        return
    }

    // 直接绘制简单路线，连接所有标记点
    drawRoute()
    console.log('路线规划完成')
}

// onLoad: 简单直接的接收参数方式
onLoad(() => {
    console.log('页面加载，接收参数')

    // 直接从存储获取数据，简单可靠
    const mapData = uni.getStorageSync('mapData')
    if (mapData) {
        console.log('获取地图数据:', mapData)
        setMapData(mapData)
        isDataReceived.value = true
        // 清理存储数据
        uni.removeStorageSync('mapData')
    } else {
        console.log('暂无数据，等待传递')
    }
})

// onMounted: 专门负责初始化地图 - 修复nextTick问题
onMounted(() => {
    console.log('DOM已挂载完成，等待数据后初始化地图')

    // 等待数据接收完成后再初始化地图
    const waitForDataAndInitMap = () => {
        if (isDataReceived.value) {
            console.log('数据已接收，开始初始化地图')
            // 🔥 修复：直接使用setTimeout，不用nextTick
            setTimeout(() => {
                useUniAppLocation()
            }, 500) // 减少延迟时间
        } else {
            // 数据还没接收完成，继续等待
            setTimeout(waitForDataAndInitMap, 100)
        }
    }

    // 开始等待数据
    waitForDataAndInitMap()
})

// 设置地图数据的通用方法
const setMapData = (data) => {
    taskList.value = data.taskList || []
    driverName.value = data.driverName || ''
    registrationNumber.value = data.registrationNumber || ''
    bucketNum.value = data.bucketNum || 0
    currentDate.value = data.currentDate || ''

    console.log('数据设置完成')
}

// 返回上一页
const back = () => {
    uni.navigateBack()
}

</script>

<style lang="scss" scoped>
.container {
    background-color: $bg-theme-color;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;


    .map-container {
        height: 1000rpx; // 给地图固定高度
        position: relative;

        .navigation-map {
            width: 100%;
            height: 100%;
        }

        .location-status {
            position: absolute;
            top: 30rpx;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 50rpx;
            padding: 20rpx 30rpx;
            display: flex;
            align-items: center;
            gap: 15rpx;
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
            z-index: 999;
            border: 2rpx solid #07C160;

            .status-text {
                color: #07C160;
                font-size: 28rpx;
                font-weight: 500;
            }
        }
    }

    .bottom-section {
        padding: 30rpx;
        background-color: $bg-theme-color;

        .driver-info-card {
            background: #FFFFFF;
            border-radius: 16rpx;
            padding: 30rpx;
            margin-bottom: 20rpx;

            .info-item {
                display: flex;
                align-items: center;
                gap: 20rpx;
                margin-bottom: 20rpx;

                .avatar {
                    width: 60rpx;
                    height: 60rpx;
                    border-radius: 50%;
                    background-color: #07C160;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .avatar-text {
                        color: white;
                        font-size: 24rpx;
                        font-weight: 500;
                    }
                }

                .name-info {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10rpx;

                    .label {
                        color: rgba(61, 61, 61, 0.50);
                        font-size: 28rpx;
                    }

                    .value {
                        color: rgba(61, 61, 61, 1);
                        font-size: 28rpx;
                        font-weight: 500;
                    }
                }
            }

            .divider {
                height: 2rpx;
                background-color: #f0f0f0;
                margin: 20rpx 0;
            }

            .driver-details {
                display: flex;
                flex-direction: column;
                gap: 20rpx;

                .detail-item {
                    display: flex;
                    align-items: center;

                    .label {
                        color: rgba(61, 61, 61, 0.50);
                        font-size: 28rpx;
                        min-width: 180rpx;
                    }

                    .value {
                        color: rgba(61, 61, 61, 1);
                        font-size: 28rpx;
                    }
                }
            }
        }

    }
}


body {
    background-color: #F5F5F5;
}
</style>
