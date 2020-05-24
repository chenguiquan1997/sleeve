// pages/home/home.js
/**
 * 注意：{***}花括号里面的参数名，必须要与配置文件中，你需要导出的常量名相同，
 * 否则会找不到常量中的属性，会报错
 */

import {Theme} from "../../model/theme.js";
import {Banner} from "../../model/banner";
import {Category} from "../../model/category";
import {Activity} from "../../model/activity";
import {FlowerSpu} from "../../model/flower-spu";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTheme:null,
    bannerB:null,
    category_grid_C:[],
    activityD:null,
    themeE:[],
    themeESpu:[],
    themeF:null,
    bannerG:null,
    themeH:null,
    water_flow_paging:null,
    spu_list_paging:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.loadAllHomeData();
    await this.getHomeSpuList();
   
  },
  async loadAllHomeData() {
    // const themeA = await Theme.getHomeLocationA();
    const themes = await Theme.getHomeLocationThems();
    const bannerB = await Banner.getHomeLocationB();
    const categoryC = await Category.getHomeCategoryC();
    const activicyD = await Activity.getHomeLocationD();


    // find()是js中操作集合的一个方法，可以从当前集合中返回第一个符合条件的数据，这里的theme代表themes集合中
    // 的每一个数据，然后再进行条件的判断
    const themeA = themes.find(theme=>(theme.name === "t-1"));
    /**
     *因为ThemeE在后端CMS系统中是可以动态的设置当前主题的上下架功能，所以在这里需要判断
     * ThemeE的状态是否为online，如果是，那么才需要加载ThemeSpu
     */
    const themeE = themes.find(theme=>(theme.name === "t-2"));
    let themeESpu = [];
    if(themeE.online) {
      const themeESpuTotal = await Theme.getHomeLocationE();
      if(themeESpuTotal) {
        themeESpu = themeESpuTotal.spu_list.slice(0,8);
      }
    }
    const themeF = themes.find(theme=>(theme.name === "t-3"));
    // 在这里添加await，是因为我需要等待结果的返回，如果不加await，那么只能返回一个promise
    const bannerG = await Banner.getHomeLocationG();
    const themeH = themes.find(theme=>(theme.name === "t-4"));

    this.setData({
      topTheme: themeA,
      bannerB:bannerB,
      category_grid_C:categoryC,
      activityD:activicyD,
      themeE:themeE,
      themeESpu:themeESpu,
      themeF:themeF,
      bannerG:bannerG,
      themeH:themeH,
    })
  },
  getHomeSpuList: async function () {
    // 我们实现滚动页面，应该每次都需要保存之前的数据，所以，paging数据应该保存到this.data中
    const paging = await FlowerSpu.getHomeWaterFlowerSpuList();
    this.data.spu_list_paging = paging;
    console.log(paging);
    const data = await paging.getHomeSpuList();
    if(data === null) {
      return;
    }
    console.log(data);
    this.data.water_flow_paging = data;
    wx.lin.renderWaterFlow(data.items);
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
    const data = await this.data.spu_list_paging.getHomeSpuList();
    console.log(data);
    if(data === null) {
      return;
    }
    wx.lin.renderWaterFlow(data.items);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})