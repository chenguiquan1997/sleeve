// components/coupon/index.js
import object from "../../miniprogram_npm/lin-ui/common/async-validator/validator/object";
import {CouponData} from "../model/coupon-data";
import {CouponStatus} from "../../core/enum";
import {Coupon} from "../../model/coupon";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupon: Object
  },

  observers: {
    'coupon': function (coupon) {
      if(!coupon) {
        return ;
      }
      console.log("获取的coupon");
      console.log(coupon);
      this.setData({
        _coupon: new CouponData(coupon)
      })

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _coupon: null,
    _status: CouponStatus.CAN_COLLECT,
    userCollected: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 用户点击领取优惠券触发的事件
     * @param event
     * @returns {Promise<void>}
     */
    async onGetCouponTap(event) {
      console.log("进入到领取优惠券事件");
      console.log(event);
      let couponId = event.currentTarget.dataset.id;
      let res;
      try{
        res = await Coupon.collectCoupon(couponId);
      }catch (e) {
        console.log("领取优惠券捕获的异常");
        console.log(e.errorCode);
        if(e.errorCode === 90002) {
          this.setUserCollected();
          let title = "您已领取过该优惠券,在\"我的优惠券\"中可查看";
          this.showToast(title);
          return ;
        }
      }
      if(res.code === 90008) {
        this.setUserCollected();
        let title = "领取成功，在\"我的优惠券\"中查看";
        this.showToast(title);
        return ;
      }
    },
    /**
     * 设置当前优惠券状态为已领取，未使用
     */
    setUserCollected() {
      this.setData({
        _status: CouponStatus.AVAILABLE
      })
    },
    /**
     * 自定义错误提示信息
     * @param title
     */
    showToast(title) {
      wx.showToast({
        icon: "none",
        duration: 3000,
        title
      })
    }

  }
})
