# NWC / WFC / DWC Server

A replacement server for NWC. Useful when you need to change behavior of a service from nintendowifi.net (e.g. when POST naswii.nintendowifi.net/ac returns an error following a server shutdown but you need a success in order to access another game server).  

It is a bundle of two projects :
- https://github.com/shutterbug2000/wii-ssl-bug : SSL vulnerability explaination for Wii IOS version **before IOS37**
- https://github.com/barronwaffles/dwc_network_server_emulator : Implementation of many gamespy endpoints, I extracted the minimum required for my needs, you might find what you need there !

Two main purposes :
- Using it with https for the players without a modded Wii (I repeat, only for games using IOS < 37)
- Using it with http for the players with a modded Wii or Dolphin. It requires to patch the game to use http instead of https with a NoSSL patcher (available on some recently updated game loaders for the Wii, and for Dolphin you can use [WIT](https://wit.wiimm.de/wit/) with the `--http` arg to apply it to your game ISO but be warned that it also replaces the sub-domain 'naswii' to 'nas').

The only thing to do is to change the DNS setting of the Wii to this server in both cases.

## How to run the project

You must patch node with older openssl to handle the deprecated SSLv3 protocol and cipher suite ECDHE-RSA-AES128-SHA (node version used : `22.1.0`).  
If you don't want to bother about patching node, you can also downgrade node to version 0.10.33 and adapt the code to revert ES6 code.   

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

## Supported games over HTTPS

Wii IOS version **IOS37 and above** won't work for sure. If your game use IOS below IOS37, then it should work, but it might need to support more endpoints.  
Also it won't work with Dolphin or a modded Wii, so the game has to be patched in order to use HTTP instead of HTTPS.


## Supported endpoints

- POST /ac
  - action 'login'
  - action 'svcloc'

For my needs nothing more is required as another server was used for my game (WFC was only a 'frontend connect'), but you might need to handle errors (e.g. keep a list of banned users to block access, etc).

## SSL key and certificate

In the `script` package you will find `nwc-ssl-cert.bat` dedicated to generate the server key and certificate.

## host file or DNS

Each route you need to forward to your server must be defined in your hosts file or DNS. E.g.  :
```
127.0.0.1 naswii.nintendowifi.net
127.0.0.1 nas.nintendowifi.net
```

## Dockerfiles

In order to run the server in a container, you can use the provided Dockerfiles.

First, the patched version of node (to allow SSLv3 and RC4 cipher algorithm) is located in the `node-sslv3-rc4` folder.  
You can build the image with the following command :
```
docker build -t node-sslv3-rc4 .
```
Note that it takes a while. This image is also hosted on GitHub Packages so you don't need to build it yourself, but you need to authenticate with your GitHub account to pull the image (replace `USERNAME` with your GitHub username, generate a token at https://github.com/settings/tokens with the `read:packages` scope, and replace `TOKEN` with the generated token) :
```
echo $TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/a-blondel/nwc-server/node-sslv3-rc4:latest
```

Then, you can build the server image (root folder) with the following command :
```
docker build -t nwc-server:latest .
```
Adapt the base image if needed.  

Finally, you can run the server with the following command (https mode requires to mount the SSL key and certificate from your host machine, e.g. /etc/ssl/certs, don't forget to provide them ! They can be generated thanks to the `nwc-ssl-cert.bat` script in the `script` package) :
```
docker run -d -p 80:80 -v /etc/ssl/certs:/app/certs nwc-server start-http
```
```
docker run -d -p 443:443 -v /etc/ssl/certs:/app/certs nwc-server start-https
```

## Credits

Contributors of the following GitHub projects :
- https://github.com/shutterbug2000/wii-ssl-bug
- https://github.com/barronwaffles/dwc_network_server_emulator
- https://github.com/Aim4kill/Bug_OldProtoSSL : automated script to generate the ssl key and certificate
