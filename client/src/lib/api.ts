import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL,
})

type GetTokenFn = () => Promise<string | null>

export function setupInterceptors(getToken: GetTokenFn) {
  // Avoid adding multiple interceptors if called more than once
  const alreadySet = (api.defaults as any)._authInterceptorSet
  if (alreadySet) return

  const interceptorId = api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken()
      console.log('[API Interceptor] Token retrieved:', token ? `${token.substring(0, 20)}...` : 'null')
      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (err) {
      console.error('[API Interceptor] Error getting token:', err)
    }
    return config
  })

  ;(api.defaults as any)._authInterceptorSet = interceptorId
  console.log('[API Interceptor] Setup complete')
}

export default api
