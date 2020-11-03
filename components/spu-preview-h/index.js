// components/spu-preview-h/index.js
Component({
    /**
     * 组件的属性列表
     */
    externalClasses: ['l-class'],
    properties: {
        spu: Object
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTap(event) {
            // const pid = event.currentTarget.dataset.pid
            // this.triggerEvent("itemtap", {
            //     pid
            // }, {
            //     bubbles: true,
            //     composed: true
            // })
            console.log("组件中获取的spu数据");
            console.log(this.properties.spu)
            wx.navigateTo({
                url: `/pages/detail/detail?id=${this.properties.spu.id}`
            })
        },
    }
})
