import {Paging} from "../utils/paging";

class Search {
    static async getSearchResult(keyWord) {
        let data = await new Paging({
            url: `search?q=${keyWord}`
        },0,10);
        return data;
    }
}
export {
    Search
}