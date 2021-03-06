let EventBus = function () {
};
var objBus = [], arrBus = [];
EventBus.prototype = {
    obj: {
        set: function (r, u) {
            if (r && u) {
                var n = {};
                n.k = r, n.v = u;
                for (var t = 0, s = objBus.length; t < s; t++) {
                    objBus[t].k == r && objBus.splice(t, 1)
                }
                objBus.push(n)
            }
        }, get: function (r) {
            if (r) for (var u = 0, n = objBus.length; u < n; u++) {
                var t = objBus[u];
                if (t.k == r) return t.v()
            }
        }
    }, emit: function (r, u) {
        if (r) for (var n = 0, t = arrBus.length; n < t; n++) {
            var s = arrBus[n];
            if (s.k == r) return s.v(u)
        }
        return new Promise(r => {
            r()
        })
    }, on: function (r, u) {
        if (r && u) {
            var n = {};
            n.k = r, n.v = u, arrBus.push(n)
        }
    }, arr: {
        push: function (r, u) {
            if (r && u) {
                var n = {};
                n.k = r, n.v = u, arrBus.push(n)
            }
        }, pop: function (r) {
            if (r) for (var u = 0, n = arrBus.length; u < n; u++) {
                var t = arrBus[u];
                t.k == r && t.v()
            }
        }
    }
};
var eventBus = new EventBus;
export default eventBus;