import axios from 'axios'

const superApi=axios.create({
    //baseURL:'http://ec2-3-17-66-232.us-east-2.compute.amazonaws.com:8000/',

    //baseURL:'http://192.168.1.74:3000/'
    baseURL:'http://localhost:3000/'
})

export default superApi