# Lições
## 2022-04-03
 * Criar o player com as propriedades (validadas com Joi):
    * Name
    * Class (deve ser 'mage', 'warrior' ou 'archer')
    * Attributes (objeto com strength, inteligence e dexterity)
* Endpoint de create player, deve criar um id para o jogador
    * Sugestão: Usar uma variável `currentId` que vai sendo aumentada quando um player é criado
* Endpoint de listar deve listar todos players, porém retornando apenas:
    * Name
    * Class
* Criar novo endpoint GET player que retorna todos os dados do player, recebendo o id
* Criar endpoint DELETE player que deleta um player, recebendo o id
* Criar endpoint PUT player que altera dados do jogador, recebendo o id na rota e os dados novos no body json