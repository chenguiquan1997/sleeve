class OrderPost {
    //应付金额
    total_price
    //实付金额
    final_total_price
    //优惠券id
    coupon_id
    //购买的sku集合
    sku_info_list = []
    //用户收货地址
    address = {}

    constructor(totalPrice, finalTotalPrice, couponId, skuInfoList, address) {
        this.total_price = totalPrice
        this.final_total_price = finalTotalPrice
        this.coupon_id = couponId
        this.sku_info_list = skuInfoList
        this._fillAddress(address)
    }

    _fillAddress(address) {
        this.address.user_name = address.userName
        this.address.national_code = address.nationalCode
        this.address.postal_code = address.postalCode
        this.address.city = address.cityName
        this.address.province = address.provinceName
        this.address.county = address.countyName
        this.address.detail = address.detailInfo
        this.address.mobile = address.telNumber
    }
}

export {
    OrderPost
}