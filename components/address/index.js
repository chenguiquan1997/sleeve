// components/address/index.js
import {Address} from "../../model/address";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // address: Object,
    // hasChosen: Boolean
  },
  // observers: {
  //   'address,hasChosen': function(address,hasChosen) {
  //     this.setData({
  //       address: address,
  //       hasChosen: hasChosen
  //     })
  //   }
  // },

  /**
   * 组件的初始数据
   */
  data: {
    address: null,
    hasChosen: false,
    showDialog: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 用户选择收货地址时，触发的事件
     * @returns {Promise<void>}
     */
    async createAddressTap() {
      console.log("触发创建收获地址事件");
      let address = await this.chooseAddress();
      if(address === "chooseAddress:fail auth deny") {
        //todo 必须要产生点击效果才能触发
        this.setData({
          showDialog: true
        })
        this.onDialogConfirmTap();
        return ;
      }
      console.log("-----------")
      console.log(address);
      console.log("-----------")
      this.setData({
        address: address,
        hasChosen: true
      });
      this.triggerEvent("getAddressTap",{
        address: address
      },{})
    },
    /**
     * 获取用户地址
     * @returns {Promise<*>}
     */
    async chooseAddress() {
      let adrs = new Address();
      let address = null;
      let error = null;
      try {
        address = await wx.chooseAddress({});
      }catch (e) {
        error = e.errMsg;
        console.log(error);
      }
      if(address) {
        adrs.storeAddress(address);
        return address;
      }else {
        return error;
      }
    },
    /**
     * 获取用户信息
     * @param event
     */
    getUserInfoTap(event) {
      console.log("触发获取用户信息的事件");
      console.log(event);
    },
    /**
     * 获取用户的权限设置界面
     * @returns {Promise<*>}
     */
    async getOpenSetting() {
      let setting = await wx.openSetting({});
      console.log(setting);
    },

    onDialogConfirmTap() {
      console.log("进入dialog事件");
      this.getOpenSetting();
    },


  }
})
