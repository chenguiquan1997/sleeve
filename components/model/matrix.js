// 用于生成sku的二维矩阵
class Matrix {
    /**
     * 当前对象持有的二维数组矩阵
     */
    matrix;

    constructor(matrix) {
        this.matrix = matrix;
    }

    /**
     * 获取二维数组的宽度
     * @returns {*}
     */
    getRowLength() {
        //如果当前商品无规格，那么this.matrix[0].length;会出现异常，需要特殊处理
        // console.log(this.matrix[0].length);
        return this.matrix[0].length;
    }

    /**
     * 获取二维数组的长度
     * @returns {*}
     */
    getColLength() {
        // console.log(this.matrix.length);
        return this.matrix.length;
    }

    /**
     * 封装了遍历矩阵（二维数组）的方法
     * @param callback 一个自定义的回调函数，需要将每次遍历得到的元素，以及坐标返回。
     */
    foreachMatrix(callback) {
        for(let i=0;i<this.getRowLength();i++) {
            for(let j=0;j<this.getColLength();j++) {
                let element = this.matrix[i][j];
                callback(element,i,j);
            }
        }
    }

    /**
     * 通过矩阵转置的方式，来生成sku二维数组
     * @returns {[]}
     */
    transposition() {
        let transArr = [];
        for(let i=0;i<this.getRowLength();i++) {
            //一维数组中的每个元素又是一维数组，那么就变成一个二维矩阵
            transArr[i] = [];
            for(let j=0;j<this.getColLength();j++) {
                transArr[i][j] = this.matrix[j][i];
            }
        }
        return transArr;
    }

}
export {
    Matrix
}