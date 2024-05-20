# NWC / WFC Server

A replacement server for NWC. Useful when you need to change behavior of a service from nintendowifi.net (e.g. when POST naswii.nintendowifi.net/ac returns an error following a server shutdown but you need a success in order to access another game server).

It is a bundle of two projects, credits goes to their contributors :
- https://github.com/shutterbug2000/wii-ssl-bug : SSL vulnerability explaination for Wii IOS version **before IOS37**
- https://github.com/barronwaffles/dwc_network_server_emulator : Implementation of many gamespy endpoints, I extracted the minimum required for my needs, you might find what you need there !

The main point is that the players don't require a modded Wii (and modded game) to play online, the only thing to do is to change the DNS setting of the Wii to this server.

## How to run the project

You must patch node with older openssl to handle the deprecated SSLv3 protocol and cipher suite ECDHE-RSA-AES128-SHA (node version : `22.1.0`)  

Then you can use these commands :
```
npm install
npm start
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

Each route you need to forward to your server much be defined in your hosts file or DNS. E.g. for the hosts file :
```
127.0.0.1 naswii.nintendowifi.net
```

## Credits

Contributors of the following GitHub projects :
- https://github.com/shutterbug2000/wii-ssl-bug
- https://github.com/barronwaffles/dwc_network_server_emulator
- https://github.com/Aim4kill/Bug_OldProtoSSL : automated script to generate the ssl key and certificate
