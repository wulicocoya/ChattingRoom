
var validateEmail2 = (rule, value, callback) => {
  //正则表达式 验证邮箱格式
  if (false) {
    callback(new Error("请输入正确的邮箱"));
  } else {
    callback();
  }
};


//注册验证规则
export const RegisterRules =  {
    email: [
      { requied:true,message:"请输入邮箱", trigger: "blur" },
      { validator: validateEmail2, trigger: "change" },
    ],
    password: [{ min:6,max:16,required:true,message:"长度在8到16个字符" , trigger: "blur" }],
    code: [{ requied:true,message:"验证码", trigger: "blur" }]
}
//登录验证规则
export const loginRules = {
    email: [
      { requied:true,message:"请输入邮箱", trigger: "blur" },
      { validator: validateEmail2, trigger: "change" },
    ],
    password: [{ min:6,max:16,required:true,message:"长度在8到16个字符" , trigger: "blur" }]
}

//更换密码
export const updateRules =  {
  email: [
    { required:true,message:"请输入邮箱" },
    { validator: validateEmail2, message:"邮箱格式有误"},
  ],
  password: [{ min:6,max:16,required:true,message:"长度在8到16个字符"}],
  code: [{ required:true,message:"请输入验证码"}]
}