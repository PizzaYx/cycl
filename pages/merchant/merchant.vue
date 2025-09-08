<template>
	<view class="Layout">
		<!-- 头部信息 -->
		
			<view class="header">
				<view class="user-info">
					<view class="avatar">
						<image src="https://ai-public.mastergo.com/ai/img_res/0528821cdbfcc3be3ed93dd2e114c3ba.jpg"
							mode="aspectFill" />
						<view class="auth-tag">认证中</view>
					</view>
					<view class="info">
						<view class="name">李老板</view>
						<view class="sub-name">张老板</view>
					</view>
				</view>
			</view>

			<!-- 数据统计 -->
			<view class="statistics">
				<view class="stat-item">
					<view class="number">4</view>
					<view class="label">预约中</view>
				</view>
				<view class="stat-item">
					<view class="number">45</view>
					<view class="label">收运中</view>
				</view>
				<view class="stat-item">
					<view class="number">6</view>
					<view class="label">待确认</view>
				</view>
				<view class="stat-item">
					<view class="number">451</view>
					<view class="label">已完成</view>
				</view>
			</view>
		
		<!-- 快捷操作 -->
		<view class="quick-actions">
			<view class="section-title">快捷操作</view>
			<view class="action-grid">
				<view class="action-item">
					<view class="icon-wrapper green">
						<uni-icons type="chatboxes" size="24" color="#fff" />
					</view>
					<text>临时预约</text>
				</view>
				<view class="action-item">
					<view class="icon-wrapper orange">
						<uni-icons type="calendar" size="24" color="#fff" />
					</view>
					<text>收运记录</text>
				</view>
				<view class="action-item">
					<view class="icon-wrapper red">
						<uni-icons type="chart" size="24" color="#fff" />
					</view>
					<text>数据统计</text>
				</view>
				<view class="action-item">
					<view class="icon-wrapper blue">
						<uni-icons type="person-filled" size="24" color="#fff" />
					</view>
					<text>商户认证</text>
				</view>
			</view>
		</view>

		<!-- 收运记录 -->
		<view class="records">
			<view class="records-header">
				<text class="title">收运记录</text>
				<text class="more">更多 >></text>
			</view>
			<view class="record-list">
				<view v-for="(item, index) in records" :key="index" class="record-item">
					<view class="record-main">
						<view class="shop-name">{{item.name}}</view>
						<view class="record-time">{{item.time}}</view>
					</view>
					<view class="record-right">
						<view class="weight">{{item.weight}}</view>
						<view class="status">{{item.status}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	const records = ref([{
			name: '川味小厨（总店）',
			time: '2023-08-20 14:05:30',
			weight: '1.56kg',
			status: '待确定'
		},
		{
			name: '川味小厨（总店）',
			time: '2023-08-20 14:05:30',
			weight: '1.56kg',
			status: '已完成'
		},
		{
			name: '川味小厨（总店）',
			time: '2023-08-20 14:05:30',
			weight: '1.56kg',
			status: '已完成'
		},
		{
			name: '川味小厨（总店）',
			time: '2023-08-20 14:05:30',
			weight: '1.56kg',
			status: '已完成'
		}
	]);
</script>

<style lang="scss" scoped>
	.Layout {
		background-color: $bg-theme-color;
		
		
		.header {
			padding-top: 214rpx;
			margin-bottom: 30rpx;

			.user-info {
				display: flex;
				align-items: center;

				.avatar {
					position: relative;
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 60rpx;
					}

					.auth-tag {
						position: absolute;
						right: -10rpx;
						bottom: 0;
						background-color: #4cd964;
						color: #fff;
						font-size: 12px;
						padding: 2px 6px;
						border-radius: 10px;
					}
				}

				.info {
					.name {
						font-size: 18px;
						font-weight: 500;
						margin-bottom: 4rpx;
					}

					.sub-name {
						font-size: 14px;
						color: #666;
					}
				}
			}
		}

		.statistics {
			display: flex;
			justify-content: space-between;
			padding: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 30rpx;

			.stat-item {
				text-align: center;

				.number {
					font-size: 24px;
					font-weight: 500;
					color: #333;
					margin-bottom: 8rpx;
				}

				.label {
					font-size: 14px;
					color: #666;
				}
			}
		}

		.quick-actions {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;

			.section-title {
				font-size: 16px;
				font-weight: 500;
				margin-bottom: 30rpx;
			}

			.action-grid {
				display: flex;
				justify-content: space-between;

				.action-item {
					display: flex;
					flex-direction: column;
					align-items: center;

					.icon-wrapper {
						width: 80rpx;
						height: 80rpx;
						border-radius: 20rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 16rpx;

						&.green {
							background-color: #4cd964;
						}

						&.orange {
							background-color: #f0ad4e;
						}

						&.red {
							background-color: #dd524d;
						}

						&.blue {
							background-color: #007aff;
						}
					}

					text {
						font-size: 14px;
						color: #333;
					}
				}
			}
		}

		.records {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;

			.records-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30rpx;

				.title {
					font-size: 16px;
					font-weight: 500;
				}

				.more {
					font-size: 14px;
					color: #666;
				}
			}

			.record-list {
				.record-item {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0;
					border-bottom: 1px solid #eee;

					&:last-child {
						border-bottom: none;
					}

					.record-main {
						.shop-name {
							font-size: 16px;
							color: #333;
							margin-bottom: 8rpx;
						}

						.record-time {
							font-size: 14px;
							color: #999;
						}
					}

					.record-right {
						text-align: right;

						.weight {
							font-size: 16px;
							color: #333;
							margin-bottom: 8rpx;
						}

						.status {
							font-size: 14px;
							color: #4cd964;
							background-color: rgba(76, 217, 100, 0.1);
							padding: 4rpx 12rpx;
							border-radius: 4px;
							display: inline-block;
						}
					}
				}
			}
		}
	}
</style>