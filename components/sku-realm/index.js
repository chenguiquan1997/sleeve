// components/sku-realm/index.js
import {FenceGroup} from "../model/fence-group";
import {Judger as judger, Judger} from "../model/judger";
import {Detail} from "../../model/detail";
import {Joiner} from "../../utils/joiner";
import {CartItem} from "../../model/cart-item";
import {Cart} from "../../model/cart";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu:Object,
    flag:String,
  },
  /**
   * js中的监听器类似于java中的监听器，都是在程序初始化时，进行数据的加载。
   * 以及当有数据变动时，程序会感知到
   */
  observers: {
    'spu':function (spu) {
      //如果data不存在时，就直接返回即可
      if(!spu) {
        return null;
      }
      let flag = Detail.noHaveSpec(spu);
      //如果当前商品是无规格的，那么需要绑定唯一的,flag=== true，表示无规格
      console.log("判断当前项目是否无规格");
      console.log(flag);
      if(flag === true) {
        this.showDefaultSku(spu.sku_list[0]);
        this.setData({
            noSpec:true
        })
        console.log("00000000");
        this.specTriggerEvent(false,false,[],[]);
      }
      let fenceGroup = new FenceGroup(spu);
      console.log("初始化的fenceGroupxxxxxxx");
      console.log(fenceGroup);
      //初始化fenceGroup
      fenceGroup.initFencesBytransPosition(spu.sku_list);
      let judger = new Judger(fenceGroup);
      this.data.judger = judger;
      //如果有默认的sku，那么需要在详情页显示默认sku,如果没有，那么需要显示spu信息
      let defaultSku = fenceGroup.getDefaultSku();
      if(defaultSku) {
        //显示sku
        this.showDefaultSku(defaultSku);

        //需要判断当前的sku库存是否大于0，如果等于0，那么将显示暂时无货
        this.whetherProductFlagDuringInit(defaultSku);
        let intact = this.data.judger.skuPending.intact();
        if(intact === true) {
          let specName = this.data.judger.getSpecName();
          this.setData({
            intact:intact,
            specName:specName,
          })
          console.log("111111111")
          this.specTriggerEvent(true,true,[],specName);
        }
      }else {
        //如果没有默认规格，则显示spu
        this.showSpu();
        //提示用户哪一个规格还没有选择
        let noSelectedSpecName = this.data.judger.findNoSelectedSpec();
        let joiner = new Joiner(" ,");
        noSelectedSpecName.forEach(name => {
          joiner.join(name);
        })
        let specName = joiner.getStr();
        this.setData({
          noSelectedSpec:specName,
          whetherProductFlag:true,
        })
        //如果当前商品是无规格的，那么不需要执行无默认sku时，详情页规格选择的判断
        if(flag === false) {
          console.log("2222222");
          this.specTriggerEvent(true,false,specName,[]);
        }
      }
      //调用方法，进行数据的绑定
      this.onFenceGroupDataTap(this.data.judger.fenceGroup);
      this.onCellTap();
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fencesData:null,
    judger:Object,
    data:Object,
    image:null,
    stock:null,
    noSpec:false,
    intact:false,
    specName:null,
    noSelectedSpec:null,
    count:1,
    whetherProductFlag:null,
    showNoSelectedSpec:null,
    showFlag:null,
    iconFlag:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFenceGroupDataTap(fenceGroup) {
      console.log("fencesData数据");
      console.log(fenceGroup.fences);
      this.setData({
        fencesData:fenceGroup.fences
      })
    },
    /**
     * 捕获到点击cell的事件函数
     * @param event
     */
    onCellTap(event) {
      console.log("realm中捕获到的事件");
      console.log(event);
      if(!event) {
        return;
      }
      let cell = event.detail.cellData;
      let x = event.detail.x;
      let y = event.detail.y;
      console.log("当前点击的cell数据");
      console.log(cell);
      //点击以后，改变当前cell的状态
      this.data.judger.changeStatus(cell,x,y);
      //这里执行判断选择规格的逻辑
      let intact = this.data.judger.skuPending.intact();
      //如果用户已经将规格选择完整,那么需要更新sku数据，将用户选择的最新的sku数据绑定上
      if(intact === true) {
        //绑定新的sku
        let matchSku = this.data.judger.getSku();
        let specName = this.data.judger.getSpecName();
        this.showDefaultSku(matchSku);
        this.specTriggerEvent(true,intact,[],specName);
        //需要判断当前的sku库存是否大于用户选择的购买数量，如果小于，那么将显示暂时无货
        let flag = this.whetherOutofStock(matchSku.stock,this.data.count);
        this.setData({
          specName:specName,
          whetherProductFlag:flag,
        })
      }else {
        //提示用户哪一个规格还没有选择
        let noSelectedSpecName = this.data.judger.findNoSelectedSpec();
        let joiner = new Joiner(" ,");
        noSelectedSpecName.forEach(name => {
          joiner.join(name);
        })
        let noSelectedSpec = joiner.getStr();
        this.specTriggerEvent(true,intact,noSelectedSpec,[]);
        this.setData({
          noSelectedSpec:noSelectedSpec,
        })
      }
      console.log(this.data.judger);
      this.setData({
        fencesData:this.data.judger.fenceGroup.fences,
        intact:intact,
      })
    },

    showDefaultSku(sku) {
      this.setData({
        data:sku,
        img:sku.img,
        stock:sku.stock,
      })
    },

    showSpu() {
      this.setData({
        data:this.properties.spu,
        img:this.properties.spu.img
      })
    },
    /**
     * 当用户点击购买数量时，触发的事件函数
     * @param event
     */
    onSelectedCount(event) {
      console.log(event.detail.count);
      this.setData({
        count:event.detail.count,
      })
      //用户每次点击购买数量按钮时,需要判断当前的购买数量是否大于当前商品的库存
      //这里执行判断选择规格的逻辑
      //判断当前商品是否有规格
      let flag = Detail.noHaveSpec(this.properties.spu);
      if(flag === true) {
        //无规格，直接判断当前用户选择的商品数量是否大于库存量
        this._setStockFlag();
      }else {
        let intact = this.data.judger.skuPending.intact();
        if(intact) {
          this._setStockFlag();
        }
      }
    },
    /**
     * 根据当前用户选择的商品数量，判断是显示立即购买，还是显示暂时缺货
     * @private
     */
    _setStockFlag() {
      //需要拿到当前sku的库存
      let sku = this.data.judger.getSku();
      let flag = this.whetherOutofStock(sku.stock,this.data.count);
      this.setData({
        whetherProductFlag:flag,
      })
    },
    /**
     * 判断当前库存，是否大于用户购买数量，是-->返回true,否-->返回false
     * @param stock
     * @param currentCount
     * @returns {boolean}
     */
    whetherOutofStock(stock,currentCount) {
      return stock >= currentCount;
    },
    /**
     * 当前商品初始化的默认规格，当他的库存 > 0 时，显示"加入购物车"这个选项
     * @param sku
     * @returns {boolean}
     */
    whetherProductFlagDuringInit(sku) {
      console.log("默认sku的库存");
      console.log(sku.stock);
      if(sku.stock > 0) {
        this.setData({
          whetherProductFlag:true,
        })
      }
    },

    /**
     * 向组件外部抛出的选择规格的事件,具体是抛到了detail页面中
     */
    specTriggerEvent(whetherSpec,intact,noSelectedSpec,selectedSpecName) {
      this.triggerEvent("onSpecTriggerEvent",{
        //是否有默认规格
        whetherSpec:whetherSpec,
        //有规格，是否选择完全
        intact:intact,
        //没有选择完全
        noSelectedSpec:noSelectedSpec,
        //选择完全
        specName:selectedSpecName,
      })
    },

    /**
     * 用户点击realm组件中的"加入购物车"，触发的事件
     */
    onAddShoppingCarTap() {
      //判断当前商品是否有规格
      let flag = Detail.noHaveSpec(this.properties.spu);
      if(flag === true) {
        //无规格，直接采用唯一的 sku + 购买数量
       let onlyOneSku = this.properties.spu.sku_list[0];
       let count = this.data.count;
       console.log("默认sku + count");
       console.log(onlyOneSku);
       console.log(count);
       this._addToStore(onlyOneSku,count);
       this._changeCounterTap();
      }else {
        //有规格，需要判断 规格是否选择完全 + 购买数量
        let intact = this.data.judger.skuPending.intact();
        if(intact === true) {
          //规格选择完全
          let matchSku = this.data.judger.getSku();
          let count = this.data.count;
          this.setData({
            showFlag:true,
            iconFlag:"success",
            showNoSelectedSpec:"添加成功!",
          });
          console.log("选择完全的规格+count");
          console.log(matchSku);
          console.log(count);
          this._addToStore(matchSku,count);
          this._changeCounterTap();
        }else {
          //规格选择不完全，需要进行提示
          let noSelectedSpec = this._findNoSelectedSpecName();
          let showNoSelectedSpec = "请选择: " + noSelectedSpec;
          this.setData({
            showFlag:true,
            iconFlag:"error",
            showNoSelectedSpec:showNoSelectedSpec,
          });
          let count = this.data.count;
          console.log("规格选择不完全+count");
          console.log(noSelectedSpec);
          console.log(count);
        }
      }
    },

    /**
     * 用户点击realm组件中的"立即购买"，触发的事件
     */
    onImmediatelyBuyTap() {
      console.log("立即购买\"，触发的事件");
      //判断当前商品是否有规格
      let flag = Detail.noHaveSpec(this.properties.spu);
      if(flag === true) {
        //无规格，直接采用唯一的 sku + 购买数量
        let onlyOneSku = this.properties.spu.sku_list[0];
        let count = this.data.count;
        console.log("默认sku + count");
        console.log(onlyOneSku);
        console.log(count);
        this.goToOrder(onlyOneSku.id,count);
      }else {
        //有规格，需要判断 规格是否选择完全 + 购买数量
        let intact = this.data.judger.skuPending.intact();
        if(intact === true) {
          //规格选择完全
          let matchSku = this.data.judger.getSku();
          let count = this.data.count;
          console.log("选择完全的规格+count");
          console.log(matchSku);
          console.log(count);
          //需要进行跳转操作
          this.goToOrder(matchSku.id,count);
        }else {
          //规格选择不完全，需要进行提示
          let noSelectedSpec = this._findNoSelectedSpecName();
          let showNoSelectedSpec = "请选择: " + noSelectedSpec;
          this.setData({
            showFlag:true,
            iconFlag:"error",
            showNoSelectedSpec:showNoSelectedSpec,
          });
          let count = this.data.count;
          console.log("规格选择不完全+count");
          console.log(noSelectedSpec);
          console.log(count);
        }
      }
    },

    /**
     * 用户点击 "立即购买" 按钮后，跳转到订单页面
     */
    goToOrder(skuId,count) {
      wx.navigateTo({
        url: "/pages/order/order?way=immediateBuy&skuId="+skuId+"&count="+count
      })
    },

    /**
     * 找出用户还没有选择完全的规格名
     */
    _findNoSelectedSpecName() {
      let noSelectedSpecName = this.data.judger.findNoSelectedSpec();
      let joiner = new Joiner(" ,");
      noSelectedSpecName.forEach(name => {
        joiner.join(name);
      })
      return joiner.getStr();
    },

    /**
     * 当用户点击 加入购物车 时，将当前商品添加到小程序缓存中
     * @param sku
     * @param count
     * @private
     */
    _addToStore(sku,count) {
      let cartItem = new CartItem(sku,count);
      let cart = new Cart();
      cart.getCartData();
      cart.addItem(cartItem);
    },

    /**
     * 当用户点击加入购物车时，向外抛出的事件
     */
    _changeCounterTap() {
      this.triggerEvent("changeCounterTap",{},{})
    }
  }
})
