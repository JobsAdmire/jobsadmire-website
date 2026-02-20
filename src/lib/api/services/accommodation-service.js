import { env } from '@constants/env'
import { Client } from '../client'

export class AccommodationService {
  static client = new Client(env.ACCOMMODATION_API_URL)

  constructor() {}

  static async getCountries() {
    return AccommodationService.client.get('/metadata/countries')
  }

  static async getCities(params) {
    return AccommodationService.client.get('/metadata/cities', {
      params: params
    })
  }
}
