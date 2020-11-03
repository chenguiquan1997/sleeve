import {Http} from "../utils/http";

class Activity {
    /**
     * 获取当前活动的信息
     * @returns {Promise<void>}
     */
    static async getHomeLocationD() {
        const data = await Http.request({
            url: "activity/name/a-2",
        })
        return data;
    }

    /**
     * 获取当前活动的所有可用优惠券
     * @param activityName
     * @returns {Promise<void>}
     */
    static async getActivityCoupons(activityName) {
        const data = await Http.request({
            url: `activity/name/${activityName}/with_coupon`,
        });
        return data;
    }
}

export {
    Activity
}