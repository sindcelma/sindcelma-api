-- MySQL dump 10.13  Distrib 5.7.37, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sindcelma
-- ------------------------------------------------------
-- Server version	5.5.5-10.7.3-MariaDB-1:10.7.3+maria~focal

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `foreign_user_id_admin` (`user_id`),
  CONSTRAINT `foreign_user_id_admin` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_service`
--

DROP TABLE IF EXISTS `admin_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_service` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `admin_service_id` bigint(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_service_access`
--

DROP TABLE IF EXISTS `admin_service_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_service_access` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `admin_id` bigint(255) NOT NULL,
  `admin_service_id` bigint(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `beneficiados`
--

DROP TABLE IF EXISTS `beneficiados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `beneficiados` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `socio_id` bigint(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `doc` varchar(255) NOT NULL,
  `data_nascimento` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `foreign_socio_id_beneficiados` (`socio_id`),
  CONSTRAINT `foreign_socio_id_beneficiados` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cct`
--

DROP TABLE IF EXISTS `cct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cct` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cct_item`
--

DROP TABLE IF EXISTS `cct_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cct_item` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `cct_id` bigint(255) NOT NULL,
  `imagem` varchar(255) NOT NULL,
  `item` varchar(255) NOT NULL,
  `resumo` varchar(255) NOT NULL,
  `texto` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_cct_id_cct_item` (`cct_id`),
  CONSTRAINT `foreign_cct_id_cct_item` FOREIGN KEY (`cct_id`) REFERENCES `cct` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cct_item_fav`
--

DROP TABLE IF EXISTS `cct_item_fav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cct_item_fav` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `cct_item_id` bigint(255) NOT NULL,
  `socio_id` bigint(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_cct_item_id_cct_item_fav` (`cct_item_id`),
  KEY `foreign_socio_id_cct_item_fav` (`socio_id`),
  CONSTRAINT `foreign_cct_item_id_cct_item_fav` FOREIGN KEY (`cct_item_id`) REFERENCES `cct_item` (`id`) ON DELETE CASCADE,
  CONSTRAINT `foreign_socio_id_cct_item_fav` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empresas` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cnpj` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CNPJ` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailing`
--

DROP TABLE IF EXISTS `mailing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailing` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `hash_id` varchar(255) NOT NULL,
  `loc_id` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `hash_id` (`hash_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1207 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailing_socio`
--

DROP TABLE IF EXISTS `mailing_socio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailing_socio` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_user_id_mailing_socio` (`user_id`),
  CONSTRAINT `foreign_user_id_mailing_socio` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `motivos`
--

DROP TABLE IF EXISTS `motivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `motivos` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `socios`
--

DROP TABLE IF EXISTS `socios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `socios` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `cpf` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = indefinido |\r\n1 = falta imagens |\r\n2 = para aprovação|\r\n3 = aprovado |\r\n4 = bloqueado',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `socios_dados_pessoais`
--

DROP TABLE IF EXISTS `socios_dados_pessoais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `socios_dados_pessoais` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `socio_id` bigint(255) NOT NULL,
  `rg` varchar(255) DEFAULT NULL,
  `sexo` char(1) NOT NULL,
  `estado_civil` varchar(100) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `socio_id` (`socio_id`),
  CONSTRAINT `foreign_socio_id_socios_dados_pessoais` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `socios_dados_profissionais`
--

DROP TABLE IF EXISTS `socios_dados_profissionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `socios_dados_profissionais` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `empresa_id` bigint(255) DEFAULT NULL,
  `socio_id` bigint(255) NOT NULL,
  `cargo` varchar(255) NOT NULL,
  `data_admissao` date NOT NULL,
  `num_matricula` varchar(255) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `socio_id` (`socio_id`),
  KEY `foreign_empresa_id_socios_dados_profissionais` (`empresa_id`),
  CONSTRAINT `foreign_empresa_id_socios_dados_profissionais` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  CONSTRAINT `foreign_socio_id_socios_dados_profissionais` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sorteio_participantes`
--

DROP TABLE IF EXISTS `sorteio_participantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sorteio_participantes` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `sorteio_id` bigint(255) NOT NULL,
  `socio_id` bigint(255) NOT NULL,
  `vencedor` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `foreign_sorteio_id_sorteios_participantes` (`sorteio_id`),
  KEY `foreign_socio_id_sorteio_participantes` (`socio_id`),
  CONSTRAINT `foreign_socio_id_sorteio_participantes` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `foreign_sorteio_id_sorteios_participantes` FOREIGN KEY (`sorteio_id`) REFERENCES `sorteios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sorteios`
--

DROP TABLE IF EXISTS `sorteios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sorteios` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `premios` varchar(255) NOT NULL,
  `qt_vencedores` int(11) NOT NULL,
  `data_sorteio` datetime NOT NULL,
  `ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `socio_id` bigint(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `temp_key` varchar(255) DEFAULT NULL,
  `valid_key` datetime DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = usuário socio \r\n2 = usuario criado pelo socio - mas que não tem privilegio para alterar dados do socio',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `foreign_socio_id_user` (`socio_id`),
  CONSTRAINT `foreign_socio_id_user` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_devices`
--

DROP TABLE IF EXISTS `user_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_devices` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `header` varchar(255) DEFAULT NULL,
  `rememberme` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `foreign_user_id_user_devices` (`user_id`),
  CONSTRAINT `foreign_user_id_user_devices` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_images`
--

DROP TABLE IF EXISTS `user_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_images` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'Os tipos podem ser: ''doc'',''nodoc'' ou ''fav''',
  `ext` varchar(10) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = é ghost | 1 = imagem',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `foreign_user_id_socios_images` (`user_id`),
  CONSTRAINT `foreign_user_id_socios_images` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_recover`
--

DROP TABLE IF EXISTS `user_recover`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_recover` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(255) NOT NULL,
  `data_limite` datetime NOT NULL,
  `codigo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_user_id_recover` (`user_id`),
  CONSTRAINT `foreign_user_id_recover` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-30 14:35:40
