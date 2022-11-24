use sindcelma;

	SELECT 
		cct_item.item,
		cct_item.resumo,
		(CASE 
			WHEN isnull(c.id) THEN 0
            ELSE 1
		END) as fav
	FROM cct_item 
	LEFT JOIN (
		SELECT 
			  cct_item_fav.id, cct_item_fav.cct_item_id 
		 FROM cct_item_fav 
         JOIN socios ON socios.id = cct_item_fav.socio_id
		WHERE socios.slug = '2854db46dc05ac91420f1e2c132e570f4e0d1b03fd4394f3ad1577585c653743'
	) c ON c.cct_item_id = cct_item.id 
	WHERE cct_id = 1
	ORDER BY 
		c.id DESC, cct_item.item ASC;