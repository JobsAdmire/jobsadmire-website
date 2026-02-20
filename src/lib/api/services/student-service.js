import { env } from '@constants/env'
import { Client } from '../client'

export class StudentService {
  static client = new Client(env.STUDENT_API_URL)
  
  constructor() {}
  
  static async getStudentsCount() {
    return StudentService.client.get('/metadata/public/students-count')
  }
  static async getCountries () {
    return StudentService.client.get('/students/countries')
  }
}
