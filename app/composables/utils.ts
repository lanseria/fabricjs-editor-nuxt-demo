/**
 * 将 Blob URL 转换为 File 对象
 * @param blobUrl - Blob URL字符串 (例如: "blob:http://xxx")
 * @param fileName - 可选的文件名 (默认为随机字符串)
 * @returns Promise<File> - 返回转换后的File对象
 * @throws Error - 当URL无效或fetch失败时抛出错误
 */
export async function blobUrlToFile(blobUrl: string, fileName?: string): Promise<File> {
  try {
    // 验证输入URL是否为有效的Blob URL
    if (!blobUrl.startsWith('blob:')) {
      throw new Error('Invalid Blob URL format')
    }

    // 获取Blob数据
    const response = await fetch(blobUrl)
    const blob = await response.blob()

    // 生成默认文件名（如果未提供）
    const defaultFileName = fileName || `file-${Math.random().toString(36).slice(2)}`

    // 根据blob的type判断文件扩展名
    const fileExtension = blob.type.split('/')[1] || ''
    const finalFileName = defaultFileName.includes('.')
      ? defaultFileName
      : `${defaultFileName}.${fileExtension}`

    // 创建File对象
    const file = new File(
      [blob],
      finalFileName,
      {
        type: blob.type,
        lastModified: new Date().getTime(),
      },
    )

    return file
  }
  catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Failed to convert Blob URL to File: ${error.message}`)
    }
    throw new Error('Failed to convert Blob URL to File')
  }
}

/**
 * 验证URL格式是否有效
 * @param url - 要验证的URL字符串
 * @returns boolean - 返回URL是否有效
 */
function isValidUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  }
  catch {
    return false
  }
}

/**
 * 将第三方资源链接转换为Blob URL
 * @param url - 资源的URL地址
 * @param options - 可选的fetch配置项
 * @returns Promise<string> - 返回生成的Blob URL
 * @throws Error - 当fetch失败或资源无效时抛出错误
 */
export async function urlToBlobUrl(url: string, options?: RequestInit): Promise<string> {
  try {
    // 验证URL
    if (!url || !isValidUrl(url)) {
      throw new Error('Invalid URL format')
    }

    // 默认的fetch配置
    const defaultOptions: RequestInit = {
      mode: 'cors',
      credentials: 'omit',
      ...options,
    }

    // 获取资源
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 获取blob数据
    const blob = await response.blob()

    // 创建Blob URL
    const blobUrl = URL.createObjectURL(blob)

    return blobUrl
  }
  catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Failed to convert URL to Blob URL: ${error.message}`)
    }
    throw new Error('Failed to convert URL to Blob URL')
  }
  finally {
    // 注意：返回的Blob URL在不需要时应该通过URL.revokeObjectURL()释放
  }
}
