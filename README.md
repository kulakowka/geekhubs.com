# The project is in development

![Site screenshot](https://habrastorage.org/files/a78/b66/10d/a78b6610d33748c5ae256bfc7cfc5061.png)

#### Install:

```
git clone https://github.com/kulakowka/geekhubs.com.git
cd geekhubs.com
npm install 
```

#### Seed data:

```
npm run seed
```

Seed config: 

```
/seed/articles/index.js
/seed/comments/index.js
/seed/hubs/index.js
/seed/users/index.js
/seed/subscriptions/index.js
```

#### Development:

```
npm start
```

Open in your browser [http://localhost:3000](http://localhost:3000)

#### Production:

```
PORT=3000 NODE_ENV=production node ./bin/www --harmony
```

Start with pm2:
```
$ pm2 start start.json --env production
```

More info: 
- [Pm2 docs](http://pm2.keymetrics.io/docs/usage/application-declaration/)
- [pm2 quick start](http://pm2.keymetrics.io/docs/usage/quick-start/)

#### Tools for comfortable development
- [Robomongo](robomongo.org) - Shell-centric cross-platform MongoDB management tool

