// components/check-box/index.js
import object from "../../miniprogram_npm/lin-ui/common/async-validator/validator/object";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checkFlag:Boolean,
  },

  observers: {
    'checkFlag': function (checkFlag) {
      console.log("check-box中的checkFlag值");
      console.log(checkFlag);
      this.setData({
        checkedFlag: checkFlag,
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checkedFlag:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 用户在购物车中点击checkbox按钮时，触发的事件
     * @param event
     */
    onCheckedTap(event) {
      console.log("触发的check-box事件");
      console.log(event);
      let flag = this.properties.checkedFlag;
      flag = !flag;
      this.setData({
        checkedFlag:flag,
      })
      //需要将check-box中的数据传出到cart页面中，需要使用triggerEvent事件
      this.triggerEvent('checkTap',{
        flag,
        },{
        bubbles: true,
        composed: true
      })

    },
    changeCartItemSelectStatus(flag) {

    }
  }
})
