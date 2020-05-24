/**
 * 当前Cell类封装的是商品sku的规格中，每一个元素的数据，其内部包含了name，id等
 */
import {SkuStatus} from "../../enum/sku-status";

class Cell {
    /**
     * sku规格中，每一个属性的名称
     */
    title;
    /**
     * 每个规格属性的id
     */
    id;
    /**
     * 可视化规格图片
     */
    img;
    /**
     * 当前cell的状态，默认初始状态为waiting
     */
    status;
    /**
     * 一个spec代表一个cell
     */
    spec;

    constructor(specItem) {
        this.title = specItem.value;
        this.id =specItem.value_id;
        this.spec = specItem;
        this.status = SkuStatus.WAITING;
    }

    appendSkuCode(spec) {
        return this.spec.key_id +"-"+ this.spec.value_id;
    }
}

export {
    Cell
}