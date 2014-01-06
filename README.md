jsmeetup-wocallback-demo
========================

Demo for "Node.js without callback" presentation at JSMeetup (Saigon)

To run the generator demo, you need to install node.js version 0.11.+:

    git clone -b v0.11.10-release https://github.com/joyent/node.git
    cd node
    ./configure
    make
    make install
    node -v

In addition, remember to execute code with --harmony flag:
    node --harmony app.js
