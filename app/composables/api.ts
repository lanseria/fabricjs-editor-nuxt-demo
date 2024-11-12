import axios, { type AxiosResponse } from 'axios'

const request = axios.create({
  baseURL: '/safedatapushboshite/fourRiskPic',
  timeout: 10000,
  validateStatus: (status: number) => {
    return status >= 200 && status <= 600 // 全部允许, 不会遇到错误就停止
  },

})

export async function responseInterceptor(response: AxiosResponse<any, any>) {
  const data = response.data
  const status = response.status
  if (status === 200 && data.code === 0) {
    return data
  }
  else {
    Message.warning(data)
    return Promise.reject(data)
  }
}

request.interceptors.response.use(responseInterceptor)

export function queryObjList(): Promise<R<any>> {
  return request.get('/obj/list')
}

export function queryUnitList(): Promise<R<any>> {
  return request.get('/unit/list')
}

export function queryPageList(): Promise<R<PageRecord[]>> {
  return request.get('/page/list')
}

export function queryPageById(id: string): Promise<R<PageRecord>> {
  return request.get(`/page/${id}`)
}

export function postPage(data: PageRecord): Promise<R<boolean>> {
  return request.post('/page', data)
}

export function putPage(data: PageRecord): Promise<R<boolean>> {
  return request.put('/page', data)
}

export function deletePage(id: string): Promise<R<boolean>> {
  return request.delete(`/page/${id}`)
}

export function queryLayerList(): Promise<R<any>> {
  return request.get('/layer/list')
}

export function deleteLayer(id: string): Promise<R<boolean>> {
  return request.delete(`/layer/${id}`)
}

export function uploadImage(data: FormData): Promise<R<string>> {
  return request.post(`/upload`, data)
}
