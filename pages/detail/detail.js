// pages/detail/detail.js.js
import {Detail} from "../../model/detail";
import {SaleExplain} from "../../model/sale-explain";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spuData:null,
    showRealm:false,
    flag:null,
    specData:null,
    saleExplain:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id;
    const spuData = await Detail.getProductDetail(id);
    const saleExplain = await SaleExplain.getSaleExplain();
    console.log(spuData);
    this.setData({
      spuData:spuData,
      saleExplain:saleExplain,
    })
  },
  onSelectSpecTap(event) {
    this.setData({
      showRealm:true,
      flag:"addCart"
    })
  },
  /**
   * 点击"加入购物车"触发的事件
   * @param event
   */
  onTapAddCart(event) {
    this.setData({
      showRealm:true,
      flag:"addCart"
    })
  },
  /**
   * 立即购买事件
   * @param event
   */
  onTapBuy(event) {
    this.setData({
      showRealm:true,
      flag:"buy"
    })
  },
  /**
   * 点击购物车图标触发的事件
   * @param event
   */
  onTapBuyCart(event) {

  },
  /**
   * 点击home图标触发的事件
   * @param event
   */
  onTapHomce(event) {
    wx.switchTab({
      url:"/pages/home/home"
    })
  },
  onSpecTriggerEvent(event) {
    console.log("onSpecTriggerEvent事件");
    console.log(event);
    this.setData({
      specData:event.detail,
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