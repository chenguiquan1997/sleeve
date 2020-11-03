class Cart {
    /**
     * 购买商品的最小数量
     * @type {number}
     */
    static SKU_MIN_COUNT = 1;
    /**
     * 单个商品允许购买的最大数量
     * @type {number}
     */
    static SKU_MAX_COUNT = 99;
    /**
     * 购物车允许加入的最大商品数量
     * @type {number}
     */
    static CART_ITEM_COUNT = 99;
    /**
     * 购物车在缓存中的数据key
     * @type {string}
     */
    static STORAGE_KEY = "cart";
    /**
     * 用户购物车中的数据，是代理模式的体现，充当缓存和购物车的媒介
     * @type {*[]}
     */
    cartData = null;

    /**
     * 单例模式
     * @returns {Cart|Cart}
     */
    constructor() {
        if(typeof Cart.instance === 'object') {
            return Cart.instance;
        }
        Cart.instance = this;
        return this;
    }

    /**
     * 从缓存中获取购物车数据
     * @returns {*[]}
     * @private
     */
    getCartData() {
        //判断当前cartData对象是否为null
        if(this.cartData !== null) {
            return this.cartData;
        }
        //如果为null，那么需要从缓存中获取
        let data = this._getStorage();
        //如果data为null，那么需要在小程序缓存中初始化数据
        if(!data) {
            data = this.initCartData();
        }
        this.cartData = data;
        return this.cartData;
    }

    /**
     * 初始化cartData数据
     * @returns {[]}
     */
    initCartData() {
        const cartData = [];
        wx.setStorageSync(Cart.STORAGE_KEY, cartData);
        return cartData;
    }

    /**
     * 向购物车中添加商品
     * @param item 待加入的商品
     */
    addItem(item) {
        console.log("我已进入添加购物车方法")
        console.log(item)
        console.log(this.cartData);
        //判断当前购物车中的商品数量，超没超过设置的最大数量
        if(this.cartData.length >= Cart.CART_ITEM_COUNT) {
            throw new Error('超过购物车最大数量');
        }
        //首先判断购物车中有没有重复数据
        let flag = this._hasEqualsInCart(item);
        if(flag === false) {
            //新增商品加到购物车的最前面
            this.cartData.unshift(item);
            console.log(this.cartData);
            console.log("进入加入方法")
        }
        //将数据刷新到缓存
        this._refreshStorage();
    }

    /**
     * 当用户点击购物车中的商品计数器时，触发的更改购物车商品数量的操作
     * @param item
     */
    addItemByCounter(item) {
        this.cartData.forEach(skuData => {
            if (skuData.skuId === item.skuId) {
                skuData.count = item.count;
                //将数据刷新到缓存
                this._refreshStorage();
            }
        })
    }

    /**
     * 判断待加入购物车的商品，是否在购物车中已经存在
     * @param item
     * @returns {boolean}
     * @private
     */
    _hasEqualsInCart(item) {
        //默认当前购物车中没有即将要加入的商品
        let flag = false;
        this.cartData.forEach(skuData => {
            if (skuData.skuId === item.skuId) {
                let count = skuData.count + item.count;
                //还需要判断：添加商品后，当前商品的数量是否大于限制的最大数量
                if (count > Cart.SKU_MAX_COUNT) {
                    let str = "当前商品允许购买的最大数量为" + Cart.SKU_MAX_COUNT.toString() + "件！";
                    console.log(str);
                } else {
                    skuData.count = skuData.count + item.count;
                    flag = true
                }
            }
        })
        return flag;
    }

    /**
     * 删除购物车中的商品
     * @param skuId
     */
    removeItem(skuId) {
        let oldItemIndex = -1;
        for(let i=0;i<this.cartData.length;i++) {
            if(this.cartData[i].skuId == skuId) {
                oldItemIndex = i;
            }
        }
        if(oldItemIndex == -1) {
            throw new Error("在购物车中未找到当前商品");
        }
        //执行删除操作，并返回一个新的数组
        this.cartData.splice(oldItemIndex,1);
        //执行刷新缓存的操作
        this._refreshStorage();
    }

    /**
     * 当用户点击 勾选框时，触发当前方法，用于改变购物车中的商品状态
     * @param skuId
     * @param flag
     */
    changeItemStatus(skuId,flag) {
        this.cartData.forEach(skuData => {
            if (skuData.skuId === skuId) {
                skuData.checked = flag;
                this._refreshStorage();
            }
        });
    }

    /**
     * 改变购物车中所有商品的check-box的状态为false
     * @param flag
     */
    changeItemsStatusToFalseOrTrue(flag) {
        for(let item of this.cartData) {
            if(flag) {
                item.checked = false;
            }
            if(!flag) {
                item.checked = true;
            }
        }
        this._refreshStorage();
    }

    /**
     * 遍历购物车中商品的check-box状态
     * @returns {boolean}
     */
    foreachItemsStatus() {
        //false 表示购物车中商品的check-box没有被全选
        //true  表示check-box已经被全部选中
        let flag = true;
        if(this.cartData.length === 0) {
            return ;
        }
        this.cartData.forEach(skuData => {
            if(skuData.checked === false) {
                flag = false;
                return flag;
            }
        });
        return flag;
    }

    /**
     * 获取当前购物车缓存中的所有skuId
     */
    getSkuIds() {
        this.cartData = this._getStorage();
        let idsArr = [];
        if(this.cartData.length === 0) {
            return idsArr;
        }
        this.cartData.forEach(item => {
            idsArr.push(item.skuId);
        });
        return idsArr;
    }

    /**
     * 在缓存中找到用户需要购买的sku
     */
    findUserAlreadySelectedSku() {
        this.cartData = this._getStorage();
        if(this.cartData.length === 0) {
            return;
        }
        let skus = [];
        this.cartData.forEach(item => {
            if(item.checked) {
                if(item.sku.online && item.sku.stock > 0) {
                    skus.push(item);
                }
            }
        });
        return skus;
    }

    /**
     * 从一组sku中获取skuId
     * @param skus
     */
    getSkuIdsBySkus(skus) {
       if(skus.length === 0) {
           return ;
       }
       let skuIds = [];
       skus.forEach(sku => {
          skuIds.push(sku.skuId);
       });
       return skuIds;
    }

    /**
     * 将服务器端的最新数据同步到购物车中
     * @param skus
     */
    synchronizedCartData(skus) {
        if(skus === null) {
            return null;
        }
        if(this.cartData.length === 0) {
            return ;
        }
        this.cartData.forEach(item => {
            let flag = true;
            skus.forEach(sku => {
                if(sku.id === item.skuId) {
                    item.sku = sku;
                    flag = false;
                    if(item.count > sku.stock) {
                        item.count = sku.stock;
                    }
                }
            })
            //如果flag = true，表示没有匹配到当前商品，当前商品已下架
            if(flag) {
                item.sku.online = false;
            }
        })
        this._refreshStorage();
    }

    /**
     * 刷新缓存
     * @private
     */
    _refreshStorage() {
        wx.setStorageSync(Cart.STORAGE_KEY, this.cartData);
    }

    /**
     * 对外提供刷新购物车缓存的方法
     */
    refreshStorage() {
        this._refreshStorage();
    }

    /**
     * 获取小程序缓存中的数据
     * @private
     */
    _getStorage() {
        return wx.getStorageSync(Cart.STORAGE_KEY);
    }
}

export {
    Cart
}