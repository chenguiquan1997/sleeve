import {baseURL} from "../config/config";
import {promisic} from "./promise";
import {Token} from "../model/token";
import {codes} from "../config/exception-config";
import {HttpException} from "../core/exception/HttpException";

class Http {
    /**
     * 使用一个自定义的方法来封装小程序自带的request
     * @param url
     * @param data
     * @param callback 需要一个callback函数，返回服务端的数据
     * @param method
     * 在小程序中，如果方法中的参数想要以json格式传递，那么可以使用({aa,bb,cc})形式
     * 一个函数前面如果添加了async，那么证明这个函数一定会返回一个promise
     * @param refetch
     * @param throwError
     */
    static async request({   url,
                             data,
                             callback,
                             method = 'GET',
                             refetch = true,
                             throwError = false}) {
        /**
         * 使用promise将小程序原生的request函数进一步的包装，promise的本质就是：
         * 采用对象的机制，将回调函数的结果，保存起来。只需要在最后获取结果的时候，
         * 才需要执行一次异步回调
         */
        let backData;
        try {
            backData = await promisic(wx.request)({
                url: `${baseURL.url}${url}`,
                data,
                method,
                header: {
                    'content-type': 'application/json',
                    appkey: baseURL.appkey,
                    'authorization': `Bearer ${wx.getStorageSync('token')}`
                }
                //与下面原生的request函数相比，少了异步回调
            });
            //return backData.data;
        }catch {
           //网络错误时可以抛出异常
            if (throwError) {
                throw new HttpException(11111, codes[11111]);
            }
            Http.showError(11111);
            return null;
        }
        // console.log("backData:");
        // console.log(backData);
        const code = backData.statusCode.toString();
        if (code.startsWith('2')) {
            //console.log(backData);
            return backData.data
        }else {
            // 401表示token授权失败
            if(code === '401') {
                console.log("Http出现401异常");
                if (refetch) {
                    Http._refetch({
                        url,
                        data,
                        refetch,
                        method
                    })
                    console.log("第二次Http重试");
                }
            }else {
                //如果throwError==true,那么证明不需要当前程序主动处理异常，需要对异常进行个性化处理
                if (throwError) {
                    console.log("抛出自定义异常");
                    console.log(backData);
                    throw new HttpException(backData.data.code, backData.data.message, code);
                }
                if (code === '404') {
                    if (backData.data.code !== undefined) {
                        return null;
                    }
                    return backData.data;
                }
                const error_code = backData.data.code;
                Http.showError(error_code, backData.data);
            }
        }
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

        // const backData = await promisic(wx.request)({
        //     url: `${baseURL.url}${url}`,
        //     data,
        //     method,
        //     header: {
        //         'content-type': 'application/json',
        //         appkey: baseURL.appkey,
        //         'authorization': `Bearer ${wx.getStorageSync('token')}`
        //     }
        //     //与下面原生的request函数相比，少了异步回调
        // })
        // // console.log(backData);
        // return backData.data;
    }

    /**
     *
     * @param url
     * @param data
     * @param refetch
     * @param method
     * @returns {Promise<null>}
     * @private
     */
    static async _refetch({   url,
                              data,
                              refetch,
                              method}) {
        const token = new Token();
        await token.getTokenFromServer();
        refetch = false;
        return await Http.request({url,data,refetch,method});
    }
    /**
     * 前端异常同一处理和显示
     * @param error_code 服务端给到前端的错误码
     * @param serverError 服务端给到前端的错误信息
     */
    static showError(error_code, serverError) {
        let tip;
        console.log(error_code);

        if (!error_code) {
            tip = codes[99999];
        } else {
            if (codes[error_code] === undefined) {
                tip = serverError.message;
            } else {
                tip = codes[error_code];
            }
        }
        /**
         * 在单一的js文件中，是不可以使用第三方组件的，因为组件必须要依赖于wxml文件
         */
        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        })
    }
}

export {
    Http
}