
import {OrderStatus} from "../../core/enum";

const orderStatusBehavior = Behavior({
    data: {
        unpaid: Boolean,
        leftPeriod: Number,
    },

    methods: {
        orderStatusText(status) {
            switch (status) {
                case OrderStatus.FINISHED:
                    return '已完成';
                case OrderStatus.UNPAID:
                    return '待支付'
                case OrderStatus.PAID:
                    return '待发货'
                case OrderStatus.DELIVERED:
                    return '待收货'
                case OrderStatus.CANCELED:
                    return '已取消'
            }
        },

        correctOrderStatus(order) {
            order.leftPeriod = 0
            if (order.status == OrderStatus.UNPAID) {
                const currentTimestamp = new Date().getTime();
                const createTimestamp = order.create_time;
                const periodMill = order.period * 1000;
                if ((createTimestamp + periodMill) > currentTimestamp) {
                    const mill = (createTimestamp + periodMill) - currentTimestamp
                    order.leftPeriod = Math.round(mill / 1000)
                } else {
                    order.status = OrderStatus.CANCELED
                }
            }
            order.statusText = this.orderStatusText(order.status)
        }
    }
})

export {
    orderStatusBehavior
}