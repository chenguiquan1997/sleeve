/**
 * 优惠券类型
 * @type {{FULL_OFF: number, FULL_MINUS: number, NO_THRESHOLD_MINUS: number}}
 */
const CouponType = {
    //满减券
    FULL_MINUS: 1,
    //折扣券
    FULL_OFF: 2,
    //无门槛券
    NO_THRESHOLD_MINUS: 3
}

export {
    CouponType
}