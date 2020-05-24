// components/sale-explain/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:Array,
  },
  observers: {
    "data":function (data) {
      console.log("explain中的data");
      console.log(data);
      this.setData({
        productDetail:data,
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productDetail:Array,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
