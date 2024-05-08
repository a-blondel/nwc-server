# NWC / WFC Server

A replacement server for NWC. Useful when you need to change behavior of a service from nintendowifi.net (e.g. when POST naswii.nintendowifi.net/ac returns an error following a server shutdown but you need a success in order to access another game server).

It is a bundle of two projects, credits goes to their contributors :
- https://github.com/shutterbug2000/wii-ssl-bug : SSL vulnerability explaination for Wii IOS version **before IOS37**
- https://github.com/barronwaffles/dwc_network_server_emulator : Implementation of many gamespy endpoints, I extracted the minimum required for my needs, you might find what you need there !

The main point is that the players don't require a modded Wii (and modded game) to play online, the only thing to do is to change the DNS setting of the Wii to this server.

## How to run the project

```
npm install
npm start
```

It runs on port 80.

## Supported endpoints

- POST /ac
  - action 'login'
  - action 'svcloc'

For my needs nothing more is required as another server was used for my game (WFC was only a 'frontend connect'), but you might need to handle errors (e.g. keep a list of banned users to block access, etc).
