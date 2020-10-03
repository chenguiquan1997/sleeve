// components/category-grid/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //为该组件设置一个初始值
    categoryData:Array,
    /*
    与上面的写法语义相同，如果想要为变量设置一个初始值，那么可以使用它
    category:{
      type:Array,
      value:[]
    }
    */
  },
  observers: {
    "categoryData":function (categoryData) {
      // console.log(categoryData);
      // console.log("当前组件的页面数据");
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

  }
})
