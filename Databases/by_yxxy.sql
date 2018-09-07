/*
Navicat MySQL Data Transfer

Source Server         : *
Source Server Version : *
Source Host           : *
Source Database       : *

Target Server Type    : MYSQL
Target Server Version : *
File Encoding         : 65001

Date: 2018-09-07 10:55:08
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for by_yxxy
-- ----------------------------
DROP TABLE IF EXISTS `by_yxxy`;
CREATE TABLE `by_yxxy` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Department` varchar(10) DEFAULT NULL,
  `Name` varchar(10) DEFAULT NULL,
  `Sex` varchar(2) DEFAULT NULL,
  `Nation` varchar(10) DEFAULT NULL,
  `Birthday` varchar(10) DEFAULT NULL,
  `Hometown` varchar(20) DEFAULT NULL,
  `Graduation_Day` varchar(10) DEFAULT NULL,
  `Major` varchar(20) DEFAULT NULL,
  `Education` varchar(20) DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `Job` varchar(100) DEFAULT NULL,
  `Industry_Category` varchar(20) DEFAULT NULL,
  `Abstract` varchar(550) DEFAULT NULL,
  `Photo` varchar(50) DEFAULT NULL,
  `Excellent` varchar(10) DEFAULT 'False',
  `Disable` varchar(10) DEFAULT 'False',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;
