-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: crypilot
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fts`
--

DROP TABLE IF EXISTS `fts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `symbol` varchar(50) DEFAULT NULL,
  `contract_address` varchar(40) DEFAULT NULL,
  `cmc_id` bigint unsigned NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_address` (`contract_address`),
  KEY `cmc_id_index` (`cmc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nfts`
--

DROP TABLE IF EXISTS `nfts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `symbol` varchar(50) DEFAULT NULL,
  `contract_address` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_address` (`contract_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `self_custodial_favorite_fts`
--

DROP TABLE IF EXISTS `self_custodial_favorite_fts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `self_custodial_favorite_fts` (
  `self_custodial_wallet_id` bigint unsigned NOT NULL,
  `ft_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`self_custodial_wallet_id`,`ft_id`),
  KEY `ft_id` (`ft_id`),
  CONSTRAINT `self_custodial_favorite_fts_ibfk_1` FOREIGN KEY (`self_custodial_wallet_id`) REFERENCES `self_custodial_wallets` (`id`),
  CONSTRAINT `self_custodial_favorite_fts_ibfk_2` FOREIGN KEY (`ft_id`) REFERENCES `fts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `self_custodial_favorite_nfts`
--

DROP TABLE IF EXISTS `self_custodial_favorite_nfts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `self_custodial_favorite_nfts` (
  `self_custodial_wallet_id` bigint unsigned NOT NULL,
  `nft_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`self_custodial_wallet_id`,`nft_id`),
  KEY `nft_id` (`nft_id`),
  CONSTRAINT `self_custodial_favorite_nfts_ibfk_1` FOREIGN KEY (`self_custodial_wallet_id`) REFERENCES `self_custodial_wallets` (`id`),
  CONSTRAINT `self_custodial_favorite_nfts_ibfk_2` FOREIGN KEY (`nft_id`) REFERENCES `nfts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `self_custodial_wallet_types`
--

DROP TABLE IF EXISTS `self_custodial_wallet_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `self_custodial_wallet_types` (
  `self_custodial_wallet_id` bigint unsigned NOT NULL,
  `wallet_type` enum('metamask','coinbase','trust') NOT NULL,
  KEY `self_custodial_wallet_id` (`self_custodial_wallet_id`),
  CONSTRAINT `self_custodial_wallet_types_ibfk_1` FOREIGN KEY (`self_custodial_wallet_id`) REFERENCES `self_custodial_wallets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `self_custodial_wallets`
--

DROP TABLE IF EXISTS `self_custodial_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `self_custodial_wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_address` varchar(40) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `public_address` (`public_address`),
  KEY `public_address_index` (`public_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_favorite_fts`
--

DROP TABLE IF EXISTS `user_favorite_fts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorite_fts` (
  `user_id` bigint unsigned NOT NULL,
  `ft_cmc_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`ft_cmc_id`),
  KEY `fk_ft_cmc_id` (`ft_cmc_id`),
  CONSTRAINT `fk_ft_cmc_id` FOREIGN KEY (`ft_cmc_id`) REFERENCES `fts` (`cmc_id`),
  CONSTRAINT `user_favorite_fts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_favorite_nfts`
--

DROP TABLE IF EXISTS `user_favorite_nfts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorite_nfts` (
  `user_id` bigint unsigned NOT NULL,
  `nft_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`nft_id`),
  KEY `nft_id` (`nft_id`),
  CONSTRAINT `user_favorite_nfts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_favorite_nfts_ibfk_2` FOREIGN KEY (`nft_id`) REFERENCES `nfts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_inventory_fts`
--

DROP TABLE IF EXISTS `user_inventory_fts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_inventory_fts` (
  `user_id` bigint unsigned NOT NULL,
  `balance` bigint unsigned DEFAULT NULL,
  `ft_cmc_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`ft_cmc_id`),
  KEY `fk_ft_cmc_id_inventory` (`ft_cmc_id`),
  CONSTRAINT `fk_ft_cmc_id_inventory` FOREIGN KEY (`ft_cmc_id`) REFERENCES `fts` (`cmc_id`),
  CONSTRAINT `fk_user_id_inventory` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_inventory_nfts`
--

DROP TABLE IF EXISTS `user_inventory_nfts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_inventory_nfts` (
  `user_id` bigint unsigned NOT NULL,
  `nft_id` bigint unsigned NOT NULL,
  `token_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`nft_id`,`token_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_inventory_nfts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_inventory_nfts_ibfk_2` FOREIGN KEY (`nft_id`) REFERENCES `nfts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_providers`
--

DROP TABLE IF EXISTS `user_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_providers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` enum('native','facebook','google','apple') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_providers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_wallets`
--

DROP TABLE IF EXISTS `user_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `public_address` varchar(40) DEFAULT NULL,
  `private_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `public_address` (`public_address`),
  UNIQUE KEY `private_key` (`private_key`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_index` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-04 20:30:18
