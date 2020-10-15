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

---

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

---

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

* create_images

```ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createImages1602754209772 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'images',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true, // Não pode ser negativo
          isPrimary: true, // Indicará que é a primaryKey
          isGenerated: true, // Será gerada automaticamente
          generationStrategy: 'increment', // Será gerada utilizando uma lógica incremental
        },
        {
          name: 'path',
          type: 'varchar',
        },
        {
          name: 'orphanage_id',
          type: 'integer',
        },
      ],
      foreignKeys: [
        {
          name: 'ImageOrphanage',
          columnNames: ['orphanage_id'],
          referencedTableName: 'orphanages',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE', // Se o id de orfanato for mudado, então é mudado aqui também
          onDelete: 'CASCADE', // Caso o orfanato seja deletado, então as imagens também serão
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images');
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

---

## Upload de imagens

Instalar a biblioteca ```multer```

```bash
yarn add multer
yarn add @types/multer -D
```

Configurar o multer

```ts
// src/config/upload.ts
import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (request, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;

      cb(null, fileName);
    },
  }),
};

```

```ts
// src/routes
import multer from 'multer';
import uploadConfig from './config/upload';

const upload = multer(uploadConfig);

routes.post('/orphanages', upload.array('images'), OrphanageController.create);
```

---

## Trabalhando com Views

As Views vão determinar como os dados ficarão disponíveis para o meu Frontend

* OrphanageView

```ts
// src/views/OrphanageView

import Orphanage from '../models/Orphanage';
import ImageView from './ImageView';

class OrphanageView {
  render(orphanage: Orphanage) {
    return {
      id: orphanage.id,
      name: orphanage.name,
      latitude: orphanage.latitude,
      longitude: orphanage.longitude,
      about: orphanage.about,
      instructions: orphanage.instructions,
      opening_hours: orphanage.opening_hours,
      open_on_weekends: orphanage.open_on_weekends,
      images: ImageView.renderMany(orphanage.images),
    };
  }

  renderMany(orphanages: Orphanage[]) {
    return orphanages.map((orphanage) => this.render(orphanage));
  }
}

export default new OrphanageView();
```

* ImageView

```ts
import Image from '../models/Image';

class ImageView {
  render(image: Image) {
    return {
      id: image.id,
      url: `http://localhost:3333/uploads/${image.path}`,
    };
  }

  renderMany(images: Image[]) {
    return images.map((image) => this.render(image));
  }
}

export default new ImageView();

```

Nos OrphanageController, fazer:

```ts
// método index()
return response.json(OrphanageView.renderMany(orphanages));
```

```ts
// método show()
return response.json(OrphanageView.render(orphanage));
```

---

## Lidando com exceções

* Instalar ```express-async-errors```

```bash
yarn add express-async-errors
```

```ts
// src/errors/handler.ts

import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error);

  return response.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;

```

```ts
// srv/server.ts
import 'express-async-errors';
import errorHandler from './errors/handler';
app.use(errorHandler);
```

---

## Validação dos dados

```ts
// método create() do OrphanagesController()

const schema = Yup.object().shape({
  name: Yup.string().required(),
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
  about: Yup.string().required().max(300),
  instructions: Yup.string().required(),
  opening_hours: Yup.string().required(),
  open_on_weekends: Yup.string().required(),
  images: Yup.array(Yup.object().shape({
    path: Yup.string().required(),
  })),
});

await schema.validate(data, {
  abortEarly: false, // Ele retorna todos os erros ao mesmo tempo, e não um de cada vez
});
```

```ts
// src/errors/handler.ts

import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

interface ValidationErrors {
  [key: string]: string[]
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (error instanceof ValidationError) {
    const errors: ValidationErrors = {};

    error.inner.forEach((err) => {
      errors[err.path] = err.errors;
    });

    return response.status(400).json({ message: 'Validation fails', errors });
  }

  console.error(error);

  return response.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;

```

---

## Adicionando CORS

O CORS define quais endereços externos vão ter acesso a nossa aplicação.

Instalar o módulo de cors

```bash
yarn add cors
yarn add @types/cors -D
```

Adicionar no server.ts

```ts
import cors from 'cors'
app.use(cors())
```
