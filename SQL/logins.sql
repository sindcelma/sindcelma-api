use sindcelma;

SELECT 
		user.id,
		user.email,
		user.ativo,
		admin.slug,
        admin.nome
    FROM 
		user 
    JOIN admin ON admin.user_id = user.id
		WHERE user.email = 'andreifcoelho@gmail.com'
		  AND user.senha = 'mushmush123'
          AND user.ativo = 1;