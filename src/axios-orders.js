import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://bear-burger-builder.firebaseio.com/'
})

export default instance