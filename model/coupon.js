import {Http} from "../utils/http";

class Coupon {
    /**
     * 根据 coupon id 领取相应的优惠券
     * @param id 优惠券id
     * @returns {Promise<null>}
     */
    static async collectCoupon(id) {
        const data = await Http.request({
            method: "POST",
            url: `coupon/collect/${id}`,
            throwError: true
        })
        return data;
    }

    /**
     * 获取当前用户“已领取，未使用”的优惠券
     * 此接口用于下单时检验用户的优惠券是否可以使用，所以需要携带分类数据
     * @returns {Promise<null>}
     */
    static async getMyCoupon() {
        const data = await Http.request({
            method: "GET",
            url: `coupon/myself/available/with_category`,
            //throwError: true
        })
        return data;
    }

    /**
     * 获取当前spu可以使用的所有优惠券
     * @param categoryId
     * @returns {Promise<null>}
     */
    static async getCurrSpuCanUseCoupons(categoryId) {
        const data = await Http.request({
            method: "GET",
            url: `coupon/by/category/${categoryId}`,
            throwError: true
        })
        return data;
    }

    /**
     * 获取当前用户不同状态的优惠券
     * 1：已领取，未使用
     * 2：已领取，已使用
     * 3：已领取，已过期
     * @param status
     * @returns {Promise<*>}
     */
    static async getUserCoupons(status) {
        const data = await Http.request({
            method: "GET",
            url: `coupon/myself/by/status/${status}`
        })
        return data;
    }

}

export {
    Coupon
}