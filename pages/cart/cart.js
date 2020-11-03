// pages/cart/cart.js
import {Cart} from "../../model/cart";
import {Calculator} from "../../model/calculator";
import {Sku} from "../../model/sku";
import {Order} from "../../model/order";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:true,
    cartItems:[],
    checkFlag: true,
    allSelectedFlag: false,
    totalPrice: 0,
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let cart = new Cart();
    let idsArr = cart.getSkuIds();
    let newSkus = await Sku.getSkusByIds(idsArr);
    console.log("服务器获取的newSkus");
    console.log(newSkus);
    cart.synchronizedCartData(newSkus);
    this.refreshCarData();
  },

  /**
   *
   */
  async settleAccountTap() {
    console.log("点击结算触发的事件");
    if (this.data.totalCount === 0) {
      wx.lin.showToast({
        title: '请选择商品后再结算~'
      });
      return;
    }
    // let cart = new Cart();
    // //在这里就应该把所有的逻辑都应该处理掉
    // //1.从购物车缓存中挑选用户需要购买的sku
    // let skus = cart.findUserAlreadySelectedSku();
    // console.log(skus)
    // if (skus.length === 0) {
    //   wx.lin.showToast({
    //     title: '请选择商品后再结算~'
    //   });
    //   return;
    // }
    // //从skus中获取skuId
    // let skuIds = cart.getSkuIdsBySkus(skus);
    //
    // //2.再次和服务器同步数据,与服务器同步时，下架的商品是查不到的
    // let newServerSkus = await Sku.getSkusByIds(skuIds);
    // console.log("newServerSkus")
    // console.log(newServerSkus)
    // let order = new Order();
    // order.checkOrderIsOk(newServerSkus, skus);
    // console.log("获取的order-items========");
    // console.log(order.orderItems);

    //找出符合条件的商品，有一个不符合，那么将会失败
    //判断当前用户可以使用的优惠券有哪些
    //计算当前订单的总价格
    //3.最终确定这些商品是否可以购买
    wx.navigateTo({
      //跳转的时候，需要携带订单中的所有数据
      url: "/pages/order/order?way=cartBuy",
    })
  },

  /**
   * 点击去逛逛按钮，触发的事件
   */
  onClickTap() {
    wx.switchTab({
      url:"/pages/home/home",
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示，每次显示 当前页面的时候，都会重新加载数据
   * 购物车中的数据应该在这里面写
   */
  onShow: function () {
    this.refreshCarData();
    this.judgementAllSelectedStatus();
    this.getPriceAndCount();
  },
  /**
   * 点击商品的删除按钮，触发的操作
   */
  onClickRightTap() {
    this.refreshCarData();
    //当用户删除了一个cartItem时，我们需要遍历一次购物车，判断他们的状态
    //如果都是true，那么全选框应该勾选，如果不全是true，就不应该勾选
    this.judgementAllSelectedStatus();
    this.getPriceAndCount();
  },

  /**
   * 当用户点击 item 中的check-box选项时，在cart中捕获的操作
   */
  changeCartItemStatusTap() {
    this.judgementAllSelectedStatus();
    this.getPriceAndCount();
  },

  /**
   * 获取结算价格和结算数量
   */
  getPriceAndCount() {
    let calculator = new Calculator();
    let arr = calculator.getTotalPriceAndTotalCount();
    let totalPrice = arr[0];
    let totalCount = arr[1];
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount
    })
  },

  /**
   * 当商品计数器改变时，触发的事件
   */
  counterChangeTap() {
    this.getPriceAndCount();
  },
  /**
   * 刷新缓存中的数据
   */
  refreshCarData() {
    const cart = new Cart();
    const cartItems = cart.getCartData();
    console.log(cartItems);
    this.setData({
      cartItems: cartItems
    })
  },

  /**
   * 判断全选按钮是应该选中，还是不应该选中
   * 触发时机：新增商品、删除、单击取消某个商品的选中状态
   */
  judgementAllSelectedStatus() {
    const cart = new Cart();
    let flag = cart.foreachItemsStatus();
    console.log("flaggggggggggggg")
    console.log(flag);
    if(flag === true) {
      this.setData({
        allSelectedFlag: true
      })
    }else {
      this.setData({
        allSelectedFlag: false
      })
    }
  },

  /**
   * 用户点击"全选"按钮时，触发的事件
   */
  onClickAllSelectTap() {
    console.log("全选触发的事件");
    let cart = new Cart();
    if(this.data.allSelectedFlag === true) {
      this.setData({
        allSelectedFlag: false
      })
      //需要将购物车中的所有item的status都设置为false
      cart.changeItemsStatusToFalseOrTrue(true);
      this.refreshCarData();
      this.getPriceAndCount();
    }else {
      this.setData({
        allSelectedFlag: true
      })
      //需要将购物车中的所有item的status都设置为false
      cart.changeItemsStatusToFalseOrTrue(false);
      this.refreshCarData();
      this.getPriceAndCount();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})