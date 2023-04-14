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
<template>
    <div class="banner" @mouseenter="suspendSlide" @mouseleave="autoSlide">
		<span
            @click="slidePre"
            class="slide-pre">
		</span>
        <span
            @click="slideNext"
            class="slide-next">
		</span>
        <div
            class="slide"
            transition="fadeIn"
            v-show="index === curpage"
            v-for="(item,index) in banners" :key="index">
            <a :href="item.url">
                <img :src="$utils.mediaUrl(item.img)" alt=""/>
            </a>
        </div>
        <div class="swiper-dot">
            <i @click="navItem(i)" v-for="(el,i) in banners" :class="[i === curpage ? 'dotActive': '']" :key="i"></i>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            prevTid: '',
            curpage: 0,
            slideDirection: 1
        }
    },
    props: {
        banners: {
            type: Array,
            required: true
        }
    },
    mounted() {
        this.autoSlide()
    },
    methods: {
        navItem(i) {
            this.curpage = i
        },
        slideNext() {
            const lastPage = this.banners.length - 1
            if (this.curpage < lastPage) {
                this.curpage += 1
            } else {
                this.curpage = 0
            }
        },
        slidePre() {
            const lastPage = this.banners.length - 1
            if (this.curpage > 0) {
                this.curpage -= 1
            } else {
                this.curpage = lastPage
            }
        },
        suspendSlide(){
            clearInterval(this.prevTid)
        },
        autoSlide() {
            clearInterval(this.prevTid)
            this.prevTid = setInterval(() => {
                this.slideNext()
            }, 5000)
        }
    },
    beforeDestroy() {
        clearInterval(this.prevTid)
    }
}
</script>

<style scoped lang="scss">
.banner {
    position: relative;
    width: 1200px;
    height: 450px;
    z-index: 0;
}

.slide-pre {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHh4f39/f5+fn4+Pj5+fn5+fn5+fn5+fn6+vr6+vr////SuEW8AAAAInRSTlMAAQIDBgcICQoMDQ4PEBESExQVFhcYGRoxxNDR0tPU2tzdoEnIjwAAARpJREFUSMelltuWgyAMRYOCrR0qCjZxrp32/z9yHnqHgGTNecQtC3I7AERSph/8jDj7oTcKilIbh/QkdJvCH9uZEoVtBjaeWHnD0XvKap/AzUQFTc0r3QYqyrcve6/QROF5/4lWNT1oSxWyN1pTlfQV93W4v+aS/7p8vEcrl/zyUVlO5684OgAAXY4+LfFiBwBDNU0DgMJqmlCxZ8nQRAZ2App24AQ0uTSMBZoCHAQ0HSAOzE+BJkzw7/OxhAsPI7yqMJBvsjSJiqCTlpiwgKXtIWy+bGv/frKtLRwcoLGGxttY4lLFpeiucZ0eRQPbNxI7CO1/zAZA2Wx80HLmqnNGqTPO2jM2PPcFl09NHlaeBZ0dL08IZ7vkzH/7UpbX365ndAAAAABJRU5ErkJggg==");
    background-repeat: no-repeat;
    display: block;
    position: absolute;
    left: 329px;
    top: 50%;
    width: 46px;
    height: 46px;
    margin-top: -35px;
    z-index: 10;
    cursor: pointer;

}

.slide-next {
    background-repeat: no-repeat;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHh4f39/f4+Pj5+fn5+fn6+vr5+fn6+vr6+vr6+vr///9mQ76xAAAAInRSTlMAAQIDBgcICQoMDQ4PEBESExQVFhcYGRoxx9DR0tPU2dzdm4JKEwAAAR1JREFUSMelltt2wiAQRQ8JoLEYEoiMbe1F//8j+6C2yi3M6nlk7bAmczsAkYQaRreEsLhxUAJViY0N9KBgN5Uvtgsl8tsCrBxl5VSO3lNR+wTuZqpo7p7p3lNVrn+6e4Um8o/3z7Sq+Y821CBzpyU1Sd5w14a7Wy2j49e3Y56/1jfOysflnOc9AOj49Hgu8RrASM38CIhAzXwQaSw1XmFHDH4HSwzeotRcWd7jQAz+gEAV/hSnpoZ/Xd4TnBkM81eZiXzhlYnVBJrbYswG5o5HksrP6vAlo336ro42c3FAhhY63NdSoVRJiX41rdMTa2G7jmMHvv+P2QDCFPMTTM5cZckoZcFZh4wNL0PF5VOTx8qzQJvp+oSwRicx/wDzWZbXEoSK9AAAAABJRU5ErkJggg==");
    display: block;
    position: absolute;
    right: 20px;
    top: 50%;
    width: 46px;
    height: 46px;
    margin-top: -35px;
    z-index: 10;
    cursor: pointer;

}

.slide {
    position: absolute;
    left: 0;
    top: 0;
    width: 1200px;
    height: 450px;
    transition: all 0.3s;

    img {
        width: 100%;
        height: 100%;
    }
}

.icon-chevron-left, .icon-chevron-right {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30px;
    height: 30px;
    margin-left: -15px;
    margin-top: -15px;
    color: #ecf0f1;
}

.swiper-dot {
    right: 0;
    bottom: 14px;
    padding-right: 20px;
    position: absolute;
    z-index: 100;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    height: 12px;
    width: 100%;

    i {
        cursor: pointer;
        margin: 0 8px;
        display: block;
        width: 40px;
        height: 4px;
        background: #ffffff;
        opacity: .4;
        border-radius: 13px;
    }

    .dotActive {
        opacity: 1;
    }
}

/* 必需 */
.fadeIn-transition {
    transition: all .5s ease;
    opacity: 1;
}

/* .expand-enter 定义进入的开始状态 */
/* .expand-leave 定义离开的结束状态 */
.fadeIn-enter, .fadeIn-leave {
    opacity: 0;
}

</style>
