import {Http} from "../utils/http";

class Tag {
    static async getHotTags() {
        let data = await Http.request({
            url: "tag/type/1",
        })
        return data;
    }
}
export {
    Tag
}