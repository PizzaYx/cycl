import {
	request
} from "@/utils/request.js"

//登录
export function apiPostLogin(data = {}) {
	return request({
		url: "/api/apiLogin",
		data,
		method:"POST"
	})
}

//用户信息
export function apiGetInfo() {
	return request({
		url: "/api/getInfo"
	})
}