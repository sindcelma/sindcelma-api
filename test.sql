create table if not exists user_web_session (
    id bigint(255) not null auto_increment,
    user_id bigint(255) not null,
    index user_id_idex (user_id),
    chave varchar(255) not null,
    foreign key(user_id) references user(id) on delete cascade,
    primary key(id)
) engine = innodb;