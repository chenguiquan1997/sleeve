import {Http} from "../utils/http";

class Activity {
    static async getHomeLocationD() {
        const data = await Http.request({
            url: "activity/name/a-2",
        })
        return data;
    }
}

export {
    Activity
}