## 蓝湖图片下载VSCode插件
通过url或者选择，从蓝湖下载图片到项目中。
![](https://github.com/xiangwenhu/lanhu-image-downloader-ext/blob/main/res/lanhu-image-downloader.gif?raw=true)

### 已支持的插件
*  （已支持）MasterGo 插件
*  （已支持）Sketch 插件
*  （已支持）Photoshop 插件
*  Adobe XD 插件
*  Figma 插件
*  Axure 插件

## 配置
在工作目录下，创建`lanhu.config.json`, 输入自己的配置
```js
{
  /**
   * 可选: 团队ID
   */
  "teamId": "5bc37737-629a-41f8-988c-bcbb89f901ea",
  /**
   * 可选: 启用中专英文
   */
  "enableTranslation": true,
  /**
   * 可选：启用翻译后，百度翻译的appId和appKey
   */
  "trans": {
    /**
     * 百度翻译的appId
     */
    "appId": "10000000000000000",
    /**
     * 百度翻译的appKey
     */
    "appKey": "xxxxxxxxxxxxxxxxxxx"
  },
  /**
   * 必须： 蓝湖登录后的cookies, 可以是数组，也可以是字符串
   */
  "cookies": [
    {
      "domain": ".lanhuapp.com",
      "name": "session",
      "value": "xxxx"
    }
  ],
  /**
   * 可选：平台，可选值 IOS | Android | Web
   */
  "platform": "IOS",
  /**
   * 可选：下载切图样式，可选择 png | jpg | webp
   */
  "cutImageStyle": "png",
  /**
   *可选： 下载的图片的切图大小，具体参见蓝湖的选项，一般情况 IOS: 1|2|3, Web: 1|2, Android: 1|1.5|2|3|4
   */
  "downloadScale": 1
}
```
