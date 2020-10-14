# Server

## Criando base do projeto

* Iniciar aplicação

  ```bash
  yarn init -y
  ```

* Instalar dependências
  * express: ```yarn add express```
  * @types/express: ```yarn add @types/express -D```
  * ts-node: ```yarn add ts-node -D```
  * ts-node-dev: ```yarn add ts-node-dev -D``` (Fica observando alterações em ambiente de desenvolvimento)
  * typescript: ```yarn add typescript -D```

* Criar atalho de execução do server

  ```json
  "start": "ts-node-dev --transpile-only --ignore-watch node_modules --respawn src/server.ts"
  ```

  * ```--transpile-only```: O Typescript só irá transpilar o código, e não mostrar os erros no terminal (O VSCode já faz isso)
  * ```--ignore-watch```: Ignora uma determinada pasta

## Configurando Banco de Dados

Há três formas de lidar com banco de dados dentro de uma aplicação no backend

* Driver Nativo: Permite executar as queries do banco de dados diretamente pelo node, mas não oferece nenhum tipo de abstração, ou seja, as queries teriam que ser criadas utilizando SQL puro.
  * Exemplo: [SQLite 3](https://www.sqlite.org/index.html)

* Query Builder: As queries são escritas com JavaScript. Nada mais é que um construtor de queries.
  * Exemplo: [Knex](http://knexjs.org/)

* ORM (Object Relational Mapping): Uma classe simboliza uma tabela no banco de dados. Basicamente é uma forma de relacionar objetos/instâncias com as tabelas do banco de dados.
  * Exemplo: [TypeORM](https://typeorm.io/#/)

### Configurando TypeORM

```js
// raiz do projeto
{
  "type": "sqlite",
  "database": "./src/database/database.sqlite",
  "migrations": [
    "./src/database/migrations/*.ts" // Onde estão localizados os arquivos de Migrations
  ],
  "entities": [
    "./src/models/*.ts" // Pasta onde ficam as entidades da aplicação
  ],
  "cli": {
    "migrationsDir": "./src/database/migrations" // O diretório onde o TypeORM deve criar novas migrations
  }
}
```

```ts
// src/database/connection.ts
import { createConnection } from 'typeorm'

createConnection()
```

```ts
// src/server.ts
import express from 'express'

import './database/connection' // Importar connection

const app = express()

app.use(express.json())
```

## Migrations

As migrations permitem você fazer um controle de versão do seu banco de dados. Ajuda muito quando um projeto envolve mais de um desenvolvedor.

**OBS:** Como o TypeORM não roda com o Typescript, eu tenho que fazer essa configuração no package.json:

```json
"typeorm": "ts-node-dev ./node_modules/typeorm/cli.js"
```

### Comando para criar migrations

```bash
 yarn typeorm migration:create -n nome_migration
```

* create_orphanages

```ts
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createOrphanages1602670854718 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'orphanages',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true, // Não pode ser negativo
          isPrimary: true, // Indicará que é a primaryKey
          isGenerated: true, // Será gerada automaticamente
          generationStrategy: 'increment' // Será gerada utilizando uma lógica incremental
        },
        {
          name: 'name',
          type: 'varchar'
        },
        {
          name: 'latitude',
          type: 'decimal',
          scale: 10, // Números depois da vírgula
          precision: 2 // Números antes da vírgula
        },
        {
          name: 'longitude',
          type: 'decimal',
          scale: 10, // Números depois da vírgula
          precision: 2 // Números antes da vírgula
        },
        {
          name: 'about',
          type: 'text'
        },
        {
          name: 'instructions',
          type: 'text'
        },
        {
          name: 'opening_hours',
          type: 'varchar',
        },
        {
          name: 'open_on_weekends',
          type: 'boolean',
          default: false
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('orphanages')
  }
}

```

### Comando para executar migrations

```bash
 yarn typeorm migration:run
```

### Comando para reverter migrations

```bash
 yarn typeorm migration:revert
```
