import axios, { type AxiosResponse } from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

export const TOKEN_STORAGE_KEY = 'EZXR_CHATGPT_KEY'

service.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
