/* ============================================================
   NOVA AI — VPN Server Data (Phase 1 / Phase 7 seed)
   ⚠️  REAL public servers only — NO fake servers.
   Snapshot verified 2026-11-08 ~09:40 +06 from:
   • Proton VPN public logical-servers list
     (github.com/tn3w/ProtonVPN-IPs — protonvpn_logicals.json)
   • VPN Gate public API + website (vpngate.net)
   Always re-check the live list before connecting.
   This file holds PUBLIC server addresses only — no secrets.
   ============================================================ */
const NOVA_VPN_SERVERS = {
  verifiedAt: "2026-11-08 09:40 +06",
  sources: [
    "Proton VPN public logicals (tn3w/ProtonVPN-IPs)",
    "VPN Gate public API + vpngate.net/en"
  ],
  protonFreeUS: [
    { name: "US-FREE#6",  host: "node-us-133.protonvpn.net", city: "Dallas",   load: 67 },
    { name: "US-FREE#7",  host: "node-us-62.protonvpn.net",  city: "New York", load: 72 },
    { name: "US-FREE#50", host: "node-us-132.protonvpn.net", city: "Seattle",  load: 73 },
    { name: "US-FREE#3",  host: "node-us-60.protonvpn.net",  city: "Miami",    load: 74 },
    { name: "US-FREE#8",  host: "node-us-131.protonvpn.net", city: "San Jose", load: 78 },
    { name: "US-FREE#9",  host: "node-us-128.protonvpn.net", city: "Chicago",  load: null }
  ],
  vpnGateUS: [
    { host: "vpn800710384.opengw.net", ip: "130.215.124.186", speed: "87.88 Mbps", ping: 11, uptime: "16 h" },
    { host: "vpn843351995.opengw.net", ip: "168.150.121.131", speed: "196.91 Mbps", ping: 4,  uptime: "0 min" },
    { host: "vpn491479594.opengw.net", ip: "104.28.196.2",    speed: "~945 Mbps",   ping: 6,  uptime: "—", port: "TCP 1469" }
  ],
  vpnGateCreds: { username: "vpn", password: "vpn", l2tpPsk: "vpn" },
  liveListUrl: "https://www.vpngate.net/en/"
};
