import axios from "axios";
import apis from "./apis";
import { getAccessToken } from "@/store/getter";

//用于检查是那种请求方式
const regexpRM = /\?__RM__=([A-Z_]+)\b/;

//参考文档 https://github.com/axios/axios
const instance = axios.create({
    baseURL: (runtimeEnvironment.isProduction ? "https://api.jpcoupon.net" : "https://api-test.jpcoupon.net"), //请求基地址
    timeout: 15000, //请求超时时间 15 秒
    headers: {} //额外的请求头 例如 token
});

//请求拦截处理
instance.interceptors.request.use(function (config) {
    //console.log("请求数据", config);
    return config;
}, function (err) {
    //console.log("请求失败", err)
    return !$toast(err.message);
});

//返回拦截处理
instance.interceptors.response.use(function (response) {
    //console.log(response.config.url + " 成功响应", response.data)
    const resData = response.data;
    const resCode = (resData.code || 999);
    if (resCode === 200) {
        return (resData.data || resData.rows);
    } else {
        //是否显示错误提示
        const cfgDat = response.config.data || response.config.params;
        const datType = (typeof cfgDat);
        if(!cfgDat || (datType === "object" && !cfgDat.doNotToastErrMsg) || (datType === "string" && !cfgDat.includes("doNotToastErrMsg"))){
            $toast(resData.msg);
        }
        
        return Promise.reject("[" + resCode + "] " + resData.msg);
    }
}, function (err) {
    //console.log("失败响应", err)
    $toast(err.message);
    return Promise.reject("[000] " + err.message);
});

//通用请求: 集 GET/POST/PUT/DELETE/HEAD 于一体
//使用方式：$request(api, data);
export default function commonRequest(apiName, postData){
    const reqUrl = apis[apiName];
    const matchList = reqUrl?.match(regexpRM); //提取请求方式
    const reqMethod = (matchList && matchList.length >= 2 ? matchList[1] : "");
    const accessToken = getAccessToken();
    const methodType = [];
    
    switch(reqMethod){
        case "POST":
            methodType[0] = "POST";
            methodType[1] = "application/json";
            break;
        case "POST_FU":
            methodType[0] = "POST";
            methodType[1] = "application/x-www-form-urlencoded";
            break;
        case "POST_FD": 
            methodType[0] = "POST";
            methodType[1] = "multipart/form-data";
            break;
        case "PUT": 
            methodType[0] = "PUT";
            methodType[1] = "application/json";
            break;
        case "PUT_FU": 
            methodType[0] = "PUT";
            methodType[1] = "application/x-www-form-urlencoded"; 
            break;
        case "DELETE": 
            methodType[0] = "DELETE";
            methodType[1] = "application/x-www-form-urlencoded";
            break;
        case "HEAD":
            methodType[0] = "HEAD";
            methodType[1] = "application/x-www-form-urlencoded"; 
            break;
        default:  //没有指明方式，也没有参数，则默认为 GET
            methodType[0] = "GET";
            methodType[1] = "application/x-www-form-urlencoded";
            methodType[2] = true; //以查询字符串方式提交数据
            break;
    }
    
    return instance.request({
        url: reqUrl,
        method: methodType[0],
        headers: {
            "Content-Type": methodType[1],
            "Authorization": (accessToken ? `Bearer ${accessToken}` : "")
        },
        data: (!methodType[2] ? postData : undefined),
        params: (!methodType[2] ? undefined : postData)
    });
}