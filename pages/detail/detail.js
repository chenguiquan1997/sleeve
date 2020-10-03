// pages/detail/detail.js.js
import {Detail} from "../../model/detail";
import {SaleExplain} from "../../model/sale-explain";
import {Cart} from "../../model/cart";

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
    cartNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id;
    wx.lin.showLoading({
      color:'#157658',
      type:'flash',
      fullScreen:true
    });
    const spuData = await Detail.getProductDetail(id);
    const saleExplain = await SaleExplain.getSaleExplain();
    console.log(spuData);
    this.setData({
      spuData:spuData,
      saleExplain:saleExplain,
    })
    wx.lin.hideLoading();
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
  onTapAddCar(event) {
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
  onTapBuyCar(event) {
    wx.switchTab({
      url:"/pages/cart/cart"
    })
  },
  /**
   * 点击home图标触发的事件
   * @param event
   */
  onTapHome(event) {
    wx.switchTab({
      url:"/pages/home/home"
    })
  },
  /**
   * 监听sku-realm抛出的事件函数
   * @param event
   */
  onSpecTriggerEvent(event) {
    console.log("onSpecTriggerEvent事件");
    console.log(event);
    this.setData({
      specData:event.detail,
    })
  },
  /**
   * 用户在sku-realm中点击”加入购物车“时，触发的改变购物车小图标事件
   */
  changeCounterTap() {
    console.log("购物车小图标事件已经被触发===========");
    let cart = new Cart();
    let cartNum = cart.getCartData().length;
    this.setData({
      cartNum: cartNum,
      showRealm:false,
      flag:"addCart"
    });
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
    let cart = new Cart();
    let cartNum = cart.getCartData().length;
    this.setData({
      cartNum: cartNum
    })
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