import {Paging} from "../utils/paging";

/**
 * Home页面获取瀑布流数据的业务类
 */
class FlowerSpu {
    static async getHomeWaterFlowerSpuList() {
        let paging = new Paging({
            url: "spu/latest",
        }, 0, 4);
        return paging;
    }

    static async getGridWaterFlowerSpuList(id) {
        let paging = new Paging({
            url: `spu/by/category/${id}`,
            data: {
                isRoot: 'true',
            },
        }, 0, 4);
        return paging;
    }
}

export {
    FlowerSpu
}