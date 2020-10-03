const systemInfo = function getSystemInfo() {
    let height = 0;
    wx.getSystemInfo({
        success(res) {
            console.log(res);
            height = res.windowHeight;
        }
    })
    return height;
}

export {
    systemInfo
}