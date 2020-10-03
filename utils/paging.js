/*
* 用于分页查询的工具类*/
import {Http} from "./http";

class Paging {
    /**
     * 查询数据的起始序号
     */
    start;
    /**
     * 查询多少条
     */
    count;
    /**
     * 传入的请求参数对象
     */
    req;
    /**
     * 需要有一个对象锁，用于判断是否可以向服务端发送http请求
     * 0:代表没有被获取
     * 1：代表已经被获取
     * @type {number}
     */
    locker = 0;
    /**
     * 存储初始的请求url
     */
    url;
    /**
     * 承装滚动列表瀑布流中spu的数据
     */
    accumulate = [];
    /**
     * 判断是否有更多数据的标志,因为必须为true时，才可以发送执行请求获取数据，所以初始值为true
     */
    isHaveMoreData = true;

    /**
     * Paging类的构造函数
     * @param req
     * @param starter
     * @param counts
     */
    constructor(req,start,count) {
        this.start = start;
        this.count = count;
        this.req = req;
        //当前类的url属性，由于是从构造方法中获取的数据，所以是最原始的数据，
        // 就是v1/spu/latest，不存在被覆盖的情况
        this.url = req.url;
    }
    /**
     *  定义从服务端获取瀑布流商品数据的方法
     * @returns {Promise<{moreData: *, accumulate: *[], items: (*[]|DataTransferItemList), empty: boolean}[]|{moreData: boolean, accumulate: *[], items: *[], empty: boolean}[]>}
     */
    async getHomeSpuList(flag="null") {
        //判断是否有更多数据,这个判断很重要，它可以在前端防止不必要的请求，降低服务器的压力
        if(!this.isHaveMoreData) {
            return null;
        }
        //调用请求之前先获取锁
        if (!this._acquireLock()) {
           return null;
        }
        //调用请求
        let flowSpuListData = await this._requestSpuList(flag);
        //释放锁
        this._releaseLock();
        return flowSpuListData;
    }
    /**
     * 内部真实执行数据请求的方法
     * @returns {Promise<{moreData: *, accumulate: [], items: ([]|DataTransferItemList), empty: boolean}[]|{moreData: boolean, accumulate: [], items: [], empty: boolean}[]>}
     * @private
     */
    async _requestSpuList(flag) {
        //首先获取每次请求之前整理好的url
        const reqObject = this.handleParameter(flag);
        //执行request方法需要返回一个promise，所以需要await
        let splitPageData = await Http.request(reqObject);
        if(splitPageData === null) {
            return null;
        }
        //处理从服务端获取的数据
        //(1)没有请求到数据的情况:
        if(splitPageData.total === 0) {
            return {
                //当前这次请求返回的数据是否为空
                empty:true,
                //是否还有更多的数据
                moreData:false,
                //当前请求的数据
                items:[],
                //每次请求叠加的数据
                accumulate:[]
            }
        }
        //如果当前已经请求到数据，那么还需要判断是否还有更多的数据，以便判断是否需要进行下一次请求
        this.isHaveMoreData = Paging._haveMoreData(splitPageData.page, splitPageData.total_page);
        if(this.isHaveMoreData) {
            //如果确定了在当前请求之后还有数据，那么需要重新拼接request url
            this.start += this.count;
        }
        //将当前的数据追加到accumulate[]中
        this._addDataToAccumulate(splitPageData.items);
        //返回数据
        return {
            empty:false,
            moreData:this.isHaveMoreData,
            items:splitPageData.items,
            accumulate:this.accumulate
        }
    }
    /**
     * 用于向accumulate[]中追加数据
     * @param splitPageData 每一次请求得到的数据
     * @private
     */
    _addDataToAccumulate(splitPageData) {
        this.accumulate = this.accumulate.concat(splitPageData);
    }
    /**
     * 类的内部方法，判断在当前请求之后，是否还有数据
     * @param currentPage 当前数据页
     * @param totalPage   总共数据页
     * @returns {boolean}
     * @private
     */
    static _haveMoreData(currentPage,totalPage) {
        if(currentPage < totalPage-1) {
            return true;
        }
        return false;
    }
    /**
     * 用于获取每次请求数据url的方法
     * @returns {*}
     */
    handleParameter(flag) {
        // v1/spu/latest
        //首先拿到请求参数中的url
        let url = this.url;
        //console.log(url);
        //拼接每次访问服务端的请求参数
        let param = `start=${this.start}&count=${this.count}`;
        if(flag == "search") {
            url = url + '&' + param;
        }else {
            url = url + '?' + param;
        }
        // console.log(url);
        //将最新拼接好的url，存入req对象中
        this.req.url = url;
        console.log("拼接好的url");
        console.log(url);
        return this.req;
    }
    /**
     * 获取锁
     * @private
     */
    _acquireLock() {
        if(this.locker === 0) {
            this.locker = 1;
            return true;
        }
        return false;
    }
    /**
     * 释放锁
     * @private
     */
    _releaseLock() {
        this.locker = 0;
    }
}

export {
    Paging
}