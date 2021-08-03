# Dev Setup
1. Set node version to supported v12.x `nvm install v12.22.4 && nvm use v12.22.4`
2. Init a new npm project for node-red work `npm init`
3. Add a start command for local node-red to *package.json* `"start": "node-red -u . -v"`
3. Install node-red as a local module `npm install node-red`
4. Install *node-red-contrib-fitbit* project for development `git clone git@github.com:JustinThorReid/node-red-contrib-fitbit.git`
5. Add local node red module to local node red instance `npm install ./node-red-contrib-fitbit/`
6. Start node-red `npm start`
