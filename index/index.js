const app = getApp()
let ctx; // 画布对象
let isStart = false; //画笔重新开始
let x = ''; //路径点的x坐标
let y = ''; //路径点的y坐标

//画布宽高
let canvasw, canvash;
Page({
  data: {

  },
  onLoad: function () {
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
    ctx = wx.createCanvasContext('canvas') //创建画布对象
    console.log(ctx)
    const canvas = wx.createSelectorQuery();
    const _this = this;
    canvas.select('#canvas').boundingClientRect(function(rect){
      canvasw = rect.width;
      canvash = rect.height;
      // ctx.drawImage('./bg.png', 0, 0, rect.width, rect.height)
      // ctx.draw()
      _this.setbg()
    }).exec()
    
  },
  onReady() {
  },
  setbg(){
    // 填充背景色
    ctx.rect(0,0,canvasw, canvash);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.draw(true)
    // 设置虚线
    ctx.setLineDash([5,3]) // 参数数组内第一个数字为虚线点的宽度，第二个数字为虚线点之前的间隔
    // 四边形边框
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.strokeRect(10,10,canvasw - 20, canvash - 20);

    // 画十字
    ctx.lineWidth = 2;
    ctx.moveTo(canvasw / 2, 10);
    ctx.lineTo(canvasw / 2, canvash - 10);
    ctx.moveTo(10, canvash / 2);
    ctx.lineTo(canvasw - 10,  canvash / 2);
    ctx.stroke();
    ctx.draw(true)
    ctx.setLineDash([5,0]) //背景设置完成，需要把线条转换回实线，避免写字时为虚线 
  },
  start(e){
    // 设置起笔点
    isStart = true;
    x = e.touches[0].x;
    y = e.touches[0].y;
  },
  move(e){
    if(isStart){
      ctx.beginPath();
      ctx.moveTo(x,y)
      ctx.lineTo(e.touches[0].x,e.touches[0].y)
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.draw(true)
      x = e.touches[0].x;
      y = e.touches[0].y;
    }
  },
  end(e){
    isStart = false;
  },
  clearCanvas(){
    ctx.clearRect(0, 0, canvasw, canvash);
    ctx.draw(true);
    // 清除后需要重新绘制背景
    this.setbg()
  },
  confirm(){
    wx.showModal({
      title: '提示',
      content: '请确认是否签名完成',
      success:(res)=>{
        if(res.confirm){

          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvasw,
            height: canvash,
            destWidth: 320,
            destHeight: canvash * 320 / canvasw,
            canvasId: 'canvas',
            success:(res)=> {
              console.log(res.tempFilePath)
              this.setData({
                imgsrc: res.tempFilePath
              })
              wx.previewImage({
                current: res.tempFilePath, // 当前显示图片的http链接
                urls: [res.tempFilePath], // 需要预览的图片http链接列表
                fail(err){
                  console.log(err)
                }
              })
            },
            fail(err){
              console.log(err)
            }
          })
        }
      }
    })
  }
})
