/**
 * 开店星公众版
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
/**
 * @Description: 自定义指令
 * @author  Gao
 * @date 2022/1/15
 */
export const dragscroll = function (el) {
    el.onmousedown = function (ev) {
        const disX = ev.clientX
        const disY = ev.clientY
        const originalScrollLeft = el.scrollLeft
        const originalScrollTop = el.scrollTop
        const originalScrollBehavior = el.style['scroll-behavior']
        const originalPointerEvents = el.style['pointer-events']
        el.style['scroll-behavior'] = 'auto'
        // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
        document.onmousemove = function (ev) {
            ev.preventDefault()
            const distanceX = ev.clientX - disX
            const distanceY = ev.clientY - disY
            el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY)
            // 由于我们的图片本身有点击效果，所以需要在鼠标拖动的时候将点击事件屏蔽掉
            el.style['pointer-events'] = 'none'
        }
        document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
            el.style['scroll-behavior'] = originalScrollBehavior
            el.style['pointer-events'] = originalPointerEvents
        }
    }
}