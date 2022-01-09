// app.js
App({
  onLaunch() {
    // 小程序保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  onPageNotFound() {
    wx.switchTab({
      url: 'pages/index/index'
    })
  },
  globalData: {
  }
})
