
import vm from '../main'



export function login(userInfo){
   return vm.$http.post('/api/user/login',userInfo);
}

export function register(userInfo){
    return vm.$http.post('/api/user/register', userInfo);
}
export function getCode(email){
    return vm.$http.post('/api/email/send', {
        email
    })
}
