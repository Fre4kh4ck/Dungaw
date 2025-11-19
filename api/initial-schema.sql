-- Initial schema for Dungaw database

CREATE DATABASE IF NOT EXISTS `dungaw` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dungaw`;

-- Table: accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_name` varchar(50) DEFAULT NULL,
  `account_username` varchar(50) DEFAULT NULL,
  `account_password` varchar(50) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `account_creation` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: addevent
CREATE TABLE IF NOT EXISTS `addevent` (
  `EventID` int(99) NOT NULL AUTO_INCREMENT,
  `EventName` varchar(50) NOT NULL,
  `EventTime` time DEFAULT NULL,
  `EventStartDate` date NOT NULL,
  `EventEndDate` date DEFAULT NULL,
  `EventVenue` char(50) DEFAULT NULL,
  `EventDescription` text DEFAULT NULL,
  `EventPhoto` text DEFAULT NULL,
  `EventDept` varchar(255) DEFAULT NULL,
  `EventStatus` enum('Submitted','Approved','Denied') DEFAULT 'Submitted',
  `EventDenialReason` text DEFAULT NULL,
  `event_qr_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: chat_messages
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `chatroom_id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `message_content` text NOT NULL,
  `sent_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: joined_events
CREATE TABLE IF NOT EXISTS `joined_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `event_id` int(11) NOT NULL,
  `ticket_id` varchar(255) DEFAULT NULL,
  `last_read_at` datetime DEFAULT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  `attended` tinyint(1) DEFAULT 0,
  `time_in` datetime DEFAULT NULL,
  `time_out` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_id` (`ticket_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `joined_events_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `addevent` (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `google_id` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `picture` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
