# Introduction

## Relational algebra

SQL implements relational algebra (https://en.wikipedia.org/wiki/Relational_algebra).
This sounds a lot more complicate than it is in practice.

A simple way to think about how SQL works as a datastore is to consider "sets" of data and how they relate to each other.
Often a "set" (or tuple) of data models a thing.
Things can often be modelled as classes in JAVA.

For example, `fruit` or `animals` may be classes.
The following might be classes and member variables (attributes) that model the thing:

- fruit
  - name
  - weight
  - color
  
- animal
  - name
  - age
  - species
  
## Tuples as rows

In SQL, tuples are represented as "rows".
Each row represents a different instance of a class.
A class, which acts as a template for instances (of tuples) is represented by a "table".

E.g. In the "fruits" table, the following two rows might represent two different fruits:
- banana, 300, yellow
- coconut, 200, brown

SQL allows us to `select` out a row based on criteria.
E.g. `SELECT * FROM fruit WHERE color='yellow'` might return the "banana" row.

The selection operators give you what you might expect for mathematical comparisons.

## Relationships between tables

Just like different JAVA classes can be related to each other, different SQL tables can be related to each other.
For example, a farm might grow different fruits.
In JAVA, the `farm` class might contain the following attributes:

- farm
  - address
  - owner
  - < list of fruit grown >

This suggests the following relationship structure:

- farm (a thing)
  - owner
  - address
  
- farm_grows (a relationship between a farm and a fruit)
  - owner
  - fruit_name

Assuming that every farm has a unique owner, this structure allows us to _not_ store the fruit's weight and color if we also assume that all fruit of the same type have the same weight and color.

To get the full list of relationships between farms and fruits, we can `join` the three tables together:

`farm` `JOIN` to `farm_grows` on the `owner` field

and further `JOIN`ed to `fruit` on the `fruit_name` field.

This is represented in SQL as:
```
farm
INNER JOIN farm_grows ON farm.owner = farm_grows.owner
INNER JOIN fruit ON farm_grows.fruit_name = fruit.name
```

We specify an `inner` join to distinguish from other types of joins which are available in SQL.

# Practice

We can practice the `select` and `join` concepts on the "shakespeare" database.
Load the `shakespeare_demo` database and use `pgweb` to write queries.

An example of what the relationships look like in a more end-user-friendly form: http://www.opensourceshakespeare.org/views/plays/playmenu.php?WorkID=macbeth .

## Select

We can view all chapters in all of Shakespeare's works by running:
```
SELECT * FROM chapter
```

If we only wanted the chapters in macbeth, we could run
```
SELECT * FROM chapter
WHERE workid = 'macbeth'
```

And if we wanted to narrow down the set of results to only Act 1, we could run
```
SELECT * FROM chapter
WHERE workid = 'macbeth' AND section = 1
```

### Exercises

What could you run to get
- a list of `work`s that were written after the year `1600`?
- a list of `character`s who speak (`speechcount`) more than `200` times?

What other queries can you run?

## Join

What if you wanted to list all the characters in Macbeth?

The `character_work` table links `character`s to the `work`s they appear in.
We can `JOIN` the `character` table to the `work` table through the `character_work` table:
```
SELECT work.*, "character".*
FROM work
INNER JOIN character_work ON work.workid = character_work.workid
INNER JOIN "character" ON "character".charid = character_work.charid
```

Note that the `character` table needs to be escaped using double quotes to `"character"` because `character` is also a keyword in postgres.

We can filter these results, just like we did in the `select` section with the `where` clause:
```
SELECT work.*, "character".*
FROM work
INNER JOIN character_work ON work.workid = character_work.workid
INNER JOIN "character" ON "character".charid = character_work.charid
WHERE work.title = 'Macbeth'
```

Note that we specify e.g. `work.title` just in case there was a `title` field in more than one of the tables we queried against.
We also matched the `title` to `Macbeth` instead of using the `workid` field directly.

The `workid` field is a `key` field.
In this database, it has an intuitive symbol, but in other databases, the key field is often a number.

### Exercises

What could you run to get
- a list of characters for `Romeo and Juliet`
- a list of chapters for `Taming of the Shrew`

What other queries can you run?

## Notes

In postgres:
- Strings are single-quoted
- Identifiers (including table and field names) are double-quoted

if you have time after running through the shakespeare database, try playing with the northwind database.
The relationship diagram for that database may be found at https://github.com/pthom/northwind_psql .