/**
 * 专门用于sku的路径选择
 */
import {SkuCode} from "./sku-code";
import {SkuStatus} from "../../enum/sku-status";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";

class Judger {
    /**
     * 存储当前商品所有数据
     */
    fenceGroup;
    /**
     * 存储当前商品所有sku组合生成的code路径
     * @type {*[]}
     */
    allSkuCodes = [];

    skuPending;
    /**
     * 用于存储规格名的数组
     * @type {*[]}
     */
    specName = [];

    /**
     * 构造方法中，代码的顺序尤为需要注意，后面的代码可能需要前面代码产生的数据，不注意顺序可能会报错
     * @param fenceGroup
     */
    constructor(fenceGroup) {
        this.fenceGroup = fenceGroup;
        this.createAllSkuCombinationPath();
        this._initSkuPending();
        this.initSpecName();
    }

    /**
     * 查找用户还未选择的规格
     * @returns {[]}
     */
    findNoSelectedSpec() {
        let noSelectedSpec = [];
        const arr = this.skuPending.findNoSelectedSpecIndex();
        for (let i = 0; i < arr.length; i++) {
            noSelectedSpec.push(this.specName[arr[i]]);
        }
        return noSelectedSpec;
    }
    /**
     * 获取一个完整的skuCode码，用于用户选择商品规格时，及时展示最新的商品信息
     * @returns {string}
     */
    getCompleteSkuCode() {
       let spuId = this.fenceGroup.getSpuId();
       let skuCode = this.skuPending.getSkuCode();
       return spuId + "$" + skuCode;
    }

    /**
     * 当用户点击规格时，获取对应的sku数据
     */
    getSku() {
        let skuCode = this.getCompleteSkuCode();
        let sku = this.fenceGroup.getMatchSku(skuCode);
        return sku;
    }

    getSpecName() {
        return this.skuPending.getSkuSpecName();
    }

    /**
     * 初始化skuPending数据
     * @private
     */
    _initSkuPending() {
        this.skuPending = new SkuPending(this.fenceGroup.fences.length);
       let defaultSku = this.fenceGroup.getDefaultSku();
       console.log("默认sku-->");
       console.log(defaultSku);
       if(!defaultSku) {
           return;
       }else {
           //需要将默认的sku添加到skuPending中
           this.skuPending.addDefaultSku(defaultSku);
           this.skuPending.pending.forEach(cell => {
               this.fenceGroup.setCellStatusById(cell.id,SkuStatus.SELECTED);
           })
           this.changeStatus(null,null,null,true);
       }
    }

    /**
     * 初始化规格名数组
     */
    initSpecName() {
        this.fenceGroup.fences.forEach(fence => {
            this.specName.push(fence.specName);
        })
    }
    /**
     * 初始化sku的所有路径
     */
    createAllSkuCombinationPath() {
        this.fenceGroup.skuList.forEach(sku => {
            let skuCode = new SkuCode(sku.code);
            skuCode.splitSkuCode();
            this.allSkuCodes = this.allSkuCodes.concat(skuCode.codes);
            // console.log("所有sku组合后生成的code路径");
            // console.log(this.allSkuCodes);
        })
    }
    /**
     * 当用户点击cell时，实现整体sku规格的变化,用户每点击一次，就会触发一次当前函数
     * @param cell
     * @param x
     * @param y
     */
    changeStatus(cell,x,y,flag=false) {
        if(!flag) {
            this._changeCurrentCellStatus(cell,x,y);
        }

        this.fenceGroup.eachCell((cell,x,y)=>{
            let path = this.findPotentialPath(cell,x,y);
            //如果path为空，那么直接返回
            if(!path) {
                return;
            }
            let exist = this.isExistInAllSkuCode(path);
            if(exist) {
                this.fenceGroup.fences[x].cells[y].status = SkuStatus.WAITING;
            }else {
                this.fenceGroup.fences[x].cells[y].status = SkuStatus.PROHIBIT;
            }
        });
    }
    isExistInAllSkuCode(path) {
        return this.allSkuCodes.includes(path);
    }
    /**
     * 当用户点击当前某一个cell时，实现其他所有cell状态的变化
     * @param cell 用户当前点击的cell
     * @param x 当前cell在二维数组的横坐标
     * @param y 当前cell在二维数组的纵坐标
     * @private
     */
    _changeOtherCellStatus(cell,x,y) {
       const path = this.findPotentialPath();
      // console.log("计算出来的所有可能路径");
      // console.log(path);
    }
    /**
     * 寻找sku潜在路径
     * @param cell
     * @param x 表示当前cell的横坐标
     * @param y 表示当前cell的纵坐标
     */
    findPotentialPath(cell,x,y) {
        const joiner = new Joiner('#');
        //遍历二维数组，提取出每一行规格-->颜色，型号，尺码
        for(let i=0;i<this.fenceGroup.fences.length;i++) {
            //找到每一行中已经选择的cell
            let selectedCell = this.skuPending.findSelectedCellByIndex(i);
            // console.log(selectedCell+"-->");
           //潜在路径的获取需要分为两步处理：1.找到当前行，2.然后根据当前行拼接所有与其它行存在的路径
            //x === i 判断点击的cell在不在当前行
            if(x === i) {
                //如果cell在当前行，并且cell的状态为已选中，那么当前cell不需要判断潜在路径
                if(this.skuPending.isSelected(cell,x)) {
                    return;
                }
                //拼接规格字符串
                const cellCode = this._getCellCode(cell.spec);
                //const cellCode = cell.appendSkuCode(cell.spec);
                joiner.join(cellCode);
            }else {
                //处理其他行,这里必须要判断是否为空，因为其它规格有可能用户还没选择，那么就为null
                if(selectedCell) {
                    const cellCode = this._getCellCode(selectedCell.spec);
                    // const cellCode = selectedCell.appendSkuCode(selectedCell.spec);
                    joiner.join(cellCode);
                    // console.log(joiner.getStr());
                }
            }
        }
        return joiner.getStr();
    }
    _getCellCode(spec) {
        return spec.key_id + '-' + spec.value_id
    }

    /**
     * 实现sell的正选和反选时，当前cell状态的变化
     * @param cell
     * @private
     */
    _changeCurrentCellStatus(cell,x,y) {
        if(cell.status === SkuStatus.SELECTED) {
            this.fenceGroup.fences[x].cells[y].status = SkuStatus.WAITING;
            //执行反选，将当前cell数据从pending[]中删除掉
            this.skuPending.removeCell(x);
        }
        if(cell.status === SkuStatus.WAITING) {
            this.fenceGroup.fences[x].cells[y].status = SkuStatus.SELECTED;
            //执行正选操作，将cell数据添加到pending[]中
            this.skuPending.insertCell(cell,x);
            console.log(this.skuPending.pending);
        }
    }

}
export {
    Judger
}