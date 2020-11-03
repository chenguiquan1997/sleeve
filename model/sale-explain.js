import {Http} from "../utils/http";

/**
 * 获取商品详情页中一些固定数据说明
 */
class SaleExplain {
    static async getSaleExplain() {
        let data = await Http.request({
            url: "sale_explain/fixed",
        });
        return data
    }
}
export {
    SaleExplain
}