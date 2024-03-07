# @loxjs/pg

`@loxjs/pg` is a Node.js module that provides a set of utilities for interacting with PostgreSQL databases. It simplifies the process of connecting to a database, executing queries, managing transactions, and performing common operations such as insertions, updates, and deletions.

## Installation

```sh
npm install @loxjs/pg
```

Or with yarn:

```sh
yarn add @loxjs/pg
```

## Usage

Before using the module, you need to set up a PostgreSQL database and gather your connection parameters.

### Basic Setup

Start by requiring the module and creating a client with your PostgreSQL configuration.

```
const createClient = require('@loxjs/pg');

const dbConfig = {
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
};

const db = createClient(dbConfig);
```

### Querying

Execute a query using the `query` method.

```
// Query example
db.query({
  text: 'SELECT * FROM my_table WHERE id = \$1',
  values: [1],
}).then(result => {
  console.log(result.data); // Outputs the rows returned by the query
}).catch(err => {
  console.error(err);
});
```

### Inserting a Single Record

Use the `insertOne` method to insert a single record into a table.

```
// Insert one example
const tableName = 'my_table';
const data = { column1: 'value1', column2: 'value2' };

db.insertOne(tableName, data, { returning: '*' }).then(result => {
  console.log(result.data); // Outputs the inserted row
}).catch(err => {
  console.error(err);
});
```

### Inserting Multiple Records

Use the `insert` method to insert multiple records into a table.

```
// Insert multiple records example
const tableName = 'my_table';
const records = [
  { column1: 'value1', column2: 'value2' },
  { column1: 'value3', column2: 'value4' }
];

db.insert(tableName, records, { returning: '*' }).then(result => {
  console.log(result.data); // Outputs the inserted rows
}).catch(err => {
  console.error(err);
});
```

### Transactions

Perform a transaction using the `transaction` method.

```
// Transaction example
db.transaction(async (client) => {
  await client.query({ text: 'INSERT INTO my_table (column1) VALUES (\$1)', values: ['value1'] });
  await client.query({ text: 'UPDATE my_table SET column2 = \$1 WHERE id = \$2', values: ['value2', 1] });
}).then(() => {
  console.log('Transaction completed successfully');
}).catch(err => {
  console.error('Transaction failed', err);
});
```

### Count Records

Count the number of records matching a condition with the `count` method.

```
// Count example
db.count({ text: 'SELECT COUNT(*) FROM my_table WHERE column1 = \$1', values: ['value1'] }).then(count => {
  console.log(count); // Outputs the count
}).catch(err => {
  console.error(err);
});
```

### Check Existence of Records

Check if any records exist that match a condition using the `exist` method.

```
// Exist example
db.exist({ text: 'SELECT COUNT(*) FROM my_table WHERE column1 = \$1', values: ['value1'] }).then(exists => {
  console.log(exists); // Outputs true if exists, false otherwise
}).catch(err => {
  console.error(err);
});
```

### Find One Record

Retrieve a single record with the `findOne` method.

```
// Find one example
db.findOne({ text: 'SELECT * FROM my_table WHERE id = \$1', values: [1] }).then(record => {
  console.log(record); // Outputs the record or undefined
}).catch(err => {
  console.error(err);
});
```

### Pool Statistics

Retrieve pool statistics using `totalCount`, `idleCount`, and `waitingCount`.

```
// Pool statistics example
console.log(db.totalCount()); // Outputs total number of clients in the pool
console.log(db.idleCount()); // Outputs number of idle clients in the pool
console.log(db.waitingCount()); // Outputs number of clients waiting for a connection
```

### Event Listeners

Attach an event listener to the pool with the `on` method.

```
// Event listener example
db.on(['error', (err, client) => {
  console.error('Unexpected error on idle client', err);
}]);
```

### Managing Schema

The module also provides methods to manage database schema, such as `TABLES`, `TABLE.addColumns`, `TABLE.dropColumn`, `TABLE.getColumns`, `VIEW.create`, `VIEW.drop`, `TRIGGER.drop`, `FUNCTION.drop`, and `INDEX.drop`.

```
// Get all tables example
db.tables().then(tables => {
  console.log(tables); // Outputs a list of table names
}).catch(err => {
  console.error(err);
});
```

## API

The module exports a function that returns a client object with the following methods:

- `query(options)`: Executes a query with the specified options.
- `transaction(callback)`: Executes a transaction using the provided callback function.
- `insertOne(tableName, data, options)`: Inserts a single record into the specified table.
- `insert(tableName, data, options)`: Inserts multiple records into the specified table.
- `count(options)`: Counts the number of records that match the query options.
- `exist(options)`: Checks if any records exist that match the query options.
- `findOne(options)`: Finds a single record that matches the query options.
- `totalCount()`: Gets the total count of clients in the pool.
- `idleCount()`: Gets the count of idle clients in the pool.
- `waitingCount()`: Gets the count of clients waiting for a connection.
- `on(options)`: Attaches an event listener to the pool.