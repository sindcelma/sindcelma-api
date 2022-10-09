use sindcelma;

	SELECT 
		user.id,
        socios.status
    FROM socios 
    LEFT JOIN user ON socios.user_id = user.id 
    WHERE
		socios.cpf = '370.778.555-77'