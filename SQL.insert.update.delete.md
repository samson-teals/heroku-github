# Insert, Update, Delete

In addition to `select` statements where you can query data from the database, SQL also allows you to change data in the database.
These operations are subject to any table or field constraints (e.g., some a field can be defined as `not null` and force a non-null value to be provided).

## Insert

You can `insert` new rows into existing tables.

For example, if you happen to discover a lost work of Shakespeare, you may want to add a record to the set of all his works in the `work` table.

```
INSERT INTO work (workid, title, longtitle, year, genretype, source, totalwords, totalparagraphs)
VALUES ('lostwork', 'lost work', 'Shakespeare''s lost work', 2020, 'L', 'private', 2000, 10)
```

## Update

Existing rows may be updated.

For example, you may discover extra pages to the previous lost work you found, and so need to update the total number of words and paragraphs in the lost work.

```
UPDATE work
SET totalwords = 3000, totalparagraphs = 15
WHERE workid = 'lostwork'
```

# Delete

Existing rows may be deleted.

For example, the lost work you found may not actually be written by Shakespeare, so you may want to delete that work from the `work` table.

```
DELETE FROM work
WHERE workid = 'lostwork'
```

# Exercises

As additional exercises, try to
- insert more than one row at the same time (in the same insert statement)
- update more than one row in the same update statement without updating all the rows in your table
- delete more than one row in the same delete statement without deleting all the rows in your table

# Update-joins

You can update a field based on values from another table through a `JOIN`.

Here's the update-join we tried to do at the end of class.
It turns out that the mysql syntax we tried does not work in postgres (which is slightly different):

```
UPDATE work
SET year = character.speechcount
FROM character_work
INNER JOIN "character" ON "character".charid = character_work.charid
WHERE work.workid = character_work.workid AND
      work.title = 'Macbeth' AND character.charid = 'macbeth'
```

This example sets a `work`'s `year` to be equal to the character's `speechcount` (for whatever reason).

To restore the year for macbeth:

```
UPDATE work
SET year = 1605
WHERE work.workid = 'macbeth'
```
