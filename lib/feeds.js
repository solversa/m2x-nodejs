'use strict';

var helpers = require("./helpers");
var Keys = require("./keys");

// Wrapper for AT&T M2X Feed API
//
// See https://m2x.att.com/developer/documentation/feed for AT&T M2X
// HTTP Feed API documentation.
var Feeds = function(client) {
    this.client = client;
    this.keysAPI = new Keys(this.client);
};

// List all the feeds that belong to the user associated with the
// M2X API key supplied when initializing M2X
Feeds.prototype.list = function(cb) {
    return this.client.get("/feeds", cb);
};

// Return the details of the supplied feed
Feeds.prototype.view = function(id, cb) {
    return this.client.get(helpers.url("/feeds/%s", id), cb);
};

// Return a list of access log to the supplied feed
Feeds.prototype.log = function(id, cb) {
    return this.client.get(helpers.url("/feeds/%s/log", id), cb);
};

// Return the current location of the supplied feed
//
// Note that this method can return an empty value (response status
// of 204) if the feed has no location defined.
Feeds.prototype.location = function(id, cb) {
    return this.client.get(helpers.url("/feeds/%s/location", id), cb);
};

// Update the current location of the feed
Feeds.prototype.updateLocation = function(id, params, cb) {
    return this.client.
        put(helpers.url("/feeds/%s/location", id), { params: params }, cb);
};

// Return a list of the associated streams for the supplied feed
Feeds.prototype.streams = function(id, cb) {
    return this.client.get(helpers.url("/feeds/%s/streams", id), cb);
};

// Return the details of the supplied stream
Feeds.prototype.stream = function(id, name, cb) {
    return this.client.get(helpers.url("/feeds/%s/streams/%s", id, name), cb);
};

// Return a list with the latest values from a stream
Feeds.prototype.streamValues = function(id, name, cb) {
    return this.client.get(helpers.url("/feeds/%s/streams/%s/values", id, name), cb);
};

// Update stream's properties
//
// If the stream doesn't exist it will create it. See
// https://m2x.att.com/developer/documentation/feed#Create-Update-Data-Stream
// for details.
Feeds.prototype.updateStream = function(id, name, params, cb) {
    return this.client.
        put(helpers.url("/feeds/%s/streams/%s", id, name), { params: params }, cb);
};

// Delete the stream (and all its values) from the feed
Feeds.prototype.deleteStream = function(id, name, cb) {
    return this.client.del(helpers.url("/feeds/%s/streams/%s", id, name), cb);
};

// Returns a list of API keys associated with the feed
Feeds.prototype.keys = function(id, cb) {
    return this.client.get("/keys", { qs: { feed: id } }, cb);
};

// Creates a new API key associated to the feed
//
// If a parameter named `stream` is supplied with a stream name, it
// will create an API key associated with that stream only.
Feeds.prototype.createKey = function(id, params, cb) {
    this.keysAPI.create(helpers.extend(params, { feed: id }), cb);
};

// Updates an API key properties
Feeds.prototype.updateKey = function(id, key, params, cb) {
    this.keysAPI.update(key, helpers.extend(params, { feed: id }), cb);
};


// Post multiple values to multiple streams
//
// This method allows posting multiple values to multiple streams
// belonging to a feed. All the streams should be created before
// posting values using this method. The `values` parameters is a
// hash with the following format:
//
//   {
//     "stream-name-1": [
//       { "at": <Time in ISO8601>, "value": x },
//       { "value": y }
//     ],
//     "stream-name-2": [ ... ]
//   }
//
// If the `at` attribute is missing the the current time of the
// server, in UTC, will be used.
Feeds.prototype.postMultiple = function(id, values, cb) {
    return this.client.post(helpers.url("/feeds/%s", id), {
        headers: { "Content-Type": "application/json" },
        params: { values: values }
    }, cb);
};

module.exports = Feeds;