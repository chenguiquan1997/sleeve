// components/my-order-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: Object
  },
  observers: {
    'order':function (order) {
      console.log("my-order-item中获取的order");
      console.log(order);
      this.setData({
        _item: order
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _item: null
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
