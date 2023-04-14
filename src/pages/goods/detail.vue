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
    <div style="background-color: #FFFFFF;min-height: calc(100vh - 351px);">
        <div class="detail-line"></div>
        <Container>
            <div class="goods-box">
                <div class="goods-top">
                    <div class="goods-swiper">
                        <div class="img-box">
                            <img v-if="showIndexImg != -1" :src="$utils.mediaUrl(getDefaultImg)" alt="">
                            <video v-else controls="controls" :src="$utils.mediaUrl(goodsDetail.video)" alt=""></video>
                        </div>
                        <div class="swiper-li">
                            <div class="left-icon icon" @click="toLeft">
                                <Icon type="ios-arrow-forward"/>
                            </div>
                            <ul v-dragscroll ref="swiperBox">

                                <li class="video-css" v-if="goodsDetail.video"
                                    @mouseenter="mouseenter(goodsDetail.video_thumb,-1)">
                                    <img :class="[ -1 == showIndexImg ? 'active' : '']"
                                         :src="$utils.mediaUrl(getVideoThumb)"
                                         alt="">
                                </li>
                                <li @mouseenter="mouseenter(item,index)" v-for="(item,index) in swiperList"
                                    :key="index">
                                    <img :class="[index == showIndexImg ? 'active' : '']" :src="$utils.mediaUrl(item)"
                                         alt="">
                                </li>
                            </ul>
                            <div class="right-icon icon" @click="toRight">
                                <Icon type="ios-arrow-forward"/>
                            </div>
                        </div>
                        <div class="collect-box">
                            <div @click="clickFavorite">
                                <span v-if="!isFavorite"><i class="iconfont icon-shoucang"></i> 收藏</span>
                                <span v-else><i class="iconfont icon-yishoucang2"></i>已收藏</span>
                            </div>
                        </div>
                    </div>
                    <div class="goods-info">
                        <!--秒杀商品及价格信息-->
                        <seckill v-if="goodsDetail.is_seckill == '1'" :goodsDetail="goodsDetail"
                                 :seckillInfo="seckillInfo" :actionsData="actionsData"></seckill>
                        <!--会员价格-->
                        <vip v-else-if="activity.member_price" :goodsDetail="goodsDetail"
                             :member_price="activity.member_price" :actionsData="actionsData"></vip>
                        <!--正常商品标题及价格信息-->
                        <normal v-else :goodsDetail="goodsDetail" :actionsData="actionsData"></normal>

                        <div class="coupon-box" v-if="!goodsDetail.is_seckill">
                            <!-- 优惠券-->
                            <div class="center flex">
                                <div class="center-left">优惠券</div>
                                <div class="center-right">
                                    <ul>
                                        <template v-for="(item,i) in goodsCoupon">
                                            <li v-if="i < 3" :key="i">
                                                <div class="flex">
                                                    <p v-if="item.coupon_sale_type == '1'" class="name">满减券</p>
                                                    <p v-else class="name">折扣券</p>
                                                    <span class="price">{{ item.content || '' }}</span>
                                                    <span class="time">{{ item.time_content }}</span>
                                                </div>
                                                <div class="get">

                                                    <span
                                                        v-if="item.can_receive_count > 0  ||  item.can_receive_count === -1  "
                                                        @click="getCoupon(item)"
                                                        class="isGet">领取</span>
                                                    <span style="margin-left: 5px" v-if="item.can_receive_count > 0">( {{
                                                            item.has_receive_count
                                                        }}/{{
                                                            item.has_receive_count + item.can_receive_count
                                                        }} )</span>
                                                    <span style="margin-left: 5px"
                                                          v-if=" item.can_receive_count === -1 ">无限制</span>
                                                    <!-- get_max_type = 0 无限制-->
                                                    <span
                                                        v-if="item.is_has == '1' && item.can_receive_count === 0 ">已领完</span>

                                                </div>
                                            </li>
                                        </template>

                                    </ul>
                                </div>

                            </div>
                            <div class="bottom flex">
                                <div class="flex noselect" @click="showMoreCoupon">
                                    更多优惠
                                    <Icon :class="[moreCoupon ?  'iconRotate' : '']" type="ios-arrow-down"/>
                                </div>
                                <div class="more" :class="[ moreCoupon ?  'moreDown' : '']">
                                    <div class="center-left">&nbsp;</div>
                                    <div class="center-right">
                                        <ul>
                                            <template v-for="(item,i) in goodsCoupon">
                                                <li v-if="i >= 3" :key="i">
                                                    <div class="flex">
                                                        <p v-if="item.coupon_sale_type == '1'" class="name">满减券</p>
                                                        <p v-else class="name">折扣券</p>
                                                        <span class="price">{{ item.content || '' }}</span>
                                                        <span class="time">{{ item.time_content }}</span>
                                                    </div>
                                                    <div class="get">
                                                        <!--<span v-if="item.is_has == '0'" @click="getCoupon(item)"-->
                                                        <!--      class="isGet">领取</span>-->
                                                        <!--<span v-else>已领取</span>-->
                                                        <span
                                                            v-if="item.can_receive_count > 0 ||  item.can_receive_count === -1 "
                                                            @click="getCoupon(item)"
                                                            class="isGet">领取</span>
                                                        <!--<span style="margin-left: 5px" v-if="item.can_receive_count > 0 && item.get_max_type == '1' ">( {{ item.has_receive_count}}/{{item.get_max}} )</span>-->
                                                        <!--<span style="margin-left: 5px" v-if="item.can_receive_count > 0 && item.get_max_type == '0' ">剩余 {{// item.can_receive_count}} 张</span>-->
                                                        <span style="margin-left: 5px"
                                                              v-if="item.can_receive_count > 0">( {{
                                                                item.has_receive_count
                                                            }}/{{
                                                                item.has_receive_count + item.can_receive_count
                                                            }} )</span>

                                                        <span style="margin-left: 5px"
                                                              v-if=" item.can_receive_count === -1 && item.get_max_type == '0' ">无限制</span>

                                                        <!-- get_max_type = 0 无限制-->
                                                        <span
                                                            v-if="item.is_has == '1' && item.can_receive_count === 0 ">已领完</span>
                                                    </div>
                                                </li>
                                            </template>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else style="height: 30px"></div>
                        <!-- 规格-->
                        <div class="goods-specs">
                            <template v-if="goodsDetail.has_option =='1' ">
                                <div class="item flex" v-for="(item,index) in spec" :key="index">
                                    <div class="name">{{ item.title }}</div>
                                    <div class="specs">
                                        <ul class="flex">
                                            <template>
                                                <li v-for="el in item.items "
                                                    :class="[getItemClass(el.id), selectIds[index] == el.id ? 'active' : '' ]"
                                                    @click="clicktypeId(index,el.id)"
                                                    :key="el.id">{{ el.title }}
                                                    <i v-show="selectIds[index] == el.id"
                                                       class="iconfont icon-a-chenggongde21"></i>
                                                </li>
                                            </template>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                            <div class="item flex" style="padding-top: 10px">
                                <div class="name">数量</div>
                                <div class="stepper">
                                    <InputNumber :min="1" v-model="buyTotal" :max="Number(stock)"
                                                 controls-outside></InputNumber>
                                    <div class="inventory">（库存{{ actionsData.stock || stock }}件）</div>
                                </div>
                            </div>
                        </div>
                        <!-- 加入购物车-->
                        <div class="class-shopping">
                            <template v-if="!goodsDetail.is_seckill">
                                <Button v-if="goodsDetail.type == '0' || goodsDetail.type == '3'" :disabled="stock <= 0"
                                        @click="addShopping" type="error">加入购物车
                                </Button>
                            </template>
                            <Button :disabled="actionsData.stock <= 0 || stock <= 0" @click="buyGoods">立即购买</Button>
                        </div>
                    </div>
                </div>
                <!-- 详情图-->
                <div class="goods-bottom">
                    <div class="params-hd">
                        <div class="params-type flex">
                            <div @click="tabIndex(0)" :class="[barIndex === 0 ? 'active' : '']">产品详情</div>
                            <div class="line"></div>
                            <div @click="tabIndex(1)" :class="[barIndex === 1 ? 'active' : '']">
                                累计评论({{ commentList.length || '0' }})
                            </div>
                        </div>

                    </div>
                    <!-- 产品图-->
                    <div v-show="barIndex === 0" class="goods-params">
                        <div v-html="goodsDetail.content"></div>
                        <!--                        <img-->
                        <!--                            src="https://qiniu.crmeb.net/attach/2021/08/12/f0dfb34fe5279226d97948d1f13350dc.jpg?imageView2/2/w/800/h/800"-->
                        <!--                            alt="">-->
                    </div>
                    <!-- 评论-->
                    <div v-show="barIndex === 1" class="goods-comment">
                        <!--                        <div class="comment-top">-->
                        <!--                            <div class="flex">-->
                        <!--                                <div class="percentage">100% <span>满意</span></div>-->
                        <!--                                <div class="rate"><span>评分</span>-->
                        <!--                                    <Rate disabled :value="5"/>-->
                        <!--                                </div>-->
                        <!--                            </div>-->
                        <!--                            <div style="margin-top: 20px">-->
                        <!--                                <ul class="flex">-->
                        <!--                                    <li @click="changeComment(index)" v-for="(tag,index) in commentTab"-->
                        <!--                                        :class="[commentTabIndex === index ? 'active' :'']" :key="index">-->
                        <!--                                        {{ tag.name }}({{ tag.id || 0 }})-->
                        <!--                                    </li>-->
                        <!--                                </ul>-->
                        <!--                            </div>-->
                        <!--                        </div>-->
                        <div class="comment-list">
                            <div class="item" v-for="(item,index) in commentList" :key="index">
                                <div class="item-hd flex">
                                    <div class="image">
                                        <img :src="$utils.mediaUrl(item.avatar)">
                                    </div>
                                    <div class="text">
                                        <div class="flex name">
                                            {{ item.nickname || '' }}
                                            <div class="star">
                                                <Rate disabled v-model="item.level"/>
                                            </div>
                                        </div>
                                        <div class="time">{{ item.create_time || '' }}</div>
                                    </div>
                                </div>
                                <div class="item-bd">
                                    <div>{{ item.content || '' }}</div>
                                    <div class="image-wrapper" v-if="typeof item.images ==='object'">
                                        <div v-for="(el,i) in item.images" :key="i"
                                             @click="previewImg(true,i,item.images)" class="image">
                                            <div class="el-image" style="width: auto; height: 54px;">
                                                <img :src="$utils.mediaUrl(el)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="reply" v-if="item.reply_content">
                                        <div class="item"><span>卖家回复：</span>{{ item.reply_content }}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div v-if="commentList.length === 0" class="empty">
                            <EmptyPage msg="暂无评论～"></EmptyPage>
                        </div>
                    </div>

                </div>
            </div>

        </Container>
        <PreviewImg :imgList="previewList || []" v-show="imageModal" :currentIndex="imgcurrentIndex"
                    @on-close="previewImg(false)"></PreviewImg>
    </div>
</template>

<script>
import PreviewImg from '@/components/common/PreviewImg';
import normal from './component/normal'
import seckill from './component/seckill'
import vip from './component/vip'
import goodsApi from '@/api/goods'
import orderApi from '@/api/order'
import userApi from '@/api/user'

export default {
    name: "detail",
    components: {PreviewImg, normal, seckill, vip},
    data() {
        return {
            isFavorite: false,//收藏
            moreCoupon: false,//更多优惠券
            buyTotal: 1,
            imageModal: false,
            imgcurrentIndex: 0,
            swiperList: [],
            goodsDetail: {},//详情
            activity: {},//所有的活动
            seckillInfo: {},
            couponList: [],
            previewList: [],//预览列表
            commentList: [],//评价列表
            goodsCoupon: [],//优惠券
            spec: [],//商品规格
            options: [],//规格对应参数
            stock: '',//库存
            showIndexImg: 0,
            scrollDistance: 100,//滚动距离
            barIndex: 0,//0 产品详情 1 累计评论
            commentTab: [{name: '全部', id: 1}, {name: '好评', id: 2}, {name: '中评', id: 3}, {name: '差评', id: 3}],
            commentTabIndex: 0,
            selectIds: [],
            actionsData: {},//选中的数据
            single_max_buy: "",//单比最多购买个数
            single_min_buy: "",//单比最低购买个数
            disabled: [],//禁选

        }
    },
    created() {
        this.getDetail()
        // history.pushState(null, '商品详情', document.URL);
    },
    methods: {
        getItemClass(id) {
            if (this.disabled.includes(id)) {
                return 'disabled'
            }
            //
            // if(this.choose[i] == id){
            //     return 'theme-primary-border theme-primary-color theme-sub-bgcolor theme-spec-bgcolor'
            // }
            return ''
        },
       async getCoupon(item) {
            await this.checkLoginStatus()
            userApi.getCoupon({id: item.id}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.$Message.success('领取成功');
                    this.getDetail()
                }
            })
        },
        showMoreCoupon() {
            this.moreCoupon = !this.moreCoupon
        },
        clicktypeId(index, id) {
            // 禁用防止点击
            // if (this.disabled.includes(id)) return;
            // if(this.selectIds[index] == id){
            //     this.$set(this.selectIds, index, '')
            // }else{
            this.$set(this.selectIds, index, id)
            // }
            let key = this.selectIds.join(',')
            // eslint-disable-next-line no-prototype-builtins
            if (this.options.hasOwnProperty(key)) {
                this.actionsData = this.options[key] //选中的数据
            }

        },
        getDetail() {
            goodsApi.getDetail({
                id: this.$route.query.id || ''
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.swiperList = res.data?.goods?.thumb_all || []
                    this.goodsDetail = res.data.goods || {}
                    if(this.goodsDetail.video){ this.showIndexImg = -1}
                    this.activity = res.activity || {}//活动
                    this.seckillInfo = res.activity?.seckill || {}
                    this.single_max_buy = res.data.goods?.ext_field?.single_max_buy || ''//单比最多购买个数
                    this.single_min_buy = res.data.goods?.ext_field?.single_min_buy || ''//单比最低购买个数
                    this.goodsCoupon = res.goods_coupon
                    this.isFavorite = res.is_favorite
                    this.stock = res.data.goods.stock
                    if (res.data.goods.has_option == '1') this.getOption()
                    this.UpdateBasic(`${this.goodsDetail.title} - ${this.channelTitle}`)
                }
            })
            orderApi.getComment({
                goods_id: this.$route.query.id || ''
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    res.list.forEach(item => {
                        item.level = Number(item.level)
                    })
                    this.commentList = res.list
                }
            })
        },
        getOption() {
            goodsApi.getOption({
                goods_id: this.$route.query.id || ''
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.options = res.options
                    this.spec = res.spec
                }
            })
        },
        clickFavorite() {
            goodsApi.favorite({
                goods_id: this.$route.query.id,
                is_add: this.isFavorite ? '0' : '1'
            }, {
                hideSuccessTip: true,
                hideErrorTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.getDetail()

                    if (this.isFavorite) return
                    this.$Message.success('收藏成功');
                }
            })
        },
        async addShopping() {
            await this.checkLoginStatus()
            if (this.goodsDetail.has_option == '0') {//单规格
                goodsApi.changeTotal({
                    goods_id: this.$route.query.id || '',//商品id
                    option_id: 0,//规格id
                    total: this.buyTotal,
                    mode: 1,//1是加 0是减 2固定数量
                    is_activity_goods: 0
                }, {
                    hideSuccessTip: true,
                    success: (res) => {
                        if (res.error !== 0) return
                        this.$store.dispatch('common/getCartCount')
                        this.$Message.success('加入购物车成功');
                    }
                })
                return
            }

            // 多规格购买
            // eslint-disable-next-line no-prototype-builtins
            if (!this.actionsData.hasOwnProperty('goods_id')) {
                this.$Message.warning('请选择商品规格');
                return
            }
            goodsApi.changeTotal({
                goods_id: this.actionsData.goods_id,//商品id
                option_id: this.actionsData.id,//规格id
                total: this.buyTotal,
                mode: 1,//1是加 0是减 2固定数量
                is_activity_goods: 0
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.$store.dispatch('common/getCartCount')
                    this.$Message.success('加入购物车成功');

                }
            })
        },
        async buyGoods() {//立即购买
            await this.checkLoginStatus()
            if (this.single_max_buy != '' && this.buyTotal > this.single_max_buy) {
                this.$Message.warning(`此商品最多购买${this.single_max_buy}件`)
                return
            }
            if (this.single_min_buy != '' && this.buyTotal < this.single_min_buy) {
                this.$Message.warning(`此商品最少购买${this.single_min_buy}件`)
                return
            }
            let query = {
                goods_id: this.$route.query.id,
                option_id: 0,
                total: this.buyTotal,
                type: this.goodsDetail.type,
            }
            if (this.goodsDetail.has_option === '1') {//多规格
                // eslint-disable-next-line no-prototype-builtins
                if (!this.actionsData.hasOwnProperty('goods_id')) {
                    this.$Message.warning('请选择商品规格');
                    return
                }
                query.option_id = this.actionsData.id //规格id
            }
            this.$router.push({
                path: '/order/confirm',
                query
            })
        },
        previewImg(status, index, imageList) {
            this.imgcurrentIndex = index
            this.previewList = imageList
            this.imageModal = status;
        },
        changeComment(index) {
            this.commentTabIndex = index
        },
        tabIndex(index) {
            this.barIndex = index
        },
        toRight() {
            let s = this.scrollDistance
            let oldX = this.$refs.swiperBox.scrollLeft
            let x = Number(oldX) + s
            this.$refs.swiperBox.scrollTo(x, 0)

        },
        toLeft() {
            let s = this.scrollDistance
            let oldX = this.$refs.swiperBox.scrollLeft
            let x = Number(oldX) - s < 0 ? 0 : Number(oldX) - s
            this.$refs.swiperBox.scrollTo(x, 0)
        },
        mouseenter(item, index) {
            this.showIndexImg = index
        },
    },
    computed: {
        getVideoThumb(){
            let url = ''
            if(this.goodsDetail.video_thumb != ''){
                url = this.goodsDetail.video_thumb
            }
            else{
                url =  this.swiperList[0]
            }
            return url
        },
        getDefaultImg() {
            if (this.showIndexImg != -1) {
                return this.swiperList[this.showIndexImg]
            } else {
                return this.swiperList[0]
            }
        },

    },
}
</script>
<style>

</style>
<style scoped lang="scss">
.detail-line {
    border-bottom: 1px solid #E9EDEF;;
}

.goods-box {
    background-color: #ffffff;
    padding: 40px 0px;

    .goods-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-bottom: 60px;

        .goods-swiper {
            width: 500px;

            .img-box {
                padding-bottom: 20px;

                img {
                    width: 500px;
                    height: 500px;
                }

                video {
                    display: block;
                    width: 500px;
                    height: 500px;
                }
            }

            .swiper-li {
                width: 500px;
                position: relative;
                cursor: pointer;

                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    width: 34px;
                    height: 90px;
                    background: rgba(#E4E4E4, 0.8);
                    top: 0;
                    font-size: 28px;
                    color: #FFFFFF;

                    &:hover {
                        background: rgba(#1D2129, 0.3);
                    }
                }

                .left-icon {
                    left: 0;
                    transform: rotate(180deg);
                    z-index: 10;
                }

                .right-icon {
                    right: 0;
                }

                ul {
                    display: flex;
                    align-items: center;
                    width: 500px;
                    overflow: hidden;
                    padding: 0 34px;

                    li {
                        margin-left: 10px;
                        //transform:translateX(-100px);
                        &.video-css {
                            position: relative;

                            &:after {
                                content: '';
                                left: 0;
                                right: 0;
                                top: 0;
                                bottom: 0;
                                margin: auto;
                                position: absolute;
                                z-index: 1;
                                width: 60px;
                                height: 60px;
                                background: url("../../assets/images/play.png") center no-repeat;
                                background-size: 40px 40px;

                            }

                        }

                        img {
                            display: block;
                            //-webkit-user-drag:none;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            cursor: pointer;
                            border: 2px solid rgba(255, 255, 255, 0);
                            width: 90px;
                            height: 90px;

                            &.active {
                                border-color: $theme-color;
                            }
                        }
                    }
                }

            }

            .collect-box {
                padding-top: 20px;
                font-size: 12px;

                > div {
                    align-items: center;
                    display: inline-block;
                    cursor: pointer;

                    span {
                        cursor: pointer;
                        line-height: 14px;
                        display: inline-block;
                        margin-right: 10px;

                        i {
                            margin-right: 3px;
                            color: $theme-color;
                            position: relative;
                            top: 1px;
                        }
                    }

                }
            }
        }

        .goods-info {
            width: 700px;
            padding-left: 40px;

            .title {
                font-size: 24px;
                line-height: 34px;
                margin-bottom: 20px;
            }

            .subTitle {
                font-size: 14px;
                line-height: 20px;
                color: #636669;
                margin-bottom: 30px;
                display: flex;
                align-items: center;

                .seckill {
                    color: #FFFFFF;
                    font-size: 12px;
                    width: 30px;
                    height: 18px;
                    display: inline-block;
                    background: $theme-BgColor;
                    border-radius: 2px;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 18px;
                }
            }

            .price-box {
                background: #E93323;
                color: #FFFFFF;
                padding: 13px 30px;
                height: 84px;
                justify-content: space-between;

                .top-left {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    span {
                        font-size: 14px;
                        line-height: 20px;
                        text-decoration: line-through;
                        margin-bottom: 6px;
                    }

                    p {
                        font-weight: 600;
                        font-size: 34px;
                        line-height: 30px;
                        color: #F7F9FF;

                        &:before {
                            content: '¥';
                            font-weight: 600;
                            font-size: 24px;
                            line-height: 30px;
                            width: 24px;
                            text-align: center;
                            display: inline-block;
                        }
                    }
                }

                .top-right {
                    padding-left: 30px;
                    position: relative;

                    &:before {
                        content: '';
                        height: 40px;
                        width: 1px;
                        background-color: rgba(255, 255, 255, 0.5);
                        position: absolute;
                        left: 0;
                        top: 6px;
                    }

                    span {
                        font-weight: 600;
                        font-size: 20px;
                        line-height: 26px;
                        color: #F7F9FF;
                        margin-bottom: 6px;
                        display: block;
                    }

                    p {
                        font-size: 14px;
                        line-height: 20px;
                        color: #F7F9FF;

                    }
                }
            }

            .coupon-box {
                background-color: #F2F3F5;
                margin-bottom: 20px;

                .center {
                    padding: 20px 0 10px;
                    position: relative;

                    .center-left {
                        width: 76px;
                        text-align: center;
                        font-size: 12px;
                        line-height: 16px;
                        color: #4E5969;


                    }

                    .center-right {
                        width: 100%;

                        li {
                            height: 36px;
                            line-height: 36px;
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            position: relative;
                            background: url('../../../static/images/goods/Frame1653.png') no-repeat;
                            background-size: 200px 36px;

                            .name {
                                width: 66px;
                                text-align: center;
                                font-style: normal;
                                font-weight: normal;
                                font-size: 14px;
                                color: #FFFFFF;
                            }

                            .price {
                                font-size: 14px;
                                color: #E93323;
                                width: 133px;
                                text-align: center;
                            }

                            .time {
                                font-size: 12px;
                                color: #4E5969;
                                margin-left: 10px;

                            }

                            .get {
                                position: absolute;
                                right: 30px;
                                font-size: 12px;
                                color: #86909C;

                                .isGet {
                                    cursor: pointer;
                                    color: #E93323;

                                    &:hover {
                                        color: $theme-color;
                                    }
                                }
                            }
                        }
                    }
                }

                .bottom {
                    background: #EEEFF1;
                    height: 40px;
                    line-height: 40px;
                    text-align: right;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 0 16px;
                    font-size: 12px;
                    color: #4E5969;
                    position: relative;

                    .iconRotate {
                        transform: rotate(180deg);
                    }

                    .more {
                        width: 660px;
                        margin: 0;
                        position: absolute;
                        left: 0;
                        bottom: 0px;
                        height: 0px;
                        right: 0;
                        overflow: hidden;
                        z-index: 100;
                        background-color: #F2F3F5;
                        overflow: hidden;
                        transition: all 0.3s;
                        display: flex;

                        .center-left {
                            width: 76px;
                            text-align: center;
                            font-size: 12px;
                            line-height: 16px;
                            color: #4E5969;
                        }

                        .center-right {
                            padding: 20px 0 10px;
                            width: 100%;
                            overflow-y: scroll;

                            li {
                                overflow: hidden;
                                height: 36px;
                                line-height: 36px;
                                display: flex;
                                align-items: center;
                                margin-bottom: 10px;
                                position: relative;
                                background: url('../../../static/images/goods/Frame1653.png') no-repeat;
                                background-size: 200px 36px;

                                .name {
                                    width: 66px;
                                    text-align: center;
                                    font-style: normal;
                                    font-weight: normal;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                }

                                .price {
                                    font-size: 14px;
                                    color: #E93323;
                                    width: 133px;
                                    text-align: center;
                                }

                                .time {
                                    font-size: 12px;
                                    color: #4E5969;
                                    margin-left: 10px;

                                }

                                .get {
                                    position: absolute;
                                    right: 30px;
                                    font-size: 12px;
                                    color: #86909C;

                                    .isGet {
                                        cursor: pointer;
                                        color: #E93323;

                                        &:hover {
                                            color: $theme-color;
                                        }
                                    }
                                }
                            }
                        }

                        &.moreDown {
                            height: 300px;
                            bottom: -300px;
                        }
                    }

                    .flex {
                        align-items: center;
                        cursor: pointer;

                        &:hover {
                            color: $theme-color;

                        }
                    }

                    i {
                        margin-left: 9px;
                        font-size: 16px;
                        font-weight: 400;
                    }
                }
            }

            .goods-specs {
                .item {
                    margin-bottom: 10px;

                    .name {
                        flex-shrink: 0;
                        font-size: 12px;
                        color: #4E5969;
                        width: 68px;

                    }

                    .stepper {
                        display: flex;
                        align-items: flex-end;
                        margin-left: 10px;
                        font-size: 16px;
                        color: #636669;
                        margin-left: 0px;

                        /deep/ .ivu-icon {
                            font-size: 18px;
                        }
                    }

                    ul {
                        flex-wrap: wrap;

                    }

                    li {
                        padding: 0 30px;
                        height: 32px;
                        line-height: 32px;
                        background: #FFFFFF;
                        border: 1px solid #E0E0E0;
                        font-size: 12px;
                        box-sizing: border-box;
                        color: #636669;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        cursor: pointer;
                        position: relative;

                        &active {
                            color: $theme-color;
                            border-color: $theme-color;
                        }

                        &.disabled {
                            border: 1px dashed #E0E0E0;
                        }

                        &:hover {
                            color: $theme-color;
                            border-color: $theme-color;
                        }

                        i {
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            color: $theme-color;
                            height: 24px;
                        }

                        &.active {
                            border: 1px solid #FF1F2C;
                        }

                    }

                    /deep/ .ivu-input-number-controls-outside {
                        width: 140px;
                        padding: 0 36px;
                        line-height: 36px;
                        height: 36px;

                        .ivu-input-number-controls-outside-btn {
                            height: 36px;
                            width: 36px;
                            line-height: 36px;
                        }

                        .ivu-input-number-input-wrap {
                            height: 36px;
                            line-height: 36px;
                        }
                    }

                    /deep/ .ivu-input-number {

                        border-radius: 0px;

                        .ivu-input-number-controls-outside-btn {
                            background-color: #FFFFFF;
                        }

                        .ivu-input-number-input {
                            text-align: center;
                        }
                    }

                }
            }

            .class-shopping {
                padding-top: 20px;

                button {
                    border-radius: 0px;
                    margin-right: 20px;
                    width: 175px;
                    height: 54px;
                    font-size: 18px;

                    &:hover {
                        background-color: $theme-BgColor;
                        color: #ffffff;
                    }
                }

                button:last-child {
                    border-color: $theme-color;
                    color: $theme-color;

                    &:hover {
                        border-color: $theme-color;
                        color: $theme-color;
                        background-color: #FFFFFF;
                    }

                }
            }
        }


    }

    .goods-bottom {
        width: 100%;

        .params-hd {
            background-color: #F2F3F5;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .params-type {
                background-color: #F2F3F5;

                > div {
                    width: 160px;
                    height: 64px;
                    line-height: 64px;
                    text-align: center;
                    font-size: 18px;
                    position: relative;
                    cursor: pointer;

                    &:hover {
                        color: $theme-color;
                    }

                    &.active {
                        &:before {
                            content: '';
                            width: 100%;
                            height: 2px;
                            background-color: $theme-BgColor;
                            position: absolute;
                            left: 0;
                            top: 0;
                        }

                        color: $theme-color;

                        &:after {
                            content: '';
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                            top: 1px;
                            width: 0px; /*  宽高设置为0，很重要，否则达不到效果 */
                            height: 0px;
                            border: 6px solid $theme-color;
                            border-bottom-color: transparent; /* 设置透明背景色 */
                            border-left-color: transparent;
                            border-right-color: transparent;

                        }
                    }

                    &.line {
                        width: 1px;
                        height: 36px;
                        position: relative;
                        background-color: #C9CDD4;
                        right: 0;
                        top: 15px;
                        //transform: translateY(-50%);

                    }
                }

            }

            .h5-code {
                justify-content: center;
                font-size: 18px;
                color: #4E5969;
                align-items: center;
                width: 167px;
                height: 64px;
                background: #EEEFF1;
                cursor: pointer;
                position: relative;

                &:hover {
                    .code {
                        visibility: inherit;
                    }

                    i:nth-child(2) {
                        transform: rotate(180deg);
                    }
                }

                .code {
                    visibility: hidden;
                    box-shadow: 0px 0px 20px rgba(176, 176, 176, 0.25);
                    position: absolute;
                    bottom: -161px;
                    width: 160px;
                    height: 160px;
                    z-index: 99;
                    background-color: #FFFFFF;

                    img {
                        margin: 6px;
                        width: 148px;
                        height: 148px;
                    }
                }

                i {
                    margin: 7px;

                }
            }
        }

        .goods-comment {

            .comment-top {
                padding: 30px 0;

                > div {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .percentage {
                        color: $theme-color;
                        font-size: 14px;

                        span {
                            margin-left: 3px;
                        }
                    }

                    .rate {
                        font-size: 14px;
                        color: #7e7e7e;

                        > span {
                            margin-right: 3px;
                        }

                        /deep/ .ivu-rate-star-full:before, .ivu-rate-star-half .ivu-rate-star-content:before {
                            color: $theme-color;
                        }
                    }

                    li {
                        width: 86px;
                        height: 34px;
                        border-radius: 2px;
                        background-color: #f7f7f7;
                        line-height: 34px;
                        text-align: center;
                        margin-right: 14px;
                        cursor: pointer;

                        &:hover {
                            color: $theme-color;
                        }

                        &.active {
                            background-color: $theme-BgColor;
                            color: #FFFFFF;
                        }
                    }
                }
            }

            .comment-list {

                .item {
                    padding-top: 20px;
                    padding-bottom: 20px;

                    .item-hd {
                        align-items: flex-start;

                        .image {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-right: 12px;

                            img {
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .name {
                            margin-bottom: 4px;
                            font-size: 16px;
                            align-items: center;
                        }

                        .star {
                            margin-left: 12px;
                            height: 16px;
                            line-height: 16px;

                            /deep/ .ivu-rate {
                                font-size: 16px;
                            }


                        }

                        .time {
                            font-size: 14px;
                            color: #868686;
                        }
                    }

                    .item-bd {
                        padding-top: 15px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e3e3e3;
                        margin-left: 52px;
                        font-size: 14px;
                        color: #282828;

                        .image-wrapper {
                            display: flex;
                            margin-top: 15px;

                            .image {
                                display: inline-block;
                                width: auto;
                                height: 54px;
                                margin-right: 8px;
                                margin-bottom: 10px;
                                cursor: pointer;

                                img {
                                    display: block;

                                    width: 100%;
                                    height: 100%;
                                }
                            }

                        }
                    }

                    .reply {
                        background-color: #f7f7f7;
                        margin-top: 15px;

                        .item {
                            padding: 7px 12px;
                            font-size: 14px;
                            color: #282828;

                            span {
                                color: $theme-color;
                            }
                        }
                    }
                }
            }

            .empty {
                position: relative;
                height: 500px;
            }
        }

    }

}
</style>
