# node-red-contrib-fitbit

<a href="http://nodered.org" target="_new">Node-RED</a> nodes that gets information from Fitbit

Install
-------

Run the following command in the root directory of your Node-RED install

        npm install node-red-node-fitbit

Configure
---------
When creating a configuration for Fitbit you will need to create an app on dev.fitbit.com with the following settings:
- Callback Url: https://<YOUR-NODE-RED-SERVER>/fitbit-credentials/auth/callback
  - Please note the URL **must be HTTPS** (self-signed SSL works).
- OAuth 2.0 Application Type: Server
      
Other settings are up to you.

Usage
-----

One node that gets reports from <a href="http://www.fitbit.com" target="_new">Fitbit</a>.

### Query node

Fitbit query node supports several endpoints
- Get Body Fat Logs
- Get Body Time Series
- Get Daily Activity Summary
- Get Activity Time Series
- Get Daily Food/Water Summary
- Get Food/Water Time Series
- Get Sleep Logs
- Get Devices information
- Log activity
- Delete activity
- Log food
- Delete log food

Depending on the endpoint selected the node will allow different inputs to filter the fitbit query.

### Note
Node-RED does not currently have a way to update credential data at runtime. App credentials are stored with 
other credentails but OAuth2 tokens are saved to disk.
