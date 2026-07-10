/** Auto-synced from data/funding-denylist.json. Do not edit by hand. */

export type FundingDenylistKind = "bridge" | "cctp" | "cex" | "router" | "token";

export type FundingDenylistEntry = {
  address: string;
  kind: FundingDenylistKind;
  label: string;
};

/** Sources funding more than this many HL wallets are treated as infrastructure. */
export const CLUSTER_SOURCE_FANOUT_CAP = 25;

export const FUNDING_DENYLIST_ENTRIES: FundingDenylistEntry[] = [
  {
    "address": "0x2df1c51e09aecf9cacb7bc98cb1742757f163df7",
    "kind": "bridge",
    "label": "Hyperliquid Bridge2"
  },
  {
    "address": "0xa95d9c1f655341597c94393fddc30cf3c08e4fce",
    "kind": "cctp",
    "label": "Hyperliquid CCTP Extension"
  },
  {
    "address": "0x28b5a0e9c621a5badaa536219b3a228c8168cf5d",
    "kind": "cctp",
    "label": "Circle TokenMessengerV2"
  },
  {
    "address": "0x81d40f21f12a8f0e3252bccb954d722d4c464b64",
    "kind": "cctp",
    "label": "Circle MessageTransmitterV2"
  },
  {
    "address": "0xfd78ee919681417d192449715b2594ab58f5d002",
    "kind": "cctp",
    "label": "Circle TokenMinterV2"
  },
  {
    "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    "kind": "token",
    "label": "Native USDC (Arbitrum)"
  },
  {
    "address": "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    "kind": "router",
    "label": "Uniswap Universal Router"
  },
  {
    "address": "0xe592427a0aece92de3edee1f18e0157c05861564",
    "kind": "router",
    "label": "Uniswap V3 SwapRouter"
  },
  {
    "address": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
    "kind": "router",
    "label": "Uniswap SwapRouter02"
  },
  {
    "address": "0x1111111254eeb25477b68fb85ed929f73a960582",
    "kind": "router",
    "label": "1inch Aggregation Router v5"
  },
  {
    "address": "0x111111125421ca6dc452d289314280a0f8842a65",
    "kind": "router",
    "label": "1inch Aggregation Router v6"
  },
  {
    "address": "0x5c7bcd6e7de5423a257d81b442095a2a20197603",
    "kind": "bridge",
    "label": "Across SpokePool (Arbitrum)"
  },
  {
    "address": "0xe8cdf27acd73a434d661f4843250f3c5cbe4c555",
    "kind": "bridge",
    "label": "Stargate Router (Arbitrum)"
  },
  {
    "address": "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
    "kind": "cex",
    "label": "Binance 1"
  },
  {
    "address": "0xd551234ae421e3bcba99a0da6d736074f22192ff",
    "kind": "cex",
    "label": "Binance 2"
  },
  {
    "address": "0x564286362092d8e7936f0549571a803b203aaced",
    "kind": "cex",
    "label": "Binance 3"
  },
  {
    "address": "0x0681d8db095565fe8a346fa0277bffde9c0edbbf",
    "kind": "cex",
    "label": "Binance 4"
  },
  {
    "address": "0xfe9e8709d3215310075d67e3ed32a380ccf451c8",
    "kind": "cex",
    "label": "Binance 5"
  },
  {
    "address": "0x4e9ce36e442e55ecd9025b9a6e0d88485d628a67",
    "kind": "cex",
    "label": "Binance 6"
  },
  {
    "address": "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8",
    "kind": "cex",
    "label": "Binance 7"
  },
  {
    "address": "0xf977814e90da44bfa03b6295a0616a897441acec",
    "kind": "cex",
    "label": "Binance 8"
  },
  {
    "address": "0x001866ae5b3de6caa5a51543fd9fb64f524f5478",
    "kind": "cex",
    "label": "Binance 9"
  },
  {
    "address": "0x85b931a32a0725be14285b66f1a22178c672d69b",
    "kind": "cex",
    "label": "Binance 10"
  },
  {
    "address": "0x708396f17127c42383e3b9014072679b2f60b82f",
    "kind": "cex",
    "label": "Binance 11"
  },
  {
    "address": "0xe0f0cfde7ee664943906f17f7f14342e76a5cec7",
    "kind": "cex",
    "label": "Binance 12"
  },
  {
    "address": "0x8f22f2063d253846b53609231ed80fa571bc0c8f",
    "kind": "cex",
    "label": "Binance 13"
  },
  {
    "address": "0x28c6c06298d514db089934071355e5743bf21d60",
    "kind": "cex",
    "label": "Binance 14"
  },
  {
    "address": "0x21a31ee1afc51d94c2efccaa2092ad1028285549",
    "kind": "cex",
    "label": "Binance 15"
  },
  {
    "address": "0xdfd5293d8e347dfe59e90efd55b2956a1343963d",
    "kind": "cex",
    "label": "Binance 16"
  },
  {
    "address": "0x56eddb7aa87536c09ccc2793473599fd21a8b17f",
    "kind": "cex",
    "label": "Binance 17"
  },
  {
    "address": "0x9696f59e4d72e237be84ffd425dcad154bf96976",
    "kind": "cex",
    "label": "Binance 18"
  },
  {
    "address": "0x4d9ff50ef4da947364bb9650892b2554e7be5e2b",
    "kind": "cex",
    "label": "Binance 19"
  },
  {
    "address": "0x4976a4a02f38326660d17bf34b431dc6e2eb2327",
    "kind": "cex",
    "label": "Binance 20"
  },
  {
    "address": "0xd88b55467f58af508dbfdc597e8ebd2ad2de49b3",
    "kind": "cex",
    "label": "Binance 21"
  },
  {
    "address": "0x7dfe9a368b6cf0c0309b763bb8d16da326e8f46e",
    "kind": "cex",
    "label": "Binance 22"
  },
  {
    "address": "0x345d8e3a1f62ee6b1d483890976fd66168e390f2",
    "kind": "cex",
    "label": "Binance 23"
  },
  {
    "address": "0xc3c8e0a39769e2308869f7461364ca48155d1d9e",
    "kind": "cex",
    "label": "Binance 24"
  },
  {
    "address": "0x2e581a5ae722207aa59acd3939771e7c7052dd3d",
    "kind": "cex",
    "label": "Binance 25"
  },
  {
    "address": "0x44592b81c05b4c35efb8424eb9d62538b949ebbf",
    "kind": "cex",
    "label": "Binance 26"
  },
  {
    "address": "0xa344c7ada83113b3b56941f6e85bf2eb425949f3",
    "kind": "cex",
    "label": "Binance 27"
  },
  {
    "address": "0x5a52e96bacdabb82fd05763e25335261b270efcb",
    "kind": "cex",
    "label": "Binance 28"
  },
  {
    "address": "0x06a0048079ec6571cd1b537418869cde6191d42d",
    "kind": "cex",
    "label": "Binance 29"
  },
  {
    "address": "0x892e9e24aea3f27f4c6e9360e312cce93cc98ebe",
    "kind": "cex",
    "label": "Binance 30"
  },
  {
    "address": "0x00799bbc833d5b168f0410312d2a8fd9e0e3079c",
    "kind": "cex",
    "label": "Binance 31"
  },
  {
    "address": "0x141fef8cd8397a390afe94846c8bd6f4ab981c48",
    "kind": "cex",
    "label": "Binance 32"
  },
  {
    "address": "0x50d669f43b484166680ecc3670e4766cdb0945ce",
    "kind": "cex",
    "label": "Binance 33"
  },
  {
    "address": "0x2f7e209e0f5f645c7612d7610193fe268f118b28",
    "kind": "cex",
    "label": "Binance 34"
  },
  {
    "address": "0xd9d93951896b4ef97d251334ef2a0e39f6f6d7d7",
    "kind": "cex",
    "label": "Binance 35"
  },
  {
    "address": "0x19184ab45c40c2920b0e0e31413b9434abd243ed",
    "kind": "cex",
    "label": "Binance 39"
  },
  {
    "address": "0x294b9b133ca7bc8ed2cdd03ba661a4c6d3a834d9",
    "kind": "cex",
    "label": "Binance 41"
  },
  {
    "address": "0x5d7f34372fa8708e09689d400a613eee67f75543",
    "kind": "cex",
    "label": "Binance 42"
  },
  {
    "address": "0x515b72ed8a97f42c568d6a143232775018f133c8",
    "kind": "cex",
    "label": "Binance 43"
  },
  {
    "address": "0x631fc1ea2270e98fbd9d92658ece0f5a269aa161",
    "kind": "cex",
    "label": "Binance 44"
  },
  {
    "address": "0x77134cbc06cb00b66f4c7e623d5fdbf6777635ec",
    "kind": "cex",
    "label": "Bitfinex Hot Wallet"
  },
  {
    "address": "0x1151314c646ce4e0efd76d1af4760ae66a9fe30f",
    "kind": "cex",
    "label": "Bitfinex 1"
  },
  {
    "address": "0x742d35cc6634c0532925a3b844bc454e4438f44e",
    "kind": "cex",
    "label": "Bitfinex 2"
  },
  {
    "address": "0x876eabf441b2ee5b5b0554fd502a8e0600950cfa",
    "kind": "cex",
    "label": "Bitfinex 3"
  },
  {
    "address": "0xdcd0272462140d0a3ced6c4bf970c7641f08cd2c",
    "kind": "cex",
    "label": "Bitfinex 4"
  },
  {
    "address": "0x4fdd5eb2fb260149a3903859043e962ab89d8ed4",
    "kind": "cex",
    "label": "Bitfinex 5"
  },
  {
    "address": "0x1b29dd8ff0eb3240238bf97cafd6edea05d5ba82",
    "kind": "cex",
    "label": "Bitfinex 6"
  },
  {
    "address": "0x30a2ebf10f34c6c4874b0bdd5740690fd2f3b70c",
    "kind": "cex",
    "label": "Bitfinex 7"
  },
  {
    "address": "0x3f7e77b627676763997344a1ad71acb765fc8ac5",
    "kind": "cex",
    "label": "Bitfinex 8"
  },
  {
    "address": "0x59448fe20378357f206880c58068f095ae63d5a5",
    "kind": "cex",
    "label": "Bitfinex 9"
  },
  {
    "address": "0x36a85757645e8e8aec062a1dee289c7d615901ca",
    "kind": "cex",
    "label": "Bitfinex 10"
  },
  {
    "address": "0xc56fefd1028b0534bfadcdb580d3519b5586246e",
    "kind": "cex",
    "label": "Bitfinex 11"
  },
  {
    "address": "0x0b73f67a49273fc4b9a65dbd25d7d0918e734e63",
    "kind": "cex",
    "label": "Bitfinex 12"
  },
  {
    "address": "0x482f02e8bc15b5eabc52c6497b425b3ca3c821e8",
    "kind": "cex",
    "label": "Bitfinex 13"
  },
  {
    "address": "0x1b8766d041567eed306940c587e21c06ab968663",
    "kind": "cex",
    "label": "Bitfinex 14"
  },
  {
    "address": "0x5a710a3cdf2af218740384c52a10852d8870626a",
    "kind": "cex",
    "label": "Bitfinex 15"
  },
  {
    "address": "0x28140cb1ac771d4add91ee23788e50249c10263d",
    "kind": "cex",
    "label": "Bitfinex 16"
  },
  {
    "address": "0x53b36141490c419fa27ecabfeb8be1ecadc82431",
    "kind": "cex",
    "label": "Bitfinex 17"
  },
  {
    "address": "0x0cd76cd43992c665fdc2d8ac91b935ca3165e782",
    "kind": "cex",
    "label": "Bitfinex 18"
  },
  {
    "address": "0xe92d1a43df510f82c66382592a047d288f85226f",
    "kind": "cex",
    "label": "Bitfinex 19"
  },
  {
    "address": "0x8103683202aa8da10536036edef04cdd865c225e",
    "kind": "cex",
    "label": "Bitfinex 20"
  },
  {
    "address": "0x618f37d7ff7b140e604172466cd42d1ec35e0544",
    "kind": "cex",
    "label": "Bitfinex 21"
  },
  {
    "address": "0x88037f361891a0b5de3c0c30632fbca7db2d341f",
    "kind": "cex",
    "label": "Bitfinex 22"
  },
  {
    "address": "0xed9eef56e64a8e779cfae9ddedb25d11ba2b2425",
    "kind": "cex",
    "label": "Bitfinex 23"
  },
  {
    "address": "0x2a7f8fa32012ba83e77afa782fbc9267ab0967d5",
    "kind": "cex",
    "label": "Bitfinex 24"
  },
  {
    "address": "0x69c6dcc8f83b196605fa1076897af0e7e2b6b044",
    "kind": "cex",
    "label": "Bitfinex 25"
  },
  {
    "address": "0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e",
    "kind": "cex",
    "label": "Bitfinex MultiSig 1"
  },
  {
    "address": "0xc6cde7c39eb2f0f0095f41570af89efc2c1ea828",
    "kind": "cex",
    "label": "Bitfinex MultiSig 2"
  },
  {
    "address": "0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c",
    "kind": "cex",
    "label": "Bitfinex MultiSig 3"
  },
  {
    "address": "0xcafb10ee663f465f9d10588ac44ed20ed608c11e",
    "kind": "cex",
    "label": "Bitfinex Old Address 1"
  },
  {
    "address": "0x7180eb39a6264938fdb3effd7341c4727c382153",
    "kind": "cex",
    "label": "Bitfinex Old Address 2"
  },
  {
    "address": "0x5754284f345afc66a98fbb0a0afe71e0f007b949",
    "kind": "cex",
    "label": "Bitfinex Tether Treasury"
  },
  {
    "address": "0xf4b51b14b9ee30dc37ec970b50a486f37686e2a8",
    "kind": "cex",
    "label": "Bitfinex Cold Storage"
  },
  {
    "address": "0x2ee3b2df6534abc759ffe994f7b8dcdfaa02cd31",
    "kind": "cex",
    "label": "Bitfinex Deployer 1"
  },
  {
    "address": "0x61d5a4d5bd270e59e9320243e574288e2a199fed",
    "kind": "cex",
    "label": "Bitfinex Deployer 2"
  },
  {
    "address": "0xc58b32218a746b70813a057275591966deb5920e",
    "kind": "cex",
    "label": "Bitfinex Contract 1"
  },
  {
    "address": "0x7727e5113d1d161373623e5f49fd568b4f543a9e",
    "kind": "cex",
    "label": "Bitfinex Contract 2"
  },
  {
    "address": "0x58ae42a38d6b33a1e31492b60465fa80da595755",
    "kind": "cex",
    "label": "Bitfinex Contract 3"
  },
  {
    "address": "0x1ae3739e17d8500f2b2d80086ed092596a116e0b",
    "kind": "cex",
    "label": "Bitget 1"
  },
  {
    "address": "0x2bf7494111a59bd51f731dcd4873d7d71f8feeec",
    "kind": "cex",
    "label": "Bitget 2"
  },
  {
    "address": "0x31a36512d4903635b7dd6828a934c3915a5809be",
    "kind": "cex",
    "label": "Bitget 3"
  },
  {
    "address": "0x461f6dcdd5be42d41fe71611154279d87c06b406",
    "kind": "cex",
    "label": "Bitget 4"
  },
  {
    "address": "0x9e00816f61a709fa124d36664cd7b6f14c13ee05",
    "kind": "cex",
    "label": "Bitget 5"
  },
  {
    "address": "0xdfe4b89cf009bffa33d9bca1f19694fc2d4d943d",
    "kind": "cex",
    "label": "Bitget 6"
  },
  {
    "address": "0xbc942e2250ec7ab83bfc4516bca4e281dbfbb393",
    "kind": "cex",
    "label": "Bitget 7"
  },
  {
    "address": "0x1a96e5da1315efcf9b75100f5757d5e8b76abb0c",
    "kind": "cex",
    "label": "Bitget 8"
  },
  {
    "address": "0x1d5ba5414f2983212e03bf7725add9eb4cdb00dc",
    "kind": "cex",
    "label": "Bitget 9"
  },
  {
    "address": "0x4dfc15890972ecea7a213bda2b478dabc382e7a1",
    "kind": "cex",
    "label": "Bitget 10"
  },
  {
    "address": "0x5051e9860c1889eb1bfa394365364b3dd61787f1",
    "kind": "cex",
    "label": "Bitget 11"
  },
  {
    "address": "0x731309e453972598ea05d706c6ee6c3c21ab4d2a",
    "kind": "cex",
    "label": "Bitget 12"
  },
  {
    "address": "0x842ea89f73add9e4fe963ae7929fdc1e80acdb52",
    "kind": "cex",
    "label": "Bitget 13"
  },
  {
    "address": "0xb8cda8d72da558ef8f76a0d928f9652d2b003e2e",
    "kind": "cex",
    "label": "Bitget 14"
  },
  {
    "address": "0x0639556f03714a74a5feeaf5736a4a64ff70d206",
    "kind": "cex",
    "label": "Bitget 15"
  },
  {
    "address": "0x97b9d2102a9a65a26e1ee82d59e42d1b73b68689",
    "kind": "cex",
    "label": "Bitget 16"
  },
  {
    "address": "0x5bdf85216ec1e38d6458c870992a69e38e03f7ef",
    "kind": "cex",
    "label": "Bitget 17"
  },
  {
    "address": "0xe2b406ec9227143a8830229eeb3eb6e24b5c60be",
    "kind": "cex",
    "label": "Bitget 18"
  },
  {
    "address": "0xe6a421f24d330967a3af2f4cdb5c34067e7e4d75",
    "kind": "cex",
    "label": "Bitget 19"
  },
  {
    "address": "0xe80623a9d41f2f05780d9cd9cea0f797fd53062a",
    "kind": "cex",
    "label": "Bitget 20"
  },
  {
    "address": "0xf646d9b7d20babe204a89235774248ba18086dae",
    "kind": "cex",
    "label": "Bitget 21"
  },
  {
    "address": "0x51971c86b04516062c1e708cdc048cb04fbe959f",
    "kind": "cex",
    "label": "Bitget 22"
  },
  {
    "address": "0x149ded7438caf5e5bfdc507a6c25436214d445e1",
    "kind": "cex",
    "label": "Bitget 23"
  },
  {
    "address": "0x1ab4973a48dc892cd9971ece8e01dcc7688f8f23",
    "kind": "cex",
    "label": "Bitget 24"
  },
  {
    "address": "0x7651fc1605a58fe9a99f1fe0d6db05d4182a9a93",
    "kind": "cex",
    "label": "Bitget 25"
  },
  {
    "address": "0x6a3f28c47542bd5811ae37ab358d5d7e3ab84127",
    "kind": "cex",
    "label": "Bitget 26"
  },
  {
    "address": "0xbff5092f83bd810e0926068b89633bf66eaa037b",
    "kind": "cex",
    "label": "Bitget 27"
  },
  {
    "address": "0x092fe28430bade62c7c044b9c77d0aaa06241319",
    "kind": "cex",
    "label": "Bitget 28"
  },
  {
    "address": "0xdbe46a02322e636b92296954637e1d7db9d5ed26",
    "kind": "cex",
    "label": "Bitget 29"
  },
  {
    "address": "0x70213959a644baa94840bbfb4129550bceceb3c2",
    "kind": "cex",
    "label": "Bitget 30"
  },
  {
    "address": "0x4d216d2682f3997f6c19420beee4530d08d0ea5f",
    "kind": "cex",
    "label": "Bitget 31"
  },
  {
    "address": "0x0edd5b0de0fe748be331186bf0aa878f47f601db",
    "kind": "cex",
    "label": "Bitget 32"
  },
  {
    "address": "0x54a679e853281a440911f72eae0e24107e9413dc",
    "kind": "cex",
    "label": "Bitget 33"
  },
  {
    "address": "0x59708733fbbf64378d9293ec56b977c011a08fd2",
    "kind": "cex",
    "label": "Bitget 34"
  },
  {
    "address": "0xffa8db7b38579e6a2d14f9b347a9ace4d044cd54",
    "kind": "cex",
    "label": "Bitget 35"
  },
  {
    "address": "0x3a7d1a8c3a8dc9d48a68e628432198a2ead4917c",
    "kind": "cex",
    "label": "Bitget Proxy 1"
  },
  {
    "address": "0x00bdb5699745f5b860228c8f939abf1b9ae374ed",
    "kind": "cex",
    "label": "Bitstamp 1"
  },
  {
    "address": "0x1522900b6dafac587d499a862861c0869be6e428",
    "kind": "cex",
    "label": "Bitstamp 2"
  },
  {
    "address": "0x9a9bed3eb03e386d66f8a29dc67dc29bbb1ccb72",
    "kind": "cex",
    "label": "Bitstamp 3"
  },
  {
    "address": "0x059799f2261d37b829c2850cee67b5b975432271",
    "kind": "cex",
    "label": "Bitstamp 4"
  },
  {
    "address": "0x4c766def136f59f6494f0969b1355882080cf8e0",
    "kind": "cex",
    "label": "Bitstamp 5"
  },
  {
    "address": "0xc5b611f502a0dcf6c3188fd494061ae29b2baa4f",
    "kind": "cex",
    "label": "Bitstamp 6"
  },
  {
    "address": "0x0b0f7ebf967146566799229394171fc47f1a765a",
    "kind": "cex",
    "label": "Bitstamp 7"
  },
  {
    "address": "0x48ec5560bfd59b95859965cce48cc244cfdf6b0c",
    "kind": "cex",
    "label": "Bitstamp 8"
  },
  {
    "address": "0x808e7133c700cf3a66e6a25aadb1fbef6be468b4",
    "kind": "cex",
    "label": "Bitstamp 9"
  },
  {
    "address": "0x16a798dbd8fa626143bb4f06fa4724d4145d4e6e",
    "kind": "cex",
    "label": "Bitstamp 10"
  },
  {
    "address": "0xfbb23038fe6cfa16aa898d7dbca7c3269bdaf258",
    "kind": "cex",
    "label": "Bitstamp 11"
  },
  {
    "address": "0x182e1259ef6ee45dc811132ef4ba5871f1536822",
    "kind": "cex",
    "label": "Bitstamp 12"
  },
  {
    "address": "0x31c84a968736fcfe02a9ba274e0fa515a4a6659c",
    "kind": "cex",
    "label": "Bitstamp 13"
  },
  {
    "address": "0x333c100ae1a2743a1e55d73913cac6d95deb7f62",
    "kind": "cex",
    "label": "Bitstamp 14"
  },
  {
    "address": "0x379825f8da776b573a63404a5c499c8a379a131f",
    "kind": "cex",
    "label": "Bitstamp 15"
  },
  {
    "address": "0x3f3e23249f38d35a4cdaf44edfd99eeb4325b401",
    "kind": "cex",
    "label": "Bitstamp 16"
  },
  {
    "address": "0xee9fb7a615cb76b46d26be6ebc9114a627a81c5b",
    "kind": "cex",
    "label": "Bitstamp 17"
  },
  {
    "address": "0x4c0907f7ad337635a7fd414a0c7a938e0d64bf4d",
    "kind": "cex",
    "label": "Bitstamp 18"
  },
  {
    "address": "0x518b82370bc31ebb96922ec257d92517d7387615",
    "kind": "cex",
    "label": "Bitstamp 19"
  },
  {
    "address": "0x593aebee9117eea447279e5973f64c68d8e977a0",
    "kind": "cex",
    "label": "Bitstamp 20"
  },
  {
    "address": "0x6130611f7a65deb930bd0c0825af88078fcced43",
    "kind": "cex",
    "label": "Bitstamp 21"
  },
  {
    "address": "0x6778c14331251bbbee71414eda389dcef4bd81b8",
    "kind": "cex",
    "label": "Bitstamp 22"
  },
  {
    "address": "0x6dca94b6173c28a4900ea257121e6002c0b96968",
    "kind": "cex",
    "label": "Bitstamp 23"
  },
  {
    "address": "0x772396dd44ce3d347838bfec437cb32f534963f2",
    "kind": "cex",
    "label": "Bitstamp 24"
  },
  {
    "address": "0x7e677cacaae0d465cfd336869f1f575a48bf012a",
    "kind": "cex",
    "label": "Bitstamp 25"
  },
  {
    "address": "0x8366dcab4cc14c826fc9d51bd4c16567bd07b02a",
    "kind": "cex",
    "label": "Bitstamp 26"
  },
  {
    "address": "0x858c83a0c97a3a710fd3b9167a0248d76d3b036f",
    "kind": "cex",
    "label": "Bitstamp 27"
  },
  {
    "address": "0x88a4df73aac310484c60c4c0ac4904cab938c20b",
    "kind": "cex",
    "label": "Bitstamp 28"
  },
  {
    "address": "0x896dfee1afeb6336e86911bd5a341c1264e5611a",
    "kind": "cex",
    "label": "Bitstamp 29"
  },
  {
    "address": "0x9fec89e34efaa4fc9f19c02f474c71373e6effe7",
    "kind": "cex",
    "label": "Bitstamp 30"
  },
  {
    "address": "0xa3fb85c3a2c50d8c0e1dd7fa7746f97c9e1d9591",
    "kind": "cex",
    "label": "Bitstamp 31"
  },
  {
    "address": "0xab09b0c5c112999bee4f45e323c4ad2b59638603",
    "kind": "cex",
    "label": "Bitstamp 32"
  },
  {
    "address": "0xab7bb7959332888e44d795c6f28ee876a8469eaa",
    "kind": "cex",
    "label": "Bitstamp 33"
  },
  {
    "address": "0xb66410ae75317faf13dba869b6df7b30892d1e46",
    "kind": "cex",
    "label": "Bitstamp 34"
  },
  {
    "address": "0xb8e73ba7c6c0b50a0cd94fe9f6622762b0401c02",
    "kind": "cex",
    "label": "Bitstamp 35"
  },
  {
    "address": "0xbcddeba6a9672c1f76a8b8edd3190bdfe6d4ef11",
    "kind": "cex",
    "label": "Bitstamp 36"
  },
  {
    "address": "0xc0ac2f4a3cf22fd504d8835b07f5acccfa9b27f9",
    "kind": "cex",
    "label": "Bitstamp 37"
  },
  {
    "address": "0xc20b79cff9d2c89ba8aeb9abf4bfef0314ca7bd2",
    "kind": "cex",
    "label": "Bitstamp 38"
  },
  {
    "address": "0xcddf488f1c826160ee832d4f1492f00cf8557ff6",
    "kind": "cex",
    "label": "Bitstamp 39"
  },
  {
    "address": "0xd46914c273443505563d346f98d41f6a40dff36c",
    "kind": "cex",
    "label": "Bitstamp 40"
  },
  {
    "address": "0x1db92e2eebc8e0c075a02bea49a2935bcd2dfcf4",
    "kind": "cex",
    "label": "Bybit 1"
  },
  {
    "address": "0xa7a93fd0a276fc1c0197a5b5623ed117786eed06",
    "kind": "cex",
    "label": "Bybit 2"
  },
  {
    "address": "0xe1ab8c08294f8ee707d4efa458eab8bbeeb09215",
    "kind": "cex",
    "label": "Bybit 3"
  },
  {
    "address": "0xee5b5b923ffce93a870b3104b7ca09c3db80047a",
    "kind": "cex",
    "label": "Bybit 4"
  },
  {
    "address": "0xf89d7b9c864f589bbf53a82105107622b35eaa40",
    "kind": "cex",
    "label": "Bybit 5"
  },
  {
    "address": "0xbaed383ede0e5d9d72430661f3285daa77e9439f",
    "kind": "cex",
    "label": "Bybit 6"
  },
  {
    "address": "0xf5f3436a05b5ced2490dae07b86eb5bbd02782aa",
    "kind": "cex",
    "label": "Bybit 7"
  },
  {
    "address": "0x4230c402c08cb66dcf3820649a115e54661fce9d",
    "kind": "cex",
    "label": "Bybit 8"
  },
  {
    "address": "0x3d5202a0564de9b05ecd07c955bcca964585ea03",
    "kind": "cex",
    "label": "Bybit 9"
  },
  {
    "address": "0x1e32760a3285550278aeafa776e5641bc581c845",
    "kind": "cex",
    "label": "Bybit 10"
  },
  {
    "address": "0x88a1493366d48225fc3cefbdae9ebb23e323ade3",
    "kind": "cex",
    "label": "Bybit 11"
  },
  {
    "address": "0x12136e543b551ecdfdea9a0ed23ed0eff5505ee0",
    "kind": "cex",
    "label": "Bybit 12"
  },
  {
    "address": "0x4ce053dfe58541e08f149c1050eb3df09d7a40bc",
    "kind": "cex",
    "label": "Bybit 13"
  },
  {
    "address": "0xd8db73f025adf9f1f6a754a4b0b7a9349b7ff128",
    "kind": "cex",
    "label": "Bybit 14"
  },
  {
    "address": "0x57b83aaff113ef81a729b63274ed6f17404c9ba6",
    "kind": "cex",
    "label": "Bybit 15"
  },
  {
    "address": "0x3ddb5d1247adc837cec3ba81edc923a4a230aa8f",
    "kind": "cex",
    "label": "Bybit 16"
  },
  {
    "address": "0x0d4dc3b8becc98782309e443a6da4b9455b5ca48",
    "kind": "cex",
    "label": "Bybit 17"
  },
  {
    "address": "0x1c3944173abee256456b1498299fc501ad5bbd6f",
    "kind": "cex",
    "label": "Bybit 18"
  },
  {
    "address": "0xa6a9f45518881a788e29f82a032f9d400177d2b6",
    "kind": "cex",
    "label": "Bybit 19"
  },
  {
    "address": "0xb5873e333161e5b45adac57379ec2b15d861178d",
    "kind": "cex",
    "label": "Bybit 20"
  },
  {
    "address": "0x0051ef9259c7ec0644a80e866ab748a2f30841b3",
    "kind": "cex",
    "label": "Bybit 21"
  },
  {
    "address": "0x828424517f9f04015db02169f4026d57b2b07229",
    "kind": "cex",
    "label": "Bybit 22"
  },
  {
    "address": "0x869bcee3a0bad2211a65c63ec47dbd3d85a84d68",
    "kind": "cex",
    "label": "Bybit 23"
  },
  {
    "address": "0x318d2aae4c99c2e74f7b5949fa1c34df837789b8",
    "kind": "cex",
    "label": "Bybit 24"
  },
  {
    "address": "0x18e296053cbdf986196903e889b7dca7a73882f6",
    "kind": "cex",
    "label": "Bybit 25"
  },
  {
    "address": "0x3bd0e57e2917d3d9a93f479b3a23b28c3f31a789",
    "kind": "cex",
    "label": "Bybit 26"
  },
  {
    "address": "0x4865d4bcf4ab92e1c9ba5011560e7d4c36f54106",
    "kind": "cex",
    "label": "Bybit 27"
  },
  {
    "address": "0xa1abfa21f80ecf401bd41365adbb6fef6fefdf09",
    "kind": "cex",
    "label": "Bybit 28"
  },
  {
    "address": "0x72187db55473b693ded367983212fe2db3768829",
    "kind": "cex",
    "label": "Bybit 29"
  },
  {
    "address": "0xcab3f132a11e5b723fc20ddab8bb1b858d00a8e8",
    "kind": "cex",
    "label": "Bybit 30"
  },
  {
    "address": "0xec949f12a3acab835f3eed8b54b7361a8fbb3ee0",
    "kind": "cex",
    "label": "Bybit 31"
  },
  {
    "address": "0x25c7d768a7d53e6ebe5590c621437126c766e1ea",
    "kind": "cex",
    "label": "Bybit 32"
  },
  {
    "address": "0xc22166664e820cda6bf4cedbdbb4fa1e6a84c440",
    "kind": "cex",
    "label": "Bybit 33"
  },
  {
    "address": "0xf2f40c3bb444288f6f64d8336dcc14dbd929fd94",
    "kind": "cex",
    "label": "Bybit 34"
  },
  {
    "address": "0x63bee4a7e4aa5d76dc6ab9b9d1852aabb9a40936",
    "kind": "cex",
    "label": "Bybit 35"
  },
  {
    "address": "0x6b9b774502e6afaafcac84f840ac8a0844a1abe3",
    "kind": "cex",
    "label": "Bybit 36"
  },
  {
    "address": "0x80a9b4aab0ad3c73cce1c9223236b722db5d6628",
    "kind": "cex",
    "label": "Bybit 37"
  },
  {
    "address": "0xdae4fdcb7fc93738ec6d5b1ea92b7c7f75e4f2f6",
    "kind": "cex",
    "label": "Bybit 38"
  },
  {
    "address": "0xbce9aecd3985d4cbb9d273453159a26301fa02ef",
    "kind": "cex",
    "label": "Bybit 39"
  },
  {
    "address": "0x260b364fe0d3d37e6fd3cda0fa50926a06c54cea",
    "kind": "cex",
    "label": "Bybit 40"
  },
  {
    "address": "0x71660c4005ba85c37ccec55d0c4493e66fe775d3",
    "kind": "cex",
    "label": "Coinbase 1"
  },
  {
    "address": "0x503828976d22510aad0201ac7ec88293211d23da",
    "kind": "cex",
    "label": "Coinbase 2"
  },
  {
    "address": "0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740",
    "kind": "cex",
    "label": "Coinbase 3"
  },
  {
    "address": "0x3cd751e6b0078be393132286c442345e5dc49699",
    "kind": "cex",
    "label": "Coinbase 4"
  },
  {
    "address": "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511",
    "kind": "cex",
    "label": "Coinbase 5"
  },
  {
    "address": "0xeb2629a2734e272bcc07bda959863f316f4bd4cf",
    "kind": "cex",
    "label": "Coinbase 6"
  },
  {
    "address": "0xd688aea8f7d450909ade10c47faa95707b0682d9",
    "kind": "cex",
    "label": "Coinbase 7"
  },
  {
    "address": "0x02466e547bfdab679fc49e96bbfc62b9747d997c",
    "kind": "cex",
    "label": "Coinbase 8"
  },
  {
    "address": "0x6b76f8b1e9e59913bfe758821887311ba1805cab",
    "kind": "cex",
    "label": "Coinbase 9"
  },
  {
    "address": "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
    "kind": "cex",
    "label": "Coinbase 10"
  },
  {
    "address": "0x77696bb39917c91a0c3908d577d5e322095425ca",
    "kind": "cex",
    "label": "Coinbase 11"
  },
  {
    "address": "0x7c195d981abfdc3ddecd2ca0fed0958430488e34",
    "kind": "cex",
    "label": "Coinbase 12"
  },
  {
    "address": "0x95a9bd206ae52c4ba8eecfc93d18eacdd41c88cc",
    "kind": "cex",
    "label": "Coinbase 13"
  },
  {
    "address": "0xb739d0895772dbb71a89a3754a160269068f0d45",
    "kind": "cex",
    "label": "Coinbase 14"
  },
  {
    "address": "0x4a4e859565d9b563afc8e63641542455cff0dfd2",
    "kind": "cex",
    "label": "Coinbase 15"
  },
  {
    "address": "0xe1a0ddeb9b5b55e489977b438764e60e314e917c",
    "kind": "cex",
    "label": "Coinbase 16"
  },
  {
    "address": "0x19ab546e77d0cd3245b2aad46bd80dc4707d6307",
    "kind": "cex",
    "label": "Coinbase 17"
  },
  {
    "address": "0xc070a61d043189d99bbf4baa58226bf0991c7b11",
    "kind": "cex",
    "label": "Coinbase 18"
  },
  {
    "address": "0xc8373edfad6d5c5f600b6b2507f78431c5271ff5",
    "kind": "cex",
    "label": "Coinbase 19"
  },
  {
    "address": "0xb624219480543c54603fb6b07d5eb347e51bffe0",
    "kind": "cex",
    "label": "Coinbase 20"
  },
  {
    "address": "0x20fe51a9229eef2cf8ad9e89d91cab9312cf3b7a",
    "kind": "cex",
    "label": "Coinbase 21"
  },
  {
    "address": "0x333d17d3b42bf7930dbc6e852ca7bcf560a69003",
    "kind": "cex",
    "label": "Coinbase 22"
  },
  {
    "address": "0x9810762578accf1f314320cca5b72506ae7d7630",
    "kind": "cex",
    "label": "Coinbase 23"
  },
  {
    "address": "0x3dd1d15b3c78d6acfd75a254e857cbe5b9ff0af2",
    "kind": "cex",
    "label": "Coinbase 24"
  },
  {
    "address": "0xf491d040110384dbcf7f241ffe2a546513fd873d",
    "kind": "cex",
    "label": "Coinbase 25"
  },
  {
    "address": "0xc7bf35c9a3bdd1b1c19a6963de669cb45191a019",
    "kind": "cex",
    "label": "Coinbase 26"
  },
  {
    "address": "0x05e3a758fdd29d28435019ac453297ea37b61b62",
    "kind": "cex",
    "label": "Coinbase 27"
  },
  {
    "address": "0xa3682fe8fd73b90a7564585a436ec2d2aeb612ee",
    "kind": "cex",
    "label": "Coinbase 28"
  },
  {
    "address": "0x739120ade7ed878fca5bbdb806263a8258fe2360",
    "kind": "cex",
    "label": "Coinbase 29"
  },
  {
    "address": "0x8af8485e1f178be06386cd3877fde20626e0284f",
    "kind": "cex",
    "label": "Coinbase 30"
  },
  {
    "address": "0x6dcbce46a8b494c885d0e7b6817d2b519df64467",
    "kind": "cex",
    "label": "Coinbase 31"
  },
  {
    "address": "0xa656f7d2a93a6f5878aa768f24eb38ec8c827fe2",
    "kind": "cex",
    "label": "Coinbase 32"
  },
  {
    "address": "0x7830c87c02e56aff27fa8ab1241711331fa86f43",
    "kind": "cex",
    "label": "Coinbase 33"
  },
  {
    "address": "0xd34ea7278e6bd48defe656bbe263aef11101469c",
    "kind": "cex",
    "label": "Coinbase 34"
  },
  {
    "address": "0xe68ee8a12c611fd043fb05d65e1548dc1383f2b9",
    "kind": "cex",
    "label": "Coinbase 35"
  },
  {
    "address": "0x28c5b0445d0728bc25f143f8eba5c5539fae151a",
    "kind": "cex",
    "label": "Coinbase 36"
  },
  {
    "address": "0xc9aaa6ca0e05b87d53a3e51edbc44b406eeaf299",
    "kind": "cex",
    "label": "Coinbase 37"
  },
  {
    "address": "0x7ed53f6e3de6b2b4156fa8e618506e60d8e65843",
    "kind": "cex",
    "label": "Coinbase 38"
  },
  {
    "address": "0x5122e9aa635c13afd2fc31de3953e0896bac7ab4",
    "kind": "cex",
    "label": "Coinbase 39"
  },
  {
    "address": "0xd839c179a4606f46abd7a757f7bb77d7593ae249",
    "kind": "cex",
    "label": "Coinbase 40"
  },
  {
    "address": "0xcd531ae9efcce479654c4926dec5f6209531ca7b",
    "kind": "cex",
    "label": "Coinbase Prime 1"
  },
  {
    "address": "0xceb69f6342ece283b2f5c9088ff249b5d0ae66ea",
    "kind": "cex",
    "label": "Coinbase Prime 2"
  },
  {
    "address": "0x1e7016f7c23859d097668c27b72c170ed7129a10",
    "kind": "cex",
    "label": "Coinbase Prime 3"
  },
  {
    "address": "0xdfd76bbfeb9eb8322f3696d3567e03f894c40d6c",
    "kind": "cex",
    "label": "Coinbase Prime 4"
  },
  {
    "address": "0xff074a0a637cdc6b86c84656dc8b4cb65540aeb3",
    "kind": "cex",
    "label": "Coinbase Prime 5"
  },
  {
    "address": "0x2bb19257c350428ce8a3f9284e342a56eb38db6a",
    "kind": "cex",
    "label": "Coinbase Prime 6"
  },
  {
    "address": "0x96c9e4ccf136789b682116fc32cda256c2af25d9",
    "kind": "cex",
    "label": "Coinbase Prime 7"
  },
  {
    "address": "0xcf3e4ce49e2df6afb7ebfcb31964597347c06860",
    "kind": "cex",
    "label": "Coinbase Prime 8"
  },
  {
    "address": "0x158f935a3be03d0739da3a50a77af185adae57d8",
    "kind": "cex",
    "label": "Coinbase Prime 9"
  },
  {
    "address": "0xf5a0c616dab7df9f73b1665f34a04270392da29a",
    "kind": "cex",
    "label": "Coinbase Prime 10"
  },
  {
    "address": "0x1f0a7cd3cf2e5ebb7c3261796cd19f24566909c1",
    "kind": "cex",
    "label": "Coinbase Prime 11"
  },
  {
    "address": "0x5a9f2215f821b4a4ab2380a24ccb4e9fa3d4dd64",
    "kind": "cex",
    "label": "Coinbase Prime 12"
  },
  {
    "address": "0x886487e87340e24c7bf8c5920e2fbbdbf808659c",
    "kind": "cex",
    "label": "Coinbase Prime 13"
  },
  {
    "address": "0xa9335f73b460dedbd0cd649ea078c9f341b9c0a9",
    "kind": "cex",
    "label": "Coinbase Prime 14"
  },
  {
    "address": "0xc673fe2b39fe7d72fe7ee4f7230bf9d9c5353ecd",
    "kind": "cex",
    "label": "Coinbase Prime 15"
  },
  {
    "address": "0xc7dc7afd8e0318e5839372bb9148ceaefb006304",
    "kind": "cex",
    "label": "Coinbase Prime 16"
  },
  {
    "address": "0x0328821945a4950015e16b80e40aed34515c35d6",
    "kind": "cex",
    "label": "Coinbase Prime 17"
  },
  {
    "address": "0x8e0c148d6a2dd159345e407f97cda0bb3afc229c",
    "kind": "cex",
    "label": "Coinbase Prime 18"
  },
  {
    "address": "0xc209d851557a8393f170e2399dc3d63d99438204",
    "kind": "cex",
    "label": "Coinbase Prime 19"
  },
  {
    "address": "0x9cadddf86cb6206adf1e3db98bee1e830572874c",
    "kind": "cex",
    "label": "Coinbase Prime 20"
  },
  {
    "address": "0x79b3a3d7b648f43780ac9b637d9375edcea23ce2",
    "kind": "cex",
    "label": "Coinbase Prime 21"
  },
  {
    "address": "0x210cfd778391f3623171ad4c283dd49339c58906",
    "kind": "cex",
    "label": "Coinbase Prime 22"
  },
  {
    "address": "0xd9af552fea56c2dd0a8805bdd3caf54c6be229c0",
    "kind": "cex",
    "label": "Coinbase Prime 23"
  },
  {
    "address": "0x5389531947033f943b5ace43668f75a6deeba250",
    "kind": "cex",
    "label": "Coinbase Prime 24"
  },
  {
    "address": "0x2ee9401ee097de023b0a9b2c4fa2894ef5514ab1",
    "kind": "cex",
    "label": "Coinbase Prime 25"
  },
  {
    "address": "0xb1dcfbf0aac1113d2deae9bcb1f1711e5154d0c2",
    "kind": "cex",
    "label": "Coinbase Prime 26"
  },
  {
    "address": "0x6938010d7b633c707d224ff2c31a85f7340630a4",
    "kind": "cex",
    "label": "Coinbase Prime 27"
  },
  {
    "address": "0xe2152acc979dfabda98ce445ca1e53686c12d581",
    "kind": "cex",
    "label": "Coinbase Prime 28"
  },
  {
    "address": "0xa7a64339ddce970a619a09756f8b5664130b8a5b",
    "kind": "cex",
    "label": "Coinbase Prime 29"
  },
  {
    "address": "0xb3afb7f3c0f7675a5503d03eff60b449f71bfdac",
    "kind": "cex",
    "label": "Coinbase Prime 30"
  },
  {
    "address": "0x834a02a81880dbc1b6793bece3c934473683674e",
    "kind": "cex",
    "label": "Coinbase Prime 31"
  },
  {
    "address": "0x7a514e9a48c7c62f59567bd9e9525d95a579617e",
    "kind": "cex",
    "label": "Coinbase Prime 32"
  },
  {
    "address": "0x11cbfa3b00f66cfb928df038986d7527b16061ef",
    "kind": "cex",
    "label": "Coinbase Prime 33"
  },
  {
    "address": "0x70f9967562626f7b96b64f1dacdeac215875b7bd",
    "kind": "cex",
    "label": "Coinbase Prime 34"
  },
  {
    "address": "0xd6e3c39505af55265d10ba75355f7936341fe1b9",
    "kind": "cex",
    "label": "Coinbase Prime 35"
  },
  {
    "address": "0x1cfbc6fff17dabfa70fe69708dc883a77b41df31",
    "kind": "cex",
    "label": "Coinbase Prime 36"
  },
  {
    "address": "0xc532b16c5fb1405e22e425aa0811328018724911",
    "kind": "cex",
    "label": "Coinbase Prime 37"
  },
  {
    "address": "0x0895caced168f3ce9a8f255f0e49e5a0fd2d5c2f",
    "kind": "cex",
    "label": "Coinbase Prime 38"
  },
  {
    "address": "0x3f827dcf5830310bb0a4837e628fc4a151198915",
    "kind": "cex",
    "label": "Coinbase Prime 39"
  },
  {
    "address": "0x56b576dffb98a5ec690ab8fc43c1ab701e2d3f72",
    "kind": "cex",
    "label": "Coinbase Prime 40"
  },
  {
    "address": "0x6262998ced04146fa42253a5c0af90ca02dfd2a3",
    "kind": "cex",
    "label": "Crypto.com 1"
  },
  {
    "address": "0x46340b20830761efd32832a74d7169b29feb9758",
    "kind": "cex",
    "label": "Crypto.com 2"
  },
  {
    "address": "0x72a53cdbbcc1b9efa39c834a540550e23463aacb",
    "kind": "cex",
    "label": "Crypto.com 3"
  },
  {
    "address": "0x7758e507850da48cd47df1fb5f875c23e3340c50",
    "kind": "cex",
    "label": "Crypto.com 4"
  },
  {
    "address": "0xcffad3200574698b78f32232aa9d63eabd290703",
    "kind": "cex",
    "label": "Crypto.com 5"
  },
  {
    "address": "0xf3b0073e3a7f747c7a38b36b805247b222c302a3",
    "kind": "cex",
    "label": "Crypto.com 6"
  },
  {
    "address": "0x9fb538820d4fde2fcc509dc01ae73a192f36cfcc",
    "kind": "cex",
    "label": "Crypto.com 7"
  },
  {
    "address": "0x0ecc16d3fa38e1a59c10e44cda4e2e9d9941275a",
    "kind": "cex",
    "label": "Crypto.com 8"
  },
  {
    "address": "0xd7a827fbaf38c98e8336c5658e4bcbcd20a4fd2d",
    "kind": "cex",
    "label": "Crypto.com 9"
  },
  {
    "address": "0x20fa1822a87d4e7a3ccf20f86e716ef3772ecff1",
    "kind": "cex",
    "label": "Crypto.com 10"
  },
  {
    "address": "0xd3d877fc323de661ff9e1a38147a1ac679ce7c64",
    "kind": "cex",
    "label": "Crypto.com 11"
  },
  {
    "address": "0x1714400ff23db4af24f9fd64e7039e6597f18c2b",
    "kind": "cex",
    "label": "Crypto.com 12"
  },
  {
    "address": "0x625b02b687ec38f3085af5b108dda410775fa76a",
    "kind": "cex",
    "label": "Crypto.com 13"
  },
  {
    "address": "0xfa0b641678f5115ad8a8de5752016bd1359681b9",
    "kind": "cex",
    "label": "Crypto.com 14"
  },
  {
    "address": "0x7aad7840f119f3876ee3569e488c7c4135f695fa",
    "kind": "cex",
    "label": "Crypto.com 15"
  },
  {
    "address": "0x92bd687953da50855aee2df0cff282cc2d5f226b",
    "kind": "cex",
    "label": "Crypto.com 16"
  },
  {
    "address": "0x187b2d576ba7ec2141c180a96edd0f202492f36b",
    "kind": "cex",
    "label": "Crypto.com 17"
  },
  {
    "address": "0x9a552417cfc942a5c88ab474756d3d9962f917c0",
    "kind": "cex",
    "label": "Crypto.com 18"
  },
  {
    "address": "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b",
    "kind": "cex",
    "label": "Crypto.com 19"
  },
  {
    "address": "0x2c2301fdb0bfa06eaabaa0122cbceb2265337c25",
    "kind": "cex",
    "label": "Crypto.com 20"
  },
  {
    "address": "0x8a161a996617f130d0f37478483afc8c1914db6d",
    "kind": "cex",
    "label": "Crypto.com 21"
  },
  {
    "address": "0xce2cc46682e9c6d5f174af598fb4931a9c0be68e",
    "kind": "cex",
    "label": "Crypto.com 22"
  },
  {
    "address": "0xb428523cdda53640a62e9f26c2d8613a9159b282",
    "kind": "cex",
    "label": "Crypto.com 23"
  },
  {
    "address": "0x17e49502febdf7b3bd3a9842a325036d729b7654",
    "kind": "cex",
    "label": "Crypto.com 24"
  },
  {
    "address": "0x8bc87020028a07e5ed17824b4fe0e2afcd823b2e",
    "kind": "cex",
    "label": "Crypto.com 25"
  },
  {
    "address": "0xa023f08c70a23abc7edfc5b6b5e171d78dfc947e",
    "kind": "cex",
    "label": "Crypto.com 26"
  },
  {
    "address": "0xcbf25a7c3f305ce9d0747b933ea314568abee40b",
    "kind": "cex",
    "label": "Crypto.com 27"
  },
  {
    "address": "0x09fa1f3461152d243ca1e5c59d0e228caaf1f2b8",
    "kind": "cex",
    "label": "Crypto.com 28"
  },
  {
    "address": "0xf8422385032dcded2e8af849058ae32543a3665e",
    "kind": "cex",
    "label": "Crypto.com 29"
  },
  {
    "address": "0x4c9df57276dc17dee5635ded208c07b0be32afd0",
    "kind": "cex",
    "label": "Crypto.com 30"
  },
  {
    "address": "0xc043fb6cb57acd89635d54802c2f8a95daf210e8",
    "kind": "cex",
    "label": "Crypto.com 31"
  },
  {
    "address": "0x42ed232dc3e65b3534dbb42d07a3f67a618f66a3",
    "kind": "cex",
    "label": "Crypto.com 32"
  },
  {
    "address": "0xb7333d779c6ecdfc4507a53706b0e173bd086a18",
    "kind": "cex",
    "label": "Crypto.com 33"
  },
  {
    "address": "0x5b71d5fd6bb118665582dd87922bf3b9de6c75f9",
    "kind": "cex",
    "label": "Crypto.com 34"
  },
  {
    "address": "0x589abd0cdcd897240f311f1eff8635271f6c605b",
    "kind": "cex",
    "label": "Crypto.com 35"
  },
  {
    "address": "0xd3e0341b361134014e0c89378b3e36bc5020cd97",
    "kind": "cex",
    "label": "Crypto.com 36"
  },
  {
    "address": "0xa8936fee3c966060849d14b6f8e71fb2c73213b3",
    "kind": "cex",
    "label": "Crypto.com 37"
  },
  {
    "address": "0x24eb3a39856723138796c5068a17ba4fb15cd25e",
    "kind": "cex",
    "label": "Crypto.com 38"
  },
  {
    "address": "0x2d17db18b41c92e64abaefb7e35ed70ed45b6dc8",
    "kind": "cex",
    "label": "Crypto.com 39"
  },
  {
    "address": "0x0a80992f815973ad7e7a9c340760fed41d96c450",
    "kind": "cex",
    "label": "Crypto.com 40"
  },
  {
    "address": "0x0d0707963952f2fba59dd06f2b425ace40b492fe",
    "kind": "cex",
    "label": "Gate.io 1"
  },
  {
    "address": "0x7793cd85c11a924478d358d49b05b37e91b5810f",
    "kind": "cex",
    "label": "Gate.io 2"
  },
  {
    "address": "0x1c4b70a3968436b9a0a9cf5205c787eb81bb558c",
    "kind": "cex",
    "label": "Gate.io 3"
  },
  {
    "address": "0x234ee9e35f8e9749a002fc42970d570db716453b",
    "kind": "cex",
    "label": "Gate.io 4"
  },
  {
    "address": "0xc882b111a75c0c657fc507c04fbfcd2cc984f071",
    "kind": "cex",
    "label": "Gate.io 5"
  },
  {
    "address": "0x05ee546c1a62f90d7acbffd6d846c9c54c7cf94c",
    "kind": "cex",
    "label": "Gate.io 6"
  },
  {
    "address": "0x85faa6c1f2450b9caea300838981c2e6e120c35c",
    "kind": "cex",
    "label": "Gate.io 7"
  },
  {
    "address": "0x925206b8a707096ed26ae47c84747fe0bb734f59",
    "kind": "cex",
    "label": "Gate.io 8"
  },
  {
    "address": "0xeb01f8cdae433e7b55023ff0b2da44c4c712dce2",
    "kind": "cex",
    "label": "Gate.io 9"
  },
  {
    "address": "0xb7715cb185990a1d7fede7bb5a3c369296018279",
    "kind": "cex",
    "label": "Gate.io 10"
  },
  {
    "address": "0x6596da8b65995d5feacff8c2936f0b7a2051b0d0",
    "kind": "cex",
    "label": "Gate.io Gas Supplier 1"
  },
  {
    "address": "0xd793281182a0e3e023116004778f45c29fc14f19",
    "kind": "cex",
    "label": "Gate.io Contract"
  },
  {
    "address": "0xd24400ae8bfebb18ca49be86258a3c749cf46853",
    "kind": "cex",
    "label": "Gemini 1"
  },
  {
    "address": "0x6fc82a5fe25a5cdb58bc74600a40a69c065263f8",
    "kind": "cex",
    "label": "Gemini 2"
  },
  {
    "address": "0x61edcdf5bb737adffe5043706e7c5bb1f1a56eea",
    "kind": "cex",
    "label": "Gemini 3"
  },
  {
    "address": "0x5f65f7b609678448494de4c87521cdf6cef1e932",
    "kind": "cex",
    "label": "Gemini 4"
  },
  {
    "address": "0xb302bfe9c246c6e150af70b1caaa5e3df60dac05",
    "kind": "cex",
    "label": "Gemini 5"
  },
  {
    "address": "0x8d6f396d210d385033b348bcae9e4f9ea4e045bd",
    "kind": "cex",
    "label": "Gemini 6"
  },
  {
    "address": "0xd69b0089d9ca950640f5dc9931a41a5965f00303",
    "kind": "cex",
    "label": "Gemini 7"
  },
  {
    "address": "0x183b1ffb0aa9213b9335adfad82e47bfb02f8d24",
    "kind": "cex",
    "label": "Gemini 8"
  },
  {
    "address": "0xf51710015536957a01f32558402902a2d9c35d82",
    "kind": "cex",
    "label": "Gemini 9"
  },
  {
    "address": "0x3e6722f32cbe5b3c7bd3dca7017c7ffe1b9e5a2a",
    "kind": "cex",
    "label": "Gemini 10"
  },
  {
    "address": "0xb1cce076e720300c4e49b529a7ce0e58d3c0e8fe",
    "kind": "cex",
    "label": "Gemini 11"
  },
  {
    "address": "0xafcd96e580138cfa2332c632e66308eacd45c5da",
    "kind": "cex",
    "label": "Gemini 12"
  },
  {
    "address": "0xb068656a1ab9609ef628c65c71c379f9d625815d",
    "kind": "cex",
    "label": "Gemini 13"
  },
  {
    "address": "0x066a10831d783fe4e08b7676d9881c77298ed298",
    "kind": "cex",
    "label": "Gemini 14"
  },
  {
    "address": "0xdd51f01d9fc0fd084c1a4737bbfa5becb6ced9bc",
    "kind": "cex",
    "label": "Gemini Deployer"
  },
  {
    "address": "0x4c2f150fc90fed3d8281114c2349f1906cde5346",
    "kind": "cex",
    "label": "Gemini Deployer 2"
  },
  {
    "address": "0x07ee55aa48bb72dcc6e9d78256648910de513eca",
    "kind": "cex",
    "label": "Gemini Contract 1"
  },
  {
    "address": "0x485b9a41e8bf06e57bb64c6ba7cb04f9d53d2d76",
    "kind": "cex",
    "label": "Gemini Contract 2"
  },
  {
    "address": "0x9d549ad2ce668271fb1354af19b1668fdb86d818",
    "kind": "cex",
    "label": "Gemini Gas Supplier 1"
  },
  {
    "address": "0xab5c66752a9e8167967685f1450532fb96d5d24f",
    "kind": "cex",
    "label": "HTX 1"
  },
  {
    "address": "0x6748f50f686bfbca6fe8ad62b22228b87f31ff2b",
    "kind": "cex",
    "label": "HTX 2"
  },
  {
    "address": "0xfdb16996831753d5331ff813c29a93c76834a0ad",
    "kind": "cex",
    "label": "HTX 3"
  },
  {
    "address": "0xeee28d484628d41a82d01e21d12e2e78d69920da",
    "kind": "cex",
    "label": "HTX 4"
  },
  {
    "address": "0x5c985e89dde482efe97ea9f1950ad149eb73829b",
    "kind": "cex",
    "label": "HTX 5"
  },
  {
    "address": "0xdc76cd25977e0a5ae17155770273ad58648900d3",
    "kind": "cex",
    "label": "HTX 6"
  },
  {
    "address": "0xadb2b42f6bd96f5c65920b9ac88619dce4166f94",
    "kind": "cex",
    "label": "HTX 7"
  },
  {
    "address": "0xa8660c8ffd6d578f657b72c0c811284aef0b735e",
    "kind": "cex",
    "label": "HTX 8"
  },
  {
    "address": "0x1062a747393198f70f71ec65a582423dba7e5ab3",
    "kind": "cex",
    "label": "HTX 9"
  },
  {
    "address": "0xe93381fb4c4f14bda253907b18fad305d799241a",
    "kind": "cex",
    "label": "HTX 10"
  },
  {
    "address": "0xfa4b5be3f2f84f56703c42eb22142744e95a2c58",
    "kind": "cex",
    "label": "HTX 11"
  },
  {
    "address": "0x46705dfff24256421a05d056c29e81bdc09723b8",
    "kind": "cex",
    "label": "HTX 12"
  },
  {
    "address": "0x32598293906b5b17c27d657db3ad2c9b3f3e4265",
    "kind": "cex",
    "label": "HTX 13"
  },
  {
    "address": "0x5861b8446a2f6e19a067874c133f04c578928727",
    "kind": "cex",
    "label": "HTX 14"
  },
  {
    "address": "0x926fc576b7facf6ae2d08ee2d4734c134a743988",
    "kind": "cex",
    "label": "HTX 15"
  },
  {
    "address": "0xeec606a66edb6f497662ea31b5eb1610da87ab5f",
    "kind": "cex",
    "label": "HTX 16"
  },
  {
    "address": "0x7ef35bb398e0416b81b019fea395219b65c52164",
    "kind": "cex",
    "label": "HTX 17"
  },
  {
    "address": "0x229b5c097f9b35009ca1321ad2034d4b3d5070f6",
    "kind": "cex",
    "label": "HTX 18"
  },
  {
    "address": "0xd8a83b72377476d0a66683cde20a8aad0b628713",
    "kind": "cex",
    "label": "HTX 19"
  },
  {
    "address": "0x90e9ddd9d8d5ae4e3763d0cf856c97594dea7325",
    "kind": "cex",
    "label": "HTX 20"
  },
  {
    "address": "0x30741289523c2e4d2a62c7d6722686d14e723851",
    "kind": "cex",
    "label": "HTX 21"
  },
  {
    "address": "0x6f48a3e70f0251d1e83a989e62aaa2281a6d5380",
    "kind": "cex",
    "label": "HTX 22"
  },
  {
    "address": "0xf056f435ba0cc4fcd2f1b17e3766549ffc404b94",
    "kind": "cex",
    "label": "HTX 23"
  },
  {
    "address": "0x137ad9c4777e1d36e4b605e745e8f37b2b62e9c5",
    "kind": "cex",
    "label": "HTX 24"
  },
  {
    "address": "0x5401dbf7da53e1c9dbf484e3d69505815f2f5e6e",
    "kind": "cex",
    "label": "HTX 25"
  },
  {
    "address": "0x034f854b44d28e26386c1bc37ff9b20c6380b00d",
    "kind": "cex",
    "label": "HTX 26"
  },
  {
    "address": "0x0577a79cfc63bbc0df38833ff4c4a3bf2095b404",
    "kind": "cex",
    "label": "HTX 27"
  },
  {
    "address": "0x0c6c34cdd915845376fb5407e0895196c9dd4eec",
    "kind": "cex",
    "label": "HTX 28"
  },
  {
    "address": "0x794d28ac31bcb136294761a556b68d2634094153",
    "kind": "cex",
    "label": "HTX 29"
  },
  {
    "address": "0x34189c75cbb13bdb4f5953cda6c3045cfca84a9e",
    "kind": "cex",
    "label": "HTX 30"
  },
  {
    "address": "0xb4cd0386d2db86f30c1a11c2b8c4f4185c1dade9",
    "kind": "cex",
    "label": "HTX 31"
  },
  {
    "address": "0x4d77a1144dc74f26838b69391a6d3b1e403d0990",
    "kind": "cex",
    "label": "HTX 32"
  },
  {
    "address": "0x28ffe35688ffffd0659aee2e34778b0ae4e193ad",
    "kind": "cex",
    "label": "HTX 33"
  },
  {
    "address": "0xcac725bef4f114f728cbcfd744a731c2a463c3fc",
    "kind": "cex",
    "label": "HTX 34"
  },
  {
    "address": "0x73f8fc2e74302eb2efda125a326655acf0dc2d1b",
    "kind": "cex",
    "label": "HTX 35"
  },
  {
    "address": "0x0a98fb70939162725ae66e626fe4b52cff62c2e5",
    "kind": "cex",
    "label": "HTX 36"
  },
  {
    "address": "0xf66852bc122fd40bfecc63cd48217e88bda12109",
    "kind": "cex",
    "label": "HTX 37"
  },
  {
    "address": "0x49517ca7b7a50f592886d4c74175f4c07d460a70",
    "kind": "cex",
    "label": "HTX 38"
  },
  {
    "address": "0x58c2cb4a6bee98c309215d0d2a38d7f8aa71211c",
    "kind": "cex",
    "label": "HTX 39"
  },
  {
    "address": "0x39d9f4640b98189540a9c0edcfa95c5e657706aa",
    "kind": "cex",
    "label": "HTX 40"
  },
  {
    "address": "0x2910543af39aba0cd09dbb2d50200b3e800a63d2",
    "kind": "cex",
    "label": "Kraken 1"
  },
  {
    "address": "0x0a869d79a7052c7f1b55a8ebabbea3420f0d1e13",
    "kind": "cex",
    "label": "Kraken 2"
  },
  {
    "address": "0xe853c56864a2ebe4576a807d26fdc4a0ada51919",
    "kind": "cex",
    "label": "Kraken 3"
  },
  {
    "address": "0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0",
    "kind": "cex",
    "label": "Kraken 4"
  },
  {
    "address": "0xfa52274dd61e1643d2205169732f29114bc240b3",
    "kind": "cex",
    "label": "Kraken 5"
  },
  {
    "address": "0x53d284357ec70ce289d6d64134dfac8e511c8a3d",
    "kind": "cex",
    "label": "Kraken 6"
  },
  {
    "address": "0x89e51fa8ca5d66cd220baed62ed01e8951aa7c40",
    "kind": "cex",
    "label": "Kraken 7"
  },
  {
    "address": "0xc6bed363b30df7f35b601a5547fe56cd31ec63da",
    "kind": "cex",
    "label": "Kraken 8"
  },
  {
    "address": "0x29728d0efd284d85187362faa2d4d76c2cfc2612",
    "kind": "cex",
    "label": "Kraken 9"
  },
  {
    "address": "0xae2d4617c862309a3d75a0ffb358c7a5009c673f",
    "kind": "cex",
    "label": "Kraken 10"
  },
  {
    "address": "0x43984d578803891dfa9706bdeee6078d80cfc79e",
    "kind": "cex",
    "label": "Kraken 11"
  },
  {
    "address": "0x66c57bf505a85a74609d2c83e94aabb26d691e1f",
    "kind": "cex",
    "label": "Kraken 12"
  },
  {
    "address": "0xda9dfa130df4de4673b89022ee50ff26f6ea73cf",
    "kind": "cex",
    "label": "Kraken 13"
  },
  {
    "address": "0xa83b11093c858c86321fbc4c20fe82cdbd58e09e",
    "kind": "cex",
    "label": "Kraken 14"
  },
  {
    "address": "0x79990a901281bee059bb3f4d7db477f7495e2049",
    "kind": "cex",
    "label": "Kraken 15"
  },
  {
    "address": "0x1f7bc4da1a0c2e49d7ef542f74cd46a3fe592cb1",
    "kind": "cex",
    "label": "Kraken 16"
  },
  {
    "address": "0x2d070ed1321871841245d8ee5b84bd2712644322",
    "kind": "cex",
    "label": "Kraken 17"
  },
  {
    "address": "0x8f9c79b9de8b0713dcac3e535fc5a1a92db6ea2d",
    "kind": "cex",
    "label": "Kraken 18"
  },
  {
    "address": "0xb874005cbea25c357b31c62145b3aef219d105cf",
    "kind": "cex",
    "label": "Kraken 19"
  },
  {
    "address": "0x555e179d64335945fc6b155b7235a31b0a595542",
    "kind": "cex",
    "label": "Kraken 20"
  },
  {
    "address": "0x62ac55b745f9b08f1a81dcbbe630277095cf4be1",
    "kind": "cex",
    "label": "Kraken 21"
  },
  {
    "address": "0x92927a664c88449318e14d0fd582c787ae2cd934",
    "kind": "cex",
    "label": "Kraken 22"
  },
  {
    "address": "0x9c2bd617b77961ee2c5e3038dfb0c822cb75d82a",
    "kind": "cex",
    "label": "Kraken 23"
  },
  {
    "address": "0xe84f75fc9caa49876d0ba18d309da4231d44e94d",
    "kind": "cex",
    "label": "Kraken 24"
  },
  {
    "address": "0x490b1e689ca23be864e55b46bf038e007b528208",
    "kind": "cex",
    "label": "Kraken 25"
  },
  {
    "address": "0x098cae2debcedcedcaf71e43c1c055c0ec369492",
    "kind": "cex",
    "label": "Kraken 26"
  },
  {
    "address": "0x9da5812111dcbd65ff9b736874a89751a4f0a2f8",
    "kind": "cex",
    "label": "Kraken 27"
  },
  {
    "address": "0xe7178ad747f2c12ab1f8332e61cf6e756815d5c6",
    "kind": "cex",
    "label": "Kraken 28"
  },
  {
    "address": "0xadae2f3b0db76cb3eafe76a8bf99b93f099c140a",
    "kind": "cex",
    "label": "Kraken 29"
  },
  {
    "address": "0x52f5f2add61c835ff10550402a46621ebd1071d5",
    "kind": "cex",
    "label": "Kraken 30"
  },
  {
    "address": "0x098cbdd8eb01b19d37539644821772e9bde12d55",
    "kind": "cex",
    "label": "Kraken 31"
  },
  {
    "address": "0xf1f7648f81f5219c36d75d24d33811f16b426dbe",
    "kind": "cex",
    "label": "Kraken 32"
  },
  {
    "address": "0xe850b7c87f66371035e184c72d4b99e7b2ca4865",
    "kind": "cex",
    "label": "Kraken 33"
  },
  {
    "address": "0x0e33be39b13c576ff48e14392fbf96b02f40cd34",
    "kind": "cex",
    "label": "Kraken 34"
  },
  {
    "address": "0x53ab4a93b31f480d17d3440a6329bda86869458a",
    "kind": "cex",
    "label": "Kraken 35"
  },
  {
    "address": "0x10593a64b7b7bb0ea29b8c01f1619ca8ff294b2f",
    "kind": "cex",
    "label": "Kraken 36"
  },
  {
    "address": "0x808e5374106e820ae54662fcf8a5e3cca6afa13d",
    "kind": "cex",
    "label": "Kraken 37"
  },
  {
    "address": "0xce27fc71139d02f9a3d5cc1356add185750660ac",
    "kind": "cex",
    "label": "Kraken 38"
  },
  {
    "address": "0x012480c08d20a14cf3cb495e942a94dd926dcc8f",
    "kind": "cex",
    "label": "Kraken 39"
  },
  {
    "address": "0xcdc8488e63a403bfd580222ea0f3719477bfea9c",
    "kind": "cex",
    "label": "Kraken 40"
  },
  {
    "address": "0x2b5634c42055806a59e9107ed44d43c426e58258",
    "kind": "cex",
    "label": "KuCoin 1"
  },
  {
    "address": "0x689c56aef474df92d44a1b70850f808488f9769c",
    "kind": "cex",
    "label": "KuCoin 2"
  },
  {
    "address": "0xa1d8d972560c2f8144af871db508f0b0b10a3fbf",
    "kind": "cex",
    "label": "KuCoin 3"
  },
  {
    "address": "0x4ad64983349c49defe8d7a4686202d24b25d0ce8",
    "kind": "cex",
    "label": "KuCoin 4"
  },
  {
    "address": "0x1692e170361cefd1eb7240ec13d048fd9af6d667",
    "kind": "cex",
    "label": "KuCoin 5"
  },
  {
    "address": "0xd6216fc19db775df9774a6e33526131da7d19a2c",
    "kind": "cex",
    "label": "KuCoin 6"
  },
  {
    "address": "0xe59cd29be3be4461d79c0881d238cbe87d64595a",
    "kind": "cex",
    "label": "KuCoin 7"
  },
  {
    "address": "0x899b5d52671830f567bf43a14684eb14e1f945fe",
    "kind": "cex",
    "label": "KuCoin 8"
  },
  {
    "address": "0xf16e9b0d03470827a95cdfd0cb8a8a3b46969b91",
    "kind": "cex",
    "label": "KuCoin 9"
  },
  {
    "address": "0xcad621da75a66c7a8f4ff86d30a2bf981bfc8fdd",
    "kind": "cex",
    "label": "KuCoin 10"
  },
  {
    "address": "0xec30d02f10353f8efc9601371f56e808751f396f",
    "kind": "cex",
    "label": "KuCoin 11"
  },
  {
    "address": "0x738cf6903e6c4e699d1c2dd9ab8b67fcdb3121ea",
    "kind": "cex",
    "label": "KuCoin 12"
  },
  {
    "address": "0xd89350284c7732163765b23338f2ff27449e0bf5",
    "kind": "cex",
    "label": "KuCoin 13"
  },
  {
    "address": "0x88bd4d3e2997371bceefe8d9386c6b5b4de60346",
    "kind": "cex",
    "label": "KuCoin 14"
  },
  {
    "address": "0xb8e6d31e7b212b2b7250ee9c26c56cebbfbe6b23",
    "kind": "cex",
    "label": "KuCoin 15"
  },
  {
    "address": "0xe66845fd840fc7e489bcb61241fff5b7fc5f1f0e",
    "kind": "cex",
    "label": "KuCoin 16"
  },
  {
    "address": "0x03e6fa590cadcf15a38e86158e9b3d06ff3399ba",
    "kind": "cex",
    "label": "KuCoin 17"
  },
  {
    "address": "0xf3f094484ec6901ffc9681bcb808b96bafd0b8a8",
    "kind": "cex",
    "label": "KuCoin 18"
  },
  {
    "address": "0xa3f45e619ce3aae2fa5f8244439a66b203b78bcc",
    "kind": "cex",
    "label": "KuCoin 19"
  },
  {
    "address": "0xebb8ea128bbdff9a1780a4902a9380022371d466",
    "kind": "cex",
    "label": "KuCoin 20"
  },
  {
    "address": "0x45300136662dd4e58fc0df61e6290dffd992b785",
    "kind": "cex",
    "label": "KuCoin 21"
  },
  {
    "address": "0x635308e731a878741bfec299e67f5fd28c7553d9",
    "kind": "cex",
    "label": "KuCoin 22"
  },
  {
    "address": "0x9ac5637d295fea4f51e086c329d791cc157b1c84",
    "kind": "cex",
    "label": "KuCoin 23"
  },
  {
    "address": "0xcd5f3c15120a1021155174719ec5fcf2c75adf5b",
    "kind": "cex",
    "label": "KuCoin 24"
  },
  {
    "address": "0xb9f79fc4b7a2f5fb33493ab5d018db811c9c2f02",
    "kind": "cex",
    "label": "KuCoin 25"
  },
  {
    "address": "0xd91efec7e42f80156d1d9f660a69847188950747",
    "kind": "cex",
    "label": "KuCoin 26"
  },
  {
    "address": "0x4e75e27e5aa74f0c7a9d4897dc10ef651f3a3995",
    "kind": "cex",
    "label": "KuCoin 27"
  },
  {
    "address": "0x14ea40648fc8c1781d19363f5b9cc9a877ac2469",
    "kind": "cex",
    "label": "KuCoin 28"
  },
  {
    "address": "0x17a30350771d02409046a683b18fe1c13ccfc4a8",
    "kind": "cex",
    "label": "KuCoin 29"
  },
  {
    "address": "0x2a8c8b09bd77c13980495a959b26c1305166a57f",
    "kind": "cex",
    "label": "KuCoin 30"
  },
  {
    "address": "0x53f78a071d04224b8e254e243fffc6d9f2f3fa23",
    "kind": "cex",
    "label": "KuCoin 31"
  },
  {
    "address": "0x58edf78281334335effa23101bbe3371b6a36a51",
    "kind": "cex",
    "label": "KuCoin 32"
  },
  {
    "address": "0x7491f26a0fcb459111b3a1db2fbfc4035d096933",
    "kind": "cex",
    "label": "KuCoin 33"
  },
  {
    "address": "0x77f59b595cac829575e262b4c8bbcb17abadb33a",
    "kind": "cex",
    "label": "KuCoin 34"
  },
  {
    "address": "0x7b915c27a0ed48e2ce726ee40f20b2bf8a88a1b3",
    "kind": "cex",
    "label": "KuCoin 35"
  },
  {
    "address": "0x83c41363cbee0081dab75cb841fa24f3db46627e",
    "kind": "cex",
    "label": "KuCoin 36"
  },
  {
    "address": "0x9f4cf329f4cf376b7aded854d6054859dd102a2a",
    "kind": "cex",
    "label": "KuCoin 37"
  },
  {
    "address": "0xa152f8bb749c55e9943a3a0a3111d18ee2b3f94e",
    "kind": "cex",
    "label": "KuCoin 38"
  },
  {
    "address": "0x3ad7d43702bc2177cc9ec655b6ee724136891ef4",
    "kind": "cex",
    "label": "KuCoin 39"
  },
  {
    "address": "0xa649ffc455ac7c5acc1bc35726fce54e25eb59f9",
    "kind": "cex",
    "label": "KuCoin 40"
  },
  {
    "address": "0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88",
    "kind": "cex",
    "label": "MEXC 1"
  },
  {
    "address": "0x0211f3cedbef3143223d3acf0e589747933e8527",
    "kind": "cex",
    "label": "MEXC 2"
  },
  {
    "address": "0x3cc936b795a188f0e246cbb2d74c5bd190aecf18",
    "kind": "cex",
    "label": "MEXC 3"
  },
  {
    "address": "0x4982085c9e2f89f2ecb8131eca71afad896e89cb",
    "kind": "cex",
    "label": "MEXC 4"
  },
  {
    "address": "0x2e8f79ad740de90dc5f5a9f0d8d9661a60725e64",
    "kind": "cex",
    "label": "MEXC 5"
  },
  {
    "address": "0x83c1c224044ef8573e9a728dbb91013cf80827e6",
    "kind": "cex",
    "label": "MEXC 6"
  },
  {
    "address": "0xdf90c9b995a3b10a5b8570a47101e6c6a29eb945",
    "kind": "cex",
    "label": "MEXC 7"
  },
  {
    "address": "0x51e3d44172868acc60d68ca99591ce4230bc75e0",
    "kind": "cex",
    "label": "MEXC 8"
  },
  {
    "address": "0xffb3118124cdaebd9095fa9a479895042018cac2",
    "kind": "cex",
    "label": "MEXC 9"
  },
  {
    "address": "0x9b64203878f24eb0cdf55c8c6fa7d08ba0cf77e5",
    "kind": "cex",
    "label": "MEXC 10"
  },
  {
    "address": "0x576b81f0c21edbc920ad63feeeb2b0736b018a58",
    "kind": "cex",
    "label": "MEXC 11"
  },
  {
    "address": "0x8e1701cfd85258ddb8dfe89bc4c7350822b9601d",
    "kind": "cex",
    "label": "MEXC 12"
  },
  {
    "address": "0x0162cd2ba40e23378bf0fd41f919e1be075f025f",
    "kind": "cex",
    "label": "MEXC 13"
  },
  {
    "address": "0x4e3ae00e8323558fa5cac04b152238924aa31b60",
    "kind": "cex",
    "label": "MEXC 14"
  },
  {
    "address": "0x9bb6a22da110c6c9bab745bcaf0ee142ee83af37",
    "kind": "cex",
    "label": "MEXC 15"
  },
  {
    "address": "0xb86f1061e0d79e8319339d5fdbb187d4e7ad3300",
    "kind": "cex",
    "label": "MEXC 16"
  },
  {
    "address": "0x4b68038e910941b7438e70a3943dcc4fd543715c",
    "kind": "cex",
    "label": "MEXC 17"
  },
  {
    "address": "0x680178d61d910736153991660c5710841c440ec7",
    "kind": "cex",
    "label": "MEXC 18"
  },
  {
    "address": "0x016c685d3379a515c64e7d85de8c0be11127f1d5",
    "kind": "cex",
    "label": "MEXC 19"
  },
  {
    "address": "0x5c30940a4544ca845272fe97c4a27f2ed2cd7b64",
    "kind": "cex",
    "label": "MEXC 20"
  },
  {
    "address": "0x9642b23ed1e01df1092b92641051881a322f5d4e",
    "kind": "cex",
    "label": "MEXC 21"
  },
  {
    "address": "0x9b79cc64cd3e5ec86d951acb27ddbd9ed660cd07",
    "kind": "cex",
    "label": "MEXC Gas Supplier 1"
  },
  {
    "address": "0xc2149f0d56e227e39077bf4d592f6314098f3b29",
    "kind": "cex",
    "label": "MEXC Gas Supplier 2"
  },
  {
    "address": "0xe8832a868c091263ed190a9f4be304a03895dd91",
    "kind": "cex",
    "label": "MEXC Gas Supplier 3"
  },
  {
    "address": "0x9dd35021d77c1de5ed50b9d788a2f68903a96b96",
    "kind": "cex",
    "label": "mexc kaia"
  },
  {
    "address": "0x6cc5f688a315f3dc28a7781717a9a798a59fda7b",
    "kind": "cex",
    "label": "OKX 1"
  },
  {
    "address": "0x236f9f97e0e62388479bf9e5ba4889e46b0273c3",
    "kind": "cex",
    "label": "OKX 2"
  },
  {
    "address": "0xa7efae728d2936e78bda97dc267687568dd593f3",
    "kind": "cex",
    "label": "OKX 3"
  },
  {
    "address": "0x2c8fbb630289363ac80705a1a61273f76fd5a161",
    "kind": "cex",
    "label": "OKX 4"
  },
  {
    "address": "0x59fae149a8f8ec74d5bc038f8b76d25b136b9573",
    "kind": "cex",
    "label": "OKX 5"
  },
  {
    "address": "0x98ec059dc3adfbdd63429454aeb0c990fba4a128",
    "kind": "cex",
    "label": "OKX 6"
  },
  {
    "address": "0x5041ed759dd4afc3a72b8192c143f72f4724081a",
    "kind": "cex",
    "label": "OKX 7"
  },
  {
    "address": "0xcba38020cd7b6f51df6afaf507685add148f6ab6",
    "kind": "cex",
    "label": "OKX 8"
  },
  {
    "address": "0x461249076b88189f8ac9418de28b365859e46bfd",
    "kind": "cex",
    "label": "OKX 9"
  },
  {
    "address": "0xc5451b523d5fffe1351337a221688a62806ad91a",
    "kind": "cex",
    "label": "OKX 10"
  },
  {
    "address": "0x42436286a9c8d63aafc2eebbca193064d68068f2",
    "kind": "cex",
    "label": "OKX 11"
  },
  {
    "address": "0x69a722f0b5da3af02b4a205d6f0c285f4ed8f396",
    "kind": "cex",
    "label": "OKX 12"
  },
  {
    "address": "0xc708a1c712ba26dc618f972ad7a187f76c8596fd",
    "kind": "cex",
    "label": "OKX 13"
  },
  {
    "address": "0x6fb624b48d9299674022a23d92515e76ba880113",
    "kind": "cex",
    "label": "OKX 14"
  },
  {
    "address": "0xf59869753f41db720127ceb8dbb8afaf89030de4",
    "kind": "cex",
    "label": "OKX 15"
  },
  {
    "address": "0x65a0947ba5175359bb457d3b34491edf4cbf7997",
    "kind": "cex",
    "label": "OKX 16"
  },
  {
    "address": "0x4d19c0a5357bc48be0017095d3c871d9afc3f21d",
    "kind": "cex",
    "label": "OKX 17"
  },
  {
    "address": "0x5c52cc7c96bde8594e5b77d5b76d042cb5fae5f2",
    "kind": "cex",
    "label": "OKX 18"
  },
  {
    "address": "0xe9172daf64b05b26eb18f07ac8d6d723acb48f99",
    "kind": "cex",
    "label": "OKX 19"
  },
  {
    "address": "0x7eb6c83ab7d8d9b8618c0ed973cbef71d1921ef2",
    "kind": "cex",
    "label": "OKX 20"
  },
  {
    "address": "0xbda23b750dd04f792ad365b5f2a6f1d8593796f2",
    "kind": "cex",
    "label": "OKX 21"
  },
  {
    "address": "0x276cdba3a39abf9cedba0f1948312c0681e6d5fd",
    "kind": "cex",
    "label": "OKX 22"
  },
  {
    "address": "0x3d55ccb2a943d88d39dd2e62daf767c69fd0179f",
    "kind": "cex",
    "label": "OKX 23"
  },
  {
    "address": "0xbf94f0ac752c739f623c463b5210a7fb2cbb420b",
    "kind": "cex",
    "label": "OKX 24"
  },
  {
    "address": "0xf7858da8a6617f7c6d0ff2bcafdb6d2eedf64840",
    "kind": "cex",
    "label": "OKX 25"
  },
  {
    "address": "0x68841a1806ff291314946eebd0cda8b348e73d6d",
    "kind": "cex",
    "label": "OKX 26"
  },
  {
    "address": "0x5c891d76584b46bc7f1e700169a76569bb77d2db",
    "kind": "cex",
    "label": "OKX 27"
  },
  {
    "address": "0x4e7b110335511f662fdbb01bf958a7844118c0d4",
    "kind": "cex",
    "label": "OKX 28"
  },
  {
    "address": "0xf51cd688b8744b1bfd2fba70d050de85ec4fb9fb",
    "kind": "cex",
    "label": "OKX 29"
  },
  {
    "address": "0xcbffcb2c38ecd19468d366d392ac0c1dc7f04bb6",
    "kind": "cex",
    "label": "OKX 30"
  },
  {
    "address": "0xc3ae71fe59f5133ba180cbbd76536a70dec23d40",
    "kind": "cex",
    "label": "OKX 31"
  },
  {
    "address": "0x4b4e14a3773ee558b6597070797fd51eb48606e5",
    "kind": "cex",
    "label": "OKX 32"
  },
  {
    "address": "0xe95f6604a591f6ba33accb43a8a885c9c272108c",
    "kind": "cex",
    "label": "OKX 33"
  },
  {
    "address": "0xd7efcbb86efdd9e8de014dafa5944aae36e817e4",
    "kind": "cex",
    "label": "OKX 34"
  },
  {
    "address": "0x0938c63109801ee4243a487ab84dffa2bba4589e",
    "kind": "cex",
    "label": "OKX 35"
  },
  {
    "address": "0x06959153b974d0d5fdfd87d561db6d8d4fa0bb0b",
    "kind": "cex",
    "label": "OKX 36"
  },
  {
    "address": "0xa16f524a804beaed0d791de0aa0b5836295a2a84",
    "kind": "cex",
    "label": "OKX 37"
  },
  {
    "address": "0x3b5a23f6207d87b423c6789d2625ea620423b32d",
    "kind": "cex",
    "label": "OKX 38"
  },
  {
    "address": "0x2d2cc0eb095e43204e0c087e07dbf95909650939",
    "kind": "cex",
    "label": "OKX 39"
  },
  {
    "address": "0x62383739d68dd0f844103db8dfb05a7eded5bbe6",
    "kind": "cex",
    "label": "OKX 40"
  },
  {
    "address": "0x40b38765696e3d5d8d9d834d8aad4bb6e418e489",
    "kind": "cex",
    "label": "Robinhood 1"
  },
  {
    "address": "0x73af3bcf944a6559933396c1577b257e2054d935",
    "kind": "cex",
    "label": "Robinhood 2"
  },
  {
    "address": "0xa26e73c8e9507d50bf808b7a2ca9d5de4fcc4a04",
    "kind": "cex",
    "label": "Robinhood 3"
  },
  {
    "address": "0x2efb50e952580f4ff32d8d2122853432bbf2e204",
    "kind": "cex",
    "label": "Robinhood 4"
  },
  {
    "address": "0x841ed663f2636863d40be4ee76243377dff13a34",
    "kind": "cex",
    "label": "Robinhood 5"
  },
  {
    "address": "0xe0f3e36dbdfa9696b7bcb0d3313522a0bb28d5f4",
    "kind": "cex",
    "label": "Robinhood 6"
  },
  {
    "address": "0x7c5830cb1a1efe898dcd5cf401165cb952508ccc",
    "kind": "cex",
    "label": "Robinhood 7"
  },
  {
    "address": "0x7ce672223ca12c990f179034645bdf8348472442",
    "kind": "cex",
    "label": "Robinhood Cumberland Deposit 1"
  },
  {
    "address": "0x6081258689a75d253d87ce902a8de3887239fe80",
    "kind": "cex",
    "label": "Robinhood Withdrawals"
  },
  {
    "address": "0x97972fa6d980aa9b93d1b584541055840302de05",
    "kind": "cex",
    "label": "Robinhood Gas Supplier 1"
  },
  {
    "address": "0x7222de11e132c6f315789eeb5c0182cabd4a9530",
    "kind": "cex",
    "label": "Robinhood Gas Supplier 2"
  },
  {
    "address": "0x4a5b84fb4c7666692c49f2e11664710aa4d0d2a0",
    "kind": "cex",
    "label": "Robinhood Deprecated 1"
  },
  {
    "address": "0xa0116a92a032d17a9ce431eabe75c5b5f29e2d5e",
    "kind": "cex",
    "label": "Robinhood Deprecated 2"
  },
  {
    "address": "0x0716a17fbaee714f1e6ab0f9d59edbc5f09815c0",
    "kind": "cex",
    "label": "Robinhood Deprecated 3"
  },
  {
    "address": "0x390de26d772d2e2005c6d1d24afc902bae37a4bb",
    "kind": "cex",
    "label": "Upbit 1"
  },
  {
    "address": "0xba826fec90cefdf6706858e5fbafcb27a290fbe0",
    "kind": "cex",
    "label": "Upbit 2"
  },
  {
    "address": "0x5e032243d507c743b061ef021e2ec7fcc6d3ab89",
    "kind": "cex",
    "label": "Upbit 3"
  },
  {
    "address": "0x1938a448d105d26c40a52a1bfe99b8ca7a745ad0",
    "kind": "cex",
    "label": "Upbit 4"
  },
  {
    "address": "0x03747f06215b44e498831da019b27f53e483599f",
    "kind": "cex",
    "label": "Upbit 5"
  },
  {
    "address": "0x5fbe6f686cccbf2a978926d135448ede0b71bb41",
    "kind": "cex",
    "label": "Upbit 6"
  },
  {
    "address": "0x8c266cf2e163443b1d6b183321e7f166f92579ba",
    "kind": "cex",
    "label": "Upbit 7"
  },
  {
    "address": "0x52c6e1ddbbc132c7d10eec5d0d8bf5c4d0617f6e",
    "kind": "cex",
    "label": "Upbit 8"
  },
  {
    "address": "0x1c1a7ce2b24db65c0b6747d616fdffbacffc3132",
    "kind": "cex",
    "label": "Upbit 9"
  },
  {
    "address": "0x39275f5ccaf27bdbf40059926d42c6a09a03f40a",
    "kind": "cex",
    "label": "Upbit 10"
  },
  {
    "address": "0xade85038d52eedebd46af89df6d606012ce3ec69",
    "kind": "cex",
    "label": "Upbit 11"
  },
  {
    "address": "0x9653785c2d902d4837e82387fc5b1a22b953d429",
    "kind": "cex",
    "label": "Upbit 12"
  },
  {
    "address": "0x0bd71dc11edef3207a6f74b7cfbae5b8713f3f43",
    "kind": "cex",
    "label": "Upbit 13"
  },
  {
    "address": "0x8dbcab4f83643f324e09769ff93f733f0af074b9",
    "kind": "cex",
    "label": "Upbit 14"
  },
  {
    "address": "0xbdf51daa5529b40f9b5c37b66f61275e58f04532",
    "kind": "cex",
    "label": "Upbit 15"
  },
  {
    "address": "0x54014ce170a7f1ba3d937b4e1b1638ba82be41f1",
    "kind": "cex",
    "label": "Upbit 16"
  },
  {
    "address": "0x33966c7445cbb26999b73a2427d97f8d06f6b3e4",
    "kind": "cex",
    "label": "Upbit 17"
  },
  {
    "address": "0xab2109ad7f82bffe7c3cab3fda25e4799c28ea5b",
    "kind": "cex",
    "label": "Upbit 18"
  },
  {
    "address": "0x5c3f261290e02ba328af0dcfe2586dba61a358ec",
    "kind": "cex",
    "label": "Upbit 19"
  },
  {
    "address": "0x00d7f2709c7b305a64b8e49a476fead84d159366",
    "kind": "cex",
    "label": "Upbit 20"
  },
  {
    "address": "0x12352dce4985ffb2074b4cb4399901c9d2fd5582",
    "kind": "cex",
    "label": "Upbit 21"
  },
  {
    "address": "0x1d791f12bb6808dc08ab365e2ec8913273c00193",
    "kind": "cex",
    "label": "Upbit 22"
  },
  {
    "address": "0x377b8ce04761754e8ac153b47805a9cf6b190873",
    "kind": "cex",
    "label": "Upbit 23"
  },
  {
    "address": "0xc9cf0ec93d764f5c9571fd12f764bae7fc87c84e",
    "kind": "cex",
    "label": "Upbit Cold Wallet"
  },
  {
    "address": "0x4f01001cf69785d4c37f03fd87398849411ccbba",
    "kind": "cex",
    "label": "Upbit Wallet Factory Contract"
  },
  {
    "address": "0x76037d22e1d7d7822d9137359c3de9fde99a81d2",
    "kind": "cex",
    "label": "upbit_wemix kaia"
  },
  {
    "address": "0x82aee37152c4d516bc5f472b4ad958c369c045be",
    "kind": "cex",
    "label": "upbit kaia"
  },
  {
    "address": "0x74c4fa0a5d205b1e645c819f6dd5d436688ad3d5",
    "kind": "cex",
    "label": "upbit1 kaia"
  },
  {
    "address": "0x1f700f00bce72be33ba4e070759d2cdbd027e148",
    "kind": "cex",
    "label": "upbit2 kaia"
  },
  {
    "address": "0xa3b8117dc4580bf12821d92ede501d0974dc5bbd",
    "kind": "cex",
    "label": "upbit3 kaia"
  },
  {
    "address": "0xe48c862ec4625459effdcff5d71143adf10036af",
    "kind": "cex",
    "label": "upbit4 kaia"
  },
  {
    "address": "0xd2c1a1300671b0c4a32574c2107e5e577e95a0d6",
    "kind": "cex",
    "label": "upbit5 kaia"
  }
];

const denylistSet = new Set(
  FUNDING_DENYLIST_ENTRIES.map((entry) => entry.address.toLowerCase()),
);

const labelByAddress = new Map(
  FUNDING_DENYLIST_ENTRIES.map((entry) => [entry.address.toLowerCase(), entry] as const),
);

export function isFundingDenylisted(address: string): boolean {
  return denylistSet.has(address.toLowerCase());
}

export function getFundingDenylistEntry(
  address: string,
): FundingDenylistEntry | undefined {
  return labelByAddress.get(address.toLowerCase());
}

