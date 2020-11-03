// pages/my/my.js
import {Coupon} from "../../model/coupon";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    console.log("进入onshow函数");
    let coupons = await Coupon.getUserCoupons(1);
    console.log(coupons.length);
    if (coupons) {
      let couponCount = coupons.length;
      this.setData({
        couponCount: couponCount
      })
    }
  },
  /**
   * 获取全部订单
   */
  onGetAllOrderTap() {
    console.log("触发获取全部订单事件");
    wx.navigateTo({
      url:"/pages/my-order/my-order?status=0"
    })
  },
  /**
   * 获取我的优惠券
   */
  onGetCouponTap() {
    console.log("触发获取优惠券事件");
    wx.navigateTo({
      url:"/pages/my-coupons/my-coupons?status=1"
    })
  },
  /**
   * 修改收货地址
   */
  onUpdateAddressTap() {
    console.log("触发修改收货地址事件");
    wx.chooseAddress({});
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