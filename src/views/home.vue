<template>
	<div class="home">
		<van-row class="home-row" type="flex" justify="center">
			<van-col span="20">
				<van-button class="home-btn" round type="primary" size="large" to="/multimedia">{{$t('multimedia.title')}}</van-button>
			</van-col>
		</van-row>
		
		<van-row type="flex" justify="center">
			<van-col span="20">
				<van-button class="home-btn" round type="info" size="large" to="/quickUpload">{{$t('quickUpload.title')}}</van-button>
			</van-col>
		</van-row>
	</div>
</template>

<script>
import { Row, Col, Button } from 'vant';

export default {
	name: 'home',

	mixins: [],

	components: {
		[Row.name]: Row,
		[Col.name]: Col,
		[Button.name]: Button,
	},

	props: {},

	data() {
		return {
			
		}
	},

	computed: {},

	watch: {},

	created() {},

	mounted() {},

	destroyed() {},

	methods: {}
};
</script>

<style lang="less">
.home {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	
	.home-row:not(:last-child) {
		margin-bottom: 50px;
	}
	
	.home-btn {
		min-height: 75px;
		font-size: 32px;
	}
}
</style>
