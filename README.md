# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run start-https`

Before run in https mode need to do a few things.

#### Step 1: Install mkcert
##### # macOS
`brew install mkcert`

##### # Windows
`choco install mkcert`

#### Step 2: Install nss
`brew install nss`

#### Step 3: Generate the certificate
`mkcert localhost`

#### Step 4:
This command generates the following files:
```
localhost-key.pem
localhost.pem
rootCA-key.pem
rootCA.pem
```

You should see the following output in the terminal:
```
Created a new local CA
Note: the local CA is not installed in the system trust store.
Run "mkcert -install" for certificates to be trusted automatically

Created a new certificate valid for the following names
 - "localhost"

The certificate is at "./localhost.pem" and the key at "./localhost-key.pem"

It will expire on 28 September 2023
```

Then, to trust the certificate, run the following command:

`mkcert -install`

You should see the following output in the terminal:

```
The local CA is now installed in the system trust store!
```

#### Step 4: Configure webpack-dev-server

Add the following `https` property to the `devServer` object in the webpack configuration:

```
https: {
  key: "localhost-key.pem",
  cert: "localhost.pem"
},
```

Edit start command:
```
webpack serve --config ./webpack.config.js --mode development --https --key localhost-key.pem --cert localhost.pem
```

### Step5: Run sev server

Run in terminal

```npm run start-https```

##### Notes: 
```
You may see the CORS error in browser console. Then you should install and activate a browser extension for CORS disabling.
```

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\

