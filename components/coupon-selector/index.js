// components/coupon-selector/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: Object,
    count: Number
  },

  observers: {
    'coupons,count': function (coupons,count) {
      this.setData({
        couponData: coupons,
        useableCouponCount: count
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    couponData: null,
    useableCouponCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    changeSelectCouponTap(event) {
      console.log("切换优惠券触发的事件");
      console.log(event);
      let key = event.detail.key;
      this.triggerEvent("changeSelectCouponTap",{
        key:key
      },{})
    }
  }
})
