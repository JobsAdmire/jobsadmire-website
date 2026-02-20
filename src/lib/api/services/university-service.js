import { env } from '../../constants/env'
import { Client } from '../client'

export class UniversityService {
  
  static client = new Client(env.UNIVERSITY_API_URL)
  
  constructor() {}
  
  static async getAllPrograms(params) {
    return UniversityService.client.get('/programs', { params })
  }

  static async getAllProgramsNames(params) {
    return UniversityService.client.get('/programs/all-names', { params })
  }

  static getCountries() {
    return UniversityService.client.get('/universities/countries')
  }

  static async getUniversitiesIdsAndNames() {
    return UniversityService.client.get('/universities/ids-and-names')
  }

  static async getUniversitiesCount() {
    return UniversityService.client.get('/metadata/public/universities-count')
  }
}
