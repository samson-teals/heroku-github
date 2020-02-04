# Creating and Altering tables

So far, we've looked at how to query and manipulate data in existing tables.
It turns out that you can also query and manipulate tables themselves.
You can:
- query the fields in each table
- create fields
- create tables

## Querying `information_schema`

Some database expose a "reflection" mechanism to allow you to query the structure of tables and fields.
This is sometimes implemented as an `information_schema` table.

For example, the following query returns information on properties of all the fields in all the tables in the `public` schema.

```
SELECT *
FROM information_schema.columns
WHERE table_schema = 'public'
```

## Creating tables

Arbitrary tables may be created with fields and types.
Fields can have constraints on them, and some databases (including postgres) implement field constraints as table constraints.

The following creates a key-value table which can be used to associate two strings:

```
CREATE TABLE kv (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
)
```

You can immediately `select` from the new `kv` table and see that it is empty:

```
SELECT * FROM kv
```

Notice that the `key` field has a `PRIMARY KEY` constraint: this means that each `key` value must be unique; the database enforces this uniqueness by rejecting any operations that would cause two `key`s to take on the same value.

The `value` field has a `NOT NULL` constraint: this means that a `value` must always be provided for every row in the `kv` table.

#### Inserting values into the new table

To review, you can insert values into the new `kv` table.

```
INSERT INTO kv (key, value) VALUES
  ('abc', '123'),
  ('def', '456')
```

But because of the `PRIMARY KEY` constraint on the `key` field, the following query will _not_ work:

```
INSERT INTO kv (key, value) VALUES
  ('abc', '1234')
```

Likewise, the following queries will not work because of the `NOT NULL` constraint on the `value` field:

```
INSERT INTO kv (key, value) VALUES
  ('ghi', NULL);

INSERT INTO kv (key) VALUES
  ('jkl');
```

### Initializing a table from a `select`

You can also create a new table by initializing the new table with the result of an existing query:

```
CREATE TABLE kv2 AS
SELECT * FROM kv
WHERE key = 'abc'
```

## Modifying tables

SQL databases allow modifications existing tables.
You can find documentation for postgres at https://www.postgresql.org/docs/9.5/ddl-alter.html.

### Adding fields

New fields may be added to existing tables by using the `ALTER TABLE` command,
The following will adding an `ordering` field to the new `kv2` table.

```
ALTER TABLE kv2
  ADD COLUMN ordering INTEGER
```

Because the `ordering ` field has no constraints and no default value, the default value is set to `NULL`.
The result is a new column with the value `NULL`.

### Dropping fields

The new field may be deleted by using another `ALTER TABLE`:

```
ALTER TABLE kv2 
  DROP COLUMN ordering
```

## Deleting tables

To delete the tables we've just created, you can:

```
DROP TABLE kv
```

`DROP TABLE` often has an `IF EXISTS` qualifier to make it easier to drop tables only if they exist.

```
DROP TABLE IF EXISTS kv;
DROP TABLE IF EXISTS kv2;
```

You can run the `IF EXISTS` form of `DROP TABLE` as many times as you want and it will not throw an error.
However, `DROP` table (without `IF EXISTS`) can only be run once: the next time will result in an error.

# Exercises

Try to do the following using the above discussion as an example:
- Create a new table `student` with the following fields:
  - `student_number` of type `INTEGER` with the `PRIMARY KEY` constraint
  - `home_room` of type `TEXT` with the `NOT NULL` constraint
  - `name` of type `TEXT` with the `NOT NULL` constraint
  - `initial` of type `TEXT` with no constraints
- Add a new field:
  - `address` of type `TEXT` with the `NOT NULL` constraint
    - you will need to use the `DEFAULT` key word if there is already data in the `student `table
- Delete the following field:
  - `initial`
- Drop the new table you just created

Between each of the `ALTER TABLE` calls, try to `INSERT` records into the new table and `SELECT *` from the table to see what the table looks like.
