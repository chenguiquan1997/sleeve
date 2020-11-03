/**
 * 当前类对应于用户订单中的每一个sku
 */
import {accMultiply} from "../utils/number";

class OrderItem {
    sku;
    /**
     * 当前商品的购买数量
     */
    itemCount;
    /**
     * 单一商品的价格
     */
    singleFinalPrice;
    /**
     * 购买当前商品所需的总价格：singleFinalPrice * itemCount
     */
    finalPrice;

    constructor(sku,count) {
        this.sku = sku;
        this.itemCount = count;
        //计算当前商品的单价
        this.calculateSingleFinalPrice();
        //计算当前商品的总价
        this.calculateFinalPrice();
    }

    /**
     * 确定当前商品的单价
     */
    calculateSingleFinalPrice() {
        if(this.sku.discount_price === null) {
            this.singleFinalPrice = this.sku.price;
        }else {
            this.singleFinalPrice = this.sku.discount_price;
        }
    }

    /**
     * 计算当前商品的总价格
     */
    calculateFinalPrice() {
        this.finalPrice = accMultiply(this.singleFinalPrice,this.itemCount);
    }
}

export {
    OrderItem
}
