import {
    request
} from "@/utils/request.js"

//登录
export function apiPostLogin(data = {}) {
    return request({
        url: "/api/apiLogin",
        data,
        method: "POST"
    })
}

//用户信息
export function apiGetInfo() {
    return request({
        url: "/api/getInfo"
    })
}

//商户首页收运统计
export function apiGetMerchantStatistics(data = {}) {
    return request({
        url: "/api/merchantapi/getMerchantStatistics"
    })
}

//商户首页收运统计
export function apiGetPlanAllPage(data = {}) {
    return request({
        url: "/api/merchantapi/getPlanAllPage"
    })
}

//商户提交认证
export function apiPostMerchantCheck(data = {}) {
    return request({
        url: "/api/merchantapi/addMerchantCheck",
        data,
        method: "POST"
    })
}

//商户修改认证
export function apiPosteditMerchantCheck(data = {}) {
    return request({
        url: "/api/merchantapi/editMerchantCheck",
        data,
        method: "POST"
    })
}

//商户获取认证信息状态 userid
export function apiGetMerchantCheck(data = {}) {
    return request({
        url: "/api/merchantapi/getMerchantCheck",
        data,
    })
}

//提交单个 String
export function apiPostwebupload(data = {}) {
    return request({
        url: "/api/merchantapi/webupload",
        data,
        method: "POST"
    })
}

