<template>
	<!-- 主登录 -->
	<view class="loginLayout">
		<bg-image height="442rpx" src="/static/headTopBg.png">
			<view class="loginInfo">
				<view class="logo">
					<image src="/static/logo.png" mode="aspectFill"></image>
				</view>
				<view class="title">
					厨余处理小程序
				</view>
				<view class="subtitle">
					智能收运·绿色环保
				</view>
				<view class="chooseRow">
					<view class="tab-item" :class="{ active: activeTab === 0 }" @click="activeTab = 0">
						商户端
						<view class="indicator" v-if="activeTab === 0"></view>
					</view>
					<view class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
						收运端
						<view class="indicator" v-if="activeTab === 1"></view>
					</view>
				</view>
				<view class="inputInfo">
					<input class="account" placeholder="请输入手机号码" type="text" placeholder-class="input-placeholder"
						v-model="formData.account" />
					<input class="account password" placeholder="请输入密码" type="safe-password"
						placeholder-class="input-placeholder" v-model="formData.password" />
				</view>
				<view class="loginBtn">
					<button type="button" @click="handleLogin">登录</button>
				</view>
				<view class="footer">
					<uni-icons :type="agreed ? 'circle-filled' : 'circle'" size="24"
						:color="agreed ? 'rgba(7, 193, 96, 1)' : 'rgba(19, 19, 19, 0.5)'" @click="toggleAgreement">
					</uni-icons>
					<view class="agreement-text">
						<text class="normal-text">我已阅读并同意</text>
						<text class="link-text" @click="openAgreement('user')">《用户协议》</text>
						<text class="normal-text">和</text>
						<text class="link-text" @click="openAgreement('privacy')">《隐私服务》</text>
					</view>
				</view>
			</view>
		</bg-image>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
} from 'vue';

import { apiPostLogin, apiGetInfo } from '@/api/apis.js';

	//商户端/收运端
	const activeTab = ref(0);

	//是否同意
	const agreed = ref(false)

	const toggleAgreement = () => {
		agreed.value = !agreed.value
	}

	// 打开协议页面
	const openAgreement = (type) => {
		// 这里可以添加跳转到协议页面的逻辑
		console.log('打开协议:', type)
		// 例如使用 uni.navigateTo 跳转到协议页面
	}

	// 表单数据
	const formData = reactive({
		account: '',
		password: ''
	});

	// 登录处理
	const handleLogin = () => {
		// 表单验证
		if (!formData.account) {
			uni.showToast({
				title: '请输入手机号码',
				icon: 'none'
			});
			return;
		}

		// if (formData.account.length !== 11) {
		// 	uni.showToast({
		// 		title: '手机号码格式不正确',
		// 		icon: 'none'
		// 	});
		// 	return;
		// }

		// if (!formData.password) {
		// 	uni.showToast({
		// 		title: '请输入密码',
		// 		icon: 'none'
		// 	});
		// 	return;
		// }

		if (formData.password.length < 6) {
			uni.showToast({
				title: '密码长度不能少于6位',
				icon: 'none'
			});
			return;
		}

		if (!agreed.value) {
			uni.showToast({
				title: '请先同意用户协议和隐私服务',
				icon: 'none'
			});
			return;
		}

		// 调用登录接口
		loginRequest();
	};

// 登录请求
const loginRequest = async () => {
    uni.showLoading({
        title: '登录中...'
    });

    try {
        // 使用封装好的API方法
        const res = await apiPostLogin({
            username: formData.account,
            password: formData.password
        });

        if (res.code === 200) {
            uni.showToast({
                title: '登录成功',
                icon: 'success'
            });

            await fetchUserInfo();

            // 延迟跳转确保toast显示
            setTimeout(() => {
                uni.navigateTo({
                    url: activeTab.value ? '/pages/collection/collection' : '/pages/merchant/merchant'
                });
            }, 1000);
        } else {
            uni.showToast({
                title: res.msg || '登录失败',
                icon: 'none'
            });
        }
    } catch (err) {
        uni.showToast({
            title: '网络请求失败',
            icon: 'none'
        });
        console.error('登录请求失败:', err);
    } finally {
        uni.hideLoading();
    }
};

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const userInfoRes = await apiGetInfo(); // 使用你在 
        if (userInfoRes.code === 200) {
            // 保存用户信息到本地缓存
            uni.setStorageSync('userInfo', userInfoRes.data);
        } else {
            console.error('获取用户信息失败:', userInfoRes.msg);
        }
    } catch (error) {
        console.error('获取用户信息异常:', error);
    }
};
</script>

<style lang="scss" scoped>
	.loginLayout {
		position: relative;

		.loginInfo {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-direction: column;
			padding-top: 284rpx;
			min-height: 100vh; // 确保容器至少占满视口高度
			width: 100%;

			// min-height: 100vh;
			// box-sizing: border-box;
			.logo {
				width: 200rpx;
				height: 200rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.title {
				font-size: 48rpx;
				font-weight: 400;
				color: #131313;
				padding-top: 60rpx;

			}

			.subtitle {
				font-size: 28rpx;
				color: #4B4B4B;
				padding-top: 32rpx;
			}

			.chooseRow {

				display: flex;
				padding-top: 52rpx;

				.tab-item {
					color: rgba(19, 19, 19, 0.50); // 未选中灰色
					font-size: 28rpx;
					position: relative;
					padding: 0 30rpx;

					&.active {
						color: rgba(19, 19, 19, 1); // 选中黑色
					}

					.indicator {
						width: 68rpx;
						height: 16rpx;
						background: rgba(7, 193, 96, 0.2);
						border-radius: 100rpx;
						position: absolute;
						bottom: -5rpx;
						left: 50%;
						transform: translateX(-50%);
					}
				}

				.tab-item:first-child {
					margin-right: 108rpx; // 一半间距
				}

				.tab-item:last-child {
					margin-left: 108rpx; // 一半间距
				}


			}

			.inputInfo {
				padding-top: 82rpx;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.account {
					width: 608rpx;
					height: 80rpx;
					background: #F4F4F4;
					border-radius: 40rpx;
					padding: 0 30rpx;
					box-sizing: border-box;
					font-size: 28rpx;
					margin-bottom: 40rpx;

					&:last-child {
						margin-bottom: 0;
					}

					&.password {
						margin-bottom: 0;
					}
				}

				.input-placeholder {
					// font-family: PingFang SC Regular, PingFang SC Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: rgba(61, 61, 61, 0.3);
					line-height: 24rpx;
					text-align: left;
					font-style: normal;
					text-transform: none;
				}
			}

			.loginBtn {
				padding-top: 66rpx;
				width: 100%;
				display: flex;
				justify-content: center;

				button {
					width: 608rpx;
					height: 80rpx;
					background: #07C160;
					border-radius: 40rpx;
					border: none;
					color: white;
					font-size: 32rpx;
					font-weight: 400;

					&::after {
						border: none; // 去除button默认边框
					}
				}
			}

			.footer {
				margin-top: auto;
				padding-bottom: calc(72rpx + env(safe-area-inset-bottom));
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;

				.agreement-text {
					display: flex;
					align-items: center;
					margin-left: 10rpx;

					.normal-text {
						font-size: 24rpx;
						color: rgba(61, 61, 61, 0.50);
						line-height: 36rpx;
					}

					.link-text {
						font-size: 24rpx;
						color: rgba(7, 193, 96, 1);
						line-height: 36rpx;
						text-decoration: underline;
					}
				}

				::v-deep .uni-icons {
					flex-shrink: 0;
				}
			}
		}
	}
</style>