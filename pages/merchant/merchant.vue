<template>
  <view class="layout">
    <view class="headImage">
      <image src="/static/headTopBg.png" mode="aspectFill"></image>
    </view>

    <view class="header">
      <view class="avatar">
        <image src="/static/logo.png" mode="aspectFill" />
      </view>
      <view class="info">
        <view class="name">李老板</view>
        <view class="sub-name">张老板</view>
        <view class="auth-tag">认证中</view>
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
            <view class="shop-name">{{ item.name }}</view>
            <view class="record-time">{{ item.time }}</view>
          </view>
          <view class="record-right">
            <view class="weight">{{ item.weight }}</view>
            <view class="status">{{ item.status }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const records = ref([
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '待确定',
  },
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '已完成',
  },
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '已完成',
  },
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '已完成',
  },
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '已完成',
  },
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '已完成',
  },
  {
    name: '川味小厨（总店）',
    time: '2023-08-20 14:05:30',
    weight: '1.56kg',
    status: '已完成',
  },
])

// 根据状态获取样式类名
const getStatusClass = (status) => {
  switch (status) {
    case '待确定':
      return 'status-pending'
    case '已完成':
      return 'status-completed'
    default:
      return 'status-default'
  }
}
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  min-height: 100vh;
  background-color: $bg-theme-color;

  .headImage {
    position: absolute;
    /* 绝对定位 */
    top: 0;
    left: 0;
    z-index: 0;
    /* 置于其他元素下方 */
    width: 100%;
    height: 442rpx;
    overflow: hidden;

    /* 防止内容溢出 */
    image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .header {
    position: relative;
    padding: 214rpx 30rpx 26rpx;
    width: 100%;
    display: flex;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      margin-right: 24rpx;

      image {
        width: 100%;
        height: 100%;
        border-radius: 60rpx;
      }
    }

    .info {
      flex: 1; /* 占满剩余宽度 */
      height: 120rpx; /* 或 min-height: 120rpx; 与头像同高 */
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-weight: 600;
        font-size: 32rpx;
        color: black;
        line-height: 32rpx;
      }

      .sub-name {
        font-weight: 400;
        font-size: 24rpx;
        color: #131313;
      }

      .auth-tag {
        width: 120rpx;
        height: 40rpx;
        background-color: rgba(7, 193, 96, 1);
        color: #fff;
        font-size: 22rpx;
        border-radius: 10px;
        display: inline-flex;
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
      }
    }
  }

  .statistics {
    position: relative;
    height: 128rpx;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 20rpx;
    margin: 0 30rpx 30rpx;
    align-items: center;
    padding: 0 28rpx;
    .stat-item {
      position: relative; /* 关键：为伪元素提供定位上下文 */
      height: 100%; /* 关键：子项高度等于父容器高度 128rpx */
      flex: 1; /* 等宽（可选） */
      display: flex; /* 让内部内容垂直居中 */
      flex-direction: column;
      justify-content: center; /* 垂直居中内容 */
      text-align: center;
      padding: 0 20rpx;
      .number {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .label {
        font-size: 14px;
        color: #666;
      }

      &:not(:first-child)::before {
        content: '';
        position: absolute;
        left: 0;
        top: 30rpx;
        bottom: 30rpx;
        width: 2rpx;
        background: #eee;
        transform: scaleX(0.5);
        transform-origin: left center;
      }
    }
  }

  .quick-actions {
    position: relative;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin: 0 30rpx 30rpx 30rpx;

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
        justify-content: space-around;
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
    position: relative;
    z-index: 1;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin: 0 30rpx 30rpx 30rpx;

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
            padding: 4rpx 12rpx;
            border-radius: 4px;
            display: inline-block;
          }

          .status-pending {
            color: #ff9900;
            background-color: rgba(255, 153, 0, 0.1);
          }

          .status-completed {
            color: #4cd964;
            background-color: rgba(76, 217, 100, 0.1);
          }

          .status-default {
            color: #666;
            background-color: rgba(102, 102, 102, 0.1);
          }
        }
      }

      .no-records {
        text-align: center;
        color: #999;
        padding: 40rpx 0;
      }
    }
  }
}
</style>
