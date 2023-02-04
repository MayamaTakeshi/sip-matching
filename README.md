# sip-matching
Permits to match and collect data from SIP messages using opensips/kamailio/openser pseudo-variables syntax.

Example:
```
const sm = require('sip-matching')
const dm = require('data-matching')
const s = require('string-matching').gen_matcher
const assert = require('assert')


var msg = `INVITE sip:bob@biloxi.com SIP/2.0
Via: SIP/2.0/UDP bigbox3.site3.atlanta.com;branch=z9hG4bK77ef4c2312983.1
Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bKnashds8;received=192.0.2.1
Max-Forwards: 70
To: Bob <sip:bob@biloxi.com>
From: Alice <sip:alice@atlanta.com>;tag=1928301774
Call-ID: a84b4c76e66710
CSeq: 314159 INVITE
USER-AGENT: SomeUA
Contact: <sip:alice@pc33.atlanta.com>
Content-Type: application/sdp
cONTENT-lENGTH: 142

v=0
o=root 123 456 IN IP4 1.2.3.4
a=rtpmap:0 pcmu/8000
a=sendrecv`

msg = msg.replace(/\n/g, "\r\n")

var p = sm.matcher(msg)

var matcher = sm.matcher({
	$fU: 'alice',
	$ua: 'SomeUA',
	'$hdr(Accept)': dm.absent,
	'$hdr(max-forwards)': '70',
	'$(hdrcnt(v))': 2,
	$fu: 'sip:!{user1}@!{domain1}',
	$tu: 'sip:!{user2}@!{domain2}',
	'$hdr(call-id)': dm.collect('call_id'),
})

var store = {}

assert(matcher(msg, store, false, '') == true)

assert(store.user1 == 'alice')
assert(store.domain1 == 'atlanta.com')
assert(store.user2 == 'bob')
assert(store.domain2 == 'biloxi.com')
assert(store.call_id == 'a84b4c76e66710')
```
