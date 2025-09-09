<!-- 收运清单 -->
<template>
	<view class="container">
		<view class="tab-bar">
			<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
				@click="handleTabClick(index)">
				{{ tab }}
				<view class="tab-line" v-if="currentTab === index"></view>
			</view>
		</view>
		<scroll-view class="content" scroll-y>
			<view class="order-list">
				<view class="order-item" v-for="(item, index) in orderList" :key="index">
					<view class="order-header">
						<view class="shop-info">
							<text class="shop-name">{{ item.shopName }}</text>
							<text :class="['status-tag', item.status === '预约中' ? 'booking' : 'completed']">
								{{ item.status }}
							</text>
						</view>
						<view class="delivery-info">今日收运：{{ item.deliveryCount }}桶</view>
					</view>
					<view class="order-content">
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
						<uni-button size="mini" class="btn-cancel">取消</uni-button>
						<uni-button size="mini" :type="item.status === '预约中' ? 'primary' : 'default'"
							class="btn-confirm">
							{{ item.status === '预约中' ? '确认收运' : '查看详情' }}
						</uni-button>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue';
	const tabs = ['全部', '预约中', '已完成'];
	const currentTab = ref(0);
	const handleTabClick = (index) => {
		currentTab.value = index;
	};
	const orderList = ref([{
			shopName: '川味小厨(总店)',
			status: '预约中',
			deliveryCount: '5',
			weight: '451kg',
			carInfo: '川A3D47M',
			time: '2025-14:30-15:30'
		},
		{
			shopName: '川味小厨(总店)',
			status: '已完成',
			deliveryCount: '5',
			weight: '451kg',
			carInfo: '川A3D47M',
			time: '2025-14:30-15:30'
		},
		{
			shopName: '川味小厨(总店)',
			status: '已完成',
			deliveryCount: '5',
			weight: '451kg',
			carInfo: '川A3D47M',
			time: '2025-14:30-15:30'
		}
	]);
</script>
<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #f5f5f5;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.tab-bar {
		display: flex;
		align-items: center;
		height: 88rpx;
		background-color: #ffffff;
		padding: 0 30rpx;
		position: relative;
	}

	.tab-item {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #666666;
		position: relative;
	}

	.tab-item.active {
		color: #07c160;
		font-weight: 500;
	}

	.tab-line {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #07c160;
		border-radius: 2rpx;
	}

	.header {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
	}

	.header-title {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
	}

	.content {
		flex: 1;
		overflow: auto;
	}

	.order-list {
		padding: 20rpx;
	}

	.order-item {
		margin-bottom: 20rpx;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
	}

	.order-header {
		margin-bottom: 20rpx;
	}

	.shop-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}

	.shop-name {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
	}

	.status-tag {
		padding: 4rpx 16rpx;
		border-radius: 4rpx;
		font-size: 12px;
	}

	.status-tag.booking {
		color: #07c160;
		background-color: rgba(7, 193, 96, 0.1);
	}

	.status-tag.completed {
		color: #999999;
		background-color: #f5f5f5;
	}

	.delivery-info {
		font-size: 14px;
		color: #666666;
	}

	.order-content {
		padding: 20rpx 0;
		border-top: 1px solid #f0f0f0;
		border-bottom: 1px solid #f0f0f0;
	}

	.info-item {
		display: flex;
		margin-bottom: 16rpx;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	.label {
		font-size: 14px;
		color: #999999;
	}

	.value {
		font-size: 14px;
		color: #333333;
	}

	.order-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
	}

	.btn-cancel {
		margin-right: 20rpx;
		color: #666666;
	}

	.btn-confirm {
		color: #07c160;
	}
</style>