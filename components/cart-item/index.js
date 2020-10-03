// components/cart-item/index.js
import {Cart} from "../../model/cart";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:Object,
    checkFlag:Boolean
  },

  observers: {
    'data': function (data) {
      // console.log("cart-item中获取到的数据");
      // console.log(data)
      // console.log(data.count)
      let specs = this.getSpecs(data);
      let title = this.getTitles(data);
      this.setData({
        specs: specs,
        stock: data.sku.stock,
        buyCount: data.count,
        online: data.sku.online,
        img: data.sku.img,
        discount_price: data.sku.discount_price,
        title: title,
        price: data.sku.price,
        checked: data.checked,
        spu_id: data.sku.spu_id
      })
    },
    'checkFlag': function (checkFlag) {
      console.log("cart-item中接收到的checkFlag");
      console.log(checkFlag);
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    specs:null,
    stock:99,
    buyCount:1,
    online: null,
    img: null,
    discount_price: null,
    title: null,
    price: null,
    checked: null
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

    getTitles(data) {
      let title = data.sku.title;
      if(title.length <= 15) {
        return title;
      }else {
        title = title.substring(0,15);
        title = title.concat("...");
        return title;
      }
    },

    /**
     * 点击购物车计数器触发的事件
     * @param event
     */
    counterChange(event) {
      let count = event.detail.count;
      this.properties.data.count = count;
      let cart = new Cart();
      cart.addItemByCounter(this.properties.data);
      this.triggerEvent("counterChange",{},{});
    },

    /**
     * 点击购物车删除按钮时，触发的事件
     * @param event
     */
    onClickRightTap(event) {
      console.log(this.properties.data);
      let skuId = this.properties.data.skuId;
      let cart = new Cart();
      cart.removeItem(skuId);
      this.triggerEvent("onClickRightTap",{skuId},{});
    },

    /**
     * 在购物车点击当前商品后，会跳转到当前商品的详情页面
     * @param event
     */
    onSkuDetailTap(event) {
      let productId = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/detail/detail?id='+productId,
      })
    },

    /**
     * 用户点击 check-box 选项框时，触发的改变状态操作
     * @param event
     */
    changeStatusTap(event) {
      console.log("cart-item中触发的check-box操作");
      console.log(event);
      let itemFlag = event.detail.flag;
      let skuId = this.properties.data.skuId;
      let cart = new Cart();
      cart.changeItemStatus(skuId,itemFlag);
      this.triggerEvent("changeCartItemStatus",{skuId},{})
    }

  }
})
