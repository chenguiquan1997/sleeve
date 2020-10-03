/**
 * 定义URI前缀的常量
 */
// const baseURL  = {
//   appkey: 'YaKUEEmZseyDFAxk',
//   url: 'http://se.7yue.pro/v1/'
// }

const baseURL  = {
  appkey: 'YaKUEEmZseyDFAxk',
  url: 'http://192.168.124.81:8082/v1/'
}
//定义的全局配置，如果想要在外部使用，那么一定需要导出,当前使用的是ES6的语法
export {
  //导出的值必须与变量名称相同
  baseURL
}