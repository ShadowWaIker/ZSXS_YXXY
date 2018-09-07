<?php
/** Powerd by RebetaStudio
 *
 *  http://www.rebeta.cn
 *
 * 20180829
 *
 */

session_start();
require_once './public.php';
$pdo = new DataBase;
$db = $pdo->mysqlconn();
$tips = "";
$html = NULL;

if(empty($_SESSION['user'])){
    //未登录
    if($_POST["flag"] == "login"){
        $username = dowith_sql($_POST["username"]);
        $sql = "SELECT * FROM admin WHERE yhm = '".$username."'";
        $rs = $db->query($sql);
        $info = $rs->fetch(PDO::FETCH_ASSOC);
        if($_POST["password"] === $info["mm"]){
            $tips = "Success";
            $_SESSION['user'] = $info["yhm"];
            $res = $info["xi"];
            //sleep(5); //延迟5秒，模拟网络延时
        } else {
            $tips = "用户名或密码不正确！";
        }
    } elseif($_POST["flag"] == "load_list"){
        if($_POST["type"] == "优秀校友代表"){
            $Excellent = "True";
        } else {
            $Excellent = "False";
        }
        $sql = "SELECT ID, Department, Name, Photo FROM by_yxxy WHERE `Disable` = 'False' AND Excellent = '".$Excellent."' ORDER BY Department ASC";
        $rs = $db->query($sql);
        $res = $rs->fetchall(PDO::FETCH_ASSOC);
        $tips = "Success";
    } elseif ($_POST["flag"] == "load_info"){
        $id = dowith_sql($_POST["id"]);       
        $sql = "SELECT Name, Photo, Sex, Nation, Birthday, Hometown, Graduation_Day, Major, Education, Job, Abstract, Photo FROM by_yxxy WHERE ID = '".$id."'";
        $rs = $db->query($sql);
        $res = $rs->fetch(PDO::FETCH_ASSOC);
        $tips = "Success";
    } elseif ($_POST["flag"] == "modify_info"){
        $tips = "Not_Logged_In";
    } else {
        $tips = "参数有误或登录超时！";
    }
} else {
    //已登录
    if($_POST["flag"] == "logout"){
        //1、清空session信息
        $_SESSION = array();
        //2、清楚客户端sessionid
        if(isset($_COOKIE[session_name()])){
            setCookie(session_name(),'',time()-3600,'/');
        }
        //3、彻底销毁session
        session_destroy();
        $tips = "Success";
    } elseif($_POST["flag"] == "load_list"){
        if($_POST["type"] == "优秀校友代表"){
            $Excellent = "True";
        } else {
            $Excellent = "False";
        }
        $username = dowith_sql($_SESSION["user"]);
        $sql = "SELECT * FROM admin WHERE yhm = '".$username."'";
        $rs = $db->query($sql);
        $info = $rs->fetch(PDO::FETCH_ASSOC);
        
        $sql = "SELECT ID, Name, Photo FROM by_yxxy WHERE `Disable` = 'False' AND Excellent = '".$Excellent."' AND Department = '".$info["xi"]."'";
        $rs = $db->query($sql);
        $result = $rs->fetchall(PDO::FETCH_ASSOC);
        
        $res = array("yhm"=>$info["xi"],"result"=>$result);
        $tips = "Success_With_Logged";
    } elseif($_POST["flag"] == "modify_info_get_form"){
        $username = dowith_sql($_SESSION["user"]);
        $sql = "SELECT * FROM admin WHERE yhm = '".$username."'";
        $rs = $db->query($sql);
        $info = $rs->fetch(PDO::FETCH_ASSOC);
        $id = dowith_sql($_POST["id"]);
        $sql = "SELECT * FROM by_yxxy WHERE ID = '".$id."'";
        $rs = $db->query($sql);
        $res = $rs->fetch(PDO::FETCH_ASSOC);
        if($res["Department"] == $info["xi"]){
            unset($res["Disable"]);
            unset($res["Department"]);
            $tips = "Success";
        } else {
            unset($res);
            $tips = "无修改权限！";
        }
    } elseif($_POST["flag"] == "modify_info"){
        if(isset($_SESSION["user"])){
            $username = dowith_sql($_SESSION["user"]);
            $sql = "SELECT * FROM admin WHERE yhm = '".$username."'";
            $rs = $db->query($sql);
            $info = $rs->fetch(PDO::FETCH_ASSOC);
            
            if(empty($_POST["result"]["id"])){
                $modify_sql = "INSERT INTO `by_yxxy`(Department , `Name` , Sex , Nation , Birthday , Hometown , Graduation_Day , Major , Education , Phone , Job , Industry_Category , Abstract , Photo  , Excellent) VALUES ('".$info["xi"]."', '".dowith_sql($_POST["result"]["name"])."', '".dowith_sql($_POST["result"]["sex"])."', '".dowith_sql($_POST["result"]["mz"])."', '".dowith_sql($_POST["result"]["csrq"])."', '".dowith_sql($_POST["result"]["jg"])."', '".dowith_sql($_POST["result"]["bysj"])."', '".dowith_sql($_POST["result"]["zy"])."', '".dowith_sql($_POST["result"]["xl"])."', '".dowith_sql($_POST["result"]["lxfs"])."', '".dowith_sql($_POST["result"]["gzqk"])."', '".dowith_sql($_POST["result"]["hylb"])."', '".dowith_sql($_POST["result"]["grjj"])."', '".dowith_sql($_POST["result"]["zp"])."', '".dowith_sql($_POST["result"]["Excellent"])."');";
            } else {
                $sql = "SELECT * FROM by_yxxy WHERE ID = '".dowith_sql($_POST["result"]["id"])."'";
                $rs = $db->query($sql);
                $res = $rs->fetch(PDO::FETCH_ASSOC);
                if($res["Department"] == $info["xi"]){
                    $modify_sql = "UPDATE by_yxxy SET `Name` = '".dowith_sql($_POST["result"]["name"])."', Sex = '".dowith_sql($_POST["result"]["sex"])."', Nation = '".dowith_sql($_POST["result"]["mz"])."', Birthday = '".dowith_sql($_POST["result"]["csrq"])."', Hometown = '".dowith_sql($_POST["result"]["jg"])."', Graduation_Day = '".dowith_sql($_POST["result"]["bysj"])."', Major = '".dowith_sql($_POST["result"]["zy"])."', Education = '".dowith_sql($_POST["result"]["xl"])."', Phone = '".dowith_sql($_POST["result"]["lxfs"])."', Job = '".dowith_sql($_POST["result"]["gzqk"])."', Industry_Category = '".dowith_sql($_POST["result"]["hylb"])."', Abstract = '".dowith_sql($_POST["result"]["grjj"])."', Photo = '".dowith_sql($_POST["result"]["zp"])."' WHERE ID = '".dowith_sql($_POST["result"]["id"])."'";
                }
            }
            if(isset($modify_sql)){
                $success = $db->exec($modify_sql);
                $res = NULL;
                if($success){
                    $tips = "Success";
                } else {
                    $tips = "提交失败！";
                }
            } else {
                $tips = "无编辑权限！";
            }
        } else {
            $tips = "登陆失效！";
        }
    } elseif($_POST["flag"] == "modify_info_delete"){
        if(isset($_SESSION["user"])){
            $username = dowith_sql($_SESSION["user"]);
            $sql = "SELECT * FROM admin WHERE yhm = '".$username."'";
            $rs = $db->query($sql);
            $info = $rs->fetch(PDO::FETCH_ASSOC);
            $sql = "SELECT * FROM by_yxxy WHERE ID = '".dowith_sql($_POST["result"]["id"])."'";
            $rs = $db->query($sql);
            $res = $rs->fetch(PDO::FETCH_ASSOC);
            if($res["Department"] == $info["xi"]){
                $tips = "Success";
                if(isset($_POST["result"]["id"])){
                    $sql = "UPDATE by_yxxy SET `Disable` = 'True' WHERE ID = '".dowith_sql($_POST["result"]["id"])."'";
                    $success = $db->exec($sql);
                    $res = NULL;
                    if($success){
                        $tips = "Success";
                    } else {
                        $tips = "删除失败！";
                    }
                } else {
                    $tips = "删除失败，参数有误！";
                }
            } else {
                $tips = "无删除权限！";
            }
        } else {
            $tips = "登陆失效！";
        }
    } else {
        $tips = "参数有误！";
    }
}

$result = json_encode(array("tips"=>$tips,"result"=>$res));
die($result);
?>