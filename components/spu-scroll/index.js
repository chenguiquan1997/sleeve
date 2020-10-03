// components/spu-scroll/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    themeE:Object,
    themeESpu:Array,
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
     * 点击商品时，触发的详情事件
     * @param event
     */
    onClickDetailTap(event) {
      let productId = event.currentTarget.dataset.id;
      console.log("productId");
      console.log(productId);
      wx.navigateTo({
        url: '/pages/detail/detail?id='+productId,
      })
    }
  }
})
