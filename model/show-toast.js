class ShowToast {
    static showToast(title) {
        wx.showToast({
            icon: "none",
            duration: 2000,
            title: title
        })
    }
}

export {
    ShowToast
}