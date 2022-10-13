use sindcelma;

SELECT 
	user.id,
    socios.status
    FROM user 
    JOIN socios ON socios.user_id = user.id 
    WHERE user.email = 'gustavo@gmail.com'