/**
 *
 */
class UnpaidOrder {
    expire_time;
    final_total_price;
    id;
    order_no;
    placed_time;
    prepay_id;
    snap_address;
    snap_img;
    snap_items;
    snap_title;
    status;
    total_count;
    total_price;
    user_id;
    delay_time;

    constructor(order,delayTime) {
        this.expire_time = order.expire_time;
        this.final_total_price = order.final_total_price;
        this.id = order.id;
        this.order_no = order.order_no;
        this.placed_time = order.placed_time;
        this.prepay_id = order.prepay_id;
        this.snap_address = order.snap_address;
        this.snap_img = order.snap_img;
        this.snap_items = order.snap_items;
        this.snap_title = order.snap_title;
        this.status = order.status;
        this.total_count = order.total_count;
        this.total_price = order.total_price;
        this.user_id = order.user_id;
        this.delay_time = delayTime;
    }
}
export {
    UnpaidOrder
}