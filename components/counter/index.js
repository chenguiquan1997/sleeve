// components/counter/index.js
import number from "../../miniprogram_npm/lin-ui/common/async-validator/validator/number";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count:{
      type:Number,
      value:1
    },
    min:{
      type:Number,
      value:1
    },
    max:{
      type:Number,
      value:99
    }
  },
  observers: {
    'count,min,max':function (count,min,max) {
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOverstep(event) {
      if(event.detail.type === "overflow_min") {
        wx.showToast({
          title:"至少需要购买1件哦!",
          icon:"none"
        })
      }
      if(event.detail.type === "overflow_max") {
        wx.showToast({
          title:"超出最大购买数量!",
          icon:"none"
        })
      }
    }
  }
})
