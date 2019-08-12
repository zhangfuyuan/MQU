<template>
	<div class="multimedia">
		<div class="multi-top">
			<div class="top">
				<!-- 顶部标题 -->
				<div class="title">{{$t('multimedia.title')}}</div>
				
				<!-- 添加提示 -->
				<div class="add-tips">{{$t('multimedia.addContentTips')}}</div>
			</div>
			
			<van-row class="options">
				<!-- 添加图片/视频 -->
				<van-col class="option-box" span="8" @click.native="addImgOrVideo">
					<van-uploader 
						name="imgOrVideoUploader"
						:accept="imgOrVideoAccept"
						:preview-image="false"
						multiple
						:before-read="imgOrVideoBeforeRead"
						:after-read="imgOrVideoAfterRead"
						:max-size="(maxUploadTotal-curUploadTotal)*1024*1024"
						:max-count="(mediaLimitMap['img']+mediaLimitMap['video']-curMediaNumMap['img']-curMediaNumMap['video']) || 18"
						@oversize="imgOrVideoOversize"
					>
						<div class="option-uploader">
							<img class="option-img" src="../../assets/img/todo.png" alt="todo" />
							<span class="option-txt">{{$t('multimedia.imgOrVideo')}}</span>
						</div>
					</van-uploader>
				</van-col>
				
				<!-- 添加跑马灯 -->
				<van-col class="option-box" span="8" @click.native="addRunningLantern">
					<img class="option-img" src="../../assets/img/todo.png" alt="todo" />
					<span class="option-txt">{{$t('multimedia.runningLanternNotice')}}</span>
				</van-col>
				
				<!-- 添加文本 -->
				<van-col class="option-box" span="8" @click.native="addTextMessage">
					<img class="option-img" src="../../assets/img/todo.png" alt="todo" />
					<span class="option-txt">{{$t('multimedia.textMessage')}}</span>
				</van-col>
			</van-row>
		</div>
		
		<!-- 多媒体详情 -->
		<div class="multi-cont">
			<template v-if="curMediaList.length>0 || isReading">
				<!-- 多媒体内容 -->
				<div class="content">
					<!-- 读取图片/视频时 -->
					<template v-if="isReading">
						<img src="../../assets/img/todo.png" alt="todo" width="100%" height="100%" />
						
						<div class="reading-mask"></div>
						
						<div class="reading-progress">
							<van-progress
								class="reading-progress-cont"
								:percentage="readingProgress"
								:show-pivot="false"
								color="#008fff"
							/>
						</div>
					</template>
					
					<template v-else-if="curMediaList.length>0 && curMediaIndex>-1">
						<!-- 图片内容 -->
						<template v-if="curMediaList[curMediaIndex].type==='img'">
							<van-image
								width="100%"
								height="100%"
								fit="contain"
								:src="curMediaList[curMediaIndex].data.content"
							/>
						</template>
						
						<!-- 视频内容 -->
						<template v-else-if="curMediaList[curMediaIndex].type==='video'">
							<img src="../../assets/img/todo.png" alt="todo" width="100%" height="100%" />
						</template>
						
						<!-- 跑马灯内容 -->
						<template v-else-if="curMediaList[curMediaIndex].type === 'run'">
							<van-field
								class="mqu-field"
								v-model="curMediaList[curMediaIndex].data.content"
								type="textarea"
								:placeholder="$t('multimedia.clickInput')"
								readonly
								:style="{ 
									color: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.color : '#333333',
									opacity: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.opacity : '1',
									fontWeight: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.weight : 'normal',
									textShadow: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.shadow : '0 0 0',
								}"
								@click="editRunningLantern"
							/>
						</template>
						
						<!-- 文本内容 -->
						<template v-else-if="curMediaList[curMediaIndex].type === 'txt'">
							<van-field
								class="mqu-field"
								v-model="curMediaList[curMediaIndex].data.content"
								type="textarea"
								:placeholder="$t('multimedia.clickInput')"
								readonly
								:style="{ 
									color: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.color : '#333333',
									fontWeight: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.weight : 'normal',
									textShadow: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.shadow : '0 0 0',
								}"
								@click="editTextMessage"
							/>
						</template>
					</template>
				</div>
				
				<div class="subjoin" v-if="curMediaList.length>0 && curMediaIndex>-1 || isReading">
					<!-- 多媒体左下角信息 -->
					<div class="info">
						<!-- 正在读取 -->
						<template v-if="isReading">
							<span>{{$t('multimedia.waitMoment')}}</span>
						</template>
						
						<!-- 图片/视频信息 -->
						<template v-else-if="curMediaList[curMediaIndex].type==='img' || curMediaList[curMediaIndex].type==='video'">
							<div class="van-ellipsis info-name">{{curMediaList[curMediaIndex].data.file.name}}</div>
							<div>{{curMediaList[curMediaIndex].data.file.size | formatSize}} MB</div>
						</template>
						
						<!-- 跑马灯信息 -->
						<template v-else-if="curMediaList[curMediaIndex].type === 'run'">
							<marquee 
								class="info-run"
								direction="left"
								scrollamount="2"
							>{{$t('multimedia.runningLanternNotice')}}</marquee>
						</template>
						
						<!-- 文本信息 -->
						<template v-else-if="curMediaList[curMediaIndex].type === 'txt'">
							<div>{{$t('multimedia.textMessage')}}</div>
						</template>
					</div>
					
					<!-- 右下角操作 -->
					<div class="action">
						<!-- 取消读取 -->
						<template v-if="isReading">
							<span class="action-cancel" @click="cancelReading">{{$t('common.cancel')}}</span>
						</template>
						
						<!-- 删除内容 -->
						<template v-else>
							<span class="action-remove" @click="removeMedia">{{$t('common.remove')}}</span>
						</template>
					</div>
				</div>
				
				<!-- 索引栏 -->
				<div class="bar" v-if="curMediaList.length>0 && curMediaIndex>-1">
					<span :class="['bar-left', { 'disable': curMediaIndex===0 }]" @click="--curMediaIndex;">
						<van-icon name="arrow-left" />
					</span>
					
					<span class="bar-cont">{{curMediaIndex+1}}/{{curMediaList.length}}</span>
					
					<span :class="['bar-right', { 'disable': curMediaIndex+1===curMediaList.length }]" @click="++curMediaIndex;">
						<van-icon name="arrow" />
					</span>
				</div>
			</template>
		</div>

		<!-- 底部上传 -->
		<div class="multi-bottom">
			<div class="bottom-box">
				<div class="upload-total">{{curUploadTotal}}/{{maxUploadTotal}} MB</div>
				
				<van-button 
					class="upload-btn" 
					size="large"
					:disabled="!canUpload" 
					@click="startUpload"
				>{{$t('multimedia.upload')}}</van-button>
			</div>
		</div>
		
		<!-- 编辑跑马灯/文本信息 -->
		<van-popup
			class="multi-edit"
			v-model="showTextEditPopup"
			position="right"
			:style="{ height: '100%', width: '100%' }"
			:close-on-click-overlay="false"
		>
			<!-- 顶部取消、完成操作 -->
			<div class="top">
				<div>
					<span class="top-cancel" @click="showTextEditPopup = false;">{{$t('common.cancel')}}</span>
					<span class="top-done" @click="textEditDone">{{$t('common.done')}}</span>
				</div>
			</div>
			
			<!-- 输入文本框 -->
			<div 
				v-if="curMediaList.length>0 && curMediaIndex>-1" 
				:class="['field', { 'is-ios': isIOS }]" >
				<van-field
					ref="editField"
					class="mqu-field mqu-field-fill"
					v-model="tempTextEditData.content"
					type="textarea"
					:placeholder="$t('multimedia.clickInput')"
					:style="{ 
						color: tempTextEditData.content ? tempTextEditData.color : '#333333',
						opacity: curMediaList[curMediaIndex].type==='run'&&tempTextEditData.content ? tempTextEditData.opacity : '1',
						fontWeight: tempTextEditData.content ? tempTextEditData.weight : 'normal',
						textShadow: tempTextEditData.content ? tempTextEditData.shadow : '0 0 0',
					}"
					@focus="isShowTabStyle = false;"
					@blur="onClickTabStyle"
				/>
			</div>
			
			<!-- 切换栏 -->
			<div 
				v-if="curMediaList.length>0 && curMediaIndex>-1" 
				:class="['bar', { 'is-ios': isIOS, 'is-landscape': isLandscape }]" 
			>
				<van-row class="bar-tab" type="flex" justify="center">
					<van-col span="12" :class="['bar-tab-keyboard', { 'active': isShowTabStyle===false }]" @click.native="() => {if(!isClickTabStyle) $refs['editField'].focus();}">
						<img src="../../assets/img/todo.png" alt="todo" />
						<span>{{$t('multimedia.keyboard')}}</span>
					</van-col>
					
					<van-col span="12" :class="['bar-tab-style', { 'active': isShowTabStyle===true }]" @click.native="onClickTabStyle">
						<img src="../../assets/img/todo.png" alt="todo" />
						<span>{{$t('multimedia.style')}}</span>
					</van-col>
				</van-row>
				
				<!-- 样式栏 -->
				<div class="bar-cont" v-show="isShowTabStyle">
						<!-- 颜色 -->
						<div class="style-color">
							<div class="style-label">
								<span 
									class="style-color-txt" 
									:style="{ background: styleColorList[styleColorSlider] }"></span>
							</div>
								
							<van-slider 
								class="style-color-cont"
								v-model="styleColorSlider" 
								:min="0" 
								:max="24" 
								:step="1"
								:bar-height="(25/75) + 'rem'"
								active-color="rgba(0, 0, 0, 0)"
								@change="tempTextEditData.color = styleColorList[styleColorSlider];"
							>
								<div 
									slot="button" 
									class="style-color-button"
									:style="{ background: styleColorList[styleColorSlider] }"
								>
									<span class="title" :style="{ background: styleColorList[styleColorSlider] }"></span>
								</div>
							</van-slider>
						</div>
						
						<!-- 透明度 -->
						<div 
							class="style-opacity" 
							v-show="curMediaList[curMediaIndex].type === 'run'">
							<div class="style-label">
								<span class="style-opacity-txt">{{styleOpacitySlider}}%</span>
							</div>
							
							<van-slider 
								class="style-opacity-cont mqu-slider"
								v-model="styleOpacitySlider" 
								:bar-height="(15/75) + 'rem'"
								active-color="#008fff"
								inactive-color="#eeeff0"
								@change="tempTextEditData.opacity = styleOpacitySlider/100;"
								/>
						</div>
						
						<!-- 粗体 -->
						<div class="style-weight">
							<div class="style-label">
								<span class="style-weight-txt">{{$t('multimedia.bold')}}</span>
							</div>
							
							<van-switch 
								class="style-weight-cont"
								v-model="styleWeightChecked" 
								:size="(40/75) + 'rem'"
								active-color="#008fff"
								inactive-color="#999"
								@change="tempTextEditData.weight = (styleWeightChecked ? 'bold' : 'normal')" />
						</div>
						
						<!-- 阴影 -->
						<div class="style-shadow">
							<div class="style-label">
								<span class="style-shadow-txt">{{$t('multimedia.shadow')}}</span>
							</div>
							
							<van-switch 
								class="style-shadow-cont"
								v-model="styleShadowChecked" 
								:size="(40/75) + 'rem'"
								active-color="#008fff"
								inactive-color="#999"
								@change="tempTextEditData.shadow = (styleShadowChecked ? '0 2px 3px' : '0 0 0')" />
						</div>
				</div>
			</div>
		</van-popup>
		
		<!-- 提交后台 -->
		<van-popup
			class="multi-submit"
			v-model="showUploadingPopup"
			position="right"
			:style="{ height: '100%', width: '100%' }"
			:close-on-click-overlay="false"
		>
			<!-- 上传完成 -->
			<template v-if="submittedNum===curMediaList.length && submitProgress===100">
				<div class="end">
					<div class="end-img">
						<img src="../../assets/img/todo.png" alt="todo" width="100%" height="100%" />
					</div>
					
					<van-button 
						class="end-return" 
						round 
						@click="reset"
					>{{$t('multimedia.returnHome')}}</van-button>
				</div>
			</template>
			
			<!-- 等待中 -->
			<template v-else>
				<div class="submit">
					<div class="submit-tips">
						<div>{{$t('multimedia.beSending')}}</div>
						<div>{{$t('multimedia.pleaseNotClosePage')}}</div>
					</div>
					
					<div class="submit-progress">
						<div class="submit-progress-txt">{{submittedNum}}/{{curMediaList.length}}</div>
						
						<van-progress
							class="submit-progress-cont"
							:percentage="submitProgress"
							:show-pivot="false"
							color="#008fff"
						/>
					</div>
					
					<van-button 
						class="submit-cancel" 
						round 
						@click="undoSend"
					>{{$t('multimedia.undoSend')}}</van-button>
				</div>
			</template>
		</van-popup>
	</div>
</template>

<script>
import { Row, Col, Button, Toast, Uploader, Image, Progress, Icon, Dialog, Field, Popup, Slider, Switch } from 'vant';
import baseURL from '@/api/config';

Toast.setDefaultOptions({
	className: 'mqu-toast',
});
		
export default {
	name: 'multimedia',

	mixins: [],

	components: {
		[Row.name]: Row,
		[Col.name]: Col,
		[Button.name]: Button,
		[Uploader.name]: Uploader,
		[Image.name]: Image,
		[Progress.name]: Progress,
		[Icon.name]: Icon,
		[Field.name]: Field,
		[Popup.name]: Popup,
		[Slider.name]: Slider,
		[Switch.name]: Switch,
	},

	props: {},

	data() {
		return {
			baseURL, // 根据环境设置的全局请求路径
			curUploadTotal: 0, // 当前已上传容量（动态）
			maxUploadTotal: 128, // 最大可上传容量
			curMediaIndex: -1, // 当前显示哪个多媒体素材（动态）
			curMediaList: [], // 当前各种多媒体素材已添加集合（动态）
			mediaLimitMap: {
				img: 9,
				video: 9,
				run: 1,
				txt: 1,
			}, // 各种多媒体素材最多上传数量限制图
			isReading: false, // 当前是否正在读取图片/视频数据（动态）
			readingProgress: 0, // 正在读取图片/视频数据显示进度（动态）
			imgOrVideoAccept: "image/*, video/*, audio/*", // 图片/视频文件支持的格式
			imgAcceptReg: /image\/*/i, // 图片文件支持的格式正则表达式
			videoAcceptReg: /(video\/*)|(audio\/*)/i, // 视频文件支持的格式正则表达式
			imgOrVideoAcceptReg: /(image\/*)|(video\/*)|(audio\/*)/i, // 图片/视频文件支持的格式正则表达式
			curReadingImgOrVideoNum: 0, // 当次读取的图片/视频文件的总数量，用于取消操作（动态）
			tempBeforeReadImgOrVideoTotal: 0, // 在当次读取的图片/视频文件前的已用容量，用于取消操作（动态）
			showTextEditPopup: false, // 是否显示跑马灯/文本信息编辑界面（动态）
			showUploadingPopup: false, // 是否显示上传等待界面（动态）
			tempTextEditData: {
				content: '',
				color: '#333333',
				opacity: '1', // 文本信息没有此属性
				weight: 'normal', // ON 为 bold
				shadow: '0 0 0', // ON 为 0 2px 3px
			}, // 缓存编辑跑马灯/文本的信息，未点击“完成”不进行更新（动态）
			isIOS: /(\(i[^;]+;( U;)? CPU.+Mac OS X)|(iPhone)|(iPad)/i.test(navigator.userAgent), // 判断是否iOS系统
			isLandscape: parseInt(document.body.clientWidth) > parseInt(document.body.clientHeight), // 是否横屏
			isShowTabStyle: false, // 编辑文本界面是否激活 “样式” Tab（动态）
			isClickTabStyle: false, // 是否点击了 “样式” Tab（动态）
			styleColorList: ['#ffffff','#9a9791','#6a6663','#34302f','#333333','#2d2824','#191814','#a86e35','#7e0e14','#c20e17','#e51b27','#e4451f','#ea7527','#f1c03c','#b4da4b','#7eb63e','#33862e','#88d9f3','#0994f5','#1064d4','#1b1c6f','#381a6c','#76128d','#e43b86','#f1cdd5'],
			styleColorSlider: 4, // 颜色条索引（动态）
			styleOpacitySlider: 100, // 透明度（动态）
			styleWeightChecked: false, // 是否加粗（动态）
			styleShadowChecked: false, // 是否阴影（动态）
			submitProgress: 0, // 当前提交后台的上传进度（动态）
			submittedNum: 0, // 当前已提交后台的内容数量（动态）
		}
	},

	computed: {
		// 当前是否可点击底部的 “上传” 按钮
		canUpload() {
			return this.curMediaList.length>0 && !this.isReading;
		},
		
		// 当前各种多媒体素材已添加数量图
		curMediaNumMap() {
			let _map = {
				img: 0,
				video: 0,
				run: 0,
				txt: 0,
			};
			
			this.curMediaList.map((item) => item.type && ++_map[item.type] || 0);
			
			window.console.log('更新已添加多媒体：', _map);
			return _map;
		}
	},

	filters: {
		// 格式化文件大小，不足1MB算1MB，向上取整
		formatSize(size) {
			return size<1024*1024 ? 1 : Math.ceil(size/(1024*1024));
		}
	},

	watch: {},

	created() {
		document.title = this.$t(document.title);
	},

	mounted() {},

	destroyed() {},

	methods: {
		// 重置 data 变量
		reset() {
			this.curUploadTotal = 0;
			this.curMediaIndex = -1;
			this.curMediaList = [];
			this.isReading = false;
			this.readingProgress = 0;
			this.curReadingImgOrVideoNum = 0;
			this.tempBeforeReadImgOrVideoTotal = 0;
			this.showTextEditPopup = false;
			this.showUploadingPopup = false;
			this.tempTextEditData =  {
				content: '',
				color: '#333333',
				opacity: '1',
				weight: 'normal',
				shadow: '0 0 0',
			};
			this.isShowTabStyle = false;
			this.isClickTabStyle = false;
			this.styleColorSlider = 4;
			this.styleOpacitySlider = 100;
			this.styleWeightChecked = false;
			this.styleShadowChecked = false;
			this.submitProgress = 0;
			this.submittedNum = 0;
		},
		
		// 添加 “图片/视频”
		addImgOrVideo($event) {
			if (this.curUploadTotal >= this.maxUploadTotal) { 
				// 文件大小超过上限
				Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
				$event.preventDefault();
				$event.stopPropagation();
				return false;
			} else if (this.curMediaNumMap['img']+this.curMediaNumMap['video'] >= this.mediaLimitMap['img']+this.mediaLimitMap['video']) { 
				// 图片/视频超上限
				Toast(this.$t('multimedia.addImgOrVideoLimitTips', { num: this.mediaLimitMap['img'] }));
				$event.preventDefault();
				$event.stopPropagation();
				return false;
			} else if (this.curMediaNumMap['img'] >= this.mediaLimitMap['img']) { 
				// 图片超上限
				Toast(this.$t('multimedia.addImgLimitTips', { num: this.mediaLimitMap['img'] }));
			} else if (this.curMediaNumMap['video'] >= this.mediaLimitMap['video']) { 
				// 视频超上限
				Toast(this.$t('multimedia.addVideoLimitTips', { num: this.mediaLimitMap['video'] }));
			}
		},
		
		// 添加 “图片/视频” - 文件读取前的回调函数，返回false可终止文件读取，支持返回Promise
		imgOrVideoBeforeRead(file, detail) {
			window.console.log('文件读取前数据：', file, detail);
			
			return new Promise((resolve, reject) => {
				if (Array.isArray(file) && file.length>0) { 
					// 多选文件
					const totalNum = file.length;
					const validNum = file.filter(item => this.imgOrVideoAcceptReg.test(item.type)).length;
					
					window.console.log('文件读取前过滤前后：', totalNum, validNum);
					if (validNum === totalNum) { 
						// 均为合法格式文件
						this.showAddImgOrVideoProgress();
						resolve();
					} else if (validNum === 0) { 
						// 均为非法格式文件
						Toast(this.$t('multimedia.addImgOrVideoFormatTips'));
						reject();
					} else { 
						// 含非法格式文件
						this.showAddImgOrVideoProgress();
						Toast(this.$t('multimedia.addImgOrVideoFormatTips'));
						resolve();
					}
				} else { 
					// 单选文件
					if (this.imgOrVideoAcceptReg.test(file.type)) {
						this.showAddImgOrVideoProgress();
						resolve();
					} else {
						Toast(this.$t('multimedia.addImgOrVideoFormatTips'));
						reject();
					}
				}
      });
		},
		
		// 添加 “图片/视频” - 文件读取完成后的回调函数
		imgOrVideoAfterRead(file, detail) {
			window.console.log('文件读取完成数据：', file, detail);
			
			let _curMediaNumMap = {
				img: this.curMediaNumMap['img'],
				video: this.curMediaNumMap['video'],
			};
			
			// 重置当次读取数量、缓存旧容量
			this.curReadingImgOrVideoNum = 0;
			this.tempBeforeReadImgOrVideoTotal = this.curUploadTotal;
			
			if (Array.isArray(file) && file.length>0) { 
				// 多选文件
				file.map(item => {
					let _type = this.imgAcceptReg.test(item.file.type) ? 'img' : 'video';
					
					if (this.curUploadTotal*1024*1024+item.file.size >= this.maxUploadTotal*1024*1024) { 
						// 添加此文件导致超出大小上限
						Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
					} else if (_curMediaNumMap[_type] >= this.mediaLimitMap[_type]) { 
						// 添加此文件导致超出数量上限
						Toast(this.$t(_type==='img'?'multimedia.addImgLimitTips':'multimedia.addVideoLimitTips', { num: this.mediaLimitMap[_type] }));
					} else if (this.isReading) {
						// 没有取消操作才继续读取
						this.curMediaIndex = [this.curMediaList.length-1];
						this.curMediaList.push({
							type: _type,
							data: item,
						});
						_curMediaNumMap[_type]++;
						this.curMediaIndex++;
						this.curUploadTotal += (item.file.size<1024*1024 ? 1 : Math.ceil(item.file.size/(1024*1024)));
						this.curReadingImgOrVideoNum++;
					}
				});
			} else {
				let _type = this.imgAcceptReg.test(file.file.type) ? 'img' : 'video';
				
				if (this.curUploadTotal*1024*1024+file.file.size >= this.maxUploadTotal*1024*1024) { 
					// 添加此文件导致超出大小上限
					Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
				} else if (_curMediaNumMap[_type] >= this.mediaLimitMap[_type]) { 
					// 添加此文件导致超出数量上限
					Toast(this.$t(_type==='img'?'multimedia.addImgLimitTips':'multimedia.addVideoLimitTips', { num: this.mediaLimitMap[_type] }));
				} else if (this.isReading) {
					// 没有取消操作才继续读取
					this.curMediaIndex = [this.curMediaList.length-1];
					this.curMediaList.push({
						type: _type,
						data: file,
					});
					this.curMediaIndex++;
					this.curUploadTotal += (file.file.size<1024*1024 ? 1 : Math.ceil(file.file.size/(1024*1024)));
					this.curReadingImgOrVideoNum++;
				}
			}
			
			this.readingProgress = 95;
			window.setTimeout(() => {
				Dialog.close();
				this.readingProgress = 100;
				this.isReading = false;
			}, 888);
		},
		
		// 添加 “图片/视频” - 文件大小超过限制时触发
		imgOrVideoOversize() {
			Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
			this.isReading = false;
			this.readingProgress = 0;
		},
		
		// 添加 “图片/视频” - 显示进度
		showAddImgOrVideoProgress() {
			if (this.isReading) { 
				// 正在读取数据时再次添加素材
				this.readingProgress = 0;
				window.setTimeout(() => {
					this.readingProgress = 50;
				}, 333);
			} else {
				this.isReading = true;
				this.readingProgress = 50;
			}
		},
		
		// 取消读取图片/视频
		cancelReading() {
			Dialog.confirm({
				message: this.$t('multimedia.readingCancelUploadTips'),
				className: 'mqu-dialog',
				cancelButtonText: this.$t('multimedia.waitMoment'),
				confirmButtonText: this.$t('multimedia.cancelUpload'),
			}).then(() => { 
				// 右侧按钮（执行）
				if (this.isReading) {
					// 取消读取
					if (this.curReadingImgOrVideoNum > 0) {
						// 有至少一个读取成功
						let _num = this.curReadingImgOrVideoNum;
						let _oldLen = this.curMediaList.length;
						
						this.curUploadTotal = this.tempBeforeReadImgOrVideoTotal;
						this.curMediaIndex = [_oldLen-1];
						this.curMediaIndex -= _num;
						this.curMediaList.splice(_oldLen-_num, _num);
						this.curReadingImgOrVideoNum = 0;
						
						if (this.curMediaIndex===-1 && this.curMediaList.length>0) this.curMediaIndex = 0;
					}
					
					this.isReading = false;
					this.readingProgress = 0;
				}
			}).catch(() => {
				// 左侧按钮（不执行）
			});
		},
		
		// 添加 “跑马灯”
		addRunningLantern() {
			const _index = this.curMediaList.findIndex(item => item.type === 'run');
			
			if (_index > -1) {
				Toast(this.$t('multimedia.addRunLimitTips'));
				return false;
			}
			
			this.curMediaIndex = [this.curMediaList.length-1];
			this.curMediaList.push({
				type: 'run',
				data: {
					content: '',
					color: '#333333',
					opacity: '1',
					weight: 'normal',
					shadow: '0 0 0',
				},
			});
			this.curMediaIndex++;
			this.styleColorSlider = 4;
			this.styleOpacitySlider = 100;
			this.styleWeightChecked = false;
			this.styleShadowChecked = false;
		},
		
		// 编辑 “跑马灯”
		editRunningLantern() {
			this.showTextEditPopup = true;
			this.tempTextEditData.content = this.curMediaList[this.curMediaIndex].data.content;
			this.tempTextEditData.color = this.curMediaList[this.curMediaIndex].data.color;
			this.tempTextEditData.opacity = this.curMediaList[this.curMediaIndex].data.opacity;
			this.tempTextEditData.weight = this.curMediaList[this.curMediaIndex].data.weight;
			this.tempTextEditData.shadow = this.curMediaList[this.curMediaIndex].data.shadow;
			this.styleColorSlider = this.styleColorList.indexOf(this.tempTextEditData.color);
			this.styleOpacitySlider = this.tempTextEditData.opacity * 100;
			this.styleWeightChecked = this.tempTextEditData.weight === 'bold';
			this.styleShadowChecked = this.tempTextEditData.shadow === '0 2px 3px';
			
			this.$nextTick(() => {
				this.$refs['editField'].focus();
			});
		},
		
		// 添加 “文本信息”
		addTextMessage() {
			const _index = this.curMediaList.findIndex(item => item.type === 'txt');
			
			if (_index > -1) {
				Toast(this.$t('multimedia.addTxtLimitTips'));
				return false;
			}
			
			this.curMediaIndex = [this.curMediaList.length-1];
			this.curMediaList.push({
				type: 'txt',
				data: {
					content: '',
					color: '#333333',
					weight: 'normal',
					shadow: '0 0 0',
				},
			});
			this.curMediaIndex++;
			this.styleColorSlider = 4;
			this.styleWeightChecked = false;
			this.styleShadowChecked = false;
		},
		
		// 编辑 “文本信息”
		editTextMessage() {
			this.showTextEditPopup = true;
			this.tempTextEditData.content = this.curMediaList[this.curMediaIndex].data.content;
			this.tempTextEditData.color = this.curMediaList[this.curMediaIndex].data.color;
			this.tempTextEditData.weight = this.curMediaList[this.curMediaIndex].data.weight;
			this.tempTextEditData.shadow = this.curMediaList[this.curMediaIndex].data.shadow;
			this.styleColorSlider = this.styleColorList.indexOf(this.tempTextEditData.color);
			this.styleWeightChecked = this.tempTextEditData.weight === 'bold';
			this.styleShadowChecked = this.tempTextEditData.shadow === '0 2px 3px';
			
			this.$nextTick(() => {
				this.$refs['editField'].focus();
			});
		},
		
		// 完成跑马灯/文本编辑
		textEditDone() {
			this.curMediaList[this.curMediaIndex].data.content = this.tempTextEditData.content;
			this.curMediaList[this.curMediaIndex].data.color = this.tempTextEditData.color;
			if (this.curMediaList[this.curMediaIndex].type === 'run') 
				this.curMediaList[this.curMediaIndex].data.opacity = this.tempTextEditData.opacity;
			this.curMediaList[this.curMediaIndex].data.weight = this.tempTextEditData.weight;
			this.curMediaList[this.curMediaIndex].data.shadow = this.tempTextEditData.shadow;
			this.showTextEditPopup = false;
		},
		
		// 删除多媒体
		removeMedia() {
			Dialog.confirm({
				message: this.$t('multimedia.removeContentTips'),
				className: 'mqu-dialog',
				cancelButtonText: this.$t('common.cancel'),
				confirmButtonText: this.$t('common.remove'),
			}).then(() => { 
				// 右侧按钮（执行）
				if (!this.isReading) {
					// 删除单个文件
					let _type = this.curMediaList[this.curMediaIndex].type;
					let _size = this.curMediaList[this.curMediaIndex].data.file.size;
					let _index = this.curMediaIndex;
					
					this.curMediaIndex--;
					this.curMediaList.splice(_index, 1);
					
					if (_type==='img' || _type==='video') this.curUploadTotal -= (_size<1024*1024 ? 1 : Math.ceil(_size/(1024*1024)));
					if (this.curMediaIndex===-1 && this.curMediaList.length>0) this.curMediaIndex = 0;
				}
			}).catch(() => {
				// 左侧按钮（不执行）
			});
		},
		
		// 点击编辑文本的 “样式” Tab时触发
		onClickTabStyle() {
			this.isClickTabStyle = true;
			setTimeout(() => {
				this.isShowTabStyle = true;
				this.isClickTabStyle = false;
			}, 111);
		},
		
		// 点击底部的 “上传” 触发
		startUpload() {
			const _runIndex = this.curMediaList.findIndex(item => item.type === 'run');
			const _txtIndex = this.curMediaList.findIndex(item => item.type === 'txt');
			
			if (this.curUploadTotal > this.maxUploadTotal) {
				Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
				return false;
			}
			
			if (_runIndex>-1 && this.curMediaList[_runIndex].data.content.length===0) {
				Toast(this.$t('multimedia.pleaseFillRunningLanternNotice'));
				return false;
			}
			
			if (_txtIndex>-1 && this.curMediaList[_txtIndex].data.content.length===0) {
				Toast(this.$t('multimedia.pleaseFillTextMessage'));
				return false;
			}
			
			this.showUploadingPopup = true;
		},
		
		// 取消发送
		undoSend() {
			Dialog.confirm({
				message: this.$t('multimedia.undoSendTips'),
				className: 'mqu-dialog',
				cancelButtonText: this.$t('multimedia.waitMoment'),
				confirmButtonText: this.$t('multimedia.cancelUpload'),
			}).then(() => { 
				// todo 通知后台
				
				this.showUploadingPopup = false;
			}).catch(() => {
				// 左侧按钮（不执行）
			});
		},
	}
};
</script>

<style lang="less" scoped>
@import '../../styles/var';

@active-bgcolor: #e6f4ff;
@edit-field-height: 500px;
@edit-field-height-ios: 425px;

.multimedia {
	width: 100%;
	height: 100%;
	
	/* 顶部 */
	.multi-top {
		.top {
			padding: 0 30px;
		}
		
		/* 标题 */
		.title {
			height: 90px;
			line-height: 90px;
			text-align: center;
			font-size: 36px;
			color: @mqu-text-color333;
			border-bottom: @mqu-hairline;
		}
		
		/* 提示 */
		.add-tips {
			height: 58px;
			line-height: 58px;
			font-size: 24px;
			color: @mqu-text-color999;
		}
		
		
		/* 多媒体 */
		.options {
			border-bottom: 15px solid #f4f4f4;
			background-color: #fff;
		}
		
		.option-box, .option-uploader {
			.mixin-flex-column-center();
			height: 120px;
		}
		
		.option-box {
			position: relative;
			overflow: hidden;
			
			&:active {
				background-color: @active-bgcolor;
			}
		}
		
		.option-uploader {
			width: 250px;
		}
		
		.option-img {
			width: 40px;
			height: 40px;
		}
		
		.option-txt {
			margin-top: 10px;
			font-size: 24px;
			color: @mqu-text-color333;
		}
	}
	
	/* 多媒体内容 */
	.multi-cont {
		padding: 30px 30px 200px;
		
		& > div {
			width: 100%;
		}
		
		/* 内容 */
		.content {
			margin-bottom: 30px;
			height: 388px;
			position: relative;
			border-radius: 10px;
			overflow: hidden;
		}
		
		.mqu-field {
			border-bottom: @mqu-hairline;
			padding: 0 0 20px;
		}
		
		/* 读取图片/视频时的遮罩 */
		.reading-mask, .reading-progress {
			display: flex;
			flex-direction: column;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		
		.reading-mask {
			background-color: #000;
			opacity: .5;
		}
		
		/* 读取图片/视频时的进度 */
		.reading-progress {
			padding: 0 20px;
			box-sizing: border-box;
		}
		
		.reading-progress-cont {
			background: #f1f0f0;
			height: 10px;
			border-radius: 5px;
		}

		.subjoin {
			.mixin-flex-between();
			height: 60px;
			align-items: flex-start;
		}
		
		/* 信息 */
		.info {
			font-size: 24px;
			color: @mqu-text-color333;
		}
		
		.info-name {
			max-width: 600px;
		}
		
		.info-run {
			width: 185px;
			height: 35px;
			line-height: 35px;
			font-size: 24px;
			background-color: rgba(0, 0, 0, .7);
			color: #fff;
		}
		
		/* 删除 */
		.action {
			font-size: 30px;
		}
		
		.action-cancel {
			color: @mqu-theme-color;
		}
		
		.action-remove {
			color: @mqu-danger-color;
		}
		
		/* 索引栏 */
		.bar {
			.mixin-flex-center();
			padding: 80px 0;
			color: @mqu-text-color333;
		}
		
		.bar-left, .bar-right {
			.mixin-flex-center();
			font-size: 50px;
			
			&.disable {
				color: #e0e0e0;
				pointer-events: none;
			}
			
			&:active {
				background-color: @active-bgcolor;
			}
		}
		
		.bar-cont {
			font-size: 36px;
			margin: 0 50px;
		}
	}
	
	/* 底部上传 */
	.multi-bottom {
		padding: 0 30px 30px;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		z-index: 2;
		
		.bottom-box {
			.mixin-flex-column-center();
			border-top: @mqu-hairline;
		}
		
		.upload-total {
			padding: 18px 0;
			font-size: 30px;
			color: @mqu-text-color999;
		}
		
		.upload-btn {
			width: 100%;
			height: 80px;
			line-height: 80px;
			font-size: 30px;
			color: @mqu-text-colorfff;
			background-color: @mqu-theme-color;
			border: 1px solid @mqu-theme-color;
			border-radius: 10px;
		}
	}
	
	/* 编辑文本 */
	.multi-edit {
		box-sizing: border-box;
		
		& > div {
			box-sizing: border-box;
		}
		
		/* 顶部取消、完成操作 */
		.top {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 80px;
			padding: 0 30px;
			
			& > div {
				.mixin-flex-between();
				width: 100%;
				height: 80px;
				line-height: 80px;
				border-bottom: @mqu-hairline;
			}
		}
		
		.top-cancel {
			font-size: 28px;
			color: @mqu-text-color333;
		}
		
		.top-done {
			font-size: 28px;
			color: @mqu-theme-color;
		}
		
		/* 输入文本框 */
		.field {
			padding: 25px 30px;
			position: absolute;
			top: 80px;
			left: 0;
			width: 100%;
			height: @edit-field-height;
			
			&.is-ios {
				height: @edit-field-height-ios;
			}
		}
		
		.mqu-field {
			padding: 0;
		}
		
		/* 样式栏 */
		.bar {
			display: flex;
			flex-direction: column;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: calc(100% - 80px - @edit-field-height);
			font-size: 28px;
			color: @mqu-text-color333;
			
			&.is-ios {
				height: calc(100% - 80px - @edit-field-height-ios);
			}
			
			&.is-landscape {
				height: 500px;
				bottom: -600px;
			}
		}
		
		.bar-tab {
			height: 70px;
			line-height: 70px;
			background-color: #f4f6f7;
		}
		
		.bar-tab-keyboard, .bar-tab-style {
			.mixin-flex-center();
			
			img {
				width: 30px;
				height: 30px;
				margin-right: 10px;
			}
			
			&.active {
				color: @mqu-theme-color;
				border-bottom: 4px solid @mqu-theme-color;
			}
		}
		
		.bar-cont {
			.mixin-flex-column-around();
			padding: 40px 30px;
			background-color: #fff;
			flex: 1;
			
			& > div {
				.mixin-flex-between();
				width: 100%;
				box-sizing: border-box;
			}
		}
		
		.style-label {
			width: 80px;
			text-align: right;
		}
		
		.style-color {
			position: relative;
			padding-top: 40px;
		}
		
		.style-color-txt {
			display: inline-block;
			width: 30px;
			height: 30px;
			border: 2px solid rgba(0, 0, 0, .25);
			border-radius: 5px;
		}
		
		.style-color-cont {
			width: 575px;
			border: 2px solid rgba(0, 0, 0, .25);
			border-radius: 13px;
			background: url(../../assets/img/todo.png) 0 0 no-repeat;
			background: linear-gradient(to right, 
				#ffffff 4%, #9a9791 4% 8%, #6a6663 8% 12%, #34302f 12% 16%, #333333 16% 20%, 
				#2d2824 20% 24%, #191814 24% 28%, #a86e35 28% 32%, #7e0e14 32% 36%, #c20e17 36% 40%, 
				#e51b27 40% 44%, #e4451f 44% 48%, #ea7527 48% 52%, #f1c03c 52% 56%, #b4da4b 56% 60%,
				#7eb63e 60% 64%, #33862e 64% 68%, #88d9f3 68% 72%, #0994f5 72% 76%, #1064d4 76% 80%,
				#1b1c6f 80% 84%, #381a6c 84% 88%, #76128d 88% 92%, #e43b86 92% 96%, #f1cdd5 96%);
			box-sizing: border-box;
		}
		
		.style-color-button {
			position: relative;
			width: 30px;
			height: 30px;
			border-radius: 50%;
			border: 3px solid rgba(0, 0, 0, .25);
			
			.title {
				display: inline-block;
				position: absolute;
				left: -3px;
				top: -55px;
				width: 30px;
				height: 30px;
				border-radius: 5px;
				border: 3px solid rgba(0, 0, 0, .25);
				
				&::after {
					display: block;
					content: " ";
					width: 8px;
					height: 8px;
					bottom: -9px;
					left: 10px;
					position: absolute;
					background: inherit;
					transform: rotate(45deg);
					border-right: 3px solid rgba(0, 0, 0, .25);
					border-bottom: 3px solid rgba(0, 0, 0, .25);
				}
			}
		}
		
		.style-opacity-txt, .style-weight-txt, .style-shadow-txt  {
			font-size: 28px;
			color: @mqu-text-color333;
		}
		
		.style-opacity-cont {
			width: 575px;
			border-radius: 8px;
			box-sizing: border-box;
		}
	}
	
	/* 提交后台 */
	.multi-submit {
		
		.submit, .end {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			width: 100%;
			text-align: center;
			
			&, & > div {
				box-sizing: border-box;
			}
		}
		
		/* 上传等待 */
		.submit {
			padding-top: 270px;
		}
		
		.submit-tips {
			margin-bottom: 50px;
			font-size: 30px;
			color: @mqu-text-color333;
		}
		
		.submit-progress {
			margin-bottom: 140px;
		}
		
		.submit-progress-txt {
			margin-bottom: 20px;
			color: @mqu-text-color999;
			font-size: 28px;
		}
		
		.submit-progress-cont {
			background: #f1f0f0;
			width: 650px;
			height: 10px;
			border-radius: 5px;
		}
		
		.submit-cancel, .end-return {
			padding: 20px 30px;
			height: auto;
			font-size: 32px;
			line-height: 32px;
			color: #fff;
			border-radius: 50px;
			background-color: @mqu-theme-color;
			background: @mqu-theme-color;
			border: 2px solid @mqu-theme-color;
			
			&:active {
				background-color: @mqu-active-color;
				background: @mqu-active-color;
			}
		}
		
		/* 上传完成 */
		.end {
			padding-top: 338px;
		}
		
		.end-img {
			width: 145px;
			height: 179px;
			margin-bottom: 62px;
		}
	}
}
</style>
