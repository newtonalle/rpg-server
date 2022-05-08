# Comandos SQL

## Criacao da tabela de players
```
create table players (
	id serial primary key,
	email varchar(200),
	name varchar(300),
	class varchar(100)
);
```

## Inserindo na tabela de players
```
insert into players (email, name, class) values ('newton.alle@gmail.com', 'Newton Alle', 'archer')
```

## Selecionando na tabela de players
```
select * from players
```

## Alterando a tabela de players
```
update players set name = 'Newtinho' where id = 1
```

## Criando tabela de batalhas
```
create table player_battles (
	id_player_1 serial not null,
	id_player_2 serial not null,
	id_winner serial not null,
	foreign key (id_player_1) references players (id),
	foreign key (id_player_2) references players (id),
	foreign key (id_winner) references players (id)
)

insert into player_battles (id_player_1, id_player_2, id_winner) values (3, 2, 2)

select p1.email as player_1_email, p2.email as player_2_email from player_battles pb
inner join players p1
on pb.id_player_1 = p1.id
inner join players p2
on pb.id_player_2 = p2.id
```

# Para inciar o banco
Para ver se o banco ta rodando ainda:
```
docker ps
```
Se aparecer o postgres, ele ta rodando.

Se não tiver rodando
```
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:14.2
```


# Lições
## 2022-04-03
 * ✓ Criar o player com as propriedades (validadas com Joi):
    * Name
    * Class (deve ser 'mage', 'warrior' ou 'archer')
    * Attributes (objeto com strength, inteligence e dexterity)
* ✓ Endpoint de create player, deve criar um id para o jogador
    * Sugestão: Usar uma variável `currentId` que vai sendo aumentada quando um player é criado
* ✓ Endpoint de listar deve listar todos players, porém retornando apenas:
    * Name
    * Class
* ✓ Criar novo endpoint GET player que retorna todos os dados do player, recebendo o id
* ✓ Criar endpoint DELETE player que deleta um player, recebendo o id
* ✓ Criar endpoint PUT player que altera dados do jogador, recebendo o id na rota e os dados novos no body json

## 2022-04-10
* ✓ Criar um middleware que autentique o usuário usando o cabeçalho
* ✓ Criar um middleware de validação de dados com o Joi https://dev.to/tayfunakgc/middleware-based-joi-validation-in-expressjs-2po5


## 2022-04-10
* ✓ Checkar se o email é unico na edição de usuário no repository (checkIfEmailIsAvailable)
* No banco de dados:
    * ✓ Criar tabelas para bairro, cidade, estado e país
        * ✓ Cada bairro tem: id, nome, id_cidade
        * ✓ Cada cidade tem: id, nome, id_estado
        * ✓ Cada estado tem: id, nome, id_pais
        * ✓ Cada país tem: id, nome
    * ✓ Inserir dados de mentira (escreve os insert aqui e salvar)
    * Fazer as consultas:
        * ✓ Listar todos bairros
        * ✓ Listar todos os bairros filtrando nome
        * Fazer uma consulta que retorna:
            * Nome do bairro
            * Nome da cidade
            * Nome do estado
            * Nome do país
## 2022-04-10
* Ligar todos os endpoints ao banco de dados
 * ✓ Create **Feito a parte**
 * ✓ List
 * ✓ Get
 * ✓ Delete
 * ✓ Put **Attributes a ser feito** **Verificação de NULL a ser feita**
 * ✓ Me

Declaração/criação de tabela (bairro):

            ```
CREATE TABLE districts (
    id serial PRIMARY KEY,
    name varchar(200),
    city_id integer
)
            ```

Declaração/criação de tabela (cidade):

            ```
CREATE TABLE cities (
    id serial PRIMARY KEY,
    name varchar(200),
    state_id integer
)
            ```

Declaração/criação de tabela (estado):

            ```
CREATE TABLE states (
    id serial PRIMARY KEY,
    name varchar(200),
    country_id integer
)
            ```

Declaração/criação de tabela (país):

            ```
CREATE TABLE countries (
    id serial PRIMARY KEY,
    name varchar(200)
)
            ```

Inserindo item (bairro):

            ```
insert into districts (name, city_id) values ('Bairro da Tijuca', 1)
            ```

            ```
insert into districts (name, city_id) values ('Centro', 1)
            ```

Inserindo item (cidade):

            ```
insert into cities (name, state_id) values ('Campinas', 1)
            ```

Inserindo item (estado):

            ```
insert into states (name, country_id) values ('Sao Paulo', 1)
            ```

Inserindo item (país):

            ```
insert into countries (name) values ('Brasil')
            ```

Listando bairros:

            ```
select * from districts
            ``` 

Só nome:

            ```
select name from districts
            ``` 

Filtrar por nome (Centro):

            ```
select * from districts where name = 'Centro'
            ``` 

Listando parentes do bairro e o bairro (Só nome):

            ```
select districts.name as district_name, cities.name as city_name, states.name as state_name, countries.name as country_name from districts, cities, states, countries where districts.city_id = cities.id and cities.state_id = states.id and states.country_id = countries.id;

select
	districts.name as district_name,
	cities.name as city_name,
	states.name as state_name,
	countries.name as country_name
from districts
inner join cities
on districts.city_id = cities.id
inner join states
on cities.state_id = states.id 
inner join countries
on states.country_id  = countries.id;
            ``` 

tipos de join
```
https://www.w3resource.com/PostgreSQL/postgresql-full-outer-join.php#:~:text=PostgreSQL%20FULL%20OUTER%20JOIN%20returns,sides%20of%20the%20join%20clause.
```


group by
```
create table notas (
	id_nota serial primary key,
	aluno varchar(100),
	materia varchar(100),
	id_prova int,
	nota float
)

insert into notas (aluno, materia, id_prova, nota) values
('Newton', 'Matematica', 1, 7.0),
('Newton', 'Matematica', 2, 5.0),
('Newton', 'Matematica', 3, 10.0),
('Newton', 'Ed. Fisica', 1, 10.0),
('Newton', 'Ed. Fisica', 2, 9.5),
('Newton', 'Ed. Fisica', 3, 10.0),
('PC', 'Matematica', 1, 3.0),
('PC', 'Matematica', 2, 9.5),
('PC', 'Matematica', 3, 4.5),
('PC', 'Ed. Fisico', 1, 10.0),
('PC', 'Ed. Fisico', 2, 10.0),
('PC', 'Ed. Fisico', 3, 10.0);


select * from
(select aluno, materia from notas) t



-- Gerr tabela com aluno, materia, menor nota, média, maior nota, S se passou e N se nao passou
select
	aluno,
	materia,
	nota_total / provas as media,
	menor_nota,
	maior_nota,
	case when (nota_total / provas) >= 7 then 'S' else 'N' end as passou
from
(select
	aluno,
	materia,
	count(distinct id_prova) as provas,
	sum(nota) as nota_total,
	min(nota) as menor_nota,
	max(nota) as maior_nota
from notas
group by aluno, materia
order by aluno desc, materia desc) t
```
