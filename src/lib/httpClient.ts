import ky from 'ky'

const kyInstance = ky.extend({})

export const httpClient = kyInstance
