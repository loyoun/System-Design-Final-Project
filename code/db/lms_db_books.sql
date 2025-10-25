-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: lms_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `genre` varchar(30) DEFAULT NULL,
  `pub_date` date NOT NULL,
  `isbn` char(13) NOT NULL,
  `status` enum('CHECKED_OUT','AVAILABLE','ON_HOLD','UNAVAILABLE') DEFAULT NULL,
  `local_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`local_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES ('Hitchhiker\'s Guide to the Galaxy','Douglas Adams','Science Fiction','1979-10-12','9780330258647','AVAILABLE',1,NULL),('Invisible Cities','Italo Calvino','Speculative Fiction','1972-11-01','9780151452903','CHECKED_OUT',2,1),('The City and the City','China Miéville','Weird Fiction','2009-05-15','9781405000178','ON_HOLD',3,NULL),('Collected Fictions','Jorge Luis Borges','Speculative Fiction','1999-09-01','9780140286809','AVAILABLE',4,NULL),('Piranesi','Susanna Clarke','Speculative Fiction','2020-09-15','9781526622426','AVAILABLE',5,NULL),('The Invisible Man','H. G. Wells','Science Fiction','1897-01-01','9780486270715','CHECKED_OUT',6,3),('Treasure Island','Robert Louis Stevenson','Adventure','1883-11-14','9780195811391','AVAILABLE',7,NULL),('The Time Machine','H. G. Wells','Science Fiction','1895-01-01','9780486284729','CHECKED_OUT',8,2),('Rendezvous with Rama','Arthur C. Clarke','Science Fiction','1973-06-01','9780151768356','CHECKED_OUT',9,1);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-24 22:59:30
