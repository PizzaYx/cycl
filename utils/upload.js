// utils/upload.js
const BASE_URL = 'http://192.168.0.118:8089'

/**
 * 上传单个文件
 * @param {string} filePath - 文件路径
 * @param {object} options - 配置选项
 * @param {string} options.url - 上传接口地址，默认为 '/api/merchantapi/webupload'
 * @param {string} options.name - 文件对应的 key，默认为 'file'
 * @param {object} options.formData - 额外的表单数据
 * @param {object} options.header - 额外的请求头
 * @returns {Promise} 返回上传结果
 */
export function uploadFile(filePath, options = {}) {
    const {
        url = '/api/merchantapi/webupload',
        name = 'file',
        formData = {},
        header = {}
    } = options

    console.log('准备上传文件:', filePath)

    return new Promise((resolve, reject) => {
        // 获取token
        const accessToken = uni.getStorageSync('access_token')

        // 构建完整URL
        const fullUrl = url.startsWith('http') ? url : BASE_URL + url

        // 合并请求头
        const finalHeader = {
            'authorization': accessToken ? `Bearer ${accessToken}` : '',
            ...header
        }

        uni.uploadFile({
            url: fullUrl,
            filePath: filePath,
            name: name,
            formData: formData,
            header: finalHeader,
            success: (uploadFileRes) => {
                console.log('文件上传成功 - 状态码:', uploadFileRes.statusCode)
                console.log('文件上传成功 - 原始数据:', uploadFileRes.data)

                try {
                    // 解析返回的数据
                    const result = JSON.parse(uploadFileRes.data)
                    console.log('解析后的上传结果:', result)

                    // 根据API返回结构来处理
                    if (result.code === 200) {
                        // 返回包含完整信息的对象，主要是url用于显示图片
                        const uploadResult = {
                            url: result.url,                    // 完整的图片URL，用于显示
                            fileName: result.fileName,          // 服务器文件路径
                            newFileName: result.newFileName,    // 新文件名
                            originalFilename: result.originalFilename, // 原始文件名
                            msg: result.msg
                        }
                        console.log('处理后的上传结果:', uploadResult)
                        resolve(uploadResult)
                    } else {
                        console.error('上传API返回错误:', result)
                        reject(new Error(result.msg || '上传失败'))
                    }
                } catch (parseError) {
                    console.error('解析上传结果失败:', parseError)
                    console.log('原始返回数据:', uploadFileRes.data)
                    // 如果解析失败，直接返回原始数据
                    resolve(uploadFileRes.data)
                }
            },
            fail: (error) => {
                console.error('文件上传失败:', error)
                reject(error)
            }
        })
    })
}

/**
 * 批量上传多个文件
 * @param {Array} filePaths - 文件路径数组
 * @param {object} options - 配置选项
 * @returns {Promise} 返回所有文件的上传结果数组
 */
export function uploadMultipleFiles(filePaths, options = {}) {
    console.log('批量上传文件:', filePaths)

    return Promise.all(
        filePaths.map(filePath => uploadFile(filePath, options))
    )
}

/**
 * 选择并上传图片（带进度提示）
 * @param {object} chooseOptions - 选择图片的配置
 * @param {number} chooseOptions.count - 最多可以选择的图片张数，默认9张
 * @param {Array} chooseOptions.sizeType - 所选的图片的尺寸，默认['compressed']
 * @param {Array} chooseOptions.sourceType - 选择图片的来源，默认['album', 'camera']
 * @param {object} uploadOptions - 上传配置选项
 * @param {Function} onProgress - 上传进度回调函数 (current, total, result) => {}
 * @returns {Promise} 返回上传结果数组
 */
export function chooseAndUploadImages(chooseOptions = {}, uploadOptions = {}, onProgress = null) {
    const {
        count = 9,
        sizeType = ['compressed'],
        sourceType = ['album', 'camera']
    } = chooseOptions

    return new Promise((resolve, reject) => {
        uni.chooseImage({
            count,
            sizeType,
            sourceType,
            success: async (res) => {
                const totalCount = res.tempFilePaths.length
                const results = []
                let currentIndex = 0

                // 显示初始加载提示
                uni.showLoading({
                    title: `上传中 0/${totalCount}`
                })

                try {
                    // 逐个上传图片，显示进度
                    for (const filePath of res.tempFilePaths) {
                        currentIndex++

                        // 更新加载提示
                        uni.showLoading({
                            title: `上传中 ${currentIndex}/${totalCount}`
                        })

                        const uploadResult = await uploadFile(filePath, uploadOptions)
                        results.push(uploadResult)

                        // 调用进度回调
                        if (onProgress && typeof onProgress === 'function') {
                            onProgress(currentIndex, totalCount, uploadResult)
                        }

                        console.log(`图片上传进度: ${currentIndex}/${totalCount}`, uploadResult)
                    }

                    uni.hideLoading()
                    console.log('所有图片上传完成:', results)
                    resolve(results)
                } catch (error) {
                    uni.hideLoading()
                    console.error('图片上传失败:', error)
                    uni.showToast({
                        title: `第${currentIndex}张图片上传失败`,
                        icon: 'none'
                    })
                    reject(error)
                }
            },
            fail: (error) => {
                console.error('选择图片失败:', error)
                reject(error)
            }
        })
    })
}

/**
 * 上传图片到指定接口（商户认证专用）
 * @param {string} filePath - 文件路径
 * @returns {Promise} 返回上传结果
 */
export function uploadMerchantImage(filePath) {
    return uploadFile(filePath, {
        url: '/api/merchantapi/webupload',
        name: 'file'
    })
}

/**
 * 处理上传结果，提取需要的字段
 * @param {object} uploadResult - 上传API返回的结果
 * @returns {object} 处理后的结果对象
 */
export function processUploadResult(uploadResult) {
    // 如果已经是处理过的结果对象，直接返回
    if (uploadResult && uploadResult.url && uploadResult.fileName) {
        return uploadResult
    }

    // 如果是原始字符串格式，尝试解析
    if (typeof uploadResult === 'string') {
        try {
            const parsed = JSON.parse(uploadResult)
            if (parsed.code === 200) {
                return {
                    url: parsed.url,
                    fileName: parsed.fileName,
                    newFileName: parsed.newFileName,
                    originalFilename: parsed.originalFilename,
                    msg: parsed.msg
                }
            }
        } catch (error) {
            console.error('解析上传结果失败:', error)
        }
    }

    return uploadResult
}

export default {
    uploadFile,
    uploadMultipleFiles,
    chooseAndUploadImages,
    uploadMerchantImage,
    processUploadResult
}
