/** 优秀校友 - 修改信息 */
var login_iframe = null;

layui.use(['form', 'laydate','upload'], function(){
  var form = layui.form, laydate = layui.laydate, upload = layui.upload;

  //拖拽上传
  var $ = layui.jquery
  var index = null;
  var object = null;
  upload.render({
    elem: '#image'
    ,accept: 'image'
    ,acceptMime: 'image/*'
    ,url: './api/upload_img.php'
    ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
    	object = obj;
    	index = layer.load(); //上传loading
  	}
    ,done: function(res){
      console.log(res)
      layer.close(index);
      if(res.status == "Success"){
      	$(".xy-modify-icon").remove();
     	layer.msg('上传成功！', {icon: 1}); 
      	$("p").remove();
      	$("#zp").val(res.result.File_Name);
      	object.preview(function(index, file, result){
        	$('.xy-modify-image').attr('src', result); //图片链接（base64）
        	$(".xy-modify-image").show();
     	 });
      } else {
      	layer.msg(res.status, {icon: 0}); 
      }
    }
  });

  //日期
  laydate.render({
  	type: 'month',
    elem: '#csrq'
  });
  laydate.render({
  	type: 'year',
    elem: '#bysj'
  });
 
  //自定义验证规则
  form.verify({
    grjj: function(value){
      if(value.length < 20){
        return '最少填写20字！';
      }
      if(value.length > 500){
        return '最多填写500字！';
      }
    },
    zp: function(value){
      if(value.length < 10){
        return '请上传照片！';
      }
    },
    Excellent: function(value){
      if(value.length < 2){
        return '页面参数有误，请重新打开！';
      }
    },
  });
  
  //监听提交
  form.on('submit(modify)', function(data){
    /*layer.alert(JSON.stringify(data.field), {
      title: '最终的提交信息'
    })*/
	//提交表单
	$.ajax({
	    type: "POST",
	    url: "./api/api.php",
	    data: {flag:"modify_info", result:data.field},
	    dataType: "json",
	    success: function(data){
	    	if(data.tips == "Success"){
	    		layer.closeAll();
	    		layer.msg('提交成功！', {icon: 1});
	    		setTimeout(function(){window.location.reload();},1500);
			} else if(data.tips == "Not_Logged_In"){
				login_iframe = layer.open({
	              type: 1,
	              closeBtn: 0,
	              shade: [1, '#393D49'],
	              title: "登陆",
	              area: '520px',
	              content: '<link rel="stylesheet" href="./css/login.css">  <div class="xy-login"><div class="xy-title">忻&nbsp;州&nbsp;师&nbsp;范&nbsp;学&nbsp;院<br>优秀校友名录</div><form class="layui-form layui-form-pane" action=""> <div class="layui-form-item"> <label class="layui-form-label">用户名</label> <div class="layui-input-block"> <input type="text" name="username" lay-verify="required" autocomplete="off" placeholder="请输入用户名" class="layui-input"> </div> </div> <div class="layui-form-item"> <label class="layui-form-label">密码</label> <div class="layui-input-block"> <input type="password" name="password" lay-verify="required" autocomplete="off" placeholder="请输入密码" class="layui-input"> </div> </div> <div class="layui-form-item"> <button class="layui-btn xy-right" lay-submit="" lay-filter="login"><i class="layui-icon layui-icon-user">&nbsp;</i>登 陆</button> </div> </form> </div> <script> layui.use("form", function(){ var $ = layui.jquery,form = layui.form; form.on("submit(login)", function(data){ data.field.flag = "login";  $.ajax({ type: "POST", url: "./api/api.php", data: data.field, dataType: "json", success: function(data){ if(data.tips == "Success"){ $(".login").hide(); $(".logout").show(); $("str").html(data.result); layer.close(login_iframe); layer.msg("重新登陆成功！", {icon: 1}); } else { layer.msg(data.tips, {icon: 0});  } } });   return false; }); }); </script>'
	            });
            	layer.msg("登陆超时！请不要刷新页面，重新登陆后可继续填写！", {icon: 0});
        	} else {
				layer.msg(data.tips, {icon: 0}); 
	        }
	    }
	});
    return false;
  });

  //监听删除
  form.on('submit(delete)', function(data){
    layer.confirm('确定删除？',{icon: 3, title:'提示'}, function(index, layero){
    	//提交删除
		$.ajax({
		    type: "POST",
		    url: "./api/api.php",
		    data: {flag:"modify_info_delete", result:data.field},
		    dataType: "json",
		    success: function(data){
		    	if(data.tips == "Success"){
		    		layer.closeAll();
		    		layer.msg('删除成功！', {icon: 1});
		    		setTimeout(function(){window.location.reload();},1500);
				} else {
					layer.msg(data.tips, {icon: 0}); 
		        }
		    }
		});
  	});
    return false;
  });



	if(!id){
		if(Excellent == "优秀校友") {
			form.val('yxxy', {
		    	"Excellent": "False"
		    });
		} else {
			form.val('yxxy', {
		    	"Excellent": "True"
		    });
		}
		$(".layui-btn-danger").hide();
	} else {
		//取回表单
  		$.ajax({
		    type: "POST",
		    url: "./api/api.php",
		    data: {flag:"modify_info_get_form", id:id},
		    dataType: "json",
		    success: function(data){
		    	if(data.tips == "Success"){
		    		$(".xy-modify-icon").remove();
		    		$("p").remove();
		    		$("#zp").val(data.result.Photo);
		    		$('.xy-modify-image').attr('src', 'http://file.xzsyzjc.cn/photos/yxxy/thumbnail/'+data.result.Photo); //图片链接（base64）
		    		$(".xy-modify-image").show();
		    		layer.msg('修改：' + data.result.Name);
		    		//表单初始赋值
		    		form.val('yxxy', {
		    			"id": data.result.ID
		    			,"Excellent": data.result.Excellent
		    		    ,"zp": data.result.Photo
		    		    ,"name": data.result.Name
		    		    ,"sex": data.result.Sex
		    		    ,"csrq": data.result.Birthday
		    		    ,"jg": data.result.Hometown
		    		    ,"mz": data.result.Nation
		    		    ,"lxfs": data.result.Phone
		    		    ,"bysj": data.result.Graduation_Day
		    		    ,"zy": data.result.Major
		    		    ,"xl": data.result.Education
		    		    ,"hylb": data.result.Industry_Category
		    		    ,"gzqk": data.result.Job
		    		    ,"grjj": data.result.Abstract
		    		});
				} else {
					layer.msg(data.tips, {icon: 0}); 
		        }
		    }
		});
	}
});