use sindcelma;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


-- DROPS
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `admin_service`;
DROP TABLE IF EXISTS `admin_service_access`;

DROP TABLE IF EXISTS `beneficiados`;

DROP TABLE IF EXISTS `cct_item_fav`;
DROP TABLE IF EXISTS `cct_item`;
DROP TABLE IF EXISTS `cct`;

DROP TABLE IF EXISTS `sorteio_participantes`;
DROP TABLE IF EXISTS `sorteios`;

DROP TABLE IF EXISTS `mailing_socio`;
DROP TABLE IF EXISTS `mailing`;


DROP TABLE IF EXISTS `user_devices`;
DROP TABLE IF EXISTS `user_images`;
DROP TABLE IF EXISTS `user_recover`;

DROP TABLE IF EXISTS `socios_dados_profissionais`;
DROP TABLE IF EXISTS `socios_dados_pessoais`;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `socios`;

DROP TABLE IF EXISTS `empresas`;
DROP TABLE IF EXISTS `motivos`;
-- --------------------------------------------------------

--
-- Estrutura da tabela `admin`
--


CREATE TABLE `admin` (
  `id` bigint(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `slug` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `admin_service`
--


CREATE TABLE `admin_service` (
  `id` bigint(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `admin_service_id` bigint(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `admin_service_access`
--


CREATE TABLE `admin_service_access` (
  `id` bigint(255) NOT NULL,
  `admin_id` bigint(255) NOT NULL,
  `admin_service_id` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `beneficiados`
--


CREATE TABLE `beneficiados` (
  `id` bigint(255) NOT NULL,
  `socio_id` bigint(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `doc` varchar(255) NOT NULL,
  `data_nascimento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cct`
--


CREATE TABLE `cct` (
  `id` bigint(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `publico` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cct_item`
--


CREATE TABLE `cct_item` (
  `id` bigint(255) NOT NULL,
  `cct_id` bigint(255) NOT NULL,
  `imagem` varchar(255) NOT NULL,
  `item` varchar(255) NOT NULL,
  `resumo` varchar(255) NOT NULL,
  `texto` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cct_item_fav`
--


CREATE TABLE `cct_item_fav` (
  `id` bigint(255) NOT NULL,
  `cct_item_id` bigint(255) NOT NULL,
  `socio_id` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `empresas`
--


CREATE TABLE `empresas` (
  `id` bigint(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cnpj` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `mailing`
--


CREATE TABLE `mailing` (
  `id` bigint(255) NOT NULL,
  `hash_id` varchar(255) NOT NULL,
  `loc_id` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `mailing_socio`
--


CREATE TABLE `mailing_socio` (
  `id` bigint(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `motivos`
--


CREATE TABLE `motivos` (
  `id` bigint(255) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `socios`
--


CREATE TABLE `socios` (
  `id` bigint(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `cpf` varchar(255) NOT NULL,
  `np` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = indefinido |\r\n1 = falta imagens |\r\n2 = para aprovação|\r\n3 = aprovado |\r\n4 = bloqueado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `socios_dados_pessoais`
--


CREATE TABLE `socios_dados_pessoais` (
  `id` bigint(255) NOT NULL,
  `socio_id` bigint(255) NOT NULL,
  `rg` varchar(255) DEFAULT NULL,
  `sexo` char(1) NOT NULL,
  `estado_civil` varchar(100) NOT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `socios_dados_profissionais`
--


CREATE TABLE `socios_dados_profissionais` (
  `id` bigint(255) NOT NULL,
  `empresa_id` bigint(255) DEFAULT NULL,
  `socio_id` bigint(255) NOT NULL,
  `cargo` varchar(255) NOT NULL,
  `data_admissao` date NOT NULL,
  `num_matricula` varchar(255) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `sorteios`
--


CREATE TABLE `sorteios` (
  `id` bigint(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `premios` varchar(255) NOT NULL,
  `qt_vencedores` int(11) NOT NULL,
  `data_sorteio` datetime NOT NULL,
  `data_inscricao` datetime NOT NULL,
  `ativo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `sorteio_participantes`
--


CREATE TABLE `sorteio_participantes` (
  `id` bigint(255) NOT NULL,
  `sorteio_id` bigint(255) NOT NULL,
  `socio_id` bigint(255) NOT NULL,
  `vencedor` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--


CREATE TABLE `user` (
  `id` bigint(255) NOT NULL,
  `socio_id` bigint(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `temp_key` varchar(255) DEFAULT NULL,
  `valid_key` datetime DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = usuário socio \r\n2 = usuario criado pelo socio - mas que não tem privilegio para alterar dados do socio'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_devices`
--


CREATE TABLE `user_devices` (
  `id` bigint(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `header` varchar(255) DEFAULT NULL,
  `rememberme` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_images`
--


CREATE TABLE `user_images` (
  `id` bigint(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'Os tipos podem ser: ''doc'',''nodoc'' ou ''fav''',
  `ext` varchar(10) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = é ghost | 1 = imagem'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_recover`
--


CREATE TABLE `user_recover` (
  `id` bigint(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `data_limite` datetime NOT NULL,
  `codigo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `foreign_user_id_admin` (`user_id`);

--
-- Índices para tabela `admin_service`
--
ALTER TABLE `admin_service`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Índices para tabela `admin_service_access`
--
ALTER TABLE `admin_service_access`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `beneficiados`
--
ALTER TABLE `beneficiados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `foreign_socio_id_beneficiados` (`socio_id`);

--
-- Índices para tabela `cct`
--
ALTER TABLE `cct`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `cct_item`
--
ALTER TABLE `cct_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_cct_id_cct_item` (`cct_id`);

--
-- Índices para tabela `cct_item_fav`
--
ALTER TABLE `cct_item_fav`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_cct_item_id_cct_item_fav` (`cct_item_id`),
  ADD KEY `foreign_socio_id_cct_item_fav` (`socio_id`);

--
-- Índices para tabela `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CNPJ` (`cnpj`);

--
-- Índices para tabela `mailing`
--
ALTER TABLE `mailing`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `hash_id` (`hash_id`);

--
-- Índices para tabela `mailing_socio`
--
ALTER TABLE `mailing_socio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_user_id_mailing_socio` (`user_id`);

--
-- Índices para tabela `motivos`
--
ALTER TABLE `motivos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- Índices para tabela `socios_dados_pessoais`
--
ALTER TABLE `socios_dados_pessoais`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `socio_id` (`socio_id`);

--
-- Índices para tabela `socios_dados_profissionais`
--
ALTER TABLE `socios_dados_profissionais`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `socio_id` (`socio_id`),
  ADD KEY `foreign_empresa_id_socios_dados_profissionais` (`empresa_id`);

--
-- Índices para tabela `sorteios`
--
ALTER TABLE `sorteios`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `sorteio_participantes`
--
ALTER TABLE `sorteio_participantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_sorteio_id_sorteios_participantes` (`sorteio_id`),
  ADD KEY `foreign_socio_id_sorteio_participantes` (`socio_id`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `foreign_socio_id_user` (`socio_id`);

--
-- Índices para tabela `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `foreign_user_id_user_devices` (`user_id`);

--
-- Índices para tabela `user_images`
--
ALTER TABLE `user_images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `foreign_user_id_socios_images` (`user_id`);

--
-- Índices para tabela `user_recover`
--
ALTER TABLE `user_recover`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_user_id_recover` (`user_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `admin`
--
ALTER TABLE `admin`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `admin_service`
--
ALTER TABLE `admin_service`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `admin_service_access`
--
ALTER TABLE `admin_service_access`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `beneficiados`
--
ALTER TABLE `beneficiados`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cct`
--
ALTER TABLE `cct`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cct_item`
--
ALTER TABLE `cct_item`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cct_item_fav`
--
ALTER TABLE `cct_item_fav`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mailing`
--
ALTER TABLE `mailing`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mailing_socio`
--
ALTER TABLE `mailing_socio`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `motivos`
--
ALTER TABLE `motivos`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `socios`
--
ALTER TABLE `socios`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `socios_dados_pessoais`
--
ALTER TABLE `socios_dados_pessoais`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `socios_dados_profissionais`
--
ALTER TABLE `socios_dados_profissionais`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `sorteios`
--
ALTER TABLE `sorteios`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `sorteio_participantes`
--
ALTER TABLE `sorteio_participantes`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_images`
--
ALTER TABLE `user_images`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_recover`
--
ALTER TABLE `user_recover`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `foreign_user_id_admin` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `beneficiados`
--
ALTER TABLE `beneficiados`
  ADD CONSTRAINT `foreign_socio_id_beneficiados` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `cct_item`
--
ALTER TABLE `cct_item`
  ADD CONSTRAINT `foreign_cct_id_cct_item` FOREIGN KEY (`cct_id`) REFERENCES `cct` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `cct_item_fav`
--
ALTER TABLE `cct_item_fav`
  ADD CONSTRAINT `foreign_cct_item_id_cct_item_fav` FOREIGN KEY (`cct_item_id`) REFERENCES `cct_item` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foreign_socio_id_cct_item_fav` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `mailing_socio`
--
ALTER TABLE `mailing_socio`
  ADD CONSTRAINT `foreign_user_id_mailing_socio` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `socios_dados_pessoais`
--
ALTER TABLE `socios_dados_pessoais`
  ADD CONSTRAINT `foreign_socio_id_socios_dados_pessoais` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `socios_dados_profissionais`
--
ALTER TABLE `socios_dados_profissionais`
  ADD CONSTRAINT `foreign_empresa_id_socios_dados_profissionais` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `foreign_socio_id_socios_dados_profissionais` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `sorteio_participantes`
--
ALTER TABLE `sorteio_participantes`
  ADD CONSTRAINT `foreign_socio_id_sorteio_participantes` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foreign_sorteio_id_sorteios_participantes` FOREIGN KEY (`sorteio_id`) REFERENCES `sorteios` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `foreign_socio_id_user` FOREIGN KEY (`socio_id`) REFERENCES `socios` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `foreign_user_id_user_devices` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `user_images`
--
ALTER TABLE `user_images`
  ADD CONSTRAINT `foreign_user_id_socios_images` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `user_recover`
--
ALTER TABLE `user_recover`
  ADD CONSTRAINT `foreign_user_id_recover` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
