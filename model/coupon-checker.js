import {CouponBo} from "./coupon-bo";
import {CouponType} from "../enum/coupon-type";
import {accAdd} from "../utils/number";

class CouponChecker {

    /**
     * 检验优惠券的可用和不可用
     * @param coupons 当前用户所有可用的优惠券
     * @param orderItems 当前用户所购买的所有商品
     * @param totalPrice 当前用户购买的商品的总价格
     */
    couponChecker(coupons,orderItems,totalPrice) {
        //用于承装校验过后的优惠券集合
        let couponSelector = [];
        for(let coupon of coupons) {
            let couponBo = new CouponBo(coupon);
            //1.满减
            if (coupon.type === CouponType.FULL_MINUS) {
                //是否全场通用
                if (coupon.whole_store) {
                    //无需考虑品类限制问题
                    this.wholeStoreCanUse(couponBo, coupon, couponSelector, totalPrice);
                } else {
                    //对品类进行校验
                    this.categoryLimit(couponBo, orderItems, couponSelector);
                }
            }
            //2.折扣
            else if (coupon.type === CouponType.FULL_OFF) {
                //是否全场通用
                if (coupon.whole_store) {
                    //无需考虑品类限制问题
                    this.wholeStoreCanUse(couponBo, coupon, couponSelector, totalPrice);
                } else {
                    //对品类进行校验
                    this.categoryLimit(couponBo, orderItems, couponSelector);
                }
            }
            //3.无门槛
            else if (coupon.type === CouponType.NO_THRESHOLD_MINUS) {
                //直接可以使用
                this.addCouponsByUse(couponBo, couponSelector);
            }
            //4.其他类型优惠券
            else {
                //直接将当前优惠券变为不可用状态
                this.addCouponsByNoUse(couponBo, couponSelector);
            }
        }
        return couponSelector;
    }

    /**
     * 将可用的优惠券加入集合的头部
     * @param couponBo
     * @param couponSelector
     */
    addCouponsByUse(couponBo,couponSelector) {
        couponBo.useable = true;
        couponSelector.unshift(couponBo);
        //break;
    }

    /**
     * 将不可用的优惠券加入集合的头部
     * @param couponBo
     * @param couponSelector
     */
    addCouponsByNoUse(couponBo,couponSelector) {
        couponSelector.push(couponBo);
        //break;
    }

    /**
     * 校验有使用品类限制的优惠券，是否适用于当前订单
     * @param couponBo
     * @param orderItems
     * @returns {boolean}
     */
    checkCouponCategory(couponBo,orderItems) {
        if(couponBo.categoryIds.length < 1) {
            return false;
        }
        let categoryIds = couponBo.categoryIds;
        let totalPrice = 0;
        for(let orderItem of orderItems){
            //如果当前商品所属的分类在当前优惠券可使用的集合中
            let id = orderItem.sku.category_id;
            if(categoryIds.includes(id)) {
                totalPrice = accAdd(totalPrice,orderItem.finalPrice);
            }
        }
        //校验符合满减的商品总价，是否达到满减的条件
        if(totalPrice > couponBo.fullMoney) {
            return true;
        }
    }

    /**
     * 判断当优惠券类型为折扣券，并且为全场券时，当前订单是否可用
     * @param coupon
     * @param totalPrice
     * @returns {boolean}
     */
    wholeStoreDiscount(coupon,totalPrice) {
        if(totalPrice > coupon.full_money) {
            return true;
        }
    }

    /**
     * 优惠券全场通用执行的业务逻辑逻辑
     * @param couponBo
     * @param coupon
     * @param couponSelector
     * @param totalPrice
     */
    wholeStoreCanUse(couponBo,coupon,couponSelector,totalPrice) {
        let flag = this.wholeStoreDiscount(coupon,totalPrice);
        if(flag) {
            this.addCouponsByUse(couponBo,couponSelector);
        }else {
            this.addCouponsByNoUse(couponBo,couponSelector);
        }
    }

    /**
     * 优惠券品类限制执行的业务逻辑
     * @param couponBo
     * @param orderItems
     * @param couponSelector
     */
    categoryLimit(couponBo,orderItems,couponSelector) {
        let flag = this.checkCouponCategory(couponBo,orderItems);
        //表示当前优惠券可以使用
        if(flag) {
            this.addCouponsByUse(couponBo,couponSelector);
        }else {
            //当前优惠券不可使用
            this.addCouponsByNoUse(couponBo,couponSelector);
        }
    }

}

export {
    CouponChecker
}