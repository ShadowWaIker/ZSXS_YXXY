/** 优秀校友 */
/* load层
//eg1
var index = layer.load();
//eg2
var index = layer.load(1); //换了种风格
//eg3
var index = layer.load(2, {time: 10*1000}); //又换了种风格，并且设定最长等待10秒 
//关闭
layer.close(index);     */
layui.use(['element', 'layer', 'form', 'laydate'], function(){
	var $ = layui.jquery, layer = layui.layer, element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块 
	//监听导航点击
	element.on('nav(demo)', function(elem){
		var str = new RegExp("校友");
		if(str.test(elem.text())){
	    	load_list(elem.text());
	    } else if(elem.text() == "登陆"){
	    	layer.open({
						type: 1,
						title: "登陆",
						area: '520px',
						content: ' <div class="xy-login"><div class="xy-title">忻&nbsp;州&nbsp;师&nbsp;范&nbsp;学&nbsp;院<br>优秀校友名录</div>'+
	'<form class="layui-form layui-form-pane" action="">'+
	  '<div class="layui-form-item">'+
		'<label class="layui-form-label">用&nbsp;户&nbsp;名</label>'+
		'<div class="layui-input-block">'+
		  '<input type="text" name="username" lay-verify="required" autocomplete="off" placeholder="请输入用户名" class="layui-input">'+
		'</div>'+
	  '</div>'+
	  '<div class="layui-form-item">'+
		'<label class="layui-form-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</label>'+
		'<div class="layui-input-block">'+
		  '<input type="password" name="password" lay-verify="required|password" autocomplete="off" placeholder="请输入密码" class="layui-input">'+
		'</div>'+
	  '</div>'+
	  '<div class="layui-form-item">'+
		'<button class="layui-btn xy-right" lay-submit="" lay-filter="login"><i class="layui-icon layui-icon-user">&nbsp;</i>登 陆</button>'+
	  '</div>'+
	'</form>'+
 '</div>'+
 '<script>'+
	'layui.use("form", function(){'+
	  'var $ = layui.jquery,form = layui.form;'+
	  'form.on("submit(login)", function(data){ data.field.flag = "login"; layer.load();'+
	  '$.ajax({'+
		    'type: "POST",'+
		    'url: "./api/api.php",'+
		   'data: data.field,'+
		    'dataType: "json",'+
		    'success: function(data){'+
		    	'if(data.tips == "Success"){'+
		    		'$(".login").hide();'+
		    		'$(".logout").show();'+
		    		'$("str").html(data.result);'+
		    		'layer.closeAll();'+
		    		'layer.msg("登陆成功！", {icon: 1});'+
		    		'setTimeout(function(){window.location.reload();},2000)'+
				'} else {'+
					'layer.closeAll();'+
					'layer.msg(data.tips, {icon: 0}); '+
		        '}'+
		    '}'+
		'});'+
	  '  return false;'+
	  '});'+
	  'form.verify({'+
	   ' password: [/(.+){6,12}$/, "密码必须6到12位"]'+
	   ' ,content: function(value){'+
	    '  layedit.sync(editIndex);'+
	    '}'+
	  '});'+
	'});'+
'</script>'}); 
	    } else if(elem.text() == "退出") {
	    	$.ajax({
		    type: "POST",
		    url: "./api/api.php",
		    data: {flag:"logout"},
		    dataType: "json",
		    success: function(data){
		    	if(data.tips == "Success"){
		    		layer.msg("退出成功！", {icon: 1});
		    		load_list("优秀校友代表");
		    		$(".login").show();
		    		$(".logout").hide();
		    		$(".yxxy").addClass("layui-this");
				} else {
					layer.msg(data.tips, {icon: 0}); 
		        }
		    }
		});
	    } else {
	    	return ;
	    }
	});
	
	load_list("优秀校友代表");

	function load_list(type) {
		$.ajax({
		    type: "POST",
		    url: "./api/api.php",
		    data: {flag:"load_list", type:type},
		    dataType: "json",
		    success: function(data){
		    	if(data.tips == "Success"){
		    		$(".xy-list").empty();
		    		for (key in data.result){
		    			$(".xy-list").append('<div class="xy-item" id="'+data.result[key].ID+'"><img class="xy-item-img" src="http://file.xzsyzjc.cn/photos/yxxy/thumbnail/'+data.result[key].Photo+'"  alt="图片正在同步，请稍后刷新查看。"/><div>'+data.result[key].Department+"&nbsp;|&nbsp;"+data.result[key].Name+'</div></div>');
					}
					$(".xy-item").click(function(){
						var id=$(this).attr("id");
						load_info(id);	
					});
				} else if(data.tips == "Success_With_Logged"){
		    		$(".xy-list").empty();
		    		$(".xy-list").append('<div class="xy-item add"><div style="height: 37px;"><br></div><i class="layui-icon layui-icon-add-circle-fine" style="font-size: 100px;"></i><div style="font-size: 25px;">添&nbsp;加<br><br></div></div>');
		    		var result = data.result.result;
		    		for (key in result){
		    			$(".xy-list").append('<div class="xy-item modify" id="'+result[key].ID+'"><img class="xy-item-img" src="http://file.xzsyzjc.cn/photos/yxxy/thumbnail/'+result[key].Photo+'"  alt="图片正在同步，请稍后刷新查看。"/><div>'+result[key].Name+'</div></div>');
					}
					$(".login").hide();
		    		$(".logout").show();
		    		$("str").html(data.result.yhm);
					$(".xy-item.add").click(function(){
						modify_info(); 
					});
					$(".xy-item.modify").click(function(){
						var id=$(this).attr("id");
						modify_info(id);
					});
				} else {
					layer.msg(data.tips, {icon: 0}); 
		        }
		    }
		});
	}

	function load_info(id) {
		$.ajax({
		    type: "POST",
		    url: "./api/api.php",
		    data: {flag:"load_info", id:id},
		    dataType: "json",
		    success: function(data){
		    	if(data.tips == "Success"){
		    		layer.open({
						type: 1,
						title: data.result.Name,
						content: '<div class="xy-info">	<img class="xy-info-img" src="http://file.xzsyzjc.cn/photos/yxxy/thumbnail/'+data.result.Photo+'"/>	<div class="xy-info-content">'+data.result.Name+'，'+data.result.Sex+'，'+data.result.Nation+'，'+data.result.Birthday.split('-')[0]+'年'+data.result.Birthday.split('-')[1]+'月出生，籍贯'+data.result.Hometown+'。'+data.result.Graduation_Day+'年毕业于忻州师范学院'+data.result.Major+'专业，现任'+data.result.Job+'。</div>	<div class="xy-info-content">'+data.result.Abstract+'</div> </div>'
					});
				} else {
					layer.msg(data.tips, {icon: 0}); 
		        }
		    }
		});
	}

	function modify_info(id) {
		if(!id){
			var title_str = "添加信息";
			var script_str = 'var id = null; var Excellent = "' + $(".layui-this").find("a").text() + '";'
		} else {
			var title_str = "修改信息";
			var script_str = 'var id = ' + id + '; var Excellent = null;'
		}
		layer.open({
			type: 1,
			area: '710px',
			title: title_str,
			content: '<div class="xy-modify"><div class="layui-upload-drag xy-modify-img"id="image"><i class="layui-icon xy-modify-icon"></i><img class="xy-modify-image"></img><p>点击上传生活照（不小于1MB）</p><p>或将照片拖拽到此处</p></div><form class="layui-form layui-form-pane xy-modify-form"action=""lay-filter="yxxy"><input type="hidden"name="id"><input type="hidden"name="Excellent"lay-verify="Excellent"value="True"><input type="hidden"name="zp"id="zp"lay-verify="zp"><div class="layui-form-item"><div class="layui-inline"><label class="layui-form-label">姓名</label><div class="layui-input-inline"><input type="text"name="name"lay-verify="required"id=""autocomplete="off"class="layui-input"></div></div><div class="layui-inline"><label class="layui-form-label">性别</label><div class="layui-input-inline"><input type="radio"name="sex"value="男"title="男"checked=""><input type="radio"name="sex"value="女"title="女"></div></div></div><div class="layui-form-item"><div class="layui-inline"><label class="layui-form-label">出生日期</label><div class="layui-input-inline"><input type="text"name="csrq"id="csrq"lay-verify="required|date"autocomplete="off"class="layui-input"></div></div><div class="layui-inline"><label class="layui-form-label">籍贯</label><div class="layui-input-inline"><input type="text"name="jg"id=""lay-verify="required"placeholder="某某省某某市"autocomplete="off"class="layui-input"></div></div></div><div class="layui-form-item"><div class="layui-inline"><label class="layui-form-label">民族</label><div class="layui-input-inline"><select name="mz"lay-verify="required"lay-search=""><option value="">直接选择或搜索选择</option><option value="汉族">汉族</option><option value="蒙古族">蒙古族</option><option value="回族">回族</option><option value="藏族">藏族</option><option value="维吾尔族">维吾尔族</option><option value="苗族">苗族</option><option value="彝族">彝族</option><option value="壮族">壮族</option><option value="布依族">布依族</option><option value="朝鲜族">朝鲜族</option><option value="满族">满族</option><option value="侗族">侗族</option><option value="瑶族">瑶族</option><option value="白族">白族</option><option value="土家族">土家族</option><option value="哈尼族">哈尼族</option><option value="哈萨克族">哈萨克族</option><option value="傣族">傣族</option><option value="黎族">黎族</option><option value="傈僳族">傈僳族</option><option value="佤族">佤族</option><option value="畲族">畲族</option><option value="高山族">高山族</option><option value="拉祜族">拉祜族</option><option value="水族">水族</option><option value="东乡族">东乡族</option><option value="纳西族">纳西族</option><option value="景颇族">景颇族</option><option value="柯尔克孜族">柯尔克孜族</option><option value="土族">土族</option><option value="达斡尔族">达斡尔族</option><option value="仫佬族">仫佬族</option><option value="羌族">羌族</option><option value="布朗族">布朗族</option><option value="撒拉族">撒拉族</option><option value="毛南族">毛南族</option><option value="仡佬族">仡佬族</option><option value="锡伯族">锡伯族</option><option value="阿昌族">阿昌族</option><option value="普米族">普米族</option><option value="塔吉克族">塔吉克族</option><option value="怒族">怒族</option><option value="乌孜别克族">乌孜别克族</option><option value="俄罗斯族">俄罗斯族</option><option value="鄂温克族">鄂温克族</option><option value="德昂族">德昂族</option><option value="保安族">保安族</option><option value="裕固族">裕固族</option><option value="京族">京族</option><option value="塔塔尔族">塔塔尔族</option><option value="独龙族">独龙族</option><option value="鄂伦春族">鄂伦春族</option><option value="赫哲族">赫哲族</option><option value="门巴族">门巴族</option><option value="珞巴族">珞巴族</option><option value="基诺族">基诺族</option></select></div></div><div class="layui-inline"><label class="layui-form-label">联系方式</label><div class="layui-input-inline"><input type="text"name="lxfs"id=""lay-verify="required|phone"autocomplete="off"class="layui-input"></div></div></div><div class="layui-form-item"><div class="layui-inline"><label class="layui-form-label">毕业时间</label><div class="layui-input-inline"><input type="text"name="bysj"id="bysj"lay-verify="required|year"autocomplete="off"class="layui-input"></div></div><div class="layui-inline"><label class="layui-form-label">专业</label><div class="layui-input-inline"><input type="text"name="zy"id=""lay-verify="required"autocomplete="off"class="layui-input"></div></div></div><div class="layui-form-item"><div class="layui-inline"><label class="layui-form-label">学历</label><div class="layui-input-inline"><select name="xl"lay-verify="required"><option value=""></option><option value="专科">专科</option><option value="本科">本科</option><option value="硕士">硕士</option><option value="博士">博士</option></select></div></div><div class="layui-inline"><label class="layui-form-label">行业类别</label><div class="layui-input-inline"><select name="hylb"lay-verify="required"><option value=""></option><option value="行政机关">行政机关</option><option value="文教科研">文教科研</option><option value="企业经营">企业经营</option><option value="其他">其他</option></select></div></div></div><div class="layui-form-item"><label class="layui-form-label">工作情况</label><div class="layui-input-block"><input type="text"name="gzqk"autocomplete="off"lay-verify="required"placeholder="工作单位及职务"class="layui-input"></div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">个人简介</label><div class="layui-input-block"><textarea name="grjj"placeholder="只需要介绍突出成绩或科研项目，不需要简历。"lay-verify="required|grjj"class="layui-textarea"></textarea></div></div><div class="layui-form-item"><button class="layui-btn xy-right"lay-submit=""lay-filter="modify"><i class="layui-icon layui-icon-form"></i>提交</button><button class="layui-btn layui-btn-danger xy-right"style="margin-right: 25px;"lay-submit=""lay-filter="delete"><i class="layui-icon layui-icon-delete"></i>删除</button></div></form></div><script>'+script_str+'</script><script src="./js/modify.js"></script>'
		});
	}
});

