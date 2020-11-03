import {getSlashYMD} from "../../utils/date";

/**
 * 主要用于将优惠券的时间戳日期，转换成为 年/月/日 日期
 */

class CouponData {
    startTime
    endTime
    status

    constructor(coupon, status) {
        Object.assign(this, coupon)
        this.startTime = getSlashYMD(coupon.start_time)
        this.endTime = getSlashYMD(coupon.end_time)
    }
}

export {
    CouponData
}