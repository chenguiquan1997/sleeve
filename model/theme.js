/**
 * 在这里面就使用到了面向对象编程的思想，将首页的theme模块抽象成一个Theme类，然后将该模块中执行
 * 请求的方法，抽象到Theme类中
 */
import {Http} from "../utils/http";


class Theme {
  /**
   * 为什么我们在封装微信的request请求时，需要在自定义的方法的参数中，添加一个callback回调呢？
   * 答案：因为在wx.request请求时，得到的结果需要异步返回，那么我们就需要一个异步函数来接收
   */
  static locationA = "t-1";
  static locationE = "t-2";
  static locationF = "t-3";
  static locationH = "t-4";
  static async getHomeLocationThems() {
      const data = await Http.request({
          url:"theme/by/names",
          data:{
              names: `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`,
          }

      })
      return data;
  }

    /**
     * 获取home页面E部位的数据-->每周上新
     */
    static async getHomeLocationE() {
        return await Theme.getThemeSpuByName(Theme.locationE);
    }

    /**
     * 通过主题名，获取一个主题的SPU
     * @param name 主题名称
     * @returns {Promise<*>}
     */
  static async getThemeSpuByName(name) {
      const data = await Http.request({
          url: `theme/name/${name}/with_spu`,
      })
      return data;
  }

  static async getHomeLocationA() {
      const backData = await Http.request({
          url: 'theme/by/names',
          data: {
              names: 't-1',
          },
          method: 'GET'
          //和下面异步调用相比，
      })
      return backData
      /*
      Http.request({
        url:'theme/by/names',
        data:{
          names:'t-1',
        },
        method:'GET',
        /**
         * 问题：当前方法中，为什么需要两个回调函数呢？
         * 答案：回调这个机制，就好像递归算法一样，调用了几次带有回调函数的方法，那么就需要在外层
         * 的方法中，嵌套几个回调
        callback:(data)=>{
          callback(data);
        }
      })
      */
  }

}

export {
  Theme
}