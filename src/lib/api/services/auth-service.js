import { env } from '@constants/env'
import { Client } from '../client'

export class AuthService {
  static client = new Client(env.AUTH_API_URL)
  
  constructor() {}
  
  static async validateEmailDoesNotExists(email) {
    const response = await AuthService.client.get(`/users/email-exists?email=${email}`)
    
    if (Boolean(response.data)) {
      throw new Error('User with this email already exists')
    }
  }
}
