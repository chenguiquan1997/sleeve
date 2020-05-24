import {Http} from "../utils/http";

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