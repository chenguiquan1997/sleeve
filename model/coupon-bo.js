class CouponBo {
    id;
    //优惠券类型
    type;
    //满减条件
    fullMoney;
    //折扣率
    rate;
    //满减金额
    minus;
    startTime;
    endTime;
    //是否全场通用
    wholeStore;
    title;
    //当前优惠券是否可以使用
    useable;
    //当前优惠券适用于哪些商品的id集合
    categoryIds;

    constructor(coupon) {
        this.type = coupon.type
        this.fullMoney = coupon.full_money
        this.rate = coupon.rate
        this.minus = coupon.minus
        this.id = coupon.id
        this.startTime = coupon.start_time
        this.endTime = coupon.end_time
        this.wholeStore = coupon.whole_store
        this.title = coupon.title
        this.useable = false
        this.categoryIds = coupon.category_list.map(category => {
            return category.id
        })
    }
}
export {
    CouponBo
}