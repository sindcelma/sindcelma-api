use sindcelma;

/* por paginação */
SELECT
	socios.id 
    FROM socios
    /* WHERE */
    ORDER BY id ASC LIMIT 3,3; 