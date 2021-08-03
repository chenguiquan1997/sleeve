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

    getMoreHotProduct() {
      console.log('触发查看更多热门商品事件：')
      //需要跳转到商品列表界面
      wx.navigateTo({
        url: '/pages/theme/theme?themeName=t-1'
      })
    },
    goToHotProductDetail(event) {
      console.log('触发左侧热门商品事件')
      console.log("用户点击热销榜单区域，触发的事件：");
      console.log(event);
      // 先获取得到 商品id
      let productId = event.currentTarget.dataset.id
      console.log('获取得到 商品id：')
      console.log(productId)
      // 根据商品 id，跳转到商品详情页
      wx.navigateTo({
        url: '/pages/detail/detail?id='+productId,
      })
    }

  }
})
