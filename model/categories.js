import {Http} from "../utils/http";

/**
 * 分类页面的模型类
 */
class Categories {
    /**
     * 一级分类数据
     * @type {*[]}
     */
    roots = [];
    /**
     * 所有二级分类数据
     * @type {*[]}
     */
    subs = [];

    /**
     * 获得分类页面的所有数据
     * @returns {Promise<void>}
     */
    async getAll() {
        const data = await Http.request({
            url: "category/all",
        })
        console.log(data);
        this.roots = data.roots;
        this.subs = data.subs;
    }

    /**
     * 获取当前分类页面中所有的一级分类数据
     * @returns {[]}
     */
    getRoots() {
        return this.roots;
    }

    /**
     * 获取当前页面中，用户点击的一级分类中的数据
     * @param rootId
     * @returns {*}
     */
    getCurrentRoot(rootId) {
        //这里只需要比较root.id和rootId的数值是否相等即可
        return this.roots.find(root => root.id == rootId);
    }

    /**
     *
     * @param parentId
     * @returns {*[]}
     */
    getSubs(parentId) {
        //filter方法会返回一个符合条件的新数组
        return this.subs.filter(sub=> sub.parent_id == parentId);
    }
}

export {
    Categories
}