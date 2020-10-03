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
    searchFlag:true,
    //searchDataFlag=false,表示根据用户提供的关键字，没有搜索到数据，需要提供一个空白页
    searchDataFlag:true,
    searchSpuList:null,
    showFlag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获得历史搜索数据
    let historyData = history.getKeyWords();
    //获取热门数据
    let hotData = await Tag.getHotTags();
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
      showFlag:false,
    })
    let keyWords = event.detail.value;

    if(keyWords.split(" ").join("").length == 0) {
      console.log("进入判断空字符的语句");
      this.setData({
        showFlag:true,
      })
      return;
    }
    history.save(keyWords);
    let historyData = history.getKeyWords();
    this.setData({
      historyData: historyData,
      searchFlag: false,
    })
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
    let searchPaging = await Search.getSearchResult(keyWords);
    this.data.searchSpuList = searchPaging;
    const data = await searchPaging.getHomeSpuList("search");
    if (data.items.length === 0) {
      console.log("进入searchDataFlag == false");
      this.setData({
        searchDataFlag:false,
      })
    } else {
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
    console.log(event);
    this.setData({
      searchFlag:true,
      searchDataFlag:true,
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})