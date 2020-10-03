// pages/grid/grid.js
import {FlowerSpu} from "../../model/flower-spu";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grid_spu_list_paging:null,
    water_flow_paging:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id;
    console.log("grid页面获取到的categoryId");
    console.log(id);
    await this.getGridSpuList(id);
  },

  getGridSpuList: async function (id) {
    // 我们实现滚动页面，应该每次都需要保存之前的数据，所以，paging数据应该保存到this.data中
    const paging = await FlowerSpu.getGridWaterFlowerSpuList(id);
    this.data.grid_spu_list_paging = paging;
    console.log("打印的paging数据");
    console.log(paging);
    console.log("打印的paging数据");
    const data = await paging.getHomeSpuList();
    if(data === null) {
      return;
    }
    console.log(data);
    this.data.water_flow_paging = data;
    wx.lin.renderWaterFlow(data.items);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {

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