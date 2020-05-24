// components/spu-waterflow-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object
  },
  observers: {
    data: function (data) {
      if(!data) {
        return null;
      }
      if(!data.tags) {
        return null;
      }
      const tags = data.tags.split('$');
      this.setData({
        tags:tags
      })

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 动态计算图片尺寸的事件
    onImgLoad(event) {
      //利用image组件中自带的bindLoad事件，获取到图片的原始宽和高
      const {width,height} = event.detail;
      // console.log(width,height);
      this.setData({
        w:340,
        h:height*340/width
      })
    },
    //点击商品，进入商品详情的事件
    onDetailTap(event) {
      //console.log(event);
      let productId = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/detail/detail?id='+productId,
      })

    }
  }
})
