// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    onTapHome() {
      this.triggerEvent("onTapHomce",{},{})
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
