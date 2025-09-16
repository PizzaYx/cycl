# uni-datetime-picker 修改记录

## 修改概述
为 uni-datetime-picker 组件的移动端（微信小程序）日历选择器添加清除按钮功能，实现时间范围选择的重置功能。

## 修改时间
2025年9月16日

## 修改文件列表
1. `uni_modules/uni-datetime-picker/components/uni-datetime-picker/calendar.vue`
2. `uni_modules/uni-datetime-picker/components/uni-datetime-picker/i18n/zh-Hans.json`

---

## 详细修改记录

### 1. calendar.vue 修改

#### 1.1 模板修改
**位置：** 第95-98行
**修改前：**
```vue
<view v-if="!insert" class="uni-date-changed uni-date-btn--ok">
    <view class="uni-datetime-picker--btn" @click="confirm">{{confirmText}}</view>
</view>
```

**修改后：**
```vue
<view v-if="!insert" class="uni-date-changed uni-date-btn--ok">
    <view class="uni-datetime-picker--btn uni-datetime-picker--btn-clear" @click="clearCalender">{{clearText}}</view>
    <view class="uni-datetime-picker--btn" @click="confirm">{{confirmText}}</view>
</view>
```

#### 1.2 计算属性添加
**位置：** 第402-404行（在 confirmText 计算属性后）
**添加内容：**
```javascript
clearText() {
    return t("uni-calender.clear")
},
```

#### 1.3 样式修改

**位置1：** 第867-871行
**修改前：**
```scss
.uni-date-btn--ok {
    padding: 20px 15px;
}
```

**修改后：**
```scss
.uni-date-btn--ok {
    padding: 20px 15px;
    display: flex;
    gap: 15px;
}
```

**位置2：** 第937-953行
**修改前：**
```scss
.uni-datetime-picker--btn {
    border-radius: 100px;
    height: 40px;
    line-height: 40px;
    background-color: $uni-primary;
    color: #fff;
    font-size: 16px;
    letter-spacing: 2px;
}
```

**修改后：**
```scss
.uni-datetime-picker--btn {
    border-radius: 100px;
    height: 40px;
    line-height: 40px;
    background-color: $uni-primary;
    color: #fff;
    font-size: 16px;
    letter-spacing: 2px;
    flex: 1;
    text-align: center;
}

.uni-datetime-picker--btn-clear {
    background-color: #f5f5f5;
    color: #666;
    border: 1px solid #e5e5e5;
}
```

### 2. zh-Hans.json 修改

**位置：** 第21-22行
**修改前：**
```json
"uni-calender.confirm": "确认"
```

**修改后：**
```json
"uni-calender.confirm": "确认",
"uni-calender.clear": "清除"
```

---

## 功能说明

### 新增功能
1. **清除按钮**：在移动端日历选择器底部添加"清除"按钮
2. **按钮布局**：清除按钮和确认按钮并排显示
3. **样式设计**：清除按钮使用灰色背景，与确认按钮区分

### 按钮功能
- **清除按钮**：点击后清空已选择的时间范围
- **确认按钮**：点击后确认选择的时间范围

### 显示条件
- 仅在移动端（微信小程序）显示
- 仅在非插入模式（`!insert`）下显示
- 与原有的确认按钮同时显示

---

## 影响范围

### 正面影响
- ✅ 提升用户体验，提供快速清除功能
- ✅ 保持原有功能不变
- ✅ 仅在移动端生效，不影响PC端

### 潜在风险
- ⚠️ 插件更新时修改会被覆盖
- ⚠️ 需要定期检查兼容性

---

## 维护建议

### 1. 备份策略
```bash
# 创建备份目录
mkdir -p backup/uni-datetime-picker-$(date +%Y%m%d)

# 备份修改后的文件
cp -r uni_modules/uni-datetime-picker backup/uni-datetime-picker-$(date +%Y%m%d)/
```

### 2. 版本控制
- 将修改记录提交到 Git
- 在 README 中记录此修改
- 定期检查插件更新

### 3. 测试检查
- 在不同设备上测试清除功能
- 确认按钮布局在不同屏幕尺寸下的表现
- 验证国际化文本显示正确

### 4. 更新检查
当 uni-datetime-picker 插件更新时，需要重新应用以下修改：
1. 模板中的按钮添加
2. 计算属性中的 clearText
3. 样式中的布局和清除按钮样式
4. 国际化文件中的翻译

---

## 回滚方案

如果需要回滚修改，可以：
1. 从备份中恢复文件
2. 或者手动删除添加的代码
3. 重新安装原始插件版本

---

## 联系信息
- 修改人：[你的姓名]
- 修改日期：2024年12月19日
- 项目：cycl 微信小程序
