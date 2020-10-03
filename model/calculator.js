/**
 * 当前类用于计算购物车中的商品总价格
 */
import {Cart} from "./cart";
import {accAdd, accMultiply} from "../utils/number";

class Calculator {

    static cart  = new Cart();

    constructor() {
        if(typeof Calculator.instance === 'object') {
            return Calculator.instance;
        }
        Calculator.instance = this;
        return this;
    }

    /**
     * 获取当前购物车中选中商品的总价格和总数量
     * @returns {[]|number}
     */
    getTotalPriceAndTotalCount() {
        let items = Calculator.cart.cartData;
        let canPriceArr = [];
        let arr = [];
        for(let item of items) {
            //如果当前item符合 未下架、未售罄、checked=true,那么它就符合计算总价的要求
            if(item.sku.online && item.sku.stock>0 && item.checked) {
                canPriceArr.push(item);
            }
        }
        if((canPriceArr.length === 0)) {
            arr.push(0);
            arr.push(0)
            return arr;
        }
        let totalPrice = 0;
        let totalCount = 0;
        for(let item of canPriceArr) {
            if(item.sku.discount_price) {
                totalPrice = accAdd(totalPrice,accMultiply(item.sku.discount_price,item.count));

            }else {
                totalPrice = accAdd(totalPrice,accMultiply(item.sku.price,item.count));
            }
            totalCount = totalCount + item.count;
        }

        arr.push(totalPrice);
        arr.push(totalCount);
        return arr;
    }
}
export {
    Calculator
}