import {Http} from "../utils/http";
import {Paging} from "../utils/paging";

class MyOrder {
    /**
     * 获取当前用户所有订单
     * @returns {Promise<*>}
     */
    static async getAllOrders() {
        let paging = new Paging({
            url: "order/all",
        }, 0, 4);
        return paging;
    }

    /**
     * 获取用户待付款订单
     * @returns {Promise<*>}
     */
    static async getUnpaidOrders() {
        let paging = new Paging({
            url: "order/status/unpaid",
        }, 0, 4);
        return paging;
    }

    /**
     * 获取用户代发货订单
     * @returns {Promise<*>}
     */
    static async getPendingShipment() {
        let paging = new Paging({
            url: "order/by/status/2",
        }, 0, 4);
        return paging;
    }

    /**
     * 获取用户待收货订单
     * @returns {Promise<*>}
     */
    static async getPendingReceipt() {
        let paging = new Paging({
            url: "order/by/status/3",
        }, 0, 4);
        return paging;
    }

    /**
     * 获取用户已完成订单
     * @returns {Promise<*>}
     */
    static async getAlreadyComplete() {
        let paging = new Paging({
            url: "order/by/status/4",
        }, 0, 4);
        return paging;
    }


}
export {
    MyOrder
}