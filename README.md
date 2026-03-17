uhh, we are doing a simple app where user can signup, signin, then create some blog post and post them with time stamp

docker container for local testing:
```
docker run --name blogging \
  -e POSTGRES_USER=blog_user \
  -e POSTGRES_PASSWORD=blog_password \
  -e POSTGRES_DB=blog_db \
  -p 5432:5432 \
  -d postgres:16
```

so was asked on what issue i had in the codebase
how i solved it, found it throug logs, the token was not generated correctly

catch all route was asked

then dynamic routes we were asked:
my fumbles:

i had a function isAuthenticated it was true evertime hence the problem for authentication

problem 2: [see here](./app/[id]/page.tsx)
chastised for ui{said couldn;t do it had some commitments}

then was talked on react, that we nailed
what to do on component mounting i said

fumbled about useReducer

then we were asked on our contributions, so we talked through that also
auto close issue

only thing i fumbled was this params thing