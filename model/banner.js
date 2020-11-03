import {Http} from "../utils/http";
import {BannerItemType} from "../enum/banner-type";

class Banner {
    static locationB = "b-1";
    static locationG = "b-2";

    static async getHomeLocationB() {
        //将异步数据返回
        return await Http.request({
            url: `banner/name/${Banner.locationB}`,
            method: 'GET'
        });
    }

    static async getHomeLocationG() {
        const data = await Http.request({
            url: `banner/name/${Banner.locationG}`,
        })
        return data;
    }

    /**
     * 用户点击Banner中的图片后，会进入相应的界面
     * @param type
     * @param keyword
     */
    static gotoBannerTarget(type, keyword) {
        switch (type) {
            case BannerItemType.SPU:
                wx.navigateTo({
                    url: `/pages/detail/detail?pid=${keyword}`
                })
                break
            case BannerItemType.THEME:
                wx.navigateTo({
                    url: `/pages/theme/theme?tname=${keyword}`
                })
                break
            case BannerItemType.SPU_LIST:
                wx.navigateTo({
                    url: `/pages/theme-spu-list/theme-spu-list?tname=${keyword}`
                })
                break
        }
    }
}

export {
    Banner
}