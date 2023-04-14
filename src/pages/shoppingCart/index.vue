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
    <div class="cart-box" style="background-color: #FFFFFF">
        <Container>
            <!--面包屑-->
            <Breadcrumbs></Breadcrumbs>
            <div class="cart-list">
                <div class="header flex">
                    <div class="allSelect">
                        <div class="checkbox-wrapper">
                            <Checkbox @on-change="allSelectedRadioChange" v-model="footerObj.all_selected">&nbsp;&nbsp;全选
                            </Checkbox>
                        </div>
                    </div>
                    <div class="info">商品信息</div>
                    <div class="price">单价</div>
                    <div class="num">数量</div>
                    <div class="money">金额</div>
                    <div class="operate">操作</div>
                </div>
                <div class="body" v-if="cartList.length > 0">
                    <div v-for="(itemEl,index) in cartList" :key="index">
                        <div class="item" v-for="(item,i) in itemEl.goods" :key="i">
                            <div class="allSelect">
                                <div class="checkbox-wrapper">
                                    <Checkbox @on-change="selectedGoods(item)" v-model="item.is_selected"></Checkbox>
                                </div>
                            </div>
                            <div class="info">
                                <div class="pictrue"><img
                                    :src="$utils.mediaUrl(item.thumb)">
                                </div>
                                <div class="text">
                                    <div class="name line2">{{ item.title }}</div>
                                    <div class="infor">{{ item.option_title || '' }}</div>
                                </div>
                            </div>
                            <div class="price">
                                <!-- 商品失效 -->
                                <template v-if="item.is_lose_efficacy=='1'">商品已下架</template>
                                <!-- 商品权限已变更 -->
                                <template class="choose-text" v-else-if="item.buy_perm =='0'">商品权限已变更</template>
                                <!-- 重选规格 -->
                                <template class="choose-text" v-else-if="item.is_reelect =='1'">重新选择商品规格</template>
                                <template class="choose-text" v-else-if="item.stock =='0'">商品已售罄</template>
                                <template v-else> ¥{{ item.price }}</template>

                            </div>
                            <div class="num">
                                <InputNumber @on-change="changeCartNumber(item)" :min="1" v-model="item.total"
                                             :max="Number(item.stock)"
                                             controls-outside></InputNumber>
                                <div class="single">
                                    <span v-if="item.single_min_buy != ''">至少购买{{item.single_min_buy}}件</span>
                                    <span v-if="item.single_max_buy != ''">限购{{item.single_max_buy}}件</span>
                                </div>
                            </div>
                            <div class="money">¥{{$utils.floatMul( item.price,item.total) }}</div>
                            <div @click="deleteGoods(item)" class="operate"><span
                                class="iconfont icon-lajitong"></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="item" v-for="(item,i) in loseList" :key="i">
                            <div class="allSelect">
                                <div class="checkbox-wrapper">
                                    失效商品
                                </div>
                            </div>
                            <div class="info">
                                <div class="pictrue"><img
                                    :src="$utils.mediaUrl(item.thumb)">
                                </div>
                                <div class="text">
                                    <div class="name line2">{{ item.title }}</div>
                                    <div class="infor">{{ item.option_title || '' }}</div>
                                </div>
                            </div>
                            <div class="price">
                                <!-- 商品失效 -->
                                <template v-if="item.is_lose_efficacy=='1'">商品已下架</template>
                                <!-- 商品权限已变更 -->
                                <template class="choose-text" v-else-if="item.buy_perm =='0'">商品权限已变更</template>
                                <!-- 重选规格 -->
                                <template class="choose-text" v-else-if="item.is_reelect =='1'">重新选择商品规格</template>
                                <template class="choose-text" v-else-if="item.stock =='0'">商品已售罄</template>
                                <template v-else> ¥{{ item.price }}</template>
                            </div>
                            <div class="num"></div>
                            <div class="money"></div>
                            <div @click="deleteGoods(item)" class="operate"><span
                                class="iconfont icon-lajitong"></span>
                            </div>
                        </div>
                    </div>

                </div>
                <div v-else style="height: 500px;position: relative">
                    <EmptyPage msg="购物车竟然是空的"></EmptyPage>
                </div>
            </div>
            <div class="footer flex">
                <div class="num">已选 {{ footerObj.selected_num || '0' }} 件商品</div>
                <div class="flex">
                    <div class="total">合计：<span class="font-color">¥{{ footerObj.total_price || '0' }}</span></div>
                    <div v-if="footerObj.total_price > 0" @click="toConfirm" class="bnt ">去结算</div>
                    <div v-else class="bnt bnt--gray">去结算</div>
                </div>
            </div>
        </Container>
    </div>
</template>

<script>
import goodsApi from '@/api/goods'

export default {
    name: "shoppingCart",
    data() {
        return {
            cartList: [],
            loseList: [],//失效商品
            footerObj: {}
        }
    },
    created() {
        this.getcartList()
    },
    methods: {
        changeCartNumber(item) {
            goodsApi.changeTotal({
                goods_id: item.goods_id,
                option_id: item.option_id || '0',//规格id
                total: item.total ? item.total : 1,
                mode: 2,//1是加 0是减 2固定数量
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.getcartList()
                    this.$store.dispatch('common/getCartCount')
                }
            })
        },
        deleteGoods(item) {
            goodsApi.cartDelete({
                clear_all: 0,
                favorite: 0,
                id: item.id
            }, {
                hideSuccessTip: true,
                success: () => {
                    this.$store.dispatch('common/getCartCount')
                    this.getcartList()
                }
            })
        },
        selectedGoods(item) {
            goodsApi.cartSelect({
                select_all: 0,
                id: item.id
            }, {
                hideSuccessTip: true,
                success: () => {
                    this.getcartList()
                }
            })
        },
        toConfirm() {
            /**
             * 判断是否有选中商品
             * 是否全选
             * 是否有商品库存不足
             * 限购*/
            let result = false;
            let arr = []
            let actives = []; // 购物车选中商品活动列表
            this.cartList.forEach(item => {
                item.goods.forEach(goods => {
                    if (goods.is_selected) {
                        result = true;
                        arr.push(goods.goods_id);

                        // 获取购物车选中商品活动类型
                        if (goods.activity_type?.length) {
                            actives = [...new Set(actives.concat(goods.activity_type))]
                        }
                    }
                })
            })
            // 存在多个活动类型商品时，不能同时下单
            if (actives.length > 1) {
                return this.$Message.error('不同的活动类型 暂不支持同时下单')
            }

            if (result || this.footerObj.all_selected) {
                goodsApi.checkSelect({
                    goods_id: arr,
                    type: 'express',//写死 只用普通快递
                    is_pop: 1
                }, {
                    hideSuccessTip: true,
                    success: (res) => {
                        if (res.error != 0) return
                        if (res.is_success == 1) {
                            let query = {
                                is_cart: 1
                            }
                            this.$router.push({path: '/order/confirm', query})
                        }
                    }
                })
                // this.$emit('create', arr)
            }

        },
        getcartList() {
            goodsApi.cartList({
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error === 0) {
                        this.cartList = this.handleList(res, res.list);
                        this.loseList = res.lose_list || []
                        this.footerObj = {
                            selected_num: res.selected_num, //选中商品数量
                            selected_goods: res.selected_goods, //选中商品
                            all_selected: res.all_selected, //是否全选
                            total_price: res.total_price, //总价
                        };
                    }
                }
            })
        },
        handleList(data, list) {
            // 单店铺的商品信息放到了goods里面
            if (list?.length && !list[0].goods) {
                list = [
                    {
                        goods: list
                    }
                ]
            }
            list.forEach(item => {
                item.goods.forEach(goods => {
                    goods.editStatus = false // 控制编辑选中
                    goods.total = Number(goods.total)
                })
            });
            this.processList = [...list]
            return list
        },
        allSelectedRadioChange() {
            goodsApi.cartSelect({
                select_all: 1
            }, {
                hideSuccessTip: true,
                success: () => {
                    this.getcartList()
                }
            })
            // console.log(status)
            // this.cartList.forEach(item => {
            //     item.goods.forEach(cItem => {
            //         cItem.editStatus = status
            //     })
            // })
        },
    }
}
</script>

<style scoped lang="scss">
.cart-box {
    min-height: calc(100vh - 351px);
}

.cart-list {
    .header {
        height: 54px;
        background: #f9f9f9;
        align-items: center;

        > div {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #282828;

        }
    }

    .body {
        background-color: #FFFFFF;
        border: 1px solid #efefef;
        border-top: 0;

        .item {
            border-top: 1px dotted #e2e2e2;
            display: flex;
            align-items: center;
            text-align: center;
            height: 170px;

            &:nth-child(1) {
                border: none;
            }

            > div {
                display: flex;
                align-items: center;
            }
        }

        .text {
            min-height: 60px;
        }

        .allSelect {
            justify-content: center;

        }

        .price {
            width: 215px;
            justify-content: center;
            font-size: 16px;

        }

        .num {
            justify-content: center;
            position: relative;

            .single {
                position: absolute;
                bottom: -60px;
                color: $theme-color;
                height: 50px;
                span{
                    display: block;
                    margin: 0 5px;
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

        .money {
            justify-content: center;
            font-size: 16px;
            color: $theme-color;
        }

        .operate {
            margin-left: 10px;

            span {
                cursor: pointer;
                font-size: 16px;
                color: #d0d0d0

            }
        }
    }

    .allSelect {
        width: 100px;
        position: relative;

        /deep/ .ivu-checkbox-inner {
            &.ivu-checkbox-focus {
                box-shadow: none;
            }

            width: 20px;
            height: 20px;
            border-radius: 50%;
        }

        /deep/ .ivu-checkbox-checked .ivu-checkbox-inner:after {
            left: 6px;
            top: 2px;
            width: 6px;
            height: 10px;
        }

        /deep/ .ivu-checkbox-inner:after {
            left: 6px;
            top: 8px;

        }
    }

    .info {
        width: 400px;
        padding-left: 30px;
        text-align: center;

        .pictrue {
            width: 90px;
            height: 90px;
            margin-right: 14px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .text {
            text-align: left;

            .infor {
                margin-top: 10px;
                font-size: 12px;
                color: #d0d0d0;
            }
        }
    }

    .price {
        width: 215px;

    }

    .num {
        width: 150px;
    }

    .money {
        width: 270px;
    }
}

.footer {
    align-items: center;
    justify-content: space-between;
    height: 82px;
    background: #f9f9f9;
    margin-top: 60px;
    padding-left: 30px;
    margin-bottom: 30px;

    .flex {
        align-items: center;

        .total {
            font-size: 16px;

            span {
                color: $theme-color;
                font-size: 22px;
                font-weight: bold;
            }
        }

        .bnt {
            width: 160px;
            height: 82px;
            text-align: center;
            line-height: 82px;
            font-size: 18px;
            color: #fff;
            margin-left: 30px;
            background-color: $theme-BgColor;
            font-weight: bold;
        }

        .bnt--gray {
            background-color: #cccccc;
        }
    }
}

</style>