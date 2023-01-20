use sindcelma;

SELECT 
		user.id,
		user.email,
		admin.slug,
        admin.nome
    FROM 
		user 
    JOIN admin ON admin.user_id = user.id
		WHERE user.email = 'andreifcoelho@gmail.com'
		  AND user.senha = 'mushmush123';	