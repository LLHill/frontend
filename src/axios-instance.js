import axios from 'axios'
import serverUrl from './util/serverUrl'

const instance = axios.create({
  baseURL: serverUrl
})

export default instance