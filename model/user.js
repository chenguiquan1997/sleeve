import {Http} from "../utils/http";

class User {

    /**
     * 用户信息在缓存中的数据key
     * @type {string}
     */
    static STORAGE_KEY = "userInfo";
    /**
     * 用户信息
     * @type {*[]}
     */
    static userInfo = null

    /**
     * 单例模式
     * @returns {Cart|Cart}
     */
    constructor() {
        if(typeof User.instance === 'object') {
            return User.instance;
        }
        User.instance = this;
        console.log('进入构造函数');
        this.getUserInfos();
        return this;
    }

    /**
     * 从缓存中获取用户数据
     * @returns {*[]}
     * @private
     */
    getUserInfos() {
        //判断当前cartData对象是否为null
        if(this.userInfo !== null) {
            return this.userInfo;
        }
        console.log('进入缓存中获取')
        //如果为null，那么需要从缓存中获取
        let data = this._getStorage();
        //如果data为null，那么需要在小程序缓存中初始化数据
        console.log(data)
        if(!data) {
            data = this.initUserInfo();
        }
        console.log('this.userInfo :')
        console.log(this.userInfo)
        this.userInfo = data;
        return this.userInfo;
    }

    /**
     * 从缓存中获取数据
     * @returns {*}
     * @private
     */
    _getStorage() {
        return wx.getStorageSync(User.STORAGE_KEY);
    }

    /**
     *
     * @param data
     * @private
     */
    _setStorage(data) {
        wx.setStorageSync(User.STORAGE_KEY,data)
    }

    /**
     *
     * @param data 用户信息
     */
    setStorage(data) {
        this._setStorage(data)
    }

    /**
     * 初始化cartData数据
     * @returns {[]}
     */
    initUserInfo() {
        const userInfo = {};
        wx.setStorageSync(User.STORAGE_KEY, userInfo);
        return userInfo;
    }

    /**
     * 保存用户信息
     * @param userInfo
     * @returns {Promise<null>}
     */
     async saveUser(userInfo) {
        const data = await Http.request({
            url: 'user/save',
            data: userInfo,
            method: 'POST'
        })
        return data;
     }

    /**
     * 根据昵称，获取用户信息
     * @param nickName
     * @returns {Promise<null>}
     */
    async getUser(nickName) {
        const data = await Http.request({
            url: 'user/searchUser',
            data: {
               nickName: nickName
            },
            method: 'POST'
        })
        return data;
    }
}
export {
    User
}
