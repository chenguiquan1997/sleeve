/**
 * 用于用户下单使用
 */
import {OrderItem} from "./order-item";
import {SkuOffLineException} from "../core/exception/SkuOffLineException";

class Order {
    orderItems = [];

    constructor() {
    }

    /**
     * 校验当前用户的订单中，购买的商品是否达到下单的要求
     * @param serverSkus 从服务器获取的的最新sku集合
     * @param storageSkus 购物车缓存中的sku集合
     */
    checkOrderIsOk(serverSkus,storageSkus) {
        for(let storSku of storageSkus) {
            let flag = false;
            for(let servSku of serverSkus) {
                if(servSku.id === storSku.skuId) {
                    flag = true;
                    //需要判断当前sku是否可以下单
                    //是否下架
                    this.weatherOffLine(servSku);
                    //是否售罄
                    this.weatherSaleOut(servSku);
                    //购买数量是否大于库存数量
                    this.weatherThanMaxStock(servSku,storSku);
                    //购买数量是否大于最大购买数量
                    this.weatherThanMaxBuyCount(storSku);
                    let orderItem = new OrderItem(servSku,storSku.count);
                    this.orderItems.push(orderItem);
                }
            }
            if(flag === false) {
                //如果flag = false，证明当前缓存中的sku已经下架
                let msg = "您购物车中的'".concat(storSku.sku.title).concat("'已经下架,请重新选购");
                throw new SkuOffLineException(msg);
            }
        }
    }

    /**
     * 用户点击 立即购买 时，触发的前端对商品的校验
     * @param serverSku
     * @param count
     */
    checkOrderByimmediateBuy(serverSku,count) {
        //校验商品是否下架
        this.weatherOffLineImmediateBuy(serverSku);
        //校验当前购买数量是否超过最大库存
        this.weatherThanMaxStockByImmediateBuy(serverSku,count);
        //校验当前商品是否售罄
        this.weatherSaleOutImmediateBuy(serverSku);
        if(count > 99) {
            let msg = "您当前购买的商品,超过最大购买数量,请重新选购~";
            throw new SkuSaleOutException(msg);
        }
        let orderItem = new OrderItem(serverSku,count);
        this.orderItems.push(orderItem);
    }

    /**
     * 校验当前sku是否下架
     * @param servSku
     * @returns {boolean}
     */
    weatherOffLine(servSku) {
        if(servSku.online) {
            return true;
        }else {
            let msg = "您购物车中的'".concat(servSku.title).concat("'已下架,请重新选购");
            throw new SkuOffLineException(msg);
        }
    }

    weatherOffLineImmediateBuy(servSku) {
        if(servSku.online) {
            return true;
        }else {
            let msg = "您当前购买的商品已下架,请重新选购~";
            throw new SkuOffLineException(msg);
        }
    }

    /**
     * 校验当前sku是否售罄
     * @param servSku
     */
    weatherSaleOut(servSku) {
        if(servSku.stock === 0) {
            let msg = "您购物车中的'".concat(servSku.title).concat("'已售罄,请重新选购");
            throw new SkuSaleOutException(msg);
        }
    }

    weatherSaleOutImmediateBuy(servSku) {
        if(servSku.stock === 0) {
            let msg = "您当前购买的商品已售罄,请重新选购~";
            throw new SkuSaleOutException(msg);
        }
    }

    /**
     * 校验当前sku购买数量是否大于库存
     * @param servSku
     * @param storSku
     */
    weatherThanMaxStock(servSku,storSku) {
        if(storSku.count > servSku.stock) {
            let msg = "您购物车中的'".concat(servSku.title).concat("'库存不够,请重新选购");
            throw new SkuSaleOutException(msg);
        }
    }

    /**
     * 用户立即购买时，校验是否超过最大库存
     * @param servSku
     * @param count
     */
    weatherThanMaxStockByImmediateBuy(servSku,count) {
        if(count > servSku.stock) {
            let msg = "您购物车中的'".concat(servSku.title).concat("'库存不够,请重新选购");
            throw new SkuSaleOutException(msg);
        }
    }

    /**
     * 校验当前sku购买数量是否大于最大购买数量
     * @param storSku
     */
    weatherThanMaxBuyCount(storSku) {
        if(storSku.count > 99) {
            let msg = "您购物车中的'".concat(storSku.title).concat("'超过最大购买数量,请重新选购");
            throw new SkuSaleOutException(msg);
        }
    }
}

export {
    Order
}