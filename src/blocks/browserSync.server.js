
var bsync = require('browser-sync');
var assign = require('object-assign');
var rClient = require("redis").createClient();
var _ = require('lodash');
var opts = {
    open: false,
    files : [
    ],
    ghostMode: {
        clicks: true,
        location: false,
        forms: true,
        scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'Browser glass',
    notify: true,
    reloadDelay: 0, //1000,
    watchOptions: {
        ignoreInitial: true,
        ignored: '*.js'
    },
    minify : false,
    ui: false
};

// https://www.browsersync.io/docs/api/#api-has
// workaround for 'has' browsersync function absence
// ask the BS creator why :)
function getBsInstance(data, ref) {
    var bsyncInstance = null;
    try {
        bsyncInstance = bsync.get(data[ref || '_id']);
    }catch (e){
        bsyncInstance = bsync.create(data[ref || '_id']);
    }

    return bsyncInstance;
}

function linkExit(bs, socket, data) {
    socket.emit('links:exit', {
        data : data
    });
    rClient.del('online-links_' + data._id);

    clearTimeout(exitBs);
}

function browseLink(bs, socket, data) {
    socket.emit('links:browse', {
        url : bs.options.getIn(['urls', 'external']),
        tunnel : bs.options.getIn(['urls', 'tunnel']),
        data : data
    });
}

function exitBs(createdInstance) {
    if (createdInstance) {
        createdInstance.exit();
    }
    
    clearTimeout(exitBs);
}

// data refers to the data emitted from client
function instanceInit(socket, data, createdInstance, err, bs) {
    var $this = this;
    //console.log(data);
    socket.emit('links:activate-online', {
        url : bs.options.getIn(['urls', 'external']),
        data : data
    });

    createdInstance.emitter.on('links:exit', linkExit.bind($this, bs, socket, data));
    //createdInstance.emitter.on('exit', linkExit.bind($this, bs, socket, data));
    createdInstance.emitter.on('links:on-browse', browseLink.bind($this, bs, socket , data));
    createdInstance.emitter.emit('links:on-browse', data);
    //socket.on('links:browse', browseLink.bind($this, bs, socket));
}
/**
 * [processOnlineLinks description]
 * @param  {[type]} socket      client socket
 * @param  {[type]} bs       instance came from BrowserSync
 * @param  {[type]} data        data from client
 * @param  {[type]} err         err obj
 * @param  {[type]} onlineLinks came from REDIS store
 * @return {[type]} undefined
 */
function processLink(socket, data) {
    var redisLinkKey = linkRedisKey(data),
        bsyncInstance = getBsInstance(data),
        expiry = 60000 * (data.expiry || 10); // per minute
    //console.log(data);
    if (bsyncInstance.active) {
        bsyncInstance.emitter.emit('links:on-browse', data);
        return;
    }

    rClient.set(redisLinkKey, JSON.stringify({
        _id : data._id,
        owner : data.owner,
        createdDate : new Date(),
        storeKey : redisLinkKey
    }), function(data ) {
        /**
         * [description] this will delete the oldest link when the maximum value of 3 has been reached
         */
        rClient.keys('online-links_*', function(data, err, keys) {
            rClient.mget(keys, function(data, err, reply) {
                var items = _(reply).filter(function(item) {
                    var newItem = JSON.parse(item);
                    if(!newItem) { return; }
                    return newItem.owner === data.owner;
                })
                .sort('createdDate').value();
                //console.log('greater than 3 -' + (items && items.length > 3));
                if (!(items && items.length > 3)) { return; }
                //console.log(items.map(function(o) { return JSON.parse(o);}));

                var toRemoveLink = JSON.parse(items[0]),
                    toRemoveInstance = getBsInstance(toRemoveLink);
                //console.log(toRemoveInstance);
                toRemoveInstance.exit();
                rClient.del(toRemoveLink.storeKey);

                exitBs();

            }.bind(this, data));
        }.bind(this, data));
    }.bind(this, data));

    rClient.expire(redisLinkKey, expiry);

    setTimeout(exitBs.bind(this, bsyncInstance), expiry);

    bsyncInstance.init(assign({}, opts, {
        proxy : data.url,
        tunnel : data.tunnel ? data.tunnel : null
    }), instanceInit.bind(
        this,
        socket,
        data,
        bsyncInstance
    ));
}

function linkRedisKey(data, key) {
    return (key || 'online-links_') + data._id;
}

function exitHandler(options, err) {

    console.log('DELETING ALL ONLINE LINK KEYS');

    if (options.type !== 'exception') {
        rClient.keys('online-links_*', function(err, keys) {
            keys.forEach(function(item){
                rClient.del(item);
            });
        });
        return;
    }

    console.log(options.type);
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true, type : 'EXIT'}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true, type : 'SIGINT'}));

//catches uncaught exceptions
process.on('uncaughtException', function(err) {
    console.log(err.message);
});

// need to consolidate / organize this module with a proper pattern
module.exports = function(io) {
	var self = this;
	self.bsInfra = io.of('/bs-infra');

	self.bsInfra.on('connection', function connection(socket) {
        socket.on('links:notify', function(data) {
            var bsyncInstance = getBsInstance(data);
            if (!bsyncInstance.active) { return;}
            bsyncInstance.sockets.emit('browser:notify', {
                message : "HTML <span color='green'>is supported</span> too!",
                timeout : 60000 * 2
            });
        });
        socket.on('links:exit', function(data) {
            var bsyncInstance = getBsInstance(data);
            if (bsyncInstance.active) {
                bsyncInstance.emitter.emit('links:exit', data);
                bsyncInstance.exit();

            }
        });
        socket.on('links:reload', function(data) {
            var bsyncInstance = getBsInstance(data);
            if (bsyncInstance.active) {
                console.log('reloead');
                bsyncInstance.reload();
            }
        });

        socket.on('links:browse', processLink.bind(this, socket));

        socket.on('links:activate-online', function(data) {
            rClient.keys('online-links_*', function(err, keys) {
                // console.log(keys);
                // keys.forEach(function(item){
                //     rClient.del(item);
                // });
                // rClient.mget(keys, function(err, reply) {
                //     console.log(reply);
                // });
            });
        });

        socket.on('links:get-online-states', function(data) {
            rClient.keys('online-links_*', function(err, keys) {
                rClient.mget(keys, function(err, reply) {
                    var items = _.filter(reply, function(item) {
                        return JSON.parse(item).owner === data.owner; 
                    })
                    .map(function(item) {
                        return JSON.parse(item)._id;
                    });

                    
                    socket.emit('links:get-online-states', items);
                });
            });
        });

        // END CONNECTION
	});

    self.bsInfra.on('error', function(err) {
        console.log(err);
    });

};