import {Paging} from "../utils/paging";

class Search {
    static async getSearchResult(keyWord) {
        let data = await new Paging({
            url: `lucene/key/spu?keyword=${keyWord}`
        },0,5);
        return data;
    }
}
export {
    Search
}
