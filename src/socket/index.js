import Socket from './js/socket.io.js'
import store from '../store/index'
export default function (url='https://chat.humraja.xyz') {
    return new Promise(function (resolve) {
        let startDate = 0
        let timer = null
        let socket = Socket(url)
        timer = setInterval(()=>{
            if(startDate>=3000){
                console.log(socket.close())
                console.log('socket超时')
                clearInterval(timer)
                timer = null
                resolve(false)
            }else if(socket.id!==undefined){
                console.log('socket连接成功')
                clearInterval(timer)
                timer = null
                store.commit('socket/joinSocket',socket)
                resolve(true)
            }
            startDate+=100
        },100)
    })
}