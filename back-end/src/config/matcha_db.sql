-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 16, 2020 at 10:20 AM
-- Server version: 8.0.21
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matcha`
--

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `idinterest` int NOT NULL,
  `label` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `interests`
--

INSERT INTO `interests` (`idinterest`, `label`) VALUES
(1, 'Music'),
(2, 'Sport'),
(3, 'Games'),
(4, 'Animals'),
(5, 'Party'),
(6, 'Arts'),
(7, 'Movies'),
(8, 'Travels'),
(9, 'Cooking'),
(10, 'Dance');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `idlike` int NOT NULL,
  `iduser` int NOT NULL,
  `user_liked` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id_message` int NOT NULL,
  `user_send` int NOT NULL,
  `user_receive` int NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id_notif` int NOT NULL,
  `type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id_notif`, `type`) VALUES
(1, 'like'),
(2, 'visite'),
(3, 'chat'),
(4, 'match'),
(5, 'unmatch');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `iduser` int NOT NULL,
  `firstname` tinytext NOT NULL,
  `lastname` tinytext NOT NULL,
  `email` tinytext NOT NULL,
  `username` tinytext NOT NULL,
  `gender` tinytext NOT NULL,
  `orientation` tinytext NOT NULL,
  `birthday` date NOT NULL,
  `pwd` longtext NOT NULL,
  `activation` tinyint(1) DEFAULT '0',
  `tokenreset` longtext,
  `tokenactivation` longtext,
  `bio` mediumtext,
  `imgprofil` tinytext,
  `img1` tinytext,
  `img2` tinytext,
  `img3` tinytext,
  `img4` tinytext,
  `img5` tinytext,
  `latitude` decimal(10,5) DEFAULT NULL,
  `longitude` decimal(10,5) DEFAULT NULL,
  `online` tinyint(1) NOT NULL DEFAULT '0',
  `popularity` int NOT NULL DEFAULT '0',
  `date_unlog` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_blocked`
--

CREATE TABLE `user_blocked` (
  `idBlock` int NOT NULL,
  `idSenderBlock` int NOT NULL,
  `idReceiverBlock` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

CREATE TABLE `user_interests` (
  `idui` int NOT NULL,
  `iduser` int NOT NULL,
  `interest` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE `user_notifications` (
  `id` int NOT NULL,
  `id_notif` int NOT NULL,
  `id_user_receive` int NOT NULL,
  `id_user_send` int NOT NULL,
  `lu` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`idinterest`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`idlike`),
  ADD KEY `iduser` (`iduser`),
  ADD KEY `user_liked` (`user_liked`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `messages_ibfk1` (`user_send`),
  ADD KEY `messages_ibfk2` (`user_receive`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id_notif`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`iduser`);

--
-- Indexes for table `user_blocked`
--
ALTER TABLE `user_blocked`
  ADD PRIMARY KEY (`idBlock`);

--
-- Indexes for table `user_interests`
--
ALTER TABLE `user_interests`
  ADD PRIMARY KEY (`idui`),
  ADD KEY `iduser` (`iduser`),
  ADD KEY `interest` (`interest`);

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_notifications_ibfk1` (`id_user_receive`),
  ADD KEY `user_notifications_ibfk2` (`id_user_send`),
  ADD KEY `user_notifications_ibfk3` (`id_notif`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interests`
--
ALTER TABLE `interests`
  MODIFY `idinterest` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `idlike` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=299;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id_message` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id_notif` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `iduser` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_blocked`
--
ALTER TABLE `user_blocked`
  MODIFY `idBlock` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `user_interests`
--
ALTER TABLE `user_interests`
  MODIFY `idui` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17776;

--
-- AUTO_INCREMENT for table `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=571;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`iduser`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_liked`) REFERENCES `users` (`iduser`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk1` FOREIGN KEY (`user_send`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk2` FOREIGN KEY (`user_receive`) REFERENCES `users` (`iduser`) ON DELETE CASCADE;

--
-- Constraints for table `user_interests`
--
ALTER TABLE `user_interests`
  ADD CONSTRAINT `user_interests_ibfk_1` FOREIGN KEY (`iduser`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_interests_ibfk_2` FOREIGN KEY (`interest`) REFERENCES `interests` (`idinterest`) ON DELETE CASCADE;

--
-- Constraints for table `user_blocked`
--
ALTER TABLE `user_blocked`
  ADD CONSTRAINT `user_blocked_ibfk_1` FOREIGN KEY (`idSenderBlock`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_blocked_ibfk_2` FOREIGN KEY (`idReceiverBlock`) REFERENCES `users` (`iduser`) ON DELETE CASCADE;

--
-- Constraints for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `user_notifications_ibfk1` FOREIGN KEY (`id_user_receive`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_notifications_ibfk2` FOREIGN KEY (`id_user_send`) REFERENCES `users` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_notifications_ibfk3` FOREIGN KEY (`id_notif`) REFERENCES `notifications` (`id_notif`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
