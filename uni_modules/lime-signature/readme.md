# LimeSignature 写字板
一款用于业务签名等场景的写字板插件，支持横屏、压感模拟、撤销/重做等功能。

## 文档链接
📚 详细文档请访问以下站点：
- [signature 文档 - 站点1](https://limex.qcoon.cn/components/signature.html)
- [signature 文档 - 站点2](https://limeui.netlify.app/components/signature.html)
- [signature 文档 - 站点3](https://limeui.familyzone.top/components/signature.html)

## 安装方法
1. 在 uni-app 插件市场中搜索并导入 `lime-signature`
2. 导入后可能需要重新编译项目。


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
### Uniapp
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

### Uniappx

```js
import {LimeSignatureToTempFilePathOptions, LimeSignatureToFileSuccess} from '@/uni_modules/lime-signature'
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
					success: (res: LimeSignatureToFileSuccess) => {
						// 是否为空画板 无签名
						console.log(res.isEmpty)
						// 生成图片的临时路径
						// H5 生成的是base64
						this.url = res.tempFilePath
					}
				} as LimeSignatureToTempFilePathOptions)
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


## API 文档

### Props
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `penSize` | 画笔大小 | `number` | `2` |
| `minLineWidth` | 线条最小宽度 | `number` | `2` |
| `maxLineWidth` | 线条最大宽度 | `number` | `6` |
| `penColor` | 画笔颜色 | `string` | `black` |
| `backgroundColor` | 背景颜色（透明背景需留空） | `string` | `` |
| `openSmooth` | 是否模拟压感 | `boolean` | `false` |
| `landscape` | 横屏模式 | `boolean` | `false` |
| `disableScroll` | 禁用滚动 | `boolean` | `true` |
| `disabled` | 禁用写字板 | `boolean` | `false` |

### 事件
| 事件名 | 说明 |
| --- | --- |
| `undo` | 撤销操作 |
| `clear` | 清空画板 |
| `canvasToTempFilePath` | 保存为图片 |


## 支持与赞赏
如果你觉得本插件解决了你的问题，可以考虑支持作者：
| 支付宝赞助 | 微信赞助 |
|------------|------------|
| ![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png) | ![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png) |