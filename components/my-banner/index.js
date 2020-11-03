// components/my-banner/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponCount: Number,
  },
  observers: {
    'couponCount': function (couponCount) {
      if(couponCount) {
        this.setData({
          count: couponCount
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 到我的优惠券页面
     */
    onGotoMyCoupon() {
      wx.navigateTo({
        url:"/pages/my-coupons/my-coupons?status=1"
      })
    }
  }
})
