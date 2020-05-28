CREATE TABLE `urls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `hitCount` int DEFAULT '0',
  `secretCode` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `secretCode_UNIQUE` (`secretCode`),
  UNIQUE KEY `alias_UNIQUE` (`alias`)
);