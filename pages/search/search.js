// pages/search/search.js
import {HistoryKeyWords} from "../../model/historyKeyWords";
import {Tag} from "../../model/tag";
import {Search} from "../../model/search";
const history = new HistoryKeyWords();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData:[],
    hotData:[],
    // 判断是展示搜索栏，还是展示商品列表的标记
    searchFlag:true,
    //searchDataFlag=false,表示根据用户提供的关键字，没有搜索到数据，需要提供一个空白页
    searchDataFlag:true,
    searchSpuList:null,
    // 用于用户输入空字符时，给用户的提示
    showFlag:false,
    loadingType:"loading",
    loadMoreFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获得历史搜索数据
    let historyData = history.getKeyWords();
    //获取热门数据
    let hotData = await Search.getHotSearchProductsTop10();
    console.log('热门数据：')
    console.log(hotData)
    this.setData({
      historyData: historyData,
      hotData:hotData,
    })
  },

  /**
   * 用户在搜索栏输入关键字时，触发的事件
   * @param event
   */
  async onConfirmTap(event) {
    this.setData({
      showFlag:false
    })
    let keyWords = event.detail.value;

    if(keyWords.split(" ").join("").length == 0) {
      console.log("进入判断空字符的语句");
      this.setData({
        showFlag:true,
      })
      return;
    }
    // 将关键字搜索记录，保存到小程序本地缓存
    history.save(keyWords);
    let historyData = history.getKeyWords();
    this.setData({
      historyData: historyData,
      searchFlag: false,
    })
    // 将关键字搜索记录，保存到服务器，用于统计热门搜索
    Search.addSearchRecords(keyWords)
    //执行根据关键字去搜索商品的操作,首先生成一个Paging对象，保存到data中
   this.handlerSearch(keyWords);
  },
  /**
   * 根据关键字，执行相应的搜索操作
   * @returns {Promise<void>}
   */
  async handlerSearch(keyWords) {
    wx.lin.showLoading({
      color:'#157658',
      type:'flash',
      fullScreen:true
    });
    const searchPaging = await Search.getSearchResult(keyWords);
    console.log('Search类查询的结果：')
    console.log(searchPaging)
    this.data.searchSpuList = searchPaging;
    console.log('this.data.searchSpuList：')
    console.log(this.data.searchSpuList)
    const data = await searchPaging.getHomeSpuList("search");
    console.log('searchPaging对象查询的结果：')
    console.log(data)
    if (data.items.length === 0) {
      console.log("进入searchDataFlag == false");
      this.setData({
        searchDataFlag:false,
      })
    } else {
      // console.log(this.data.searchSpuList)
      // this.data.searchSpuList = data;
      // console.log(this.data.searchSpuList)
      wx.lin.renderWaterFlow(data.items);
    }
    wx.lin.hideLoading();
  },

  /**
   * 当用户点击删除按钮时，触发清空搜索记录的事件
   * @param event
   */
  onClearTap(event) {
    console.log(event);
    history.clear();
    let data = history.getKeyWords();
    this.setData({
      historyData:data,
    })
  },
  /**
   * 当用户点击tag标签时，触发的搜索某一类商品的事件
   * @param event
   */
  async onSearchTap(event) {
    console.log(event);
    let keyWord = event.detail.name;
    this.setData({
      searchFlag:false,
    })
    this.handlerSearch(keyWord);
  },
  /**
   *当用户点击"取消"时，触发的事件函数
   * @param event
   */
  onCancelTap(event) {
    console.log('当用户点击"取消"时，触发的事件函数')
    console.log(event);
    this.setData({
      searchFlag:true,
      searchDataFlag:true,
    })
  },
  onFocusTap(event) {
    console.log('搜索栏聚焦时触发')
    console.log(event)
    this.setData({
      searchFlag: true,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    console.log("触发触底事件")
    this.setData({
      loadMoreFlag: true
    })
    const data = await this.data.searchSpuList.getHomeSpuList("search");
    console.log(data);
    if (data === null) {
      console.log("进入data是否为空的判断");
      this.setData({
        loadingType: "end",
      })
      return;
    }
    wx.lin.renderWaterFlow(data.items);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
