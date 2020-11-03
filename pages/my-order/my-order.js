// pages/my-order/my-order.js
import {MyOrder} from "../../model/my-order";
import {UnpaidOrder} from "../../model/unpaid-order";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: null,
    activeKey: null,
    loadingType: "loading",
    allOrdersPaging: null,
    unpaidOrdersPaging: null,
    pendingShipmentPaging: null,
    pendingReceiptPaging: null,
    alreadyCompletePaging: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    if (options.status === "0") {
      console.log("进入获取全部订单逻辑");
      this.allOrders();
    }
    if(options.status === "1") {
      console.log("进入待付款逻辑");
      this.unpaidOrders();
    }
    if(options.status === "2") {
      console.log("进入待发货逻辑");
      this.pendingShipment();
    }
    if(options.status === "3") {
      console.log("进入待收货逻辑");
      this.pendingReceipt();
    }
    if(options.status === "4") {
      console.log("进入已完成逻辑");
      this.alreadyComplete();
    }

  },
  async changeTabs(event) {
    console.log("切换tab事件");
    console.log(event);
    let key = event.detail.activeKey;
    if (key === "0") {
      this.allOrders();
    }
    if (key === "1") {
      console.log("进入待付款")
      this.unpaidOrders();
    }
    if (key === "2") {
      console.log("进入待发货")
      this.pendingShipment();
    }
    if (key === "3") {
      console.log("进入待收货")
      this.pendingReceipt();
    }
    if (key === "4") {
      console.log("进入已完成")
      this.alreadyComplete();
    }
  },
  /**
   * 当前订单项是否还有更多的数据
   */
  hasMoreData(data) {
    if(!data.moreData) {
      this.setData({
        loadingType: "end"
      })
    }
  },
  /**
   * 全部订单逻辑
   */
  async allOrders() {
    console.log("进入全部订单")
    let allOrdersPaging = await MyOrder.getAllOrders();
    console.log(allOrdersPaging);
    this.data.allOrdersPaging = allOrdersPaging;
    let allOrders = await allOrdersPaging.getHomeSpuList();
    console.log(allOrders);
    if (allOrders !== null) {
      this.hasMoreData(allOrders);
      this.setData({
        orders: allOrders.accumulate,
        activeKey: 0
      })
    } else {
      return;
    }
  },

  /**
   * 待付款逻辑
   * @returns {Promise<void>}
   */
  async unpaidOrders() {
    let unpaidOrdersPaging = await MyOrder.getUnpaidOrders();
    this.data.unpaidOrdersPaging = unpaidOrdersPaging;
    let unpaidOrders = await unpaidOrdersPaging.getHomeSpuList();
    console.log(unpaidOrders.accumulate);
    let newUnpaidOrders = this.getExpireTime(unpaidOrders.accumulate);
    unpaidOrders.accumulate = newUnpaidOrders;
    console.log("最新的unpaidOrders.accumulate：")
    console.log(unpaidOrders.accumulate);
    if (unpaidOrders !== null) {
      this.hasMoreData(unpaidOrders);
      this.setData({
        orders: unpaidOrders.accumulate,
        activeKey: 1
      })
    } else {
      return;
    }
  },

  /**
   * 根据待支付订单的过期时间，计算延迟支付的所剩时间
   * @param unpaidOrderList
   */
  getExpireTime(unpaidOrderList) {
    if(!unpaidOrderList) {
      return;
    }
    let arr = [];
    for(let unpaidOrder of unpaidOrderList) {
      let et = unpaidOrder.expire_time;
      let expireMillisecond = new Date(et).getTime();
      let currMill = new Date().getTime();
      let delayPayTime = ((expireMillisecond - currMill)/1000).toString().split(".")[0];
      console.log(delayPayTime);
      // let unpaidOrderItem = new UnpaidOrder(unpaidOrder,delayPayTime);
      // arr.push(unpaidOrderItem);
      unpaidOrder["delay_time"] = delayPayTime;
      arr.push(unpaidOrder);
    }
    return arr;
  },

  /**
   * 待发货逻辑
   * @returns {Promise<void>}
   */
  async pendingShipment() {
    let pendingShipmentPaging = await MyOrder.getPendingShipment();
    this.data.pendingShipmentPaging = pendingShipmentPaging;
    let pendingShipment = await pendingShipmentPaging.getHomeSpuList();
    console.log(pendingShipment);
    if (pendingShipment !== null) {
      this.hasMoreData(pendingShipment);
      this.setData({
        orders: pendingShipment.accumulate,
        activeKey: 2
      })
    } else {
      return;
    }
  },

  /**
   * 待收货逻辑
   * @returns {Promise<void>}
   */
  async pendingReceipt() {
    let pendingReceiptPaging = await MyOrder.getPendingReceipt();
    this.data.pendingReceiptPaging = pendingReceiptPaging;
    let pendingReceipt = await pendingReceiptPaging.getHomeSpuList();
    console.log(pendingReceipt);
    if (pendingReceipt !== null) {
      this.hasMoreData(pendingReceipt);
      this.setData({
        orders: pendingReceipt.accumulate,
        activeKey: 3
      })
    } else {
      return;
    }
  },

  /**
   * 已完成逻辑
   */
  async alreadyComplete() {
    let alreadyCompletePaging = await MyOrder.getAlreadyComplete();
    this.data.alreadyCompletePaging = alreadyCompletePaging;
    let alreadyComplete = await alreadyCompletePaging.getHomeSpuList();
    console.log(alreadyComplete);
    if (alreadyComplete !== null) {
      this.hasMoreData(alreadyComplete);
      this.setData({
        orders: alreadyComplete.accumulate,
        activeKey: 4
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onReachBottom: async function () {
    console.log("触发触底事件");
    if (this.data.activeKey === 0) {
      let data = await this.data.allOrdersPaging.getHomeSpuList();
      this.additionalData(data);
    }
    if (this.data.activeKey === 1) {
      let data = await this.data.unpaidOrdersPaging.getHomeSpuList();
      this.additionalData(data);
    }
    if (this.data.activeKey === 2) {
      let data = await this.data.pendingShipmentPaging.getHomeSpuList();
      this.additionalData(data)
    }
    if (this.data.activeKey === 3) {
      let data = await this.data.pendingReceiptPaging.getHomeSpuList();
      this.additionalData(data);
    }
    if (this.data.activeKey === 4) {
      let data = await this.data.alreadyCompletePaging.getHomeSpuList();
      this.additionalData(data);
    }
  },
  /**
   * 向原订单数据列表中追加新数据
   * @param data
   */
  additionalData(data) {
    if (data === null) {
      this.setData({
        loadingType: "end"
      })
      return;
    }
    this.setData({
      orders: data.accumulate
    })
    console.log("触底之后获取的数据");
    console.log(data.accumulate);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})