import {
    request
} from "@/utils/request.js"

///登录
export function apiPostLogin(data = {}) {
    return request({
        url: "/api/apiLogin",
        data,
        method: "POST"
    })
}

///用户信息
export function apiGetInfo() {
    return request({
        url: "/api/getInfo"
    })
}


////api/apiRegister 注册
export function apiPostRegister(data = {}) {
    return request({
        url: "/api/apiRegister",
        data,
        method: "POST"
    })
}

/// 首页 统计数api/merchantapi/getMerchantStatistics
export function apiGetMerchantStatistics(data = {}) {
    return request({
        url: "/api/merchantapi/getMerchantStatistics",
        data
    })
}

///商户首页收运记录全部
export function apiGetPlanAllPage(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanAllPage",
        data
    })
}

///商户首页收运清单分页/api/merchantapi/getPlanPage
export function apiGetPlanPage(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanPage",
        data
    })
}


///商户提交认证
export function apiPostMerchantCheck(data = {}) {
    return request({
        url: "/api/merchantapi/addMerchantCheck",
        data,
        method: "POST"
    })
}

///商户修改认证
export function apiPosteditMerchantCheck(data = {}) {
    return request({
        url: "/api/merchantapi/editMerchantCheck",
        data,
        method: "POST"
    })
}

///商户获取认证信息状态 userid
export function apiGetMerchantCheck(data = {}) {
    return request({
        url: "/api/merchantapi/getMerchantCheck",
        data,
    })
}

///提交单个 String
export function apiPostwebupload(data = {}) {
    return request({
        url: "/api/merchantapi/webupload",
        data,
        method: "POST"
    })
}

///临时预约 api/merchantapi/addPlanTemporary
export function apiPostaddPlanTemporary(data = {}) {
    return request({
        url: "/api/merchantapi/addPlanTemporary",
        data,
        method: "POST"
    })
}

// 商户确认按钮/api/merchantapi/confirmPlanById
export function apiGetconfirmPlanById(data = {}) {
    return request({
        url: "/api/merchantapi/confirmPlanById",
        data
    })
}

//商户收运端统计 /api/merchantapi/getPlanStatistics
export function apiGetPlanStatistics(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanStatistics",
        data
    })
}

///api/merchantapi/getPlanStatisticsPage
export function apiGetPlanStatisticsPage(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanStatisticsPage",
        data
    })
}

//临时预约取消/api/merchantapi/delPlanTemporary
export function apiGetcancelPlanById(data = {}) {
    return request({
        url: '/api/merchantapi/delPlanTemporary',
        data,
    })
}

///getMerchantNotConfirmNum  商户收运清单进行中数量
export function apiGetMerchantNotConfirmNum(data = {}) {
    return request({
        url: "/api/merchantapi/getMerchantNotConfirmNum",
        data
    })
}

////api/merchantapi/getPlanTemporaryById 商户提交临时预约收运单
export function apiGetPlanTemporaryById(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanTemporaryById",
        data
    })
}

///api/merchantapi/getPlanById 商户收运记录详情
export function apiGetPlanById(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanById",
        data
    })
}

///api/merchantapi/selectMerchantList 商户认证商户名称
export function apiSelectMerchantList(data = {}) {
    return request({
        url: "/api/merchantapi/selectMerchantList",
        data
    })
}

//------------------------收运端 司机------------------------------//

///api/driver/getDriverTodayStatistics
export function apiGetDriverTodayStatistics(data = {}) {
    return request({
        url: "/api/driver/getDriverTodayStatistics",
        data
    })
}

///api/driver/getDriverInfo获取司机今日收运统计信息
export function apiGetDriverInfo(data = {}) {
    return request({
        url: "/api/driver/getDriverInfo",
        data
    })
}

///api/driver/getDriverTodayPlan司机今日收运管理列表
export function apiGetDriverTodayPlan(data = {}) {
    return request({
        url: "/api/driver/getDriverTodayPlan",
        data
    })
}


///api/driver/noNeedCollect 无需收运
export function apiGetnoNeedCollect(data = {}) {
    return request({
        url: "/api/driver/noNeedCollect",
        data
    })
}

///api/driver/driverConfirmPlan 司机完成收运
export function apiGetdriverConfirmPlan(data = {}) {
    return request({
        url: "/api/driver/driverConfirmPlan",
        data
    })
}

//api/driver/reportWeight 收运上报每个接口
export function apiPostreportWeight(data = {}) {
    return request({
        url: '/api/driver/reportWeight',
        data,
        method: 'POST',
    })
}

///api/driver/getDriverPlanById 查看详情
export function apiGetDriverPlanById(data = {}) {
    return request({
        url: "/api/driver/getDriverPlanById",
        data
    })
}

////api/driver/addCarWeight 添加当天车辆过磅重量
export function apiAddCarWeight(data = {}) {
    return request({
        url: '/api/driver/addCarWeight',
        data,
    })
}

///api/driver/getDriverPlanPage 获取收运记录
export function apiGetDriverPlanPage(data = {}) {
    return request({
        url: '/api/driver/getDriverPlanPage',
        data,
    })
}

////api/driver/getDriverPlanStatisticsPage 收运统计列表搜索
export function apiGetDriverPlanStatisticsPage(data = {}) {
    return request({
        url: '/api/driver/getDriverPlanStatisticsPage',
        data,
    })
}

////api/driver/getDriverPlanStatistics 收运统计统计搜索
export function apiGetDriverPlanStatistics(data = {}) {
    return request({
        url: '/api/driver/getDriverPlanStatistics',
        data,
    })
}

///api/driver/getDriverNotConfirmNum司机收运纪录待处理数量
export function apiGetDriverNotConfirmNum(data = {}) {
    return request({
        url: '/api/driver/getDriverNotConfirmNum',
        data,
    })
}
