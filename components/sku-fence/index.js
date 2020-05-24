
// components/sku-fence/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fenceData:Object,
    //用于接收fence的index值
    x:Number
  },
  observers: {
    'x':function (x) {
      this.onBindTap(x);
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
    onBindTap: function (x) {
      // console.log("载入到sku-fence中的数据：fenceData , x");
      // console.log(x);
    }
  }
})
