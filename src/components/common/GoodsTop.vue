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
	<div class="goods-top clearfix">
		<h3 class="top-title">{{topTitle}}</h3>
		<ul class="top-sub">
			<li v-for="sub in subs"
				:class="{'active': topSubStatus === sub.key}"
				@mouseenter="topSubEnter(sub.key)">{{sub.name}}</li>
		</ul>
	</div>
</template>

<script>
export default {
	data () {
		return {
			topSubStatus: this.subs[0].key
		}
	},
	computed: {
	},
	props: {
		subs: {
			required: true,
			type: Array
		},
		topTitle: {
			required: true,
			type: String
		}
	},
	methods: {
		topSubEnter (key) {
			this.topSubStatus = key
		}
	}
}
</script>

<style>
.goods-top {
	width: 100%;
	height: 58px;
	.top-title {
		float: left;
		margin: 0;
		font-size: 22px;
		font-weight: 200;
		line-height: 58px;
		color: #333;
	}
	.top-sub {
		float: right;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
		font-size: 16px;
		margin-top: 16px;
		color: #424242;
		li {
			width: auto;
			height: 24px;
			line-height: 24px;
			margin-left: 30px;
			cursor: pointer;
			border-bottom: 2px solid #f5f5f5;
			&.active {
				color: #ff6700;
				border-bottom: 2px solid #ff6700;
			}
		}
	}
}
</style>
