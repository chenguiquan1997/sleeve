// pages/category/category.js
import {systemInfo} from "../../utils/system";
import {px2rpx} from "../../miniprogram_npm/lin-ui/utils/util";
import {Categories} from "../../model/categories";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actualHeight:null,
    categories:null,
    roots:null,
    subs:null,
    rootId:1,
    img:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
   this.getScreenHeight();
   await this.initCategoriesData();
  },
  /**
   * 初始化当前分类页面的数据
   */
  async initCategoriesData() {
    let categories = new Categories();
    await categories.getAll();
    let roots = categories.roots;
    let rootId = roots[0].id;
    let currentSubs = categories.getSubs(rootId);
    console.log("rootId和二级分类数据");
    console.log(this.data.rootId);
    console.log(currentSubs);
    let img = roots[0].img;

    this.setData({
      categories:categories,
      roots: roots,
      subs: currentSubs,
      img:img,
    })
  },
  /**
   * 获得屏幕的可用区间的高度
   */
  getScreenHeight() {
    const height = systemInfo();
    let actualHeight = px2rpx(height) - 60;
    // console.log(actualHeight);
    this.setData({
      actualHeight:actualHeight,
    })
  },
  /**
   * 每当用户点击不同的分类商品时，触发的事件函数
   * @param event
   * @returns {Promise<void>}
   */
  async onChangeCategoryTap(event) {
    console.log(event);
    const parentId = event.detail.activeKey;
    //获取当前rootId下的二级数据,以及分类图片
    let currentSubs = this.data.categories.getSubs(parentId);
    let img = this.data.categories.getCurrentRoot(parentId).img;
    this.setData({
      subs:currentSubs,
      img:img,
    })
  },
  /**
   * 当用户点击搜索栏时，跳转到商品搜索页面
   */
  onSearchTap() {
    wx.navigateTo({
      url:"/pages/search/search",
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