// components/my-order/index.js
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
    /**
     * 用户点击 "待支付"，“待发货”，“待收货”，“已完成” 按钮时，触发的事件
     */
    onGotoMyOrder(event) {
      console.log(event);
      let key = event.currentTarget.dataset.key;
      if(key === "1") {
        wx.navigateTo({
          url:"/pages/my-order/my-order?status=1"
        })
      }
      if(key === "2") {
        wx.navigateTo({
          url:"/pages/my-order/my-order?status=2"
        })
      }
      if(key === "3") {
        wx.navigateTo({
          url:"/pages/my-order/my-order?status=3"
        })
      }
      if(key === "4") {
        wx.navigateTo({
          url:"/pages/my-order/my-order?status=4"
        })
      }
    }
  }
})
