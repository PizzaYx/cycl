# signature 写字板
> 写字板，可用业务签名等场景  

## 文档
 🚀 [signature【站点1】](https://limex.qcoon.cn/components/signature.html)
 🌍 [signature【站点2】](https://limeui.netlify.app/components/signature.html)
 🔥 [signature【站点3】](https://limeui.familyzone.top/components/signature.html)

## 安装
插件市场导入即可


## 代码演示

### 基本用法
```html
<view style="width: 750rpx ;height: 750rpx;">
	<l-signature disableScroll  ref="signatureRef" :penColor="penColor" :penSize="penSize" :openSmooth="openSmooth" ></l-signature>
</view>
<view>
	<button @click="onClick('clear')">清空</button>
	<button @click="onClick('undo')">撤消</button>
	<button @click="onClick('save')">保存</button>
	<!-- uvue 不支持 openSmooth -->
	<button @click="onClick('openSmooth')">压感{{openSmooth?'开':'关'}}</button>
</view>
```
### Vue/Nvue
```js
export default {
	data() {
		return {
			title: 'Hello',
			penColor: 'red',
			penSize: 5,
			url: '',
			openSmooth: true
		}
	},
	methods: {
		onClick(type) {
			 if(type == 'openSmooth') {
				 this.openSmooth = !this.openSmooth
				 return
			 }
			if (type == 'save') {
				this.$refs.signatureRef.canvasToTempFilePath({
					success: (res) => {
						// 是否为空画板 无签名
						console.log(res.isEmpty)
						// 生成图片的临时路径
						// H5 生成的是base64
						this.url = res.tempFilePath
					}
				})
				return
			}
			if (this.$refs.signatureRef)
				this.$refs.signatureRef[type]()
		}
	}
}
```

### Uvue

```js
import {LSignatureToTempFilePathOptions, LSignatureToFileSuccess} from '@/uni_modules/lime-signature'
export default {
	data() {
		return {
			title: 'Hello',
			penColor: 'red',
			penSize: 5,
			url: '',
			openSmooth: true
		}
	},
	methods: {
		onClick(type: string) {
			const signatureRef = this.$refs['signatureRef'] as LSignatureComponentPublicInstance
			// APP 不支持
			// #ifndef APP 
			 if(type == 'openSmooth') {
				 this.openSmooth = !this.openSmooth
			 }
			 // #endif
			if (type == 'save') {
				signatureRef.canvasToTempFilePath({
					success: (res: LSignatureToFileSuccess) => {
						// 是否为空画板 无签名
						console.log(res.isEmpty)
						// 生成图片的临时路径
						// H5 生成的是base64
						this.url = res.tempFilePath
					}
				} as LSignatureToTempFilePathOptions)
				return
			}
			if(type == 'undo'){
				signatureRef.undo()
			}
			if(type == 'redo'){
				signatureRef.redo()
			}
			if(type == 'clear'){
				signatureRef.clear()
			}
		}
	}
}
```


### 横屏
通过设置`landscape`,改变生成图片的方向，达到横屏的作用
```html
<view style="width: 100vw; height: 100vh;">
	<l-signature landscape></l-signature>
</view>
<view style="transform: rotate(90deg);">
	<button @click="onClick('clear')">清空</button>
	<button @click="onClick('undo')">撤消</button>
	<button @click="onClick('save')">保存</button>
	<button @click="onClick('openSmooth')">压感{{openSmooth?'开':'关'}}</button>
</view>
```

### 插件标签
- 默认 l-signature 为 component
- 默认 lime-signature 为 demo


## API
### Props

| 参数             | 说明                  | 类型              | 默认值        |
| --------------   | ------------         | ----------------  | ------------ |
| penSize          | 画笔大小              | <em>number</em>   |    `2`           |
| minLineWidth     | 线条最小宽            | <em>number</em>    | `2`        |
| maxLineWidth     | 线条最大宽            | <em>number</em>    | `6`        |
| penColor         | 画笔颜色              | <em>string</em>    | `black`      |
| backgroundColor  | 背景颜色(不填则为透明背景)              | <em>string</em>    | ``      |
| type             | 指定 canvas 类型  **uvue暂不支持**  | <em>string</em> | `2d`  |
| openSmooth       | 是否模拟压感 **uvue暂不支持**          | <em>boolean</em>   | `false`       |
| beforeDelay       | 延时初始化（毫秒）          | <em>number</em>   | `0`       |
| maxHistoryLength   | 限制历史记录数，即最大可撤销数，传入0则关闭历史记录功能           | <em>boolean</em>   | `20`       |
| landscape        | 横屏           | <em>boolean</em>   | ``       |
| disableScroll     | 当在写字时，禁止屏幕滚动以及下拉刷新           | <em>boolean</em>   | `true`       |
| disabled         | 禁用           | <em>boolean</em>   | `false`       |
| boundingBox     | 只生成内容区域，即未画部分不生成，有性能的损耗（微信小程序pc/uvue不支持） | <em>boolean</em>   | `false`       |
| preferToDataURL     | 是否优先使用toDataURL，在支持的环境优先使用`toDataURL`生成图片，图片格式是base64（uvue不支持） | <em>boolean</em>   | `false`       |


### 事件 Events

| 事件名  | 说明         | 回调           |
| ------- | ------------ | -------------- |
| undo | 撤消，回退到上一步 |  |
| clear | 清空，清空画板 |  |
| canvasToTempFilePath | 保存，生成图片，与官方保持一致，但不需要传canvasId |  |

### 常见问题
- 放在弹窗里时，尺寸不对 可以延时手写板出现时机，给手写板加`v-if`
- boundingBox 微信小程序 pc / uvue 不支持, 因为获取不到 ImageData 数据
- backgroundColor 不能设置为`transparent`,填了也没用，我在代码里排除了。因为会导致微信小程序无法生成图片

### 打赏
如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。   
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)