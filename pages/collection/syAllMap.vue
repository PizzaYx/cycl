<template>
    <view class="container">
        <PageHeader title="收运地图详情" @back="back" />

        <view class="map-container">
            <map id="navigationMap" class="navigation-map" :scale="mapScale" :markers="mapMarkers"
                :polyline="mapPolyline" :show-location="true" :enable-zoom="true" :enable-scroll="true"
                :latitude="mapCenter.latitude" :longitude="mapCenter.longitude"></map>

            <!-- 定位状态提示 -->
            <view class="location-status" v-if="isLocating && isFirstLocation">
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
                </view>

                <view class="divider"></view>

                <view class="driver-details">
                    <view class="detail-item">
                        <text class="label">车牌号：</text>
                        <text class="value">{{ registrationNumber }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">收运总重量：</text>
                        <text class="value">{{ totalEstimateWeight }}kg</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">垃圾桶数：</text>
                        <text class="value">{{ totalBucketNum }}个</text>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { onLoad } from '@dcloudio/uni-app'; // 正确导入onLoad生命周期
import { TIANDITU_CONFIG } from '@/utils/config.js' // 导入天地图配置
import gcoord from 'gcoord' // 导入坐标转换库
import PageHeader from '@/components/PageHeader/PageHeader.vue'
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

// 持续定位相关
const locationTimer = ref(null)
const isContinuousLocation = ref(false)
const isFirstLocation = ref(true) // 标记是否为第一次定位

// 添加一个标志位，表示数据是否已接收
const isDataReceived = ref(false)

// 计算总重量
const totalEstimateWeight = computed(() => {
    return taskList.value.reduce((total, task) => {
        return total + (parseFloat(task.weight) || 0)
    }, 0).toFixed(1)
})

//计算已收垃圾桶数
const totalBucketNum = computed(() => {
    return taskList.value.reduce((total, task) => {
        return total + (parseFloat(task.bucketNum) || 0)
    }, 0)
})


// 使用UniApp定位
const useUniAppLocation = () => {
    console.log('开始定位...')
    isLocating.value = true

    // 先检查定位权限
    checkLocationPermission()
}

// 开始持续定位
const startContinuousLocation = () => {
    console.log('开始持续定位，间隔20秒')
    isContinuousLocation.value = true

    // 立即执行一次定位
    useUniAppLocation()

    // 设置定时器，每20秒定位一次
    locationTimer.value = setInterval(() => {
        if (isContinuousLocation.value) {
            console.log('定时定位触发')
            useUniAppLocation()
        }
    }, 20000) // 20秒 = 20000毫秒
}

// 停止持续定位
const stopContinuousLocation = () => {
    console.log('停止持续定位')
    isContinuousLocation.value = false

    if (locationTimer.value) {
        clearInterval(locationTimer.value)
        locationTimer.value = null
    }
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
            const gcj02Lat = res.latitude
            const gcj02Lng = res.longitude

            console.log('定位成功(GCJ02):', gcj02Lat, gcj02Lng)


            // 更新当前位置
            currentLocation.value = {
                latitude: gcj02Lat,
                longitude: gcj02Lng,
                accuracy: res.accuracy || 100
            }

            // 更新地图中心点
            mapCenter.value.latitude = gcj02Lat
            mapCenter.value.longitude = gcj02Lng


            // 直接执行，不使用nextTick
            setTimeout(() => {
                // 添加当前位置标记
                addCurrentLocationMarker(gcj02Lat, gcj02Lng)

                // 添加任务地点标记
                addTaskMarkers()

                // 绘制路线和规划路径
                planRoute()

                isLocating.value = false

                // 只在第一次定位成功时显示提示
                if (isFirstLocation.value) {
                    uni.showToast({
                        title: '定位成功，路线规划完成',
                        icon: 'success'
                    })
                    isFirstLocation.value = false // 标记第一次定位完成
                } else {
                    console.log('持续定位更新成功，路线已重新规划')
                }
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

        // uni.showToast({
        //     title: '使用默认位置，路线规划完成',
        //     icon: 'none'
        // })
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
        // 使用任务数据中的真实经纬度（天地图CGCS2000坐标系）
        const cgcs2000Lat = parseFloat(task.lat)
        const cgcs2000Lon = parseFloat(task.lon)

        // 验证经纬度是否有效
        if (isNaN(cgcs2000Lat) || isNaN(cgcs2000Lon)) {
            console.warn(`任务 ${task.merchantName} 的经纬度无效:`, task.lat, task.lon)
            return
        }

        // 将天地图CGCS2000坐标转换为腾讯地图GCJ02坐标
        const gcj02Coord = gcoord.transform([cgcs2000Lon, cgcs2000Lat], gcoord.WGS84, gcoord.GCJ02)
        const taskLon = gcj02Coord[0]
        const taskLat = gcj02Coord[1]


        const marker = {
            id: index + 1, // 使用数字ID，从1开始（0已被当前位置使用）
            latitude: taskLat,
            longitude: taskLon,
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


// 使用天地图API进行路线规划
const planRoute = async () => {

    if (mapMarkers.value.length < 1) {
        console.log('标记数量不足，无法进行路线规划')
        return
    }

    try {
        // 起点：当前位置（第一个标记点，ID为0）
        const startPoint = mapMarkers.value.find(marker => marker.id === 0)
        if (!startPoint) {
            console.error('找不到起点（当前位置）')
            return
        }

        // 任务点：除了起点之外的所有点
        const taskPoints = mapMarkers.value.filter(marker => marker.id !== 0)

        if (taskPoints.length === 0) {
            console.log('没有任务点，无法规划路线')
            return
        }

        console.log('开始路线规划 - 任务点数量:', taskPoints.length)

        // 将起始点从GCJ02转换为CGCS2000（天地图API需要统一坐标系）
        const startCgcs2000Coord = gcoord.transform([startPoint.longitude, startPoint.latitude], gcoord.GCJ02, gcoord.WGS84)

        let midCgcs2000Coords = []
        let endCgcs2000Coord = null

        if (taskPoints.length === 1) {
            // 只有1个任务点：从GCJ02转换为CGCS2000
            const taskPoint = taskPoints[0]
            endCgcs2000Coord = gcoord.transform([taskPoint.longitude, taskPoint.latitude], gcoord.GCJ02, gcoord.WGS84)
        } else {
            // 多个任务点：都从GCJ02转换为CGCS2000
            const endPoint = taskPoints[taskPoints.length - 1]
            const midPoints = taskPoints.slice(0, -1)

            endCgcs2000Coord = gcoord.transform([endPoint.longitude, endPoint.latitude], gcoord.GCJ02, gcoord.WGS84)
            midCgcs2000Coords = midPoints.map(point =>
                gcoord.transform([point.longitude, point.latitude], gcoord.GCJ02, gcoord.WGS84)
            )

            console.log('途经点数量:', midPoints.length)
        }

        // 显示路线规划信息
        const routeInfo = taskPoints.length === 1 ?
            `规划直达路线：起点 → ${taskPoints[0].title}` :
            `规划多点路线：起点 → ${taskPoints.slice(0, -1).map(p => p.title).join(' → ')} → ${taskPoints[taskPoints.length - 1].title}`

        console.log(routeInfo)
        // uni.showLoading({
        //     title: '正在规划路线...'
        // })

        // 调用天地图路径规划API
        const routeData = await callTiandituRouteAPI(startCgcs2000Coord, endCgcs2000Coord, midCgcs2000Coords)

        if (routeData && typeof routeData === 'string' && routeData.includes('<result')) {
            // 天地图返回XML格式，需要解析
            parseRouteXML(routeData)
        } else {
            console.log('天地图API返回数据格式异常')
        }
    } catch (error) {
        if (typeof error === 'string' && error.includes('<result')) {
            // API返回了XML数据，但被当作错误处理
            parseRouteXML(error)
        } else {
            console.error('路线规划失败:', error.message || error)
            uni.showToast({
                title: '路线规划失败',
                icon: 'none'
            })
        }
    } finally {
        // 确保关闭加载提示
        uni.hideLoading()
    }
}

// 使用配置文件中的天地图API配置
const { API_KEY: TIANDITU_API_KEY, TIMEOUT } = TIANDITU_CONFIG

// 坐标验证工具
const coordinateValidator = {
    // 检查坐标是否在合理范围内
    isValidCoordinate: (lng, lat) => {
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
    }
}


// 天地图Web API请求函数
const requestTiandituApi = (endpoint, params) => {
    return new Promise((resolve, reject) => {
        const baseUrl = `https://api.tianditu.gov.cn/${endpoint}`

        // 手动构建查询参数字符串（兼容小程序环境）
        const queryPairs = []
        Object.keys(params).forEach(key => {
            queryPairs.push(`${key}=${encodeURIComponent(params[key])}`)
        })
        queryPairs.push(`tk=${TIANDITU_API_KEY}`)

        const fullUrl = `${baseUrl}?${queryPairs.join('&')}`

        uni.request({
            url: fullUrl,
            method: 'GET',
            timeout: TIMEOUT,
            success: (res) => {
                // 小程序环境中，statusCode可能为undefined，但data有值就认为成功
                if (res.data && typeof res.data === 'string' && res.data.includes('<result')) {
                    resolve(res.data)
                } else if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            },
            fail: (error) => {
                console.error('天地图API请求失败:', error)
                reject(error)
            }
        })
    })
}

// 调用天地图路径规划API
const callTiandituRouteAPI = async (startCgcs2000Coord, endCgcs2000Coord, midCgcs2000Coords = []) => {

    // 构建天地图路线规划请求参数（使用CGCS2000坐标）
    const routeParams = {
        orig: `${startCgcs2000Coord[0]},${startCgcs2000Coord[1]}`, // 起点经纬度
        dest: `${endCgcs2000Coord[0]},${endCgcs2000Coord[1]}`,     // 终点经纬度
        style: '0' // 0: 最快路线, 1: 最短路线, 2: 避开高速, 3: 步行
    }

    // 如果有途经点，添加mid参数
    if (midCgcs2000Coords && midCgcs2000Coords.length > 0) {
        // 途经点格式：116.35506,39.92277;116.35506,39.92277
        const midPointsStr = midCgcs2000Coords.map(coord =>
            `${coord[0]},${coord[1]}`
        ).join(';')
        routeParams.mid = midPointsStr
    }

    const params = {
        postStr: JSON.stringify(routeParams),
        type: 'search'
    }


    // 调用天地图路线规划API
    const result = await requestTiandituApi('drive', params)

    return result
}

// 解析天地图返回的XML数据
const parseRouteXML = (xmlData) => {

    try {
        // 提取关键信息：距离、时间、路线坐标

        // 提取距离信息
        const distanceMatch = xmlData.match(/<distance>([^<]+)<\/distance>/)
        let distance = '未知'
        if (distanceMatch) {
            const distanceValue = parseFloat(distanceMatch[1])
            distance = (distanceValue / 1000).toFixed(1) + 'km'
        }

        // 提取时间信息
        const durationMatch = xmlData.match(/<duration>([^<]+)<\/duration>/)
        let duration = '未知'
        if (durationMatch) {
            const durationValue = parseInt(durationMatch[1])
            duration = Math.ceil(durationValue / 60) + '分钟'
        }

        // 提取路线坐标
        const routeLatLonMatch = xmlData.match(/<routelatlon>([^<]+)<\/routelatlon>/)
        if (routeLatLonMatch) {
            const routeCoords = routeLatLonMatch[1]

            // 使用正确的坐标转换方案：WGS84 → GCJ02
            drawCorrectRoute(routeCoords)

            // 计算途经点信息
            const taskPoints = mapMarkers.value.filter(marker => marker.id !== 0)
            const routeType = taskPoints.length === 1 ? '直达路线' : `途经${taskPoints.length - 1}个点的路线`

            // uni.showToast({
            //     title: `${routeType}规划成功\n距离:${distance} 时间:${duration}`,
            //     icon: 'success',
            //     duration: 3000
            // })

        } else {
            throw new Error('未找到路线坐标信息')
        }

    } catch (error) {
        console.error('解析XML数据失败:', error)
    }
}

// 使用正确的坐标转换绘制单条路线
const drawCorrectRoute = (routeCoordsString) => {
    if (!routeCoordsString) {
        console.log('路线坐标字符串为空')
        return
    }

    // 解析原始坐标
    const rawCoords = routeCoordsString.split(';').map(coord => {
        const [lng, lat] = coord.split(',').map(Number)
        if (!coordinateValidator.isValidCoordinate(lng, lat)) {
            return null
        }
        return { lng, lat }
    }).filter(coord => coord !== null)

    if (rawCoords.length === 0) {
        console.error('没有有效的原始坐标')
        return
    }


    // 使用正确的转换方案：WGS84 → GCJ02
    const routeCoords = rawCoords.map(coord => {
        const gcj02Coord = gcoord.transform([coord.lng, coord.lat], gcoord.WGS84, gcoord.GCJ02)
        return { latitude: gcj02Coord[1], longitude: gcj02Coord[0] }
    })

    const polyline = {
        points: routeCoords,
        color: '#07c160',
        width: 4,
        arrowLine: true,
        borderColor: '#ffffff',
        borderWidth: 2
    }

    // 先清空现有路线
    mapPolyline.value = []

    // 强制触发响应式更新
    nextTick(() => {
        mapPolyline.value = [polyline]
        console.log('路线已绘制，坐标点数:', routeCoords.length)
    })
}


// 根据坐标数组绘制路线（保留原函数作为备用）
const drawRouteFromCoordinates = (coordinates) => {
    if (!coordinates || coordinates.length === 0) {
        console.log('坐标数组为空，无法绘制路线')
        return
    }

    // 确保坐标格式正确
    const validCoordinates = coordinates.filter(coord => {
        const isValid = typeof coord.latitude === 'number' &&
            typeof coord.longitude === 'number' &&
            !isNaN(coord.latitude) &&
            !isNaN(coord.longitude)

        if (!isValid) {
            console.warn('无效坐标:', coord)
        }

        return isValid
    })

    if (validCoordinates.length === 0) {
        console.error('没有有效的坐标点')
        return
    }

    const polyline = {
        points: validCoordinates,
        color: '#07c160',
        width: 4,
        arrowLine: true,
        borderColor: '#ffffff',
        borderWidth: 2
    }

    // 先清空现有路线
    mapPolyline.value = []

    // 强制触发响应式更新
    nextTick(() => {
        mapPolyline.value = [polyline]
        console.log('路线已绘制，坐标点数:', validCoordinates.length)
    })
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


    // 等待数据接收完成后再初始化地图
    const waitForDataAndInitMap = () => {
        if (isDataReceived.value) {

            // 🔥 修复：直接使用setTimeout，不用nextTick
            setTimeout(() => {
                // 开始持续定位
                startContinuousLocation()
            }, 500) // 减少延迟时间
        } else {
            // 数据还没接收完成，继续等待
            setTimeout(waitForDataAndInitMap, 100)
        }
    }

    // 开始等待数据
    waitForDataAndInitMap()
})

// 页面卸载时清理定时器
onUnmounted(() => {
    stopContinuousLocation()
})

// 设置地图数据的通用方法
const setMapData = (data) => {
    // 筛选出status == 0的任务数据
    const filteredTaskList = (data.taskList || []).filter(task => task.status == 0)
    taskList.value = filteredTaskList
    driverName.value = data.driverName || ''
    registrationNumber.value = data.registrationNumber || ''
    bucketNum.value = data.bucketNum || 0
    currentDate.value = data.currentDate || ''

}

// 返回上一页
const back = () => {
    // 停止持续定位
    stopContinuousLocation()
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
