/**
 * 当前类用于操作用户收货地址
 */
class Address {

    static STORAGE_KEY = "address";

    constructor() {
        if(typeof Address.instance === 'object') {
            return Address.instance;
        }
        Address.instance = this;
        return this;
    }

    storeAddress(address) {
        wx.setStorageSync(Address.STORAGE_KEY, address);
    }

    getAddress() {
        return wx.getStorageSync(Address.STORAGE_KEY);
    }

}

export {
    Address
}