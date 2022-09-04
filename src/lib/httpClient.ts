import axios from 'axios'

let axiosInstance = axios.create()

export const httpClient = axiosInstance
