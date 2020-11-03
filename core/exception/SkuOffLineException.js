class SkuOffLineException extends Error{
    /**
     * 异常提示消息
     */
    message;

    constructor(msg) {
        super()
        this.message = msg
    }
}

export {
    SkuOffLineException
}