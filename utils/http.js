import {baseURL} from "../config/config";
import {promisic} from "./promise";

class Http {
    /**
     * 使用一个自定义的方法来封装小程序自带的request
     * @param url
     * @param data
     * @param callback 需要一个callback函数，返回服务端的数据
     * @param method
     * 在小程序中，如果方法中的参数想要以json格式传递，那么可以使用({aa,bb,cc})形式
     * 一个函数前面如果添加了async，那么证明这个函数一定会返回一个promise
     */
    static async request({url, data, callback, method = 'GET'}) {
        /**
         * 使用promise将小程序原生的request函数进一步的包装，promise的本质就是：
         * 采用对象的机制，将回调函数的结果，保存起来。只需要在最后获取结果的时候，
         * 才需要执行一次异步回调
         */
        const backData = await promisic(wx.request)({
            url: `${baseURL.url}${url}`,
            data,
            method,
            header: {
                appkey: baseURL.appkey
            }
            //与下面原生的request函数相比，少了异步回调
        })
       // console.log(backData);
        return backData.data;
        /*
        wx.request({
            url:`${baseURL.url}${url}`,
            data,
            method,
            header:{
                appkey: baseURL.appkey
            },
            success:(res)=>{
               callback(res.data);
            }
        })
         */
    }

}

export {
    Http
}