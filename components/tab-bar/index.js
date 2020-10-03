// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    buyCarValue:Number
  },

  observers: {
    'buyCarValue': function (buyCarValue) {
      console.log("tabbar组件接收到的value");
      console.log(buyCarValue);
      if(buyCarValue === 0) {
        console.log("进入购物车等于0的方法")
        this.setData({
          show: false
        })
      }
      this.setData({
        carValue: buyCarValue
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    carValue:0,
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapHome() {
      this.triggerEvent("onTapHome",{},{})
    },
    onTapBuyCar() {
      this.triggerEvent("onTapBuyCar",{},{})
    },
    onTapAddCar() {
      this.triggerEvent("onTapAddCar",{},{})
    },
    onTapBuy() {
      this.triggerEvent("onTapBuy",{},{})
    }
  }
})
