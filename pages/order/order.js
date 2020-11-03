// pages/order/order.js
import {Cart} from "../../model/cart";
import {Sku} from "../../model/sku";
import {Order} from "../../model/order";
import {accAdd, accMultiply} from "../../utils/number";
import {CouponChecker} from "../../model/coupon-checker";
import {Coupon} from "../../model/coupon";
import {getSlashYMD} from "../../utils/date";
import {CouponType} from "../../enum/coupon-type";
import {OrderPost} from "../../model/order-post";
import {Http} from "../../utils/http";
import {ShowToast} from "../../model/show-toast";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    skus: null,
    totalPrice: 0,
    coupons: null,
    count: 0,
    discountAmount: 0,
    couponKey: null,
    status: "noselect",
    actualTotalPrice: 0,
    couponId: null,
    showDialog: false,
    orderId: -1,
    idArr: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    let way = options.way;
    if(way === null) {
      ShowToast.showToast("抱歉，服务器异常，请稍后重试~");
      return ;
    }else {
      if(way === "cartBuy") {
        this.cartBuy();
      }
      if(way === "immediateBuy") {
        let skuId = options.skuId;
        let count = options.count;
        if(skuId === null || count === null) {
          ShowToast.showToast("抱歉，服务器异常，请稍后重试~");
          return ;
        }
        this.immediatelyBuy(skuId,count);
      }
    }
    let coupons = await Coupon.getMyCoupon();
    console.log("获取的已领取未使用的coupons");
    console.log(coupons);

    if(coupons.code === 10003) {
      console.log("获取的已领取未使用的coupons为空！");


    }
    // 校验当前用户领取的优惠券，哪些可以使用，哪些不可以使用
    let couponChecker = new CouponChecker();
    let couponSelector = couponChecker.couponChecker(coupons,this.data.skus,this.data.totalPrice);
    couponSelector = this.formateCouponDate(couponSelector);
    let count = this.getUseableCouponCount(couponSelector);
    console.log("校验完的优惠券=====");
    console.log(couponSelector);
    this.setData({
      coupons: couponSelector,
      count: count
    })
  },

  /**
   * 如果当前购买行为是从购物车发出的，那么执行当前方法
   */
  async cartBuy() {
    let cart = new Cart();
    //在这里就应该把所有的逻辑都应该处理掉
    //1.从购物车缓存中挑选用户需要购买的sku
    let skus = cart.findUserAlreadySelectedSku();
    console.log(skus)
    if (skus.length === 0) {
      wx.lin.showToast({
        title: '请选择商品后再结算~'
      });
      return;
    }
    //从skus中获取skuId
    let skuIds = cart.getSkuIdsBySkus(skus);

    //2.再次和服务器同步数据,与服务器同步时，下架的商品是查不到的
    let newServerSkus = await Sku.getSkusByIds(skuIds);
    console.log("newServerSkus")
    console.log(newServerSkus)
    let order = new Order();
    order.checkOrderIsOk(newServerSkus, skus);
    console.log("获取的order-items========");
    console.log(order.orderItems);
    let totalPrice = this.getTotalPrice(order.orderItems);
    this.setData({
      skus: order.orderItems,
      totalPrice: totalPrice,
      actualTotalPrice: totalPrice
    })
  },

  /**
   * 如果当前购买行为是从商品详情页的“立即购买”发出的，那么执行当前方法
   */
  async immediatelyBuy(skuId, count) {
    let serverNewSku = await Sku.getSkusByIds(skuId);
    console.log("立即购买从服务器查询的sku");
    console.log(serverNewSku);
    if(serverNewSku.length === 0) {
      ShowToast.showToast("抱歉，当前商品已下架，请重新选择~");
      return;
    }
    let order = new Order();
    order.checkOrderByimmediateBuy(serverNewSku[0],count);
    console.log("获取的order-items========");
    console.log(order.orderItems);
    let totalPrice = this.getTotalPrice(order.orderItems);
    this.setData({
      skus: order.orderItems,
      totalPrice: totalPrice,
      actualTotalPrice: totalPrice
    })
  },

  /**
   * 格式化优惠券日期
   * @param couponSelector
   * @returns {*}
   */
  formateCouponDate(couponSelector) {
    for(let coupon of couponSelector) {
      let startTime = coupon.startTime;
      let endTime = coupon.endTime;
      let start = getSlashYMD(startTime);
      let end = getSlashYMD(endTime);
      coupon.startTime = start;
      coupon.endTime = end;
    }
    return couponSelector;
  },

  /**
   * 获取可以使用的优惠券的数量
   * @param couponSelector
   * @returns {number}
   */
  getUseableCouponCount(couponSelector) {
    let count = 0
    for(let coupon of couponSelector) {
      if(coupon.useable) {
        count++;
      }
    }
    return count;
  },

  /**
   * 计算当前订单的商品总价格（没有除去优惠券的价格）
   * @param orderItem
   */
  getTotalPrice(orderItem) {
    let totalPrice = 0;
    orderItem.forEach(item => {
      totalPrice = accAdd(totalPrice,item.finalPrice);
    });
    return totalPrice;
  },

  /**
   * order中捕获的改变优惠券事件
   * @param event
   */
  changeSelectCouponTap(event) {
    console.log("order中捕获的改变优惠券事件");
    console.log(event);
    let couponKey = parseInt(event.detail.key);
    if(couponKey === this.data.couponKey) {
      if(this.data.status === "select") {
        this.setData({
          discountAmount:0,
          status: "noselect",
          couponId: null
        });
        this.getActualTotalPrice(this.data.totalPrice,this.data.discountAmount);
        return;
      }
    }
    let discountAmount = 0;
    for(let coupon of this.data.coupons) {
      if(coupon.id === couponKey) {
        //满减
        if(coupon.type === CouponType.FULL_MINUS) {
          discountAmount = coupon.minus;
        }
        //折扣
        if(coupon.type === CouponType.FULL_OFF) {
          let rate = accAdd(-1,coupon.rate);
          discountAmount = accMultiply(this.data.totalPrice,-rate);
         // discountAmount = accMultiply(coupon.fullMoney,-rate);
        }
        //无门槛
        if(coupon.type === CouponType.NO_THRESHOLD_MINUS) {
          //如果无门槛券的优惠金额 > 当前商品的金额，那么当前商品的总价格为0
          if(coupon.minus > this.data.totalPrice) {
            discountAmount = this.data.totalPrice;
          }else {
            discountAmount = coupon.minus;
          }
        }
      }
    }
    console.log("discountAmount:");
    console.log(discountAmount);
    this.setData({
      discountAmount: discountAmount,
      couponKey: couponKey,
      status: "select",
      couponId: couponKey
    })
    this.getActualTotalPrice(this.data.totalPrice,this.data.discountAmount);
  },
  /**
   * 计算当前订单最后实际金额
   * @param totalPrice
   * @param discountAmount
   */
  getActualTotalPrice(totalPrice,discountAmount) {
    let actualTotalPrice = accAdd(totalPrice,-discountAmount);
    this.setData({
      actualTotalPrice: actualTotalPrice
    })
  },
  /**
   * 用户点击“提交订单”触发的方法
   */
  async onSubmit() {
    console.log("触发提交订单事件");
    console.log(this.data.address);
    if(!this.data.address) {
      ShowToast.showToast("请选择收获地址~")
      return;
    }
    let skuList = this.makeSkuList(this.data.skus);
    this.getOrderSkuIds(skuList);
    let orderPost = new OrderPost(this.data.totalPrice, this.data.actualTotalPrice,
        this.data.couponId, skuList, this.data.address);
    console.log(orderPost);
    //用户进行下单操作
    let result = await this.createOrder(orderPost);
    console.log("获取到的result结果");
    console.log(result);
    this.handlerResult(result);
  },

  /**
   * 获取订单中的 sku id 列表
   * @param skuList
   */
  getOrderSkuIds(skuList) {
    if(!skuList) {
      return;
    }
    let idArr = [];
    for(let sku of skuList) {
      let id = sku.id;
      idArr.push(id);
    }
    this.setData({
      idArr: idArr
    })
  },

  /**
   * 处理用户下单
   */
  async handlerResult(result) {
    let orderId = result.orderId;
    //表示支付失败
    if (result.code !== "200" || orderId === -1) {
      console.log("下单出错");
      ShowToast.showToast("抱歉，服务器异常，请稍后重试~");
      return;
    } else {
      this.setData({
        orderId: orderId
      })
      // 进行真实支付
      //this.actualMiniPay(orderId);
      //进行虚拟支付,如果进行虚拟支付的话，会在此弹出提示框
      this.virtualPayment();

    }
  },

  /**
   * 从购物车中清楚当前订单中的数据
   * @param skuIds
   */
  removeCartSku(skuIds) {
    if(!skuIds) {
      return;
    }
    let cart = new Cart();
    let cartData = cart.getCartData();
    if(!cartData) {
      return;
    }
    for(let skuId of skuIds)  {
      for(let cartSku of cartData) {
        if(skuId === cartSku.sku.id) {
          let location = cartData.indexOf(cartSku);
          cartData.splice(location,1);
        }
      }
    }
    cart.refreshStorage();
  },
  /**
   * 虚拟支付方法
   */
  virtualPayment() {
    this.setData({
      showDialog: true
    })
  },
  /**
   * 用户点击 “体验下单” 时，执行的流程
   */
  onConfirmTap() {
    //清除购物车缓存
    this.removeCartSku(this.data.idArr);
    //进行修改订单状态的操作，由于用户虚拟支付成功，那么需要将订单状态修改为“已支付”
    this.updateOrderStatus(this.data.orderId);
    console.log("用户体验下单时，执行的流程");
    wx.redirectTo({
      url: `/pages/pay-success/pay-success?oid=${this.data.orderId}`
    })
  },
  /**
   * 用户点击取消时，执行的下单流程
   */
  onCancelTap() {
    console.log("用户点击取消时，执行的下单流程");
  },

  /**
   * 执行真实支付时，调用的支付方法
   * @param orderId
   * @returns {Promise<void>}
   */
  async actualMiniPay(orderId) {
    let miniParam = this.handlerPayment(orderId);
    try {
      let res = await wx.requestPayment(miniParam);
      wx.redirectTo({
        url: `/pages/pay-success/pay-success?oid=${orderId}`
      })
    } catch (e) {
      wx.redirectTo({
        //如果支付时出现异常，那么应该跳转到 "待付款" 页面
        url: `/pages/my-order/my-order?key=${1}`
      })
    }
  },
  /**
   * 处理后台下单的方法
   * @param orderId
   */
  handlerPayment(orderId) {
    let miniPayParam = this.payment(orderId);
    if(miniPayParam === null) {
      ShowToast.showToast("支付失败，请稍后到\"待支付\"，重新支付~")
      return;
    }
    return miniPayParam;
  },

  /**
   * 调用后台生成订单的操作
   * @param orderPostData
   * @returns {Promise<*>}
   */
  async createOrder(orderPostData) {
    const data = await Http.request({
      method: "POST",
      url: "order/create",
      data: orderPostData
    })
    return data;
  },

  /**
   * 调用后台生成预订单，以及生成小程序端拉起微信支付时，需要的所有参数
   */
  async payment(id) {
    const data = await Http.request({
      method: "POST",
      url: `order/pay/order/${id}`
    })
    return data;
  },

  /**
   * 将订单的状态从"待支付"-->"已支付"
   * @param orderId
   * @returns {Promise<*>}
   */
  async updateOrderStatus(orderId) {
    const data = await Http.request({
      method: "POST",
      url: `order/update/status/alreadyPay/${orderId}`
    })
    return data;
  },

  /**
   * 组装下单时需要的skuList
   * @param skus
   * @returns {null|[]}
   */
  makeSkuList(skus) {
    if(skus === null) {
      return null;
    }
    let skuList = [];
    for(let skuItem of skus) {
      let item = {};
      item.id = skuItem.sku.id;
      item.count = skuItem.itemCount;
      skuList.push(item);
    }
    return skuList;
  },

  /**
   * 获取用户的收获地址
   * @param event
   */
  getAddressTap(event) {
    this.setData({
      address: event.detail.address
    })
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})