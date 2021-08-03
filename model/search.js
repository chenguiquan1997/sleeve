import {Paging} from "../utils/paging";
import {Http} from "../utils/http";

class Search {
    /**
     * 根据关键字获取相关商品数据
     * @param keyWord
     * @returns {Promise<*>}
     */
    static async getSearchResult(keyWord) {
        let paging = await new Paging({
            url: `lucene/key/spu?keyword=${keyWord}`
        },0,4);
        return paging;
    }

    /**
     * 获取top10热门搜索数据
     * @returns {Promise<*>}
     */
    static async getHotSearchProductsTop10() {
        let data = await Http.request({
            url: "lucene/key/top10",
        })
        return data;
    }

    /**
     * 向服务器添加搜索记录
     * @param keyword
     * @returns {Promise<*>}
     */
    static async addSearchRecords(keyword) {
        let data = await Http.request({
            method: "POST",
            url: `lucene/key/add/hot/record?keyword=${keyword}`
        })
        return data;
    }
}
export {
    Search
}
