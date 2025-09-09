<!-- 收运总列表 -->
<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view class="search-bar">
			<uni-icons class="search-icon" type="search" size="16" color="#999"></uni-icons>
			<input class="search-input" type="text" placeholder="按单号/物品关键词" placeholder-class="placeholder" />
		</view>
		<!-- 筛选条件栏 -->
		<view class="filter-bar">
			<view class="filter-item">
				<text>状态</text>
				<uni-icons type="bottom" size="12" color="#666"></uni-icons>
			</view>
			<view class="filter-item">
				<text>时间</text>
				<uni-icons type="bottom" size="12" color="#666"></uni-icons>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="content-wrapper">
			<scroll-view class="content" scroll-y>
				<view class="order-list">
					<view class="order-item" v-for="(item, index) in orderList" :key="index">
						<view class="order-header">
							<view class="shop-info">
								<text class="shop-name">{{ item.shopName }}</text>
								<text :class="['status-tag', item.status === '预约中' ? 'booking' : (item.status === '进行中' ? 'processing' : 'completed')]">
									{{ item.status }}
								</text>
							</view>
						</view>
						<view class="order-content">
							<view class="info-item">
								<text class="label">今日收运：</text>
								<text class="value">{{ item.deliveryCount }}桶</text>
							</view>
							<view class="info-item">
								<text class="label">收运重量：</text>
								<text class="value">{{ item.weight }}</text>
							</view>
							<view class="info-item">
								<text class="label">车辆信息：</text>
								<text class="value">{{ item.carInfo }}</text>
							</view>
							<view class="info-item">
								<text class="label">收运时间：</text>
								<text class="value">{{ item.time }}</text>
							</view>
						</view>
						<view class="order-footer">
							<uni-button size="mini" class="btn-cancel" v-if="item.status !== '已完成'">取消</uni-button>
							<uni-button size="mini" :type="item.status === '预约中' ? 'primary' : 'default'" class="btn-confirm">
								{{ item.status === '预约中' ? '确认收运' : (item.status === '进行中' ? '完成收运' : '查看详情') }}
							</uni-button>
						</view>
					</view>
				</view>
				<view class="loadMore">
					<uni-load-more :status="loadingStatus" :content-text="{
						contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'
					}"></uni-load-more>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script lang="ts" setup>
import { ref, computed, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

// 数据列表
const allOrderList = ref([
	// 预约中数据
	{
		id: 1,
		shopName: '川味小厨(总店)',
		status: '预约中',
		deliveryCount: '5',
		weight: '451kg',
		carInfo: '川A3D47M',
		time: '2025-08-20 14:30-15:30'
	},
	{
		id: 2,
		shopName: '老北京烤鸭店',
		status: '预约中',
		deliveryCount: '3',
		weight: '210kg',
		carInfo: '川B5H29N',
		time: '2025-08-21 10:00-11:00'
	},
	{
		id: 3,
		shopName: '兰州拉面',
		status: '预约中',
		deliveryCount: '4',
		weight: '320kg',
		carInfo: '川C1D2E3',
		time: '2025-08-21 14:00-15:00'
	},
	// 进行中数据
	{
		id: 4,
		shopName: '湘菜馆',
		status: '进行中',
		deliveryCount: '7',
		weight: '625kg',
		carInfo: '川C8K45P',
		time: '2025-08-20 09:15-10:15'
	},
	{
		id: 5,
		shopName: '粤式茶餐厅',
		status: '进行中',
		deliveryCount: '4',
		weight: '312kg',
		carInfo: '川D1M67Q',
		time: '2025-08-20 13:45-14:45'
	},
	// 已完成数据
	{
		id: 6,
		shopName: '东北饺子王',
		status: '已完成',
		deliveryCount: '6',
		weight: '523kg',
		carInfo: '川E3R89S',
		time: '2025-08-19 16:30-17:30'
	},
	{
		id: 7,
		shopName: '重庆小面',
		status: '已完成',
		deliveryCount: '2',
		weight: '156kg',
		carInfo: '川F6T23U',
		time: '2025-08-19 11:20-12:20'
	},
	{
		id: 8,
		shopName: '新疆羊肉串',
		status: '已完成',
		deliveryCount: '8',
		weight: '742kg',
		carInfo: '川G9Y56V',
		time: '2025-08-18 15:40-16:40'
	}
]);

const orderList = computed(() => {
	return allOrderList.value;
});

// 上拉加载更多相关
const loadingStatus = ref('more'); // more-加载前/loading-加载中/nomore-没有更多数据

// 上拉加载更多方法
const onLoadMore = () => {
	if (loadingStatus.value === 'nomore') return;

	loadingStatus.value = 'loading';
	// 模拟加载更多数据
	setTimeout(() => {
		// 这里可以请求更多数据并添加到列表中
		loadingStatus.value = 'more';
		// 如果没有更多数据了，设置为 'nomore'
		// loadingStatus.value = 'nomore';
	}, 1500);
};

// 下拉刷新
onPullDownRefresh(() => {
	// 模拟刷新操作
	setTimeout(() => {
		uni.stopPullDownRefresh();
	}, 1500);
});

// 触底加载更多
onReachBottom(() => {
	onLoadMore();
});
</script>
<style lang="scss" scoped>
page {
	height: 100%;
	background-color: $bg-theme-color;
}

.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: $bg-theme-color;

	.search-bar {
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		position: relative;

		.search-icon {
			position: absolute;
			left: 50rpx;
			z-index: 1;
		}

		.search-input {
			flex: 1;
			height: 72rpx;
			background-color: #f5f5f5;
			border-radius: 36rpx;
			padding: 0 80rpx;
			font-size: 14px;
		}
	}

	.placeholder {
		color: #999999;
	}

	.filter-bar {
		display: flex;
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		justify-content: center;

		.filter-item {
			display: flex;
			align-items: center;
			margin: 0 40rpx;

			text {
				font-size: 14px;
				color: #333333;
				margin-right: 8rpx;
			}
		}
	}

	.content-wrapper {
		flex: 1;

		.content {
			height: 100%;
		}

		.order-list {
			padding: 0 30rpx; // 左右30rpx

			.order-item {
				margin-bottom: 20rpx;
				padding: 30rpx;
				background-color: #ffffff;
				border-radius: 12rpx;

				.order-header {
					margin-bottom: 20rpx;

					.shop-info {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 16rpx;

						.shop-name {
							font-size: 28rpx;
							font-weight: 400;
							color: rgba(61, 61, 61, 1);
						}

						.status-tag {
							border-radius: 8rpx;
							font-size: 24rpx;
							width: 100rpx;
							height: 40rpx;
							display: flex;
							justify-content: center;
							align-items: center;

							&.booking {
								color: rgba(255, 161, 0, 1);
								background-color: rgba(255, 161, 0, 0.10);
							}

							&.processing {
								color: rgba(7, 193, 96, 1);
								background-color: rgba(7, 193, 96, 0.10);
							}

							&.completed {
								color: rgba(61, 61, 61, 0.50);
								background-color: rgba(61, 61, 61, 0.10);
							}
						}
					}
				}

				.order-content {
					padding: 20rpx 0;
					border-top: 1px solid #f0f0f0;
					border-bottom: 1px solid #f0f0f0;

					.info-item {
						display: flex;
						margin-bottom: 16rpx;

						&:last-child {
							margin-bottom: 0;
						}

						.label {
							font-size: 26rpx;
							color: rgba(61, 61, 61, 0.50);
						}

						.value {
							font-size: 26rpx;
							color: rgba(61, 61, 61, 1);
						}
					}
				}

				.order-footer {
					display: flex;
					justify-content: flex-end;
					margin-top: 20rpx;

					.btn-cancel {
						margin-right: 20rpx;
						color: rgba(61, 61, 61, 1);
						background-color: #fff;
						border: 1px solid rgba(196, 196, 196, 1);
						font-size: 26rpx;
						width: 144rpx;
						height: 48rpx;
						border-radius: 20rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						box-sizing: border-box; // 使用border-box盒模型
					}

					.btn-confirm {
						color: rgba(255, 255, 255, 1);
						background-color: rgba(7, 193, 96, 1);
						font-size: 26rpx;
						width: 144rpx;
						height: 48rpx;
						border-radius: 20rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						box-sizing: border-box; // 使用border-box盒模型
					}
				}
			}
		}
	}

	.loadMore {
		padding-bottom: calc(env(safe-area-inset-bottom) + 50);
	}
}