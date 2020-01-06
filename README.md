# node-red-contrib-fitbit

<a href="http://nodered.org" target="_new">Node-RED</a> nodes that gets information from Fitbit

Install
-------

Run the following command in the root directory of your Node-RED install

        npm install node-red-node-fitbit

Usage
-----

One node that gets reports from <a href="http://www.fitbit.com" target="_new">Fitbit</a>.

### Query node

Fitbit query node supports several endpoints
- Get Body Fat Logs
- Get Body Time Series
- Get Daily Activity Summary
- Get Sleep Logs

Depending on the endpoint selected the node will allow different inputs to filter the fitbit query.

### Note
Node-RED does not currently have a way to update credential data at runtime. App credentials are stored with 
other credentails but OAuth2 tokens are saved to disk.
