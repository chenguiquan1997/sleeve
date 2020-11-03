/**
 *
 */
import {baseURL} from "../config/config";
import {promisic} from "../utils/promise";



class Token {
    /**
     * 获取token的接口地址
     */
    tokenUrl;
    /**
     * 校验token的接口地址
     */
    verifyUrl;

    constructor() {
        this.tokenUrl = baseURL.url + "token/getToken";
        this.verifyUrl = baseURL.url + "token/verify";
    }

    /**
     * 校验当前缓存中的token令牌是否有效，如果无效，则从服务器重新获取
     * @returns {Promise<void>}
     */
    async verify() {
        const token = wx.getStorageSync('token');
        if (!token) {
            await this.getTokenFromServer();
        } else {
            await this._verifyFromServer(token);
        }
    }

    /**
     * 从服务器获取token令牌
     * @returns {Promise<*>}
     */
    async getTokenFromServer() {
        // code
        const r = await wx.login();
        const code = r.code;

        const res = await promisic(wx.request)({
            url: this.tokenUrl,
            method: 'POST',
            data: {
                account: code,
                type: 0
            },
        })
        wx.setStorageSync('token', res.data.token);
        console.log("getTokenFromServer中的token");
        console.log(res.data.token);
        return res.data.token;
    }

    /**
     * 去服务器校验当前的token令牌是否有效
     * @param token
     * @returns {Promise<*>}
     * @private
     */
    async _verifyFromServer(token) {
        const res = await promisic(wx.request)({
            url: this.verifyUrl,
            method: 'POST',
            data: {
                token
            }
        });

        const valid = res.data.is_valid;
        if (!valid) {
            return this.getTokenFromServer();
        }
    }

}

export {
    Token
}