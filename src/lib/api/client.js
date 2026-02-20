import axios from 'axios'

export class Client {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL: `${baseURL}api`,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
  
  async get(url, config) {
    return this.instance.get(url, config)
  }
  
  async post(url, data, config) {
    return this.instance.post(url, data, config)
  }
  
  async put(url, data, config) {
    return this.instance.put(url, data, config)
  }
  
  async delete(url, config) {
    return this.instance.delete(url, config)
  }
  
  async patch(url, data, config) {
    return this.instance.patch(url, data, config)
  }
}
