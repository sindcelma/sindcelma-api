use sindcelma;

SELECT 
		user.id,
		user.nome,
		user.sobrenome,
		user.email,
		user.ativo,
		admin.slug
    FROM 
		user 
    JOIN admin ON admin.user_id = user.id
		WHERE user.email = 'andreifcoelho@gmail.com'
		  AND user.senha = 'mushmush123'
          AND user.ativo = 1;