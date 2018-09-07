<?php 
/** Powerd by RebetaStudio 
 * 
 *  http://www.rebeta.cn
 * 
 * 201809
 * 
 */

//本地数据库账户及配置
define ("MySqlUSER","用户名");
define ("MySqlPWD","密码");
define ("MySqlDSN","mysql:host=数据库IP;port=数据库端口;dbname=数据库名;charset=utf8");

//关闭错误回显
//error_reporting(0);
error_reporting(E_ALL);
//设置时区为+8
date_default_timezone_set('PRC');
//设置字符为UTF-8
header("Content-type: text/html; charset=utf-8");

//数据库类
class DataBase{
    public function mysqlconn()
    {
        try{
            //实例化mysqlpdo，执行这里时如果出错会被catch
            $mysqlpdo = new PDO(MySqlDSN,MySqlUSER,MySqlPWD);
            return $mysqlpdo;
        }catch (Exception $e){
            $err = $e->getMessage();
            die($err);
        }
    }
}

function dowith_sql($str){
    $str = str_ireplace("and","**疑似SQL注入：A_N_D**",$str);
    $str = str_ireplace("execute","**疑似SQL注入：E_X_E_C_U_T_E**",$str);
    $str = str_ireplace("update","**疑似SQL注入：U_P_D_A_T_E**",$str);
    $str = str_ireplace("count","**疑似SQL注入：C_O_U_N_T**",$str);
    $str = str_ireplace("chr","**疑似SQL注入：C_H_R**",$str);
    $str = str_ireplace("mid","**疑似SQL注入：M_I_D**",$str);
    $str = str_ireplace("master","**疑似SQL注入：M_A_S_T_E_R**",$str);
    $str = str_ireplace("truncate","**疑似SQL注入：T_R_U_N_C_A_T_E**",$str);
    $str = str_ireplace("char","**疑似SQL注入：C_H_A_R**",$str);
    $str = str_ireplace("declare","**疑似SQL注入：D_E_C_L_A_R_E**",$str);
    $str = str_ireplace("select","**疑似SQL注入：S_E_L_E_C_T**",$str);
    $str = str_ireplace("create","**疑似SQL注入：C_R_E_A_T_E**",$str);
    $str = str_ireplace("delete","**疑似SQL注入：D_E_L_E_T_Y_E**",$str);
    $str = str_ireplace("insert","**疑似SQL注入：I_N_S_E_R_T**",$str);
    $str = str_ireplace("or","**疑似SQL注入：O_R**",$str);
    $str = str_ireplace("%20","**疑似SQL注入：%_2_0**",$str);
    /*$str = str_ireplace("'","**疑似SQL注入：单引号**",$str);
     $str = str_ireplace('"',"**疑似SQL注入：双引号**",$str);
     $str = str_ireplace(" ","**疑似SQL注入：空格符**",$str);
     $str = str_ireplace("=","**疑似SQL注入：等于号**",$str);*/
    $str = str_ireplace("'","\'",$str); //单引号进行转义
    $str = str_ireplace('"',"\"",$str); //双引号进行转义
    //空格不处理 $str = str_ireplace(" ","**疑似SQL注入：空格符**",$str);
    $str = str_ireplace("=","**疑似SQL注入：等于号**",$str);
    //echo $str;
    return $str;
}
?>