# Primary Keys

SQL supports adding primary keys to tables.
This has the effect of making the value in the primary key column unique.

In postgres, this can be done by creating an `UNIQUE INDEX` on a field.
This forces the values in the field to be unique and it also includes an index to make looking up values in that field fast.

Note that a table may have _many_ unique indexes, but usually only one is treated as a primary key.
In the shakespeare example tables, each will only have one unique index.

For example, this is the statement used to create a primary key on the `work` table in the shakespeare database (and this should already be done for you in your example db):

```
CREATE UNIQUE INDEX work_pkey ON public.work USING btree (workid)
```

You can find this in pgweb's `Indexes` tab.
Similarly, other tables also have primary keys.
This is because the primary key was defined in the database dump when you imported it.

Similarly, if you switch to the `Constraints` tab, you can see the `PRIMARY KEY` definition itself.

One primary key to note is in the `character_work` table.
This is a compound key because it is composed of (`charid`, `workid`).

```
CREATE UNIQUE INDEX character_work_pkey ON public.character_work USING btree (charid, workid)
```

This has the following primary key definition:

```
PRIMARY KEY (charid, workid)
```

## Using the `SERIAL` data type

The `SERIAL` data type is postgres' way of supporting an automatically incrementing unique key field in a table.
This is often used as a primary key.
Other database packages also implement this functionality, but the syntax to do that may be different.
For example, mysql implements an `AUTOINCREMENT` flag on a field.

Try creating the following table:

```
CREATE TABLE kv (
  key   SERIAL PRIMARY KEY,
  value TEXT NOT NULL
)
```

Now try inserting values into the `kv` table.
Note that you do _not_ need to include a value for the `key` field, but a value will be populated for you.

```
INSERT INTO kv (value) VALUES
  ('abc')
```

In fact, if you run the `INSERT` query a few times, you will get many `key`s associated with the value `abc`.

## Postgres Documentation

See https://www.postgresql.org/docs/9.1/sql-altertable.html for official documentation.

Note that the `USING btree` parts in the above examples is optional, and is used to specify an indexing strategy.

# Foreign Keys

A Foreign key connects a key field in one table with a key field in another table.
Usually, a foreign key is connected to a primary key.

For example, the `chapter` table has the following foreign key connected to the `work` table:

```
FOREIGN KEY (workid) REFERENCES work(workid)
```

The foreign key relationship may be used to prevent the foreign key field from being changed independently from the primary key.
Or, in general, it is used to prevent values in the foreign key field from taking on any values that are _not_ in the primary key field it is linked to.

For example, the following query will fail because `macbeth2` is not a value in the `work.workid` field.

```
UPDATE chapter
SET workid = 'macbeth2'
WHERE workid = 'macbeth'
```

Likewise, the related query on the `work` table also fails because it would result in violating a key constraint:

```
UPDATE work
SET workid = 'macbeth2'
WHERE workid = 'macbeth'
```

## Cascades

SQL databases usually implement a cascade feature to allow updates and deletes to automatically resolve when presented with an example like the above query that updates a primary key.

For example, if the foreign key definition of _all_ the constraints that reference the `work.workid` field were changed to cascade an update, the query to update `work.workid` from `macbeth` to `macbeth2` would suceed.

```
ALTER TABLE chapter DROP CONSTRAINT chapter_workid_fkey;
ALTER TABLE chapter ADD CONSTRAINT chapter_workid_fkey FOREIGN KEY (workid) REFERENCES work(workid) ON UPDATE CASCADE;

ALTER TABLE character_work DROP CONSTRAINT character_work_workid_fkey;
ALTER TABLE character_work ADD CONSTRAINT character_work_workid_fkey FOREIGN KEY (workid) REFERENCES work(workid) ON UPDATE CASCADE;
```

Then updating `work.workid` would succeed:

```
UPDATE work
SET workid = 'macbeth2'
WHERE workid = 'macbeth'
```

This affects not only the `work` table, but any foreign key into the `work` table: all the `macbeth` values in `character.workid` and `character_work.workid` have also been updated.

You can also create a foreign key in a table creation statement:

```
CREATE TABLE kvx ( 
  fkey INTEGER REFERENCES kv(key) ON UPDATE CASCADE, 
  valuex TEXT 
)
```

# Exercises

- Create a new table with a foreign key into the `kv` table
  - try both `ON UPDATE CASCADE` and `ON DELETE CASCADE` on your table's foreign key into `kv.key`
  - try updating a `key` value in the `kv` table
  - try deleting a `key` value in the `kv` table

## Data modelling

If you have time (or next class), think about a system of tables that can model a school's database including:
- students
- teachers
- courses
- grades
- any other tables you can think of

What fields would go in those tables, and what would be the primary and foreign key relationships?

What would the database look like for the BC education system if the province wanted to track things across multiple schools?

## Working with your data model

"Test" your model by adding some data into your tables and running a few joins to see what you get. e.g.
- list all the grades for a student
- list all the courses taught by a teacher
- list all the students taught by a teacher
- list all the grades assigned by a teacher

Once you've extended your data model to include multiple schools:
- list all the grades given in a school

If you're feeling adventurous, look into SQL aggregate operations such as count, sum, and avg (and more) and see what you can do with it.
You may want to use these aggregate operations with `GROUP BY`.

For example, write queries to discover
- which teachers give the highest average grades
- which courses do students get the highest average grades in
- which schools give the highest average grades

You may need to modify your data model to include year:
- how do grades in a course compare over a set of years
- how consistent are teachers from year to year (e.g. use `STDDEV`)
