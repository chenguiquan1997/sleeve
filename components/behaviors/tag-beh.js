
const tagBehavior = Behavior({
    properties: {
        text:String,
        image:String,
        status:String,
        name:Object,
    },

    methods:{
        onTap(event){
            this.triggerEvent('lintap', {
                name:this.properties.name
            })
        }
    }

})

export {
    tagBehavior
}