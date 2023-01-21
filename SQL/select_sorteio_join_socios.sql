 SELECT 
			 sorteio_participantes.id      as participante_id,
			 socios.id                     as socio_id,
             socios_dados_pessoais.id      as dados_pessoais_id,
             socios_dados_profissionais.id as dados_profissionais_id
 FROM        socios
 LEFT JOIN   socios_dados_pessoais      ON socios_dados_pessoais.socio_id = socios.id
 LEFT JOIN   socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
 LEFT JOIN   sorteio_participantes 
	ON  sorteio_participantes.socio_id   = socios.id
	AND sorteio_participantes.sorteio_id = 1
 WHERE socios.slug = 'gustavo-coelho' 