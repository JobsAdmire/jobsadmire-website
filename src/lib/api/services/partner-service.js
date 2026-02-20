import { env } from '@constants/env'
import { Client } from '../client'

export class PartnerService {
  static client = new Client(env.PARTNER_API_URL)
  
  constructor() {}
  
  static async getPartnersCount() {
    return PartnerService.client.get('/metadata/public/partners-count')
  }
  
  static async createPartnerRequest(data) {
    return PartnerService.client.post(`/public/partner-requests`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`
      }
    })
  }
  
  static async createReferrer(data) {
    return PartnerService.client.post(`/referrers/public`, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`
      }
    })
  }
}
