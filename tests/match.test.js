const sip_msg = require('../index.js')
const m = require('data-matching')
const s = require('string-matching').gen_matcher

test('matched', () => {
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
P-Some-Fake-Header: blabla
Content-Type: application/sdp
cONTENT-lENGTH: 142

v=0
o=root 123 456 IN IP4 1.2.3.4
a=rtpmap:0 pcmu/8000
a=sendrecv`

	msg = msg.replace(/\n/g, "\r\n")

	const matcher = sip_msg({
		$fU: 'alice',
		$ua: 'SomeUA',

		$fu: s('sip:!{user1}@!{domain1}'),
		$tu: s('sip:!{user2}@!{domain2}'),

		'$hdr(Accept)': m.absent,
        hdr_accept: m.absent,

		'$hdr(max-forwards)': '70',
        hdr_Max_Forwards: '70',

		'$(hdrcnt(v))': 2,

        '$hdr(content-length)': '142',
        hdr_CONTENT_length: '142',
        hdr_l: '142',

        '$hdr(P-Some-Fake-Header)': 'blabla',
        hdr_P_some_FAKE_header: 'blabla',
	})

	const store = {}

	expect(matcher(msg, store, false, '')).toBe(true)

	expect(store.user1).toBe('alice')
	expect(store.domain1).toBe('atlanta.com')
	expect(store.user2).toBe('bob')
	expect(store.domain2).toBe('biloxi.com')
})


