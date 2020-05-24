// 用于生成sku的每一行规格
import {Cell} from "./cell";

class Fence {
    /**
     * 用于承装每一行规格中的每一个属性cell的集合
     * @type {*[]}
     */
    cells = [];
    /**
     * sku的规格名id
     */
    specId;
    /**
     * sku的规格名
     */
    specName;
    //因为当前每一个fence中，存储的数据都是一样的规格，所以就默认取第一个元素的key，value
    // 作为当前fence的specId,specName
    constructor(spec) {
      this.specName = spec[0].key;
      this.specId = spec[0].key_id;
    }

    /**
     * 向栅栏中添加规格
     * @param specs
     */
    addSpecToFence(specs) {
        specs.forEach(spec => {
            //将规格值去重.some方法的意思是：检查当前集合中是否有符合要求的数据
            const existed = this.cells.some(cell => {
                return spec.value_id === cell.id;
            })
            if(existed  === true) {
                return;
            }
            let cell = new Cell(spec);
            this.cells.push(cell);
        })
    }

    /**
     * 向cell中添加可视化规格
     * @param skuList
     * @param cells
     */
    addVisualSpecificationsToCell(skuList,cells) {
        cells.forEach(cell => {
            const specCode = cell.appendSkuCode();
            skuList.forEach(sku => {
                let matchCode = sku.code.indexOf(specCode);
                console.log(matchCode);
              //  console.log(sku.img);
                if(matchCode !== -1){
                    cell.img = sku.img
                  //  console.log(cell.skuImg);
                }
            })
        })
    }

    /**
     * 向每一行规格数组中，添加元素名
     * @param title
     * @returns {number}
     */
    addFenceTitleValue(element) {
        let cell = new Cell(element);
        return this.cells.push(cell);
    }
}

export {
    Fence
}