// components/hot-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerG:Object
  },
  /**
   * 自定义一个监听器，来监听properties中的bannerG的数据状态
   */
  observers: {
     'bannerG': function(bannerG) {
       if(bannerG === null) {
         return;
       }
       if(bannerG.items.length === 0) {
         return;
       }
       const left = bannerG.items.find(item=>item.name === "left");
       const rightTop = bannerG.items.find(item=>item.name === "right-top");
       const rightBottom = bannerG.items.find(item=>item.name === "right-bottom");
       this.setData({
         left,
         rightTop,
         rightBottom
       })
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
