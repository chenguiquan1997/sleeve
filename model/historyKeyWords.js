/**
 * 历史搜索关键字的模型类
 */
class HistoryKeyWords {
    /**
     * 承装历史关键字的集合
     * @type {*[]}
     */
    keywords = [];

    /**
     * 定义集合的最大容量
     * @type {number}
     */
    MAX_COUNT = 10;

    /**
     * 设置缓存的关键字
     * @type {string}
     */
    key = "searchKey";

    constructor() {
        this.keywords = this._getCacheDataFromStore();
    }

    /**
     *向数组中保存用户输入的关键字
     * @param keyWords
     */
    save(keyWords) {
        //首先判断当前集合中是否已经存在该关键字
        let data = this.keywords.filter(keyWord => keyWords == keyWord);
        if(data.length !== 0) {
            return;
        }
        //判断当前集合是否已满
        let length = this.keywords.length;
        if(length == this.MAX_COUNT) {
            //删除末尾元素，并且把其他元素向前移动一位
            this.keywords.pop();
        }
        //向数组头部添加元素
        this.keywords.unshift(keyWords);
        //刷新缓存
        this.refreshStore(this.key,this.keywords);
    }

    /**
     * 从缓存中删除数据
     */
    clear() {
        this.keywords = [];
        this.refreshStore(this.key,this.keywords);
    }

    /**
     * 获取缓存数据
     * @returns {*[]}
     */
    getKeyWords() {
        return this.keywords;
    }

    /**
     * 刷新小程序缓存
     * @param key
     * @param value
     */
    refreshStore(key,value) {
        wx.setStorageSync(key, value);
    }

    /**
     * 从小程序缓存中获取缓存数据
     * @returns {*[]|*}
     */
    _getCacheDataFromStore() {
        const keywords = wx.getStorageSync(this.key);
        if(!keywords) {
            wx.setStorageSync(this.key,[]);
            return [];
        }
        return keywords;
    }
}

export {
    HistoryKeyWords
}