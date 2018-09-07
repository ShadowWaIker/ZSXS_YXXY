/*
Navicat MySQL Data Transfer

Source Server         : *
Source Server Version : *
Source Host           : *
Source Database       : *

Target Server Type    : MYSQL
Target Server Version : *
File Encoding         : 65001

Date: 2018-09-07 10:54:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `xi` varchar(20) NOT NULL,
  `yhm` varchar(30) DEFAULT NULL,
  `mm` varchar(50) NOT NULL,
  `isAdmin` varchar(2) NOT NULL,
  PRIMARY KEY (`xi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
