use sindcelma;

SELECT 
    sorteio.qt_vencedores,
    participantes.socio_id,
    socio.nome,
    socio.cpf
    FROM sorteio_participantes as participantes
    JOIN socios as socio ON participantes.socio_id = socio.id 
    JOIN sorteios as sorteio ON sorteio.id = participantes.sorteio_id 
    WHERE sorteio.id = 1