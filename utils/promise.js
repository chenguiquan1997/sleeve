const promisic = function (func) {
    return function (params = {}) {
        return new Promise((resolve, reject) => {
            const args = Object.assign(params, {
                success: (res) => {
                    resolve(res);
                },
                fail: (error) => {
                    reject(error);
                }
            });
            func(args);
        });
    };
};

/**
 * js计算组合的方法
 * @param arr 需要计算组合的数据集合
 * @param size 在所有的数据中，需要选取多少个进行组合 例如：C31,C32,三个里面选1个，三个里面选2个
 * @returns {[]}
 */
const combination = function (arr, size) {
    var r = [];
    function _(t, a, n) {
        if (n === 0) {
            r[r.length] = t;
            return;
        }
        for (var i = 0, l = a.length - n; i <= l; i++) {
            var b = t.slice();
            b.push(a[i]);
            _(b, a.slice(i + 1), n - 1);
        }
    }
    _([], arr, size);
    return r;
}

export {
    promisic,
    combination
}