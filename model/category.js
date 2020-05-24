import {Http} from "../utils/http";

class Category {
    static async getHomeCategoryC() {
        const data = await Http.request({
            url: "category/grid/all"
        })
        return data;
    }

}

export {
    Category
}