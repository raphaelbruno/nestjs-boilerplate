# Application API

API for remote medical report application.

## Get started

- ### Download dependencies

  ```
  npm install
  ```

- ### Environment

  Copy `.env.example` to `.env` and do the necessary changes.

  ```
  cp .env.example .env
  ```

- ### Docker

  If you want to use `docker` to test the application

  ```
  docker compose up -d
  ```

  Or only for development database (in this case, change `DATABASE_HOST` to `localhost` in your `.env` file)

  ```
  docker compose up -d db
  ```

- ### Migration

  To create all necessary structure use this command

  ```
  npx prisma migrate reset --force
  ```

  By using this command it will seed database as well, for convenience an user will be created with username `admin@localhost.net`, `manager@localhost.net` and `reader@localhost.net`, both with password `Pass@123`

- ### Run

  ```
  npm run start:dev
  ```

## Start to code

- ### Add permissions to enum into permission.enum.ts

  Insert your permissions into permission enum file `src/domain/models/enums/permission.enum.ts`

  ```js
  export enum PermissionKey {
    ...

    ItemRead = 'ITEM:READ',
    ItemCreate = 'ITEM:CREATE',
    ItemUpdate = 'ITEM:UPDATE',
    ItemDelete = 'ITEM:DELETE',
  }
  ```

- ### Create the migration for the new resource

  Add a model into `prisma/schema.prisma` and add the necessary relationship, let's try a resource called Item

  ```js
  model Users {
    ...
    Items     Items[]
    ...
  }

  model Items {
    id        Int       @id @default(autoincrement())
    title     String
    userId    Int       @map("user_id")
    createdAt DateTime  @default(now()) @map("created_at")
    updatedAt DateTime? @updatedAt @map("updated_at")
    deletedAt DateTime? @map("deleted_at")

    user      Users     @relation(fields: [userId], references: [id])

    @@map("items")
  }
  ```

  Run the new migration

  ```
  npx prisma migrate dev --name "create items table"
  ```

- ### Use Makefile to scaffold a complete resource

  ```
  make resource name=Item
  ```

- ### Add the new module into app.module.ts

  Insert your new resource module into imports of the file `src/app.module.ts`

  ```js
  @Module({
    imports: [
      ...,
      ItemsModule,
    ],
    ...
  })
  ```
