use sindcelma;

	 SELECT 
			socios.nome,
			socios.sobrenome,
			socios.slug,
			user.id,
			user.email,
			user.ativo
             
	   FROM  user
	   JOIN  socios ON user.id = socios.user_id 
       
	  WHERE  user.email = 'gustavo@gmail.com'
		AND  user.senha = 'mushmush123'
		AND  user.ativo = 1 
        AND  socios.status = 1
    