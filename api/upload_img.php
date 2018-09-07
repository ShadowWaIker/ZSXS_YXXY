<?php
/**
 * 返回参数过于详细，仅供内部使用。
 * 
 * Rebeta 20180830
 * */

//允许跨域请求
//header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$result = NULL;
if (($_FILES["file"]["type"] == "image/png") || ($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg") || ($_FILES["file"]["type"] == "image/pjpeg")){
    if(($_FILES["file"]["size"] < 20*1024*1024)){
        if(($_FILES["file"]["size"] > 1*1024*1024)){
            if ($_FILES["file"]["error"] > 0){
                $status = "Return Code: " . $_FILES["file"]["error"];
            } else {
                $arr=explode('.', $_FILES["file"]["name"]);
                $file_name = date("YmdHis").".".end($arr);
                move_uploaded_file($_FILES["file"]["tmp_name"], "./upload_image/".$file_name);
                reSizeImg("./upload_image/".$file_name, 175, 215, "./upload_image_thumbnail/".$file_name);
                $status = "Success";
                $result = array("Upload"=>$_FILES["file"]["name"],"Type"=>$_FILES["file"]["type"],"Size"=>($_FILES["file"]["size"] / 1024) . " KB","Temp_File"=>$_FILES["file"]["tmp_name"],"File_Name"=>$file_name);
            }
        } else {
            $status = "文件过小！请不要小于1MB！";
        }
        
    } else {
        $status = "文件过大！请不要大于20MB！";
    }
} else {
  $status = var_dump($_FILES).$_FILES["file"]["type"]."文件格式不正确 !";
}

$result = json_encode(array("status"=>$status,"result"=>$result));
die($result);


/**
 * 生成缩略图
 * $imgSrc           图片源路径
 * $resize_width     图片宽度
 * $resize_height    图片高度
 * $dstimg           缩略图路径
 * $isCut            是否剪切图片
 */
function reSizeImg($imgSrc, $resize_width, $resize_height, $dstimg, $isCut = false) {
    //图片的类型
    //20180904修改：增加strtolower转换字符为小写，避免上传文件后缀名大小写问题导致的生成缩略图失败
    $type = strtolower(substr(strrchr($imgSrc, "."), 1));
    //初始化图象
    if ($type == "jpg" || $type == "jpeg") {
        $im = imagecreatefromjpeg($imgSrc);
    }
    if ($type == "gif") {
        $im = imagecreatefromgif($imgSrc);
    }
    if ($type == "png") {
        $im = imagecreatefrompng($imgSrc);
    }

    $width = imagesx($im);
    $height = imagesy($im);

    //生成图象
    //改变后的图象的比例
    $resize_ratio = ($resize_width) / ($resize_height);
    //实际图象的比例
    $ratio = ($width) / ($height);
    if (($isCut) == 1) {
        if ($ratio >= $resize_ratio) {
            //高度优先
            $newimg = imagecreatetruecolor($resize_width, $resize_height);
            imagecopyresampled($newimg, $im, 0, 0, 0, 0, $resize_width, $resize_height, (($height) * $resize_ratio), $height);
            ImageJpeg($newimg, $dstimg);
        }
        if ($ratio < $resize_ratio) {
            //宽度优先
            $newimg = imagecreatetruecolor($resize_width, $resize_height);
            imagecopyresampled($newimg, $im, 0, 0, 0, 0, $resize_width, $resize_height, $width, (($width) / $resize_ratio));
            ImageJpeg($newimg, $dstimg);
        }
    } else {
        if ($ratio >= $resize_ratio) {
            $newimg = imagecreatetruecolor($resize_width, ($resize_width) / $ratio);
            imagecopyresampled($newimg, $im, 0, 0, 0, 0, $resize_width, ($resize_width) / $ratio, $width, $height);
            ImageJpeg($newimg, $dstimg);
        }
        if ($ratio < $resize_ratio) {
            $newimg = imagecreatetruecolor(($resize_height) * $ratio, $resize_height);
            imagecopyresampled($newimg, $im, 0, 0, 0, 0, ($resize_height) * $ratio, $resize_height, $width, $height);
            ImageJpeg($newimg, $dstimg);
        }
    }
    ImageDestroy($im);
}
?>