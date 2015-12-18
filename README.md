# The project is in development :octocat:

![Site screenshot](https://habrastorage.org/files/a78/b66/10d/a78b6610d33748c5ae256bfc7cfc5061.png)

#### Install:

You must have installed and running [MongoDB](https://www.mongodb.org/) database before you run the application.

```
git clone https://github.com/kulakowka/geekhubs.com.git
cd geekhubs.com
npm install 
```

## Seed data:

#### Attention! :point_up::guardsman: 


> The script will drop database before you start :bomb::bomb::bomb:


Seed script help:
```
node seed -h
```

#### Seed data with default settings:

In order to fill your project with fake data, run this command in console.
```
node seed
```
Or with npm:
```
npm run seed
```

#### Seed data with custom settings:
```
node seed -U 5 -S 10 -H 10 -C 100 -A 30
```
Or full arguments names:
```
node seed --users 5 --subscriptions 10 --hubs 10 --comments 100 --articles 30
```

#### Admin user

The generator will give you a user with administrative privileges.

Username: **admin**

Password: **pass**

## Run application:

#### Development

In order to start application in `development` mode, run this command in console.
```
npm start
```

Now, open in your browser [http://localhost:3000](http://localhost:3000)

#### Production:

In order to start application in `production` mode, run this command in console.
```
PORT=3000 NODE_ENV=production node ./bin/www --harmony
```

Or start with pm2:
```
$ pm2 start ecosystem.json --env production
```

More info about pm2: 
- [Pm2 docs](http://pm2.keymetrics.io/docs/usage/application-declaration/)
- [pm2 quick start](http://pm2.keymetrics.io/docs/usage/quick-start/)

#### Tools for comfortable development
- [Robomongo](robomongo.org) - Shell-centric cross-platform MongoDB management tool

