import {Http} from "../utils/http";

class Detail {
    /**
     *获取spu的信息
     * @param id
     * @returns {Promise<void>}
     */
    static async getProductDetail(id) {
        const data = await Http.request({
            url: `spu/id/${id}/detail`
        })
        return data;
    }

    /**
     * 判断当前spu是否有规格
     * @param spu
     * @returns {boolean} 返回true:无规格 ， 返回false:有规格
     */
    static noHaveSpec(spu) {
        if (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0) {
            return true
        }
        return false
    }


}

export {
    Detail
}