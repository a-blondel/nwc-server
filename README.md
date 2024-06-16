# NWC / WFC / DWC Server

A replacement server for NWC. Useful when you need to change behavior of a service from nintendowifi.net (e.g. when POST naswii.nintendowifi.net/ac returns an error following a server shutdown but you need a success in order to access another game server).  

It is a bundle of two projects :
- https://github.com/shutterbug2000/wii-ssl-bug : SSL vulnerability explaination for Wii IOS version **before IOS37**
- https://github.com/barronwaffles/dwc_network_server_emulator : Implementation of many gamespy endpoints, I extracted the minimum required for my needs, you might find what you need there !

Two main purposes :
- Using it with https for the players without a modded Wii (I repeat, only for games using IOS < 37)
- Using it with http for the players with a modded Wii or Dolphin. It requires to patch the game to use http instead of https with a NoSSL patcher (available on some recently updated game loaders for the Wii, and for Dolphin you can use [WIT](https://wit.wiimm.de/wit/) with the `--http` arg to apply it to your game ISO but be warned that it also replaces the sub-domain 'naswii' to 'nas').

The only thing to do is to change the DNS setting of the Wii to this server in both cases.

## Supported games over HTTPS

Wii IOS version **IOS37 and above** won't work for sure. If your game use IOS below IOS37, then it should work, but it might need to support more endpoints.  
Also it won't work with Dolphin or a modded Wii, so the game has to be patched in order to use HTTP instead of HTTPS.

## Supported endpoints

- POST /ac
  - action 'login'
  - action 'svcloc'

For my needs nothing more is required as another server was used for my game (WFC was only a 'frontend connect'), but you might need to handle errors (e.g. keep a list of banned users to block access, etc).

## SSL key and certificate

In order to make the https version to work, you need a server key and certificate.  
In the `scripts` package you will find `nwc-ssl-cert.bat` dedicated to generate the server key and certificate.  
Once generated, put them in a `certs` folder at the root of the project.

Important notes :
- You will surely need to edit your `openssl.cnf` file to set `string_mask = default` (instead of utf8only) for some games to correctly read the certificate
- Some games won't be able to read certificates past 2050 (X509 certificate validity period is in `UTCTime` format until 2049, then starting from 2050 it's in `GeneralizedTime` format), but thankfully many games don't check the expiry date so you can use an expired date in UTF8STRING format and you'll be fine

## host file or DNS

Each route you need to forward to your server must be defined in your hosts file or DNS. E.g.  :
```
127.0.0.1 naswii.nintendowifi.net
127.0.0.1 nas.nintendowifi.net
```

## Start the project

### Using node

The project requires node version 0.10.33 to accept deprecated SSL protocols (SSLv2, SSLv3) and cipher suites (ECDHE-RSA-AES128-SHA).  
If you want to use a recent version of node, you must patch node and openssl to accept the deprecated SSL protocols and cipher suites.


Pull dependencies
```
npm install
```

Start in HTTP mode
```
npm run start-http
```

Start in HTTPS mode
```
npm run start-https
```

It runs on port 80 for HTTP and 443 for HTTPS.

### Using docker-compose

To run the servers in containers, you can use the provided docker-compose.  

First, make sure you have generated the server key and certificate, and moved them in a `certs` folder at the root of the project.  

The Dockerfile requires the `node:0.10.33-jessie` image that is hosted on GitHub Packages -so you don't need to build it yourself- but you need to authenticate with your GitHub account to pull the image (replace `USERNAME` with your GitHub username, generate a token at https://github.com/settings/tokens with the `read:packages` scope, and replace `$TOKEN` with the generated token) :
```
echo $TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

Then, you can build and start the server images (be sure to be on the project root folder) :
```
docker-compose up -d --build
```

## Credits

Contributors of the following GitHub projects :
- https://github.com/shutterbug2000/wii-ssl-bug
- https://github.com/barronwaffles/dwc_network_server_emulator
- https://github.com/Aim4kill/Bug_OldProtoSSL : automated script to generate the ssl key and certificate
