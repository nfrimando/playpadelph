# Play Padel PH

### How to Add an Admin

1. Go to your Supabase project dashboard.
2. Open the SQL editor or Table editor.

3. To promote a user to admin, run the following SQL (replace `<USER_UID>` with the user's UID from the `users` table in the **Authentication** tab of Supabase):

```sql
update profiles set role = 'admin' where id = '<USER_UID>';
```

4. The user will now have the `admin` role in your application.

**Note:** Only `user` and `admin` are valid values for the `role` column due to the check constraint.
