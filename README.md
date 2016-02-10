# sphere-client

This is the client javascript library for Go-Sphere. Go-Sphere is an open source realtime framework to scale websocket horizontally (across multiple hosts) via pub/sub synchronization. Sphere supports both real-time bidirectional event-based communication and group communication.

## Get Started

###### Build sphere-client

```sh

$ ./build.sh
```

###### Usage

```html
<script type="text/javascript" src="sphere.min.js"></script>
```
```javascript
var websocket = new Sphere.Module.WebSocket("ws://localhost:4000/sync");

// Listen to open event
websocket.on('open', function callback() { });

// Listen to close event
websocket.on('close', function callback() { });

// Listen to message event
websocket.on('message', function callback() { });

// Subscribe channel
websocket.subscribe('namespace', 'room', function callback(res) { });

// Unsubscribe channel
websocket.unsubscribe('namespace', 'room', function callback(res) { });

// List channels in array
websocket.channels() 

// Send a packet to server
websocket.send(new Sphere.Module.Packet());

// Listen to subscribe event
websocket.channel('namespace', 'room').on('subscribe', function callback() { });

// Listen to unsubscribe event
websocket.channel('namespace', 'room').on('unsubscribe', function callback() { });

// Listen to subscribed event
websocket.channel('namespace', 'room').on('subscribed', function callback() { });

// Listen to unsubscribed event
websocket.channel('namespace', 'room').on('unsubscribed', function callback() { });

// Send message to channel
websocket.channel('namespace', 'room').send('event', 'data');

```

## TODO

- Rewrite library in Javascript ES6
- Unit testing

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/samuelngs/sphere-client/issues)
- Fix bugs and [submit pull requests](https://github.com/samuelngs/sphere-client/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

## License ##

This project is distributed under the MIT license found in the [LICENSE](./LICENSE)
file.

```
The MIT License (MIT)

Copyright (c) 2015 Samuel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
