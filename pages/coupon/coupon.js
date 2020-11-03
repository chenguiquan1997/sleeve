// pages/coupon/coupon.js
import {Activity} from "../../model/activity";
import {Coupon} from "../../model/coupon";

Page({

  properites: {

  },
  /**
   * 页面的初始数据
   */
  data: {
    coupon: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("获取的options数据：");
    console.log(options);
    //1.无categoryId证明是从home首页的领取优惠券页面进来的
    if(options.type === 'activity') {
      let coupons = await Activity.getActivityCoupons("a-2");
      if(coupons === null) {
        return ;
      }
      this.setData({
        coupon: coupons.coupon_list
      })
      console.log(coupons);
    }
    if(options.type === 'category') {
      //证明是从商品详情页进入的
      let categoryId = options.categoryId;
      if(categoryId !== null) {
        let coupons = await Coupon.getCurrSpuCanUseCoupons(categoryId);
        console.log(coupons);
        this.setData({
          coupon: coupons
        })
      }
    }

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