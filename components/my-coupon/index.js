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
    coupon: Object,
    status: Number
  },

  observers: {
    'coupon,status': function (coupon,status) {
      if(!coupon || !status) {
        return ;
      }
      console.log("获取的coupon");
      console.log(coupon);
      this.setData({
        _coupon: new CouponData(coupon),
        _status: status
      })

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _coupon: null,
    _status: CouponStatus.AVAILABLE,
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
    async onUseCouponTap(event) {
      console.log("进入到使用优惠券事件");
      console.log(event);
      let couponId = event.currentTarget.dataset.id;

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
