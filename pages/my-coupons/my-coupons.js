// pages/my-coupons/my-coupons.js
import {Coupon} from "../../model/coupon";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: null,
    status: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    let key = options.status;
    if (key === "1") {
      console.log("获取未使用优惠券")
      let coupons = await Coupon.getUserCoupons(1);
      console.log(coupons);
      this.setData({
        coupon: coupons,
        status: 1
      })
    }
  },
  async changeTabs(event) {
    let key = event.detail.activeKey;
    console.log(key);
    if (key === "1") {
      console.log("获取未使用优惠券")
      let coupons = await Coupon.getUserCoupons(1);
      console.log(coupons);
      this.setCouponData(coupons,1);
    }
    if (key === "2") {
      console.log("获取已使用优惠券")
      let coupons = await Coupon.getUserCoupons(2);
      this.setCouponData(coupons,2);
    }
    if (key === "3") {
      console.log("获取已过期优惠券")
      let coupons = await Coupon.getUserCoupons(3);
      this.setCouponData(coupons,3);
    }
  },
  setCouponData(coupons,status) {
    this.setData({
      coupon: coupons,
      status: status
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