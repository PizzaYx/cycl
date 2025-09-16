<template>
  <view class="navigation-container">
    <!-- 头部 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">路线导航</text>
      <view class="header-actions">
        <view class="action-btn" @click="refreshRoute">
          <text class="action-icon">🔄</text>
        </view>
        <view class="action-btn" @click="toggleWorkOrders">
          <text class="action-icon">📋</text>
        </view>
      </view>
    </view>

    <!-- 路线信息卡片 -->
    <view class="route-info-card">
      <view class="route-summary">
        <view class="route-item">
          <text class="route-label">起点</text>
          <text class="route-value">{{ routeInfo.startPoint }}</text>
        </view>
        <view class="route-item">
          <text class="route-label">终点</text>
          <text class="route-value">{{ routeInfo.endPoint }}</text>
        </view>
        <view class="route-item">
          <text class="route-label">距离</text>
          <text class="route-value">{{ routeInfo.distance }}</text>
        </view>
        <view class="route-item">
          <text class="route-label">预计时间</text>
          <text class="route-value">{{ routeInfo.estimatedTime }}</text>
        </view>
      </view>
      <view class="route-actions">
        <button class="start-nav-btn" @click="startNavigation" :disabled="!canStartNav">
          开始导航
        </button>
        <button class="route-plan-btn" @click="planRoute" :disabled="mapMarkers.length < 2">
          路线规划
        </button>

      </view>
    </view>

    <!-- 地图容器 -->
    <view class="map-container">
      <!-- Uxian -->
      <map
        id="navigationMap"
        class="navigation-map"
        :latitude="mapCenter.latitude"
        :longitude="mapCenter.longitude"
        :scale="mapScale"
        :markers="mapMarkers"
        :polyline="mapPolyline"
        :show-location="true"
        :enable-zoom="true"
        :enable-scroll="true"
        @markertap="onMarkerTap"
        @regionchange="onRegionChange"
        @callouttap="onCalloutTap"
        @tap="onMapTap"
      ></map>
      
      <!-- 地图控制按钮 -->
      <view class="map-controls">
        <view class="control-btn" @click="zoomIn">
          <text class="control-icon">+</text>
        </view>
        <view class="control-btn" @click="zoomOut">
          <text class="control-icon">-</text>
        </view>
        <view class="control-btn" @click="locateMe">
          <text class="control-icon">📍</text>
        </view>
        <view class="control-btn" @click="clearRoute">
          <text class="control-icon">🗑️</text>
        </view>
        <view class="control-btn" @click="toggleLocationWatching" :class="{ active: isLocationWatching }">
          <text class="control-icon">{{ isLocationWatching ? '📍' : '⭕' }}</text>
        </view>
      </view>
    </view>

    <!-- 路线详情 -->
    <view class="route-details" v-if="showRouteDetails">
      <view class="details-header">
        <text class="details-title">路线详情</text>
        <view class="close-btn" @click="hideRouteDetails">
          <text class="close-icon">×</text>
        </view>
      </view>
      <scroll-view class="details-content" scroll-y>
        <view 
          v-for="(step, index) in routeSteps" 
          :key="index" 
          class="route-step"
          :class="{ active: index === currentStepIndex }"
        >
          <view class="step-number">{{ index + 1 }}</view>
          <view class="step-content">
            <text class="step-instruction">{{ step.instruction }}</text>
            <text class="step-distance">{{ step.distance }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 工单列表 -->
    <view class="work-orders-panel" v-if="showWorkOrders">
      <view class="panel-header">
        <text class="panel-title">今日工单</text>
        <view class="close-btn" @click="hideWorkOrders">
          <text class="close-icon">×</text>
        </view>
      </view>
      <scroll-view class="panel-content" scroll-y>
        <view 
          v-for="order in todayWorkOrders" 
          :key="order.id" 
          class="work-order-item"
          @click="selectWorkOrder(order)"
        >
          <view class="order-info">
            <text class="order-name">{{ order.merchantName }}</text>
            <text class="order-address">{{ order.address }}</text>
            <text class="order-time">{{ order.appointmentTime }}</text>
          </view>
          <view class="order-status" :class="order.status">
            <text class="status-text">{{ getStatusText(order.status) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 导航状态栏 -->
    <view class="navigation-status" v-if="isNavigating">
      <view class="status-content">
        <text class="status-text">正在导航中...</text>
        <text class="next-instruction">{{ nextInstruction }}</text>
      </view>
      <button class="stop-nav-btn" @click="stopNavigation">
        结束导航
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gcoord from 'gcoord'

// 天地图Web API类型声明
declare global {
  interface Window {
    T: any
  }
}

// 地图相关
const mapCenter = reactive({
  latitude: 30.5728, // 设置成都市中心作为默认中心点，避免显示在非洲
  longitude: 104.0668
})



// 天地图Web API配置
const TIANDITU_KEY = '1fea78f710be3a88282ab14019dd34c7'

// 地图事件处理
const onCalloutTap = (e: any) => {
  console.log('地图标注点击:', e)
}

const onMapTap = (e: any) => {
  console.log('地图点击:', e)
}



// 定位相关
const currentLocation = reactive({
  latitude: 0,
  longitude: 0,
  address: '',
  accuracy: 0
})
const isLocating = ref(false)

// 持续性定位相关
const isLocationWatching = ref(false)
const locationUpdateInterval = ref<number | null>(null)

const mapScale = ref(14)
const mapMarkers = ref<any[]>([])
const mapPolyline = ref<any[]>([])



// 坐标验证工具
const coordinateValidator = {
  // 检查坐标是否在合理范围内
  isValidCoordinate: (lng: number, lat: number) => {
    return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
  }
}



// 路线信息
const routeInfo = reactive({
  startPoint: '当前位置',
  endPoint: '成都欢乐谷',
  distance: '2.5km',
  estimatedTime: '8分钟'
})

// 路线步骤
const routeSteps = ref([
  { instruction: '正在规划路线...', distance: '0m' }
])

const currentStepIndex = ref(0)
const showRouteDetails = ref(false)
const showWorkOrders = ref(false)



// 导航状态
const isNavigating = ref(false)
const nextInstruction = ref('正在规划路线...')

// 工单数据
const todayWorkOrders = ref([
  {
    id: 1,
    merchantName: '川味小厨（总店）',
    address: '成都市锦江区春熙路123号',
    appointmentTime: '14:30-15:30',
    status: 'pending'
  }
])

// 页面加载完成
onMounted(() => {
  console.log('路线导航页面加载完成')
  initMap()
  loadRouteData()
})

// 页面卸载
onUnmounted(() => {
  // 清理导航相关资源
  if (isNavigating.value) {
    stopNavigation()
  }
  
  // 停止持续性定位
  stopLocationWatching()
})

// 初始化地图
const initMap = () => {
  console.log('初始化腾讯地图')
  console.log('地图初始中心点:', mapCenter.latitude, mapCenter.longitude)
  
  // 直接开始定位
  useUniAppLocation()
}

// 天地图Web API请求函数
const requestTiandituApi = (endpoint: string, params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const url = `https://api.tianditu.gov.cn/${endpoint}`
    const requestParams = { ...params, tk: TIANDITU_KEY }
    
    uni.request({
      url,
      method: 'GET',
      data: requestParams,
      success: (res: any) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}

// 天地图路线规划API
const planRouteWithTiandituAPI = async () => {
  try {
    console.log('开始天地图路线规划...')
    
    // 获取起点和终点坐标（当前是GCJ02坐标系）
    const startMarker = mapMarkers.value.find(m => m.title === '当前位置')
    const endMarker = mapMarkers.value.find(m => m.title === routeInfo.endPoint)
    
    if (!startMarker || !endMarker) {
      console.log('找不到起点或终点标记')
      return
    }
    
    // 将GCJ02坐标转换为WGS84坐标（天地图使用）
    const startWgs84Coord = gcoord.transform([startMarker.longitude, startMarker.latitude], gcoord.GCJ02, gcoord.WGS84)
    const endWgs84Coord = gcoord.transform([endMarker.longitude, endMarker.latitude], gcoord.GCJ02, gcoord.WGS84)
    
    console.log('起点GCJ02坐标:', startMarker.longitude, startMarker.latitude)
    console.log('起点WGS84坐标:', startWgs84Coord[0], startWgs84Coord[1])
    console.log('终点GCJ02坐标:', endMarker.longitude, endMarker.latitude)
    console.log('终点WGS84坐标:', endWgs84Coord[0], endWgs84Coord[1])
    
    // 构建天地图路线规划请求参数（使用WGS84坐标）
    const params = {
      postStr: JSON.stringify({
        orig: `${startWgs84Coord[0]},${startWgs84Coord[1]}`,
        dest: `${endWgs84Coord[0]},${endWgs84Coord[1]}`,
        style: '0' // 0: 最快路线, 1: 最短路线, 2: 避开高速, 3: 步行
      }),
      type: 'search'
    }
    
    console.log('天地图路线规划参数:', params)
    
    // 调用天地图路线规划API
    const result = await requestTiandituApi('drive', params)
    console.log('天地图路线规划结果:', result)
    
    // 天地图返回的是XML格式，需要解析
    if (result && typeof result === 'string') {
      // 解析XML数据
      parseRouteXML(result)
    } else {
      console.log('天地图API返回格式异常:', result)
      // 失败时显示错误
      uni.showToast({
        title: '路线规划失败',
        icon: 'none'
      })
    }
    
  } catch (error) {
    console.error('天地图路线规划失败:', error)
    uni.showToast({
      title: '路线规划失败',
      icon: 'none'
    })
  }
}


// 使用UniApp定位
const useUniAppLocation = () => {
  console.log('小程序环境，检查定位权限...')
  // 直接尝试定位，如果失败则引导用户开启权限
  startUniAppLocation()
}

// 开始UniApp定位
const startUniAppLocation = () => {
  uni.getLocation({
    type: 'gcj02', // 直接获取GCJ02坐标系的位置，直接在地图上显示
    success: (res) => {
      const lat = res.latitude
      const lng = res.longitude
      
      console.log('UniApp定位成功(GCJ02):', lat, lng)
      
      // 先更新位置信息
      updateLocation(lat, lng, res.accuracy || 100)
      
      // 等待地图中心点更新后再添加标记
      nextTick(() => {
        console.log('定位后地图中心点:', mapCenter.latitude, mapCenter.longitude)
        
        // 清除之前的标记
        mapMarkers.value = []
        
        // 添加起点标记（当前位置）
        addMarker('start', lat, lng, '当前位置', '📍')
        
        // 添加终点标记（成都欢乐谷）- 直接使用GCJ02坐标
        const endLat = 30.722949
        const endLng = 104.035034
        addMarker('end', endLat, endLng, routeInfo.endPoint, '🎢')
        
        console.log('已添加起点和终点标记')
        console.log('当前markers:', mapMarkers.value)
        
        // 更新地图中心点
        mapCenter.longitude = lng
        mapCenter.latitude = lat
        console.log('地图中心点已更新:', mapCenter.latitude, mapCenter.longitude)
        
        // 绘制路线
        drawRoute()
        
        isLocating.value = false
        
        uni.showToast({
          title: '定位成功',
          icon: 'success'
        })
      })
    },
    fail: (error) => {
      console.error('UniApp定位失败:', error)
      isLocating.value = false
      
      // 定位失败，使用默认位置
      useDefaultLocation()
    }
  })
}

// 更新位置信息
const updateLocation = (lat: number, lng: number, accuracy: number) => {
  console.log('更新位置信息前:', { lat, lng, accuracy })
  console.log('更新前地图中心点:', mapCenter.latitude, mapCenter.longitude)
  
  currentLocation.latitude = lat
  currentLocation.longitude = lng
  currentLocation.accuracy = accuracy
  
  // 更新地图中心点
  mapCenter.latitude = lat
  mapCenter.longitude = lng
  
  console.log('地图中心点已更新:', mapCenter.latitude, mapCenter.longitude)
  
  // 更新routeInfo中的起点
  routeInfo.startPoint = '当前位置'
  
  // 强制触发地图重新渲染
  nextTick(() => {
    console.log('地图中心点强制更新后:', mapCenter.latitude, mapCenter.longitude)
    console.log('当前地图中心点对象:', mapCenter)
  })
}

// 添加地图标记
const addMarker = (id: string, latitude: number, longitude: number, title: string, icon: string) => {
  const markerId = mapMarkers.value.length + 1
  
  const marker = {
    id: markerId,
    latitude,
    longitude,
    title,
    iconPath: '/static/marker.png',
    width: 32,
    height: 32
  }
  
  mapMarkers.value.push(marker)
}

// 绘制路线
const drawRoute = () => {
  // 确保有起点和终点标记
  if (mapMarkers.value.length < 2) {
    console.log('标记数量不足，无法绘制路线')
    return
  }
  
  // 获取起点和终点坐标
  const startMarker = mapMarkers.value.find(m => m.title === '当前位置' || m.title === routeInfo.startPoint)
  const endMarker = mapMarkers.value.find(m => m.title === routeInfo.endPoint)
  
  if (!startMarker || !endMarker) {
    console.log('找不到起点或终点标记')
    return
  }
  
  console.log('绘制路线，起点:', startMarker.latitude, startMarker.longitude)
  console.log('绘制路线，终点:', endMarker.latitude, endMarker.longitude)
  
  // 创建路线（从起点到终点）
  const polyline = {
    points: [
      { latitude: startMarker.latitude, longitude: startMarker.longitude },
      { latitude: endMarker.latitude, longitude: endMarker.longitude }
    ],
    color: '#07c160',
    width: 4,
    arrowLine: true
  }
  
  mapPolyline.value = [polyline]
  console.log('路线已绘制:', mapPolyline.value)
}

// 根据API数据绘制路线
const drawRouteFromAPI = (steps: any[]) => {
  if (!steps || steps.length === 0) return
  
  // 构建路线坐标点
  const points: any[] = []
  
  // 添加起点
  points.push({
    latitude: mapCenter.latitude,
    longitude: mapCenter.longitude
  })
  
  // 根据步骤添加中间点
  steps.forEach((step: any) => {
    if (step.polyline) {
      // 解析polyline坐标
      const coords = step.polyline.split(';')
      coords.forEach((coord: string) => {
        const [lng, lat] = coord.split(',').map(Number)
        points.push({
          latitude: lat,
          longitude: lng
        })
      })
    }
  })
  
        // 添加终点（成都欢乐谷）
      points.push({
        latitude: 30.72293,
        longitude: 104.032811
      })
  
  // 创建路线
  const polyline = {
    points: points,
    color: '#07c160',
    width: 4,
    arrowLine: true
  }
  
  mapPolyline.value = [polyline]
}

// 加载路线数据
const loadRouteData = () => {
  // 这里应该调用接口获取路线数据
  console.log('加载路线数据')
}

// 是否可以开始导航
const canStartNav = computed(() => {
  return mapMarkers.value.length >= 2 && mapPolyline.value.length > 0
})

// 开始导航
const startNavigation = () => {
  if (!canStartNav.value) {
    uni.showToast({
      title: '路线未规划完成',
      icon: 'none'
    })
    return
  }
  
  isNavigating.value = true
  currentStepIndex.value = 0
  nextInstruction.value = routeSteps.value[0].instruction
  
  uni.showToast({
    title: '导航已开始',
    icon: 'success'
  })
  
  // 模拟导航进度更新
  startNavigationProgress()
}

// 导航进度更新
const startNavigationProgress = () => {
  const progressTimer = setInterval(() => {
    if (!isNavigating.value) {
      clearInterval(progressTimer)
      return
    }
    
    if (currentStepIndex.value < routeSteps.value.length - 1) {
      currentStepIndex.value++
      nextInstruction.value = routeSteps.value[currentStepIndex.value].instruction
    } else {
      // 到达目的地
      uni.showToast({
        title: '已到达目的地',
        icon: 'success'
      })
      stopNavigation()
    }
  }, 10000) // 每10秒更新一次
}

// 停止导航
const stopNavigation = () => {
  isNavigating.value = false
  currentStepIndex.value = 0
  
  uni.showToast({
    title: '导航已结束',
    icon: 'none'
  })
}

// 路线规划
const planRoute = () => {
  // 检查是否有起点和终点
  if (mapMarkers.value.length < 2) {
    uni.showToast({
      title: '请先设置起点和终点',
      icon: 'none'
    })
    return
  }
  
  uni.showToast({
    title: '正在规划路线...',
    icon: 'loading'
  })
  
  // 使用天地图Web API进行路线规划
  planRouteWithTiandituAPI()
}


// 刷新路线
const refreshRoute = () => {
  uni.showToast({
    title: '正在刷新路线...',
    icon: 'loading'
  })
  
  setTimeout(() => {
    drawRoute()
    uni.showToast({
      title: '路线已刷新',
      icon: 'success'
    })
  }, 1000)
}

// 显示工单列表
const toggleWorkOrders = () => {
  showWorkOrders.value = true
}

// 隐藏工单列表
const hideWorkOrders = () => {
  showWorkOrders.value = false
}

// 选择工单
const selectWorkOrder = (order: any) => {
  // 更新终点信息
  routeInfo.endPoint = order.merchantName
  
  // 重新规划路线
  planRoute()
  
  hideWorkOrders()
}

// 隐藏路线详情
const hideRouteDetails = () => {
  showRouteDetails.value = false
}







const clearRoute = () => {
  // 清除路线
  mapPolyline.value = []
  uni.showToast({
    title: '路线已清除',
    icon: 'success'
  })
}

// 地图控制
const zoomIn = () => {
  if (mapScale.value < 20) {
    mapScale.value++
    console.log('地图放大到:', mapScale.value)
  }
}

const zoomOut = () => {
  if (mapScale.value > 3) {
    mapScale.value--
    console.log('地图缩小到:', mapScale.value)
  }
}

const locateMe = () => {
  // 重新定位到当前位置
  if (isLocating.value) {
    uni.showToast({
      title: '正在定位中...',
      icon: 'none'
    })
    return
  }
  
  console.log('小程序环境，重新定位')
  useUniAppLocation()
}

// 地图事件处理
const onMarkerTap = (e: any) => {
  const marker = mapMarkers.value.find(m => m.id === e.markerId)
  if (marker) {
    uni.showToast({
      title: marker.title,
      icon: 'none'
    })
  }
}

const onRegionChange = (e: any) => {
  if (e.type === 'end') {
    // 地图区域变化结束
    console.log('地图区域变化:', e.detail)
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    'in-progress': '进行中',
    completed: '已完成'
  }
  return statusMap[status] || status
}

// 使用默认位置
const useDefaultLocation = () => {
  console.log('使用默认位置初始化地图')
  
  // 使用成都市中心作为默认位置（直接使用GCJ02坐标）
  const defaultLat = 30.5728
  const defaultLng = 104.0668
  
  console.log('默认位置GCJ02坐标:', defaultLat, defaultLng)
  
      // 先更新位置信息
    updateLocation(defaultLat, defaultLng, 1000) // 默认精度1000米
    
    // 等待地图中心点更新后再添加标记
    nextTick(() => {
      console.log('默认位置地图中心点:', mapCenter.latitude, mapCenter.longitude)
      
      // 清除之前的标记
      mapMarkers.value = []
      
      // 添加起点标记
      addMarker('start', defaultLat, defaultLng, '当前位置', '📍')
      
      // 添加终点标记（成都欢乐谷）- 直接使用GCJ02坐标
      const endLat = 30.72293
      const endLng = 104.032811
      
      addMarker('end', endLat, endLng, routeInfo.endPoint, '🎢')
      
      // 绘制路线
      drawRoute()
      
      // 确保地图中心点更新
      nextTick(() => {
        mapCenter.longitude = defaultLng
        mapCenter.latitude = defaultLat
        console.log('最终地图中心点:', mapCenter.latitude, mapCenter.longitude)
      })
      
      uni.showToast({
        title: '使用默认位置',
        icon: 'none'
      })
    })
}

// 开始持续性定位
const startLocationWatching = () => {
  if (isLocationWatching.value) {
    console.log('持续性定位已在运行中')
    return
  }
  
  console.log('开始持续性定位')
  isLocationWatching.value = true
  
  // 使用定时器定期获取位置（推荐用于小程序环境）
  locationUpdateInterval.value = setInterval(() => {
    uni.getLocation({
      type: 'gcj02', // 直接获取GCJ02坐标系的位置
      success: (res) => {
        const lat = res.latitude
        const lng = res.longitude
        
        console.log('持续性定位更新(GCJ02):', lat, lng, '精度:', res.accuracy)
        
        // 检查位置是否发生显著变化（超过10米）
        const distance = calculateDistance(
          currentLocation.latitude || 0,
          currentLocation.longitude || 0,
          lat,
          lng
        )
        
        if (distance > 10) { // 10米阈值
          console.log('位置发生显著变化，距离:', distance, '米')
          
          // 更新位置信息
          updateLocation(lat, lng, res.accuracy || 100)
          
          // 更新起点标记位置
          updateStartMarker(lat, lng)
          
          // 如果正在导航，重新绘制路线
          if (isNavigating.value) {
            drawRoute()
          }
        }
      },
      fail: (error) => {
        console.warn('持续性定位失败:', error)
      }
    })
  }, 5000) // 每5秒更新一次位置
  

}

// 停止持续性定位
const stopLocationWatching = () => {
  if (locationUpdateInterval.value) {
    clearInterval(locationUpdateInterval.value)
    locationUpdateInterval.value = null
  }
  
  isLocationWatching.value = false
  console.log('持续性定位已停止')
}

// 切换持续性定位状态
const toggleLocationWatching = () => {
  if (isLocationWatching.value) {
    stopLocationWatching()
    uni.showToast({
      title: '持续性定位已关闭',
      icon: 'none'
    })
  } else {
    startLocationWatching()
    uni.showToast({
      title: '持续性定位已开启',
      icon: 'success'
    })
  }
}

// 更新起点标记位置
const updateStartMarker = (lat: number, lng: number) => {
  const startMarkerIndex = mapMarkers.value.findIndex(m => 
    m.title === '当前位置' || m.title === routeInfo.startPoint
  )
  
  if (startMarkerIndex !== -1) {
    // 更新现有标记
    mapMarkers.value[startMarkerIndex].latitude = lat
    mapMarkers.value[startMarkerIndex].longitude = lng
    console.log('起点标记位置已更新:', lat, lng)
  } else {
    // 如果没有找到起点标记，添加新的
    addMarker('start', lat, lng, '当前位置', '📍')
  }
}

// 计算两点间距离（米）
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000 // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}



// 解析天地图返回的XML数据
const parseRouteXML = (xmlData: string) => {
  console.log('解析XML数据:', xmlData)
  
  try {
    // 提取关键信息：距离、时间、路线坐标
    
    // 提取距离信息
    const distanceMatch = xmlData.match(/<distance>([^<]+)<\/distance>/)
    if (distanceMatch) {
      const distance = parseFloat(distanceMatch[1])
      routeInfo.distance = (distance / 1000).toFixed(1) + 'km'
    }
    
    // 提取时间信息
    const durationMatch = xmlData.match(/<duration>([^<]+)<\/duration>/)
    if (durationMatch) {
      const duration = parseInt(durationMatch[1])
      routeInfo.estimatedTime = Math.ceil(duration / 60) + '分钟'
    }
    
    // 提取路线坐标
    const routeLatLonMatch = xmlData.match(/<routelatlon>([^<]+)<\/routelatlon>/)
    if (routeLatLonMatch) {
      const routeCoords = routeLatLonMatch[1]
      console.log('提取到的路线坐标字符串:', routeCoords)
      
      // 解析坐标字符串，格式：116.35506,39.92277;116.35506,39.92277
      const coordinates = routeCoords.split(';').map(coord => {
        const [lng, lat] = coord.split(',').map(Number)
        
        // 检查坐标有效性
        if (!coordinateValidator.isValidCoordinate(lng, lat)) {
          console.warn('无效坐标:', coord)
          return null
        }
        
        // 天地图返回的是WGS84坐标，需要转换为GCJ02坐标（地图组件使用）
        const gcj02Coord = gcoord.transform([lng, lat], gcoord.WGS84, gcoord.GCJ02)
        const gcj02Lng = gcj02Coord[0]
        const gcj02Lat = gcj02Coord[1]
        
        console.log('天地图WGS84坐标:', coord, '->', { lng, lat })
        console.log('转换为GCJ02坐标:', { longitude: gcj02Lng, latitude: gcj02Lat })
        
        return { latitude: gcj02Lat, longitude: gcj02Lng }
      }).filter(coord => coord !== null) // 过滤掉无效坐标
      
      console.log('解析后的坐标数组:', coordinates)
      
      if (coordinates.length > 0) {
        // 绘制路线
        drawRouteFromCoordinates(coordinates)
        
        // 更新路线步骤
        updateRouteSteps(xmlData)
        
        uni.showToast({
          title: '路径规划完成',
          icon: 'success'
        })
        
        showRouteDetails.value = true
      } else {
        throw new Error('坐标数组为空')
      }
    } else {
      console.log('XML数据中未找到routelatlon标签')
      console.log('XML数据内容:', xmlData)
      throw new Error('未找到路线坐标信息')
    }
    
  } catch (error) {
    console.error('解析XML数据失败:', error)
    uni.showToast({
      title: '解析路径数据失败',
      icon: 'none'
    })
    
    // 解析失败时显示错误
    uni.showToast({
      title: '解析路径数据失败',
      icon: 'none'
    })
  }
}

// 根据坐标数组绘制路线
const drawRouteFromCoordinates = (coordinates: any[]) => {
  if (!coordinates || coordinates.length === 0) {
    console.log('坐标数组为空，无法绘制路线')
    return
  }
  
  console.log('开始绘制路线，坐标数量:', coordinates.length)
  console.log('绘制路线坐标:', coordinates)
  
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
  
  console.log('有效坐标数量:', validCoordinates.length)
  
  const polyline = {
    points: validCoordinates,
    color: '#07c160',
    width: 4,
    arrowLine: true
  }
  
  console.log('准备绘制的polyline:', polyline)
  
  // 先清空现有路线
  mapPolyline.value = []
  console.log('清空路线后:', mapPolyline.value)
  
  // 强制触发响应式更新
  nextTick(() => {
    mapPolyline.value = [polyline]
    console.log('路线已绘制，polyline数据:', mapPolyline.value)
    
    // 再次强制更新
    nextTick(() => {
      console.log('地图路线数据更新完成')
      console.log('最终polyline数据:', mapPolyline.value)
      
      // 检查地图组件是否正确接收数据
      if (mapPolyline.value.length > 0) {
        console.log('路线数据已成功设置到地图组件')
        uni.showToast({
          title: '路线绘制成功',
          icon: 'success'
        })
      } else {
        console.error('路线数据设置失败')
      }
    })
  })
}

// 更新路线步骤
const updateRouteSteps = (xmlData: string) => {
  // 提取路线步骤信息
  const stepMatches = xmlData.match(/<item id='[^']*'>([\s\S]*?)<\/item>/g)
  
  if (stepMatches) {
    const steps: any[] = []
    
    stepMatches.forEach((stepXml, index) => {
      // 提取文字描述
      const strguideMatch = stepXml.match(/<strguide>([^<]+)<\/strguide>/)
      const instruction = strguideMatch ? strguideMatch[1] : `步骤${index + 1}`
      
      // 提取距离信息（如果有）
      const distanceMatch = stepXml.match(/<streetDistance>([^<]+)<\/streetDistance>/)
      const distance = distanceMatch ? (parseInt(distanceMatch[1]) / 1000).toFixed(1) + 'km' : '100m'
      
      steps.push({
        instruction: instruction,
        distance: distance
      })
    })
    
    routeSteps.value = steps
    console.log('路线步骤已更新:', routeSteps.value)
  }
}









// 返回上一页
const goBack = () => {
  if (isNavigating.value) {
    uni.showModal({
      title: '确认退出',
      content: '正在导航中，确定要退出吗？',
      success: (res) => {
        if (res.confirm) {
          stopNavigation()
          // 检查页面栈
          const pages = getCurrentPages()
          if (pages.length > 1) {
            uni.navigateBack()
          } else {
            // 如果是第一页，跳转到首页
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      }
    })
  } else {
    // 检查页面栈
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      // 如果是第一页，跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
.navigation-container {
  height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.header {
  background: #ffffff;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 32rpx;
  color: #333333;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.header-actions {
  position: absolute;
  right: 30rpx;
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.action-icon {
  font-size: 24rpx;
}

.route-info-card {
  background: #ffffff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.route-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.route-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.route-label {
  font-size: 24rpx;
  color: #666666;
}

.route-value {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.route-actions {
  display: flex;
  gap: 20rpx;
}

.start-nav-btn, .route-plan-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
}

.start-nav-btn {
  background: linear-gradient(135deg, #07c160 0%, #05a050 100%);
  color: #ffffff;
}

.start-nav-btn:disabled {
  background: #cccccc;
  color: #999999;
}

.route-plan-btn {
  background: #f5f5f5;
  color: #333333;
}

.route-plan-btn:disabled {
  background: #cccccc;
  color: #999999;
}





.map-container {
  flex: 1;
  position: relative;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.navigation-map {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}





.map-controls {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.control-btn {
  width: 80rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.control-btn.active {
  background: #07c160;
  color: #ffffff;
}

.control-btn.active .control-icon {
  color: #ffffff;
}

.control-icon {
  font-size: 32rpx;
  color: #333333;
}

.route-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 16rpx 16rpx 0 0;
  max-height: 60vh;
  z-index: 200;
}

.details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.details-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 40rpx;
  color: #999999;
}

.details-content {
  max-height: 50vh;
  padding: 0 30rpx;
}

.route-step {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.route-step:last-child {
  border-bottom: none;
}

.route-step.active {
  background: #f0f8ff;
  margin: 0 -30rpx;
  padding: 25rpx 30rpx;
}

.step-number {
  width: 60rpx;
  height: 60rpx;
  background: #07c160;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.step-instruction {
  font-size: 28rpx;
  color: #333333;
}

.step-distance {
  font-size: 24rpx;
  color: #666666;
}

.work-orders-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 300;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: #f8f8f8;
}

.panel-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.panel-content {
  max-height: calc(100vh - 120rpx);
  padding: 0 30rpx;
}

.work-order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.work-order-item:last-child {
  border-bottom: none;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.order-name {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.order-address {
  font-size: 24rpx;
  color: #666666;
}

.order-time {
  font-size: 22rpx;
  color: #999999;
}

.order-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-status.in-progress {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.completed {
  background: #d4edda;
  color: #155724;
}

.status-text {
  font-size: 22rpx;
}

.navigation-status {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #07c160 0%, #05a050 100%);
  color: #ffffff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 400;
}

.status-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.status-text {
  font-size: 28rpx;
  font-weight: bold;
}

.next-instruction {
  font-size: 24rpx;
  opacity: 0.9;
}

.stop-nav-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  font-size: 26rpx;
}
</style>
