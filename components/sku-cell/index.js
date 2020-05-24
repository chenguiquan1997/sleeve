// components/sku-cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cell:Object,
    //存储当前cell的横坐标和纵坐标
    x:Number,
    y:Number
  },

  observers: {
    'cell':function (cell) {
      this.onBindTap(cell);
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
    onBindTap(cell) {
      // console.log("载入到sku-cell中的数据：cell");
      // console.log(cell);
    },
    /**
     * 用户选择商品规格的点击事件
     * @param event
     */
    onOptionCell(event) {
      // console.log("用户正在选择商品规格");
      /**
       * 由于当前的cell组件，是我们自定义的组件，所以如果我们想要在自定义组件上触发事件，那么就需要调用
       * triggerEvent();使用事件的目的就是为了要传递数据，而且是子组件-->父组件传递数据
       * 第一个参数：事件名,设置当前事件名的目的是让父组件可以捕获到当前事件
       * 第二个参数：detail-->需要传出的数据
       * 第三个参数：事件选项-->只有当两个选型全都打开时，才能够传递出数据
       */
      this.triggerEvent("cellTap",{
        cellData:this.properties.cell,
        x:this.properties.x,
        y:this.properties.y,
      },{
        //设置当前事件为冒泡事件，是可以向父组件传递的
        bubbles:true,
        composed:true
      })
    }
  }

})
