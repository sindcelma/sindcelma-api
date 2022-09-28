use sindcelma;

   SELECT 
		  user.id,
		  user.nome,
		  user.sobrenome,
		  user.email,
		  user.ativo
     FROM user_devices
	 JOIN user ON user.id = user_devices.user_id 
	WHERE user_devices.rememberme = 'YUZf2hwBR9+c4qnRNVLNyev/0f1AzZ2I+jIdgiDO28g='