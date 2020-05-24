import {Http} from "../utils/http";

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
}

export {
    Banner
}