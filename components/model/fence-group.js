//一个整体的sku规格，包含多个fence，fenceGroup因为它管理多个sku，所以它最适合进行业务逻辑的编写
import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup {
    /**
     * 整体的spu数据
     */
    spuData;
    /**
     *存储当前商品所有sku的数据
     */
    skuList = [];
    /**
     * 存储spu中所有的规格fences,每一行就是一条栅栏
     * @type {*[]}
     */
    fences = [];

    matrix;

    constructor(spuData) {
        this.spuData = spuData;
        console.log("spuData==>");
        console.log(this.spuData);
        this.skuList = spuData.sku_list;
    }

    /**
     * 获得与当前skuCode码相匹配的sku商品数据
     * @param skuCode
     */
    getMatchSku(skuCode) {
       return this.skuList.find(sku => sku.code === skuCode);
    }
    /**
     * 获取当前spu的id
     * @returns {*}
     */
    getSpuId() {
        return this.spuData.id;
    }

    setCellStatusById(cellId,status) {
        this.eachCell((cell) => {
            if(cellId === cell.id) {
                cell.status = status;
            }
        })
    }
    /**
     * 获取默认的sku数据
     */
    getDefaultSku() {
       const defaultSkuId = this.spuData.default_sku_id;
       if(defaultSkuId === null) {
           return;
       }
       let defaultSku;
        this.skuList.forEach(sku => {
            if (sku.id === defaultSkuId) {
                defaultSku = sku;
            }
        });
        return defaultSku;
    }
    /**
     * 内部方法，创建一个二维矩阵，并将当前spu的所有sku数据，初始化到二维矩阵中
     * @param skuList
     * @returns {Matrix}
     * @private
     */
    _createMatrix(skuList) {
        let matrix = [];
        // js中的forEach();作用是遍历集合中的每一个元素，需要遍历哪一个集合，就通过当前集合调用forEach();
        // 然后拿到每一个元素后，再进行操作
        skuList.forEach(sku => {
            let ele = sku.specs;
            matrix.push(ele);
        })
        console.log(matrix);
        console.log("==========");
        return new Matrix(matrix);
    }
    /**
     * 遍历二维矩阵中的所有cell
     * 问题：为什么当前方法需要使用回调函数呢？-->因为每次遍历得到的cell元素，如果不想传出，那么就需要在当前
     * 方法中解决，所以就需要传入一个函数来解决
     * @param callback
     */
    eachCell(callback) {
        for(let i=0;i<this.fences.length;i++) {
            for(let j=0;j<this.fences[i].cells.length;j++) {
                let cell = this.fences[i].cells[j];
                //当前这个回调函数，就会携带着参数，进入judger中的_changeOtherCellStatus();中
                callback(cell,i,j);
            }
        }
    }

    eachCellForDefaultCell(cell) {
        let arr = [];
        for(let i=0;i<this.fences.length;i++) {
            for(let j=0;j<this.fences[i].cells.length;j++) {
                let inCell = this.fences[i].cells[j];
                if(cell.id === inCell.id) {
                    arr.push(i);
                    arr.push(j);
                    return arr;
                }
            }
        }
    }
    /**
     * 通过矩阵的转置，初始化商品的sku
     * @param skuList
     */
    initFencesBytransPosition(skuList) {
        let matrixs = this._createMatrix(this.skuList);
        //fences代表拿到一个二维数组
        let fences = matrixs.transposition();
        //将矩阵中的每一行数据，包装成一个fence对象
        fences.forEach(spec => {
            //为每一行规格，创建一个fence
            let fence = this._createFence(spec);
            fence.addSpecToFence(spec);

            //判断当前fence是否为可视化规格
            if(this.whetherHasVisualSpecifications() && this.whetherIsVisualSpecifications(fence.specId)) {
                console.log("创建的fence数据=====》");
                console.log(fence);
              //将可视化规格图片存入cell中
                fence.addVisualSpecificationsToCell(this.skuList,fence.cells);
                console.log(fence.cells);
            }
            this.fences.push(fence);
        })
        console.log("矩阵转置");
        console.log(this.fences);
    }

    /**
     * 判断当前spu是否存在可视化规格
     * @returns {boolean}
     */
    whetherHasVisualSpecifications() {
      return this.spuData.sketch_spec_id ? true : false;
    }

    /**
     * 判断当前规格(fence),是否为默认可视化规格
     * @param fenceId
     * @returns {boolean}
     */
    whetherIsVisualSpecifications(fenceId) {
        return this.spuData.sketch_spec_id === fenceId;
    }

    /**
     * 初始化一个sku的所有规格可选项
     * @param skuList sku列表
     */
    initFences(skuList) {
        // 初始化一个二维矩阵,并且在当前对象接收
        this.matrix = this._createMatrix(this.skuList);
        //循环遍历二维矩阵中的元素
        for(let i=0;i<this.matrix.getRowLength();i++) {
            let fence = this._createFence();
            for(let j=0;j<this.matrix.getColLength();j++) {
                let element = this.matrix.matrix[j][i];
                fence.addFenceTitleValue(element);
            }
            this.fences.push(fence);
        }
        console.log(this.fences);
    }
    /**
     * 实例化fence对象
     * @param spec
     * @returns {Fence}
     * @private
     */
    _createFence(spec) {
        let fence = new Fence(spec);
        return fence;
    }
}

export {
    FenceGroup
}