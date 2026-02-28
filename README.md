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