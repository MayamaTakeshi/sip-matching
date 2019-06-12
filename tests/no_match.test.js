var sm = require('../index.js')
var dm = require('data-matching')

test('not matched', () => {
	var s = `INVITE sip:bob@biloxi.com SIP/2.0
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

	s = s.replace(/\n/g, "\r\n")

	var p = sm.matcher(s)

	var matcher = sm.matcher({
		$fU: 'alice',
		$rU: 'bob',
		$tu: 'sip:bob@biloxi.com',
		$ua: 'XXXX',
	})

	expect(matcher(s, {}, false, '')).toBe(false)
})


