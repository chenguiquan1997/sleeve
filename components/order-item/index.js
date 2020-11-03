// components/order-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sku:Object
  },

  observers: {
    'sku': function (sku) {
      let specs = this.getSpecs(sku)
      this.setData({
        skuData: sku,
        specData: specs
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    skuData: null,
    specData: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取当前商品的所有规格
     * @param data
     */
    getSpecs(data) {
      let specStr = "";
      data.sku.specs.forEach(spec => {
        let v = spec.value;
        specStr = specStr.concat(v).concat(", ")
      })
      specStr = specStr.substring(0,specStr.length-2);
      return specStr;
    },
  }
})
