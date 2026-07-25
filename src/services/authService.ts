import apiClient from './apiClient'

export interface UserSession {
  name: string
  permissions: string[]
}

export async function fetchMe(): Promise<UserSession | null> {
  try {
    const response = await apiClient.get<UserSession>('/auth/me')
    return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      return null
    }
    return null
  }
}

export async function postLogout(): Promise<void> {
  await apiClient.post('/auth/logout')
}
