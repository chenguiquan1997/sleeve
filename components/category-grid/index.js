// components/category-grid/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //为该组件设置一个初始值
    category_grid_C:Array,
    /*
    与上面的写法语义相同，如果想要为变量设置一个初始值，那么可以使用它
    category:{
      type:Array,
      value:[]
    }
    */
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
     * 用户点击分类图标时，触发的事件，跳转到相应的分类页面
     * @param event
     */
    onClickBindTap(event) {
      let categoryId = event.currentTarget.dataset.id;
      console.log("categoryId");
      console.log(categoryId);
      wx.navigateTo({
        url: '/pages/grid/grid?id='+categoryId,
      })
    }
  }
})
