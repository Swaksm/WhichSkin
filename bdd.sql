-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 17 nov. 2025 à 19:33
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `esportify`
--

-- --------------------------------------------------------

--
-- Structure de la table `bets`
--

DROP TABLE IF EXISTS `bets`;
CREATE TABLE IF NOT EXISTS `bets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `champion_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','won','lost') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_bets_champion` (`champion_id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `bets`
--

INSERT INTO `bets` (`id`, `champion_id`, `amount`, `status`, `created_at`) VALUES
(14, 7, 5.00, 'pending', '2025-11-13 13:01:20'),
(17, 17, 5.00, 'pending', '2025-11-17 19:19:48'),
(16, 15, 5.00, 'pending', '2025-11-17 19:19:36');

-- --------------------------------------------------------

--
-- Structure de la table `champions`
--

DROP TABLE IF EXISTS `champions`;
CREATE TABLE IF NOT EXISTS `champions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `pick_rate` decimal(5,2) DEFAULT '0.00',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `champions`
--

INSERT INTO `champions` (`id`, `name`, `pick_rate`, `image_url`) VALUES
(1, 'Aatrox', 12.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Aatrox.png'),
(2, 'Lee Sin', 18.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/LeeSin.png'),
(3, 'Ahri', 10.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ahri.png'),
(4, 'Kai\'Sa', 22.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kaisa.png'),
(5, 'Thresh', 15.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Thresh.png'),
(6, 'Akali', 8.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Akali.png'),
(7, 'Alistar', 6.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Alistar.png'),
(8, 'Amumu', 5.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Amumu.png'),
(9, 'Anivia', 4.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Anivia.png'),
(10, 'Annie', 7.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Annie.png'),
(11, 'Aphelios', 5.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Aphelios.png'),
(12, 'Ashe', 9.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ashe.png'),
(13, 'Aurelion Sol', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/AurelionSol.png'),
(14, 'Azir', 2.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Azir.png'),
(15, 'Bard', 4.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Bard.png'),
(16, 'Blitzcrank', 6.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Blitzcrank.png'),
(17, 'Brand', 5.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Brand.png'),
(18, 'Braum', 7.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Braum.png'),
(19, 'Caitlyn', 8.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Caitlyn.png'),
(20, 'Camille', 6.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Camille.png'),
(21, 'Cassiopeia', 4.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Cassiopeia.png'),
(22, 'Cho\'Gath', 5.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Chogath.png'),
(23, 'Corki', 3.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Corki.png'),
(24, 'Darius', 9.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Darius.png'),
(25, 'Diana', 7.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Diana.png'),
(26, 'Dr. Mundo', 5.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/DrMundo.png'),
(27, 'Draven', 6.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Draven.png'),
(28, 'Ekko', 8.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ekko.png'),
(29, 'Elise', 4.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Elise.png'),
(30, 'Evelynn', 5.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Evelynn.png'),
(31, 'Ezreal', 11.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ezreal.png'),
(32, 'Fiddlesticks', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Fiddlesticks.png'),
(33, 'Fiora', 6.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Fiora.png'),
(34, 'Fizz', 7.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Fizz.png'),
(35, 'Galio', 3.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Galio.png'),
(36, 'Gangplank', 4.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Gangplank.png'),
(37, 'Garen', 10.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Garen.png'),
(38, 'Gnar', 5.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Gnar.png'),
(39, 'Gragas', 5.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Gragas.png'),
(40, 'Graves', 6.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Graves.png'),
(41, 'Gwen', 3.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Gwen.png'),
(42, 'Hecarim', 4.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Hecarim.png'),
(43, 'Heimerdinger', 3.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Heimerdinger.png'),
(44, 'Illaoi', 4.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Illaoi.png'),
(45, 'Irelia', 6.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Irelia.png'),
(46, 'Ivern', 2.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ivern.png'),
(47, 'Janna', 5.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Janna.png'),
(48, 'Jarvan IV', 4.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/JarvanIV.png'),
(49, 'Jax', 7.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Jax.png'),
(50, 'Jayce', 5.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Jayce.png'),
(51, 'Jhin', 9.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Jhin.png'),
(52, 'Jinx', 8.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Jinx.png'),
(53, 'Kaisa', 11.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kaisa.png'),
(54, 'Kalista', 3.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kalista.png'),
(55, 'Karma', 4.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Karma.png'),
(56, 'Karthus', 4.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Karthus.png'),
(57, 'Kassadin', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kassadin.png'),
(58, 'Katarina', 6.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Katarina.png'),
(59, 'Kayle', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kayle.png'),
(60, 'Kennen', 4.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kennen.png'),
(61, 'Kha\'Zix', 5.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Khazix.png'),
(62, 'Kindred', 3.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kindred.png'),
(63, 'Kled', 3.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Kled.png'),
(64, 'Kog\'Maw', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/KogMaw.png'),
(65, 'LeBlanc', 6.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/LeBlanc.png'),
(66, 'Leona', 5.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Leona.png'),
(67, 'Lillia', 3.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Lillia.png'),
(68, 'Lissandra', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Lissandra.png'),
(69, 'Lucian', 8.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Lucian.png'),
(70, 'Lulu', 6.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Lulu.png'),
(71, 'Malphite', 5.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Malphite.png'),
(72, 'Malzahar', 4.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Malzahar.png'),
(73, 'Maokai', 5.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Maokai.png'),
(74, 'Master Yi', 7.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/MasterYi.png'),
(75, 'Miss Fortune', 8.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/MissFortune.png'),
(76, 'Mordekaiser', 4.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Mordekaiser.png'),
(77, 'Morgana', 6.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Morgana.png'),
(78, 'Nami', 5.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nami.png'),
(79, 'Nasus', 6.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nasus.png'),
(80, 'Nautilus', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nautilus.png'),
(81, 'Neeko', 3.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Neeko.png'),
(82, 'Nidalee', 5.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nidalee.png'),
(83, 'Nocturne', 4.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nocturne.png'),
(84, 'Nunu & Willump', 3.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nunu.png'),
(85, 'Olaf', 4.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Olaf.png'),
(86, 'Orianna', 5.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Orianna.png'),
(87, 'Ornn', 4.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ornn.png'),
(88, 'Pantheon', 5.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Pantheon.png'),
(89, 'Poppy', 4.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Poppy.png'),
(90, 'Pyke', 5.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Pyke.png'),
(91, 'Qiyana', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Qiyana.png'),
(92, 'Quinn', 3.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Quinn.png'),
(93, 'Rakan', 5.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Rakan.png'),
(94, 'Rammus', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Rammus.png'),
(95, 'Rek\'Sai', 3.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/RekSai.png'),
(96, 'Rell', 3.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Rell.png'),
(97, 'Renekton', 5.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Renekton.png'),
(98, 'Rengar', 4.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Rengar.png'),
(99, 'Lux', 0.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Lux.png'),
(100, 'Rumble', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Rumble.png'),
(101, 'Ryze', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ryze.png'),
(102, 'Samira', 6.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Samira.png'),
(103, 'Sejuani', 4.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Sejuani.png'),
(104, 'Senna', 5.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Senna.png'),
(105, 'Seraphine', 4.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Seraphine.png'),
(106, 'Sett', 6.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Sett.png'),
(107, 'Shaco', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Shaco.png'),
(108, 'Shen', 5.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Shen.png'),
(109, 'Shyvana', 4.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Shyvana.png'),
(110, 'Singed', 3.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Singed.png'),
(111, 'Sion', 4.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Sion.png'),
(112, 'Sivir', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Sivir.png'),
(113, 'Skarner', 3.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Skarner.png'),
(114, 'Sona', 5.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Sona.png'),
(115, 'Soraka', 4.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Soraka.png'),
(116, 'Swain', 3.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Swain.png'),
(117, 'Sylas', 4.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Sylas.png'),
(118, 'Syndra', 5.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Syndra.png'),
(119, 'Tahm Kench', 4.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/TahmKench.png'),
(120, 'Taliyah', 4.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Taliyah.png'),
(121, 'Talon', 5.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Talon.png'),
(122, 'Taric', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Taric.png'),
(123, 'Teemo', 5.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Teemo.png'),
(124, 'Tristana', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Tristana.png'),
(125, 'Trundle', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Trundle.png'),
(126, 'Tryndamere', 4.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Tryndamere.png'),
(127, 'Twisted Fate', 4.40, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/TwistedFate.png'),
(128, 'Twitch', 4.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Twitch.png'),
(129, 'Udyr', 3.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Udyr.png'),
(130, 'Urgot', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Urgot.png'),
(131, 'Varus', 4.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Varus.png'),
(132, 'Vayne', 5.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Vayne.png'),
(133, 'Veigar', 4.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Veigar.png'),
(134, 'Vel\'Koz', 3.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Velkoz.png'),
(135, 'Vex', 4.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Vex.png'),
(136, 'Vi', 5.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Vi.png'),
(137, 'Viego', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Viego.png'),
(138, 'Viktor', 4.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Viktor.png'),
(139, 'Vladimir', 4.30, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Vladimir.png'),
(140, 'Volibear', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Volibear.png'),
(141, 'Warwick', 4.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Warwick.png'),
(142, 'Wukong', 4.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Wukong.png'),
(143, 'Xayah', 5.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Xayah.png'),
(144, 'Xerath', 3.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Xerath.png'),
(145, 'Xin Zhao', 4.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/XinZhao.png'),
(146, 'Yasuo', 5.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Yasuo.png'),
(147, 'Yone', 4.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Yone.png'),
(148, 'Yorick', 3.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Yorick.png'),
(149, 'Yuumi', 4.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Yuumi.png'),
(150, 'Zac', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Zac.png'),
(151, 'Zed', 5.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Zed.png'),
(152, 'Zeri', 4.80, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Zeri.png'),
(153, 'Ziggs', 3.70, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Ziggs.png'),
(154, 'Zilean', 3.60, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Zilean.png'),
(155, 'Zoe', 4.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Zoe.png'),
(156, 'Zyra', 3.90, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Zyra.png'),
(157, 'K\'Sante', 3.50, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/KSante.png'),
(158, 'Nilah', 3.20, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Nilah.png'),
(159, 'Bel\'Veth', 3.00, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/BelVeth.png'),
(160, 'Renata Glasc', 3.10, 'https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/Renata.png');

-- --------------------------------------------------------

--
-- Structure de la table `patches`
--

DROP TABLE IF EXISTS `patches`;
CREATE TABLE IF NOT EXISTS `patches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `published_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_patch_url` (`url`(191))
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `patches`
--

INSERT INTO `patches` (`id`, `title`, `url`, `published_at`) VALUES
(1, 'Patch 25.22 Notes', 'https://www.leagueoflegends.com/en-us/news/game-updates/patch-25-22-notes', '2025-11-04 20:00:00'),
(2, 'Patch 25.21 Notes', 'https://www.leagueoflegends.com/en-us/news/game-updates/patch-25-21-notes', '2025-10-21 20:00:00'),
(3, 'Patch 25.20 Notes', 'https://www.leagueoflegends.com/en-us/news/game-updates/patch-25-20-notes', '2025-10-07 20:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `patch_skins`
--

DROP TABLE IF EXISTS `patch_skins`;
CREATE TABLE IF NOT EXISTS `patch_skins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patch_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `champion_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_patch_skin` (`patch_id`,`name`(191)),
  KEY `idx_patch_id` (`patch_id`),
  KEY `idx_champion_id` (`champion_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `patch_skins`
--

INSERT INTO `patch_skins` (`id`, `patch_id`, `name`, `champion_id`) VALUES
(1, 1, 'Panda Pal Lux', 99),
(2, 1, 'Machine Herald Viktor', 138),
(3, 1, 'Mecha Kingdoms Darius', 24),
(4, 1, 'Mecha Kingdoms Wukong', 142),
(5, 2, 'Prestige Eternal Aspect Zoe', 155),
(6, 2, 'Beeko', 81),
(7, 2, 'Mecha Kingdoms Skarner', 113),
(8, 3, 'Flora Fatalis Soraka', 115),
(9, 3, 'Flora Fatalis Fiddlesticks', 32),
(10, 3, 'Flora Fatalis Lissandra', 68),
(11, 3, 'Trials of Twilight Xin Zhao', 145);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(50) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `tokens` int UNSIGNED NOT NULL DEFAULT '0',
  `last_spin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `pseudo`, `mot_de_passe`, `admin`, `tokens`, `last_spin`) VALUES
(8, 'User', 'password', 0, 0, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
