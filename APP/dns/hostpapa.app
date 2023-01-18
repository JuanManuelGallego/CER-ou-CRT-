;
; Zone file for hostpapa.app
;
; The full zone file
;
$TTL 1D
@       IN      SOA     ns.hostpapa.app. master.hostpapa.app. (
                        202301181       ; serial, todays date + todays serial # 
                        8H              ; refresh, seconds
                        2H              ; retry, seconds
                        4W              ; expire, seconds
                        1D )            ; minimum, seconds
;
	IN	NS	ns.hostpapa.app.
ns	IN	A	255.0.255.0
www	IN	A	127.0.0.1
