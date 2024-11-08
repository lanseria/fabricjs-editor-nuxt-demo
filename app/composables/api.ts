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

export function queryObjList(): Promise<any> {
  return request.get('/obj/list')
}

export function queryUnitList(): Promise<any> {
  return request.get('/unit/list')
}

export function queryPageList(): Promise<any> {
  return request.get('/page/list')
}

export function postPage(data: PageRecord): Promise<boolean> {
  return request.post('/page', data)
}

export function deletePage(id: string): Promise<boolean> {
  return request.delete(`/page/${id}`)
}

export function queryLayerList(): Promise<any> {
  return request.get('/layer/list')
}

export function postLayer(data: PolygonWithTextOptions): Promise<boolean> {
  return request.post('/layer', data)
}

export function putLayer(data: PolygonWithTextOptions): Promise<boolean> {
  return request.put('/layer', data)
}
export function deleteLayer(id: string): Promise<boolean> {
  return request.delete(`/layer/${id}`)
}
