export type CardCategory = "bank" | "member";

export type CatalogCard = {
  id: string;
  name: string;
  category: CardCategory;
  /** Tailwind background color or hex */
  bg: string;
  /** Optional secondary color */
  fg?: string;
  /** Logo style hint for rendering: text-only, mono, etc. */
  style?: "block" | "outline" | "wordmark";
  /** Short label/abbr to render on the card tile */
  label: string;
  /** Optional sublabel under main label */
  sub?: string;
  /** Optional URL to exact brand logo (e.g., SVG from Wikimedia) */
  logo?: string;
  /** Set to true to invert logo to pure white */
  logoWhite?: boolean;
  /** Custom utility classes for the logo (e.g. scaling) */
  logoClass?: string;
};

/* ============================================================
 * BANKS — bank di Indonesia
 *  - BUMN, swasta nasional, asing, digital, BPD, syariah
 *  - Warna mengikuti identitas brand secara umum
 *  - Logo digambar via wordmark (tanpa aset eksternal)
 * ============================================================ */
export const BANKS: CatalogCard[] = [
  // BUMN & swasta besar
  { id: "bca", name: "BCA", category: "bank", bg: "#0060A8", label: "BCA", style: "wordmark", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg", logoWhite: true },
  { id: "mandiri", name: "Mandiri", category: "bank", bg: "#003D79", label: "mandiri", style: "wordmark", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Bank_Mandiri.svg", logoWhite: true },
  { id: "bri", name: "BRI", category: "bank", bg: "#00529C", label: "BRI", style: "wordmark", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg", logoWhite: true },
  { id: "bni", name: "BNI", category: "bank", bg: "#F26522", label: "BNI", style: "wordmark", logo: "/logo/bni.png", logoWhite: false, logoClass: "scale-[2.5]" },
  { id: "btn", name: "BTN", category: "bank", bg: "#003F7F", label: "BTN", sub: "Bank BTN", style: "wordmark" },
  { id: "cimb", name: "CIMB Niaga", category: "bank", bg: "#A6192E", label: "CIMB", sub: "Niaga", style: "wordmark" },
  { id: "danamon", name: "Danamon", category: "bank", bg: "#F58220", label: "Danamon", style: "wordmark" },
  { id: "permata", name: "Permata", category: "bank", bg: "#005B41", label: "PermataBank", style: "wordmark" },
  { id: "ocbc", name: "OCBC", category: "bank", bg: "#E60012", label: "OCBC", style: "wordmark" },
  { id: "panin", name: "Panin", category: "bank", bg: "#0072CE", label: "Panin", style: "wordmark" },
  { id: "maybank", name: "Maybank", category: "bank", bg: "#FFCD00", fg: "#000000", label: "maybank", style: "wordmark" },
  { id: "uob", name: "UOB", category: "bank", bg: "#1B3F8B", label: "UOB", style: "wordmark" },
  { id: "hsbc", name: "HSBC", category: "bank", bg: "#DB0011", label: "HSBC", style: "wordmark" },
  { id: "sc", name: "Standard Chartered", category: "bank", bg: "#0473EA", label: "SC", sub: "Standard Chartered", style: "wordmark" },
  { id: "btpn", name: "BTPN", category: "bank", bg: "#0099A8", label: "BTPN", style: "wordmark" },
  { id: "btpn-jenius", name: "Jenius", category: "bank", bg: "#0099A8", label: "Jenius", sub: "by BTPN", style: "wordmark" },
  { id: "mega", name: "Bank Mega", category: "bank", bg: "#F2C300", fg: "#000000", label: "MEGA", style: "wordmark" },
  { id: "bukopin", name: "KB Bukopin", category: "bank", bg: "#FFD200", fg: "#000000", label: "KB Bukopin", style: "wordmark" },
  { id: "muamalat", name: "Muamalat", category: "bank", bg: "#5A2A82", label: "Muamalat", style: "wordmark" },
  { id: "victoria", name: "Bank Victoria", category: "bank", bg: "#1A4A8C", label: "Victoria", style: "wordmark" },
  { id: "mayapada", name: "Bank Mayapada", category: "bank", bg: "#0F3F8C", label: "Mayapada", style: "wordmark" },
  { id: "sinarmas", name: "Bank Sinarmas", category: "bank", bg: "#E30613", label: "Sinarmas", style: "wordmark" },
  { id: "mestika", name: "Bank Mestika", category: "bank", bg: "#003F7F", label: "Mestika", style: "wordmark" },
  { id: "qnb", name: "QNB Indonesia", category: "bank", bg: "#5C2A82", label: "QNB", style: "wordmark" },
  { id: "commonwealth", name: "Commonwealth Bank", category: "bank", bg: "#FFCC00", fg: "#000000", label: "CBA", sub: "Commonwealth", style: "wordmark" },
  { id: "dbs", name: "DBS Indonesia", category: "bank", bg: "#E30613", label: "DBS", style: "wordmark" },
  { id: "citi", name: "Citibank", category: "bank", bg: "#003B70", label: "citi", style: "wordmark" },
  { id: "anz", name: "ANZ Indonesia", category: "bank", bg: "#004A8F", label: "ANZ", style: "wordmark" },
  { id: "rabobank", name: "Rabobank", category: "bank", bg: "#FF6B00", label: "Rabobank", style: "wordmark" },
  { id: "mizuho", name: "Mizuho", category: "bank", bg: "#0F4C8C", label: "Mizuho", style: "wordmark" },
  { id: "mufg", name: "MUFG Bank", category: "bank", bg: "#D71920", label: "MUFG", style: "wordmark" },
  { id: "bnp-paribas", name: "BNP Paribas", category: "bank", bg: "#00915A", label: "BNP Paribas", style: "wordmark" },
  { id: "deutsche", name: "Deutsche Bank", category: "bank", bg: "#003BA6", label: "Deutsche Bank", style: "wordmark" },
  { id: "boc", name: "Bank of China", category: "bank", bg: "#A6192E", label: "BOC", sub: "Bank of China", style: "wordmark" },
  { id: "icbc", name: "ICBC Indonesia", category: "bank", bg: "#A6192E", label: "ICBC", style: "wordmark" },

  // Bank syariah
  { id: "bsi", name: "Bank Syariah Indonesia", category: "bank", bg: "#00A39D", label: "BSI", style: "wordmark" },
  { id: "btpn-syariah", name: "BTPN Syariah", category: "bank", bg: "#1A8F7B", label: "BTPN", sub: "Syariah", style: "wordmark" },
  { id: "bca-syariah", name: "BCA Syariah", category: "bank", bg: "#00598D", label: "BCA Syariah", style: "wordmark" },
  { id: "mega-syariah", name: "Mega Syariah", category: "bank", bg: "#0F4C8C", label: "Mega Syariah", style: "wordmark" },
  { id: "bjb-syariah", name: "BJB Syariah", category: "bank", bg: "#0072BC", label: "bjb syariah", style: "wordmark" },
  { id: "panin-dubai-syariah", name: "Panin Dubai Syariah", category: "bank", bg: "#0072CE", label: "Panin", sub: "Dubai Syariah", style: "wordmark" },

  // Bank digital
  { id: "seabank", name: "SeaBank", category: "bank", bg: "#FF7A00", label: "SeaBank", style: "wordmark" },
  { id: "blu", name: "blu by BCA Digital", category: "bank", bg: "#00B7C7", label: "blu", style: "wordmark" },
  { id: "neo", name: "Bank Neo Commerce", category: "bank", bg: "#FFC107", fg: "#000000", label: "neo+", style: "wordmark" },
  { id: "jago", name: "Bank Jago", category: "bank", bg: "#F58220", label: "jago", style: "wordmark" },
  { id: "allo", name: "Allo Bank", category: "bank", bg: "#E91E63", label: "allo", style: "wordmark" },
  { id: "linebank", name: "LINE Bank by Hana", category: "bank", bg: "#06C755", label: "LINE Bank", style: "wordmark" },
  { id: "krom", name: "Krom Bank", category: "bank", bg: "#5E17EB", label: "krom", style: "wordmark" },
  { id: "superbank", name: "Superbank", category: "bank", bg: "#00C2A8", label: "Superbank", style: "wordmark" },
  { id: "raya", name: "Bank Raya", category: "bank", bg: "#003B70", label: "Bank Raya", style: "wordmark" },
  { id: "amar", name: "Amar Bank (Tunaiku)", category: "bank", bg: "#1F4DA0", label: "Amar Bank", style: "wordmark" },
  { id: "aladin", name: "Bank Aladin Syariah", category: "bank", bg: "#0F4D8A", label: "aladin", style: "wordmark" },

  // BPD (Bank Pembangunan Daerah)
  { id: "bjb", name: "Bank BJB", category: "bank", bg: "#0072BC", label: "bjb", style: "wordmark" },
  { id: "dki", name: "Bank DKI", category: "bank", bg: "#E30613", label: "Bank DKI", style: "wordmark" },
  { id: "jateng", name: "Bank Jateng", category: "bank", bg: "#00529C", label: "Bank Jateng", style: "wordmark" },
  { id: "jatim", name: "Bank Jatim", category: "bank", bg: "#E30613", label: "Bank Jatim", style: "wordmark" },
  { id: "bpd-bali", name: "BPD Bali", category: "bank", bg: "#003F7F", label: "BPD Bali", style: "wordmark" },
  { id: "bpd-diy", name: "BPD DIY", category: "bank", bg: "#0F4D8A", label: "BPD DIY", style: "wordmark" },
  { id: "sumut", name: "Bank Sumut", category: "bank", bg: "#0F7A3B", label: "Bank Sumut", style: "wordmark" },
  { id: "sumselbabel", name: "Bank Sumsel Babel", category: "bank", bg: "#003F7F", label: "Sumsel Babel", style: "wordmark" },
  { id: "nagari", name: "Bank Nagari", category: "bank", bg: "#0F4D8A", label: "Bank Nagari", style: "wordmark" },
  { id: "riau-kepri", name: "Bank Riau Kepri", category: "bank", bg: "#0F7A3B", label: "Riau Kepri", style: "wordmark" },
  { id: "lampung", name: "Bank Lampung", category: "bank", bg: "#0F4D8A", label: "Bank Lampung", style: "wordmark" },
  { id: "banten", name: "Bank Banten", category: "bank", bg: "#003F7F", label: "Bank Banten", style: "wordmark" },
  { id: "kalbar", name: "Bank Kalbar", category: "bank", bg: "#0F4D8A", label: "Bank Kalbar", style: "wordmark" },
  { id: "kalsel", name: "Bank Kalsel", category: "bank", bg: "#003F7F", label: "Bank Kalsel", style: "wordmark" },
  { id: "kaltimtara", name: "Bank Kaltimtara", category: "bank", bg: "#0F4D8A", label: "Kaltimtara", style: "wordmark" },
  { id: "sulutgo", name: "Bank SulutGo", category: "bank", bg: "#E30613", label: "SulutGo", style: "wordmark" },
  { id: "sulselbar", name: "Bank Sulselbar", category: "bank", bg: "#003F7F", label: "Sulselbar", style: "wordmark" },
  { id: "papua", name: "Bank Papua", category: "bank", bg: "#0F7A3B", label: "Bank Papua", style: "wordmark" },
  { id: "ntt", name: "Bank NTT", category: "bank", bg: "#0F4D8A", label: "Bank NTT", style: "wordmark" },
  { id: "ntb-syariah", name: "Bank NTB Syariah", category: "bank", bg: "#1A8F7B", label: "NTB Syariah", style: "wordmark" },
  { id: "aceh-syariah", name: "Bank Aceh Syariah", category: "bank", bg: "#1A8F7B", label: "Bank Aceh", sub: "Syariah", style: "wordmark" },
  { id: "maluku-malut", name: "Bank Maluku Malut", category: "bank", bg: "#003F7F", label: "Maluku Malut", style: "wordmark" },
  { id: "bengkulu", name: "Bank Bengkulu", category: "bank", bg: "#0F4D8A", label: "Bank Bengkulu", style: "wordmark" },
  { id: "jambi", name: "Bank Jambi", category: "bank", bg: "#003F7F", label: "Bank Jambi", style: "wordmark" },
];

/* ============================================================
 * MEMBERS — kartu member retail / F&B / lifestyle / transport
 * ============================================================ */
export const MEMBERS: CatalogCard[] = [
  /* ---------- Minimarket & supermarket ---------- */
  { id: "alfamart", name: "Alfamart", category: "member", bg: "#E30613", label: "Alfamart", style: "wordmark", logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg", logoWhite: true },
  { id: "alfamidi", name: "Alfamidi", category: "member", bg: "#E30613", label: "Alfamidi", style: "wordmark" },
  { id: "indomaret", name: "Indomaret", category: "member", bg: "#005BAA", label: "Indomaret", style: "wordmark" },
  { id: "lawson", name: "Lawson", category: "member", bg: "#005BAA", label: "LAWSON", style: "wordmark" },
  { id: "circlek", name: "Circle K", category: "member", bg: "#E30613", label: "Circle K", style: "wordmark" },
  { id: "familymart", name: "FamilyMart", category: "member", bg: "#005BAA", label: "FamilyMart", style: "wordmark" },
  { id: "lottemart", name: "Lotte Mart", category: "member", bg: "#E30613", label: "LOTTE Mart", style: "wordmark" },
  { id: "hypermart", name: "Hypermart", category: "member", bg: "#E30613", label: "hypermart", style: "wordmark" },
  { id: "transmart", name: "Transmart", category: "member", bg: "#003F87", label: "Transmart", style: "wordmark" },
  { id: "superindo", name: "Super Indo", category: "member", bg: "#0072BC", label: "Super Indo", style: "wordmark" },
  { id: "ranch-market", name: "Ranch Market", category: "member", bg: "#0F7A3B", label: "Ranch Market", style: "wordmark" },
  { id: "farmers-market", name: "Farmers Market", category: "member", bg: "#0F7A3B", label: "Farmers Market", style: "wordmark" },
  { id: "papaya", name: "Papaya Fresh Gallery", category: "member", bg: "#F58220", label: "papaya", style: "wordmark" },
  { id: "kemchicks", name: "Kem Chicks", category: "member", bg: "#A6192E", label: "Kem Chicks", style: "wordmark" },
  { id: "all-fresh", name: "All Fresh", category: "member", bg: "#0F7A3B", label: "All Fresh", style: "wordmark" },
  { id: "grand-lucky", name: "Grand Lucky", category: "member", bg: "#A6192E", label: "Grand Lucky", style: "wordmark" },
  { id: "tiara-gatzu", name: "Tiara Gatzu", category: "member", bg: "#E58A2D", fg: "#5C2C0E", label: "TIARA GATZU", style: "wordmark" },
  { id: "tiara-dewata", name: "Tiara Dewata", category: "member", bg: "#F26522", label: "TIARA DEWATA", style: "wordmark" },
  { id: "naga-swalayan", name: "Naga Swalayan", category: "member", bg: "#FFD200", fg: "#000000", label: "Naga", style: "wordmark" },

  /* ---------- Department store & fashion ---------- */
  { id: "matahari", name: "Matahari", category: "member", bg: "#5E6A75", label: "MATAHARI", style: "wordmark" },
  { id: "sogo", name: "SOGO", category: "member", bg: "#000000", label: "SOGO", style: "wordmark" },
  { id: "metro", name: "Metro Department Store", category: "member", bg: "#1A1A1A", label: "METRO", style: "wordmark" },
  { id: "centro", name: "Centro", category: "member", bg: "#000000", label: "Centro", style: "wordmark" },
  { id: "debenhams", name: "Debenhams", category: "member", bg: "#0F2E60", label: "Debenhams", style: "wordmark" },
  { id: "parkson", name: "Parkson", category: "member", bg: "#003F87", label: "Parkson", style: "wordmark" },
  { id: "uniqlo", name: "Uniqlo", category: "member", bg: "#E60012", label: "UNI\nQLO", style: "block" },
  { id: "muji", name: "MUJI", category: "member", bg: "#A6192E", label: "MUJI", style: "wordmark" },
  { id: "hnm", name: "H&M", category: "member", bg: "#E30613", label: "H&M", style: "wordmark" },
  { id: "zara", name: "Zara", category: "member", bg: "#000000", label: "ZARA", style: "wordmark" },
  { id: "pull-and-bear", name: "Pull & Bear", category: "member", bg: "#000000", label: "Pull&Bear", style: "wordmark" },
  { id: "bershka", name: "Bershka", category: "member", bg: "#000000", label: "BERSHKA", style: "wordmark" },
  { id: "stradivarius", name: "Stradivarius", category: "member", bg: "#E30613", label: "Stradivarius", style: "wordmark" },
  { id: "massimo", name: "Massimo Dutti", category: "member", bg: "#1A1A1A", label: "Massimo Dutti", style: "wordmark" },
  { id: "mango", name: "Mango", category: "member", bg: "#000000", label: "MANGO", style: "wordmark" },
  { id: "gap", name: "GAP", category: "member", bg: "#0F2E60", label: "GAP", style: "wordmark" },
  { id: "old-navy", name: "Old Navy", category: "member", bg: "#0F2E60", label: "OLD NAVY", style: "wordmark" },
  { id: "banana-republic", name: "Banana Republic", category: "member", bg: "#1A1A1A", label: "Banana Republic", style: "wordmark" },
  { id: "marks-spencer", name: "Marks & Spencer", category: "member", bg: "#0F7A3B", label: "M&S", sub: "Marks & Spencer", style: "wordmark" },
  { id: "the-executive", name: "The Executive", category: "member", bg: "#000000", label: "The Executive", style: "wordmark" },
  { id: "wood", name: "(X)S.M.L", category: "member", bg: "#000000", label: "X.S.M.L", style: "wordmark" },
  { id: "et-cetera", name: "Et Cetera", category: "member", bg: "#000000", label: "Et Cetera", style: "wordmark" },
  { id: "buccheri", name: "Buccheri", category: "member", bg: "#5C2C0E", label: "Buccheri", style: "wordmark" },
  { id: "rotelli", name: "Rotelli", category: "member", bg: "#1A1A1A", label: "Rotelli", style: "wordmark" },
  { id: "yongki", name: "Yongki Komaladi", category: "member", bg: "#A6192E", label: "Yongki Komaladi", style: "wordmark" },
  { id: "fladeo", name: "Fladeo", category: "member", bg: "#1A1A1A", label: "Fladeo", style: "wordmark" },
  { id: "bata", name: "Bata", category: "member", bg: "#E30613", label: "Bata", style: "wordmark" },
  { id: "nike", name: "Nike", category: "member", bg: "#000000", label: "✓ Nike", style: "wordmark", logoWhite: true },
  { id: "adidas", name: "Adidas", category: "member", bg: "#000000", label: "adidas", style: "wordmark", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", logoWhite: true },
  { id: "puma", name: "Puma", category: "member", bg: "#000000", label: "PUMA", style: "wordmark" },
  { id: "reebok", name: "Reebok", category: "member", bg: "#000000", label: "Reebok", style: "wordmark" },
  { id: "converse", name: "Converse", category: "member", bg: "#000000", label: "Converse", style: "wordmark" },
  { id: "vans", name: "Vans", category: "member", bg: "#E30613", label: "VANS", style: "wordmark" },
  { id: "newbalance", name: "New Balance", category: "member", bg: "#A6192E", label: "New Balance", style: "wordmark" },
  { id: "asics", name: "Asics", category: "member", bg: "#0F2E60", label: "ASICS", style: "wordmark" },
  { id: "skechers", name: "Skechers", category: "member", bg: "#0F2E60", label: "SKECHERS", style: "wordmark" },
  { id: "planet-sports", name: "Planet Sports", category: "member", bg: "#000000", label: "Planet Sports", style: "wordmark" },
  { id: "sport-station", name: "Sport Station", category: "member", bg: "#E30613", label: "Sport Station", style: "wordmark" },

  /* ---------- Beauty, kosmetik, perawatan ---------- */
  { id: "watsons", name: "Watsons", category: "member", bg: "#0FA6A6", label: "watsons", style: "wordmark" },
  { id: "guardian", name: "Guardian", category: "member", bg: "#00529C", label: "Guardian", style: "wordmark" },
  { id: "century", name: "Century", category: "member", bg: "#003E7E", label: "Century", style: "wordmark" },
  { id: "boots", name: "Boots", category: "member", bg: "#0F4D8A", label: "Boots", style: "wordmark" },
  { id: "sociolla", name: "Sociolla", category: "member", bg: "#FF6FA1", label: "Sociolla", style: "wordmark" },
  { id: "sephora", name: "Sephora", category: "member", bg: "#000000", label: "SEPHORA", style: "wordmark" },
  { id: "the-body-shop", name: "The Body Shop", category: "member", bg: "#0F4D2E", label: "The Body Shop", style: "wordmark" },
  { id: "loccitane", name: "L'Occitane", category: "member", bg: "#FFCD00", fg: "#000000", label: "L'OCCITANE", style: "wordmark" },
  { id: "innisfree", name: "Innisfree", category: "member", bg: "#0F7A3B", label: "innisfree", style: "wordmark" },
  { id: "etude", name: "Etude House", category: "member", bg: "#FF6FA1", label: "ETUDE", style: "wordmark" },
  { id: "skinfood", name: "Skinfood", category: "member", bg: "#F58220", label: "Skinfood", style: "wordmark" },
  { id: "nature-republic", name: "Nature Republic", category: "member", bg: "#0F7A3B", label: "Nature Republic", style: "wordmark" },
  { id: "missha", name: "Missha", category: "member", bg: "#1A1A1A", label: "MISSHA", style: "wordmark" },
  { id: "mac", name: "MAC Cosmetics", category: "member", bg: "#000000", label: "M·A·C", style: "wordmark" },
  { id: "mustika-ratu", name: "Mustika Ratu", category: "member", bg: "#5C2C0E", label: "Mustika Ratu", style: "wordmark" },
  { id: "wardah", name: "Wardah", category: "member", bg: "#0F4D8A", label: "Wardah", style: "wordmark" },
  { id: "sariayu", name: "Sariayu", category: "member", bg: "#0F7A3B", label: "Sariayu", style: "wordmark" },
  { id: "make-over", name: "Make Over", category: "member", bg: "#000000", label: "MAKE OVER", style: "wordmark" },
  { id: "emina", name: "Emina", category: "member", bg: "#FF6FA1", label: "Emina", style: "wordmark" },
  { id: "sensatia", name: "Sensatia Botanicals", category: "member", bg: "#9CB9A6", label: "Sensatia", sub: "botanicals", style: "wordmark" },
  { id: "kiehls", name: "Kiehl's", category: "member", bg: "#0F4D2E", label: "Kiehl's", style: "wordmark" },

  /* ---------- Home, furniture, electronics ---------- */
  { id: "ace", name: "ACE Hardware", category: "member", bg: "#E1251B", label: "ACE", style: "wordmark" },
  { id: "informa", name: "Informa", category: "member", bg: "#FFFFFF", fg: "#0033A0", label: "informa", style: "wordmark" },
  { id: "ikea", name: "IKEA", category: "member", bg: "#0058A3", fg: "#FFDB00", label: "IKEA", style: "wordmark" },
  { id: "index", name: "Index Living Mall", category: "member", bg: "#A6192E", label: "Index", sub: "Living Mall", style: "wordmark" },
  { id: "courts", name: "Courts", category: "member", bg: "#E30613", label: "Courts", style: "wordmark" },
  { id: "electronic-city", name: "Electronic City", category: "member", bg: "#003F87", label: "Electronic City", style: "wordmark" },
  { id: "electronic-solution", name: "Electronic Solution", category: "member", bg: "#E30613", label: "Electronic Solution", style: "wordmark" },
  { id: "best-denki", name: "Best Denki", category: "member", bg: "#E30613", label: "BEST DENKI", style: "wordmark" },
  { id: "erafone", name: "Erafone", category: "member", bg: "#003F87", label: "Erafone", style: "wordmark" },
  { id: "ibox", name: "iBox", category: "member", bg: "#1A1A1A", label: "iBox", style: "wordmark" },
  { id: "digimap", name: "Digimap", category: "member", bg: "#1A1A1A", label: "Digimap", style: "wordmark" },
  { id: "samsung-store", name: "Samsung Experience Store", category: "member", bg: "#1428A0", label: "SAMSUNG", style: "wordmark" },

  /* ---------- F&B: kopi & teh ---------- */
  { id: "starbucks", name: "Starbucks", category: "member", bg: "#006241", label: "Starbucks", style: "wordmark", logo: "https://cdn.simpleicons.org/starbucks/white" },
  { id: "kopi-kenangan", name: "Kopi Kenangan", category: "member", bg: "#7A2E20", label: "Kopi Kenangan", style: "wordmark" },
  { id: "janji-jiwa", name: "Janji Jiwa", category: "member", bg: "#1F3F1A", label: "Janji Jiwa", style: "wordmark" },
  { id: "fore", name: "Fore Coffee", category: "member", bg: "#0E5B3A", label: "fore.", style: "wordmark" },
  { id: "tomoro", name: "Tomoro Coffee", category: "member", bg: "#C8102E", label: "TOMORO", style: "wordmark" },
  { id: "kopi-tuku", name: "Kopi Tuku", category: "member", bg: "#5C2C0E", label: "Kopi Tuku", style: "wordmark" },
  { id: "anomali", name: "Anomali Coffee", category: "member", bg: "#1A1A1A", label: "Anomali", style: "wordmark" },
  { id: "kopi-soe", name: "Kopi Soe", category: "member", bg: "#5C2C0E", label: "Kopi Soe", style: "wordmark" },
  { id: "filosofi-kopi", name: "Filosofi Kopi", category: "member", bg: "#5C2C0E", label: "Filosofi Kopi", style: "wordmark" },
  { id: "common-grounds", name: "Common Grounds", category: "member", bg: "#1A1A1A", label: "Common Grounds", style: "wordmark" },
  { id: "djournal", name: "Djournal Coffee", category: "member", bg: "#1A1A1A", label: "Djournal", style: "wordmark" },
  { id: "excelso", name: "Excelso", category: "member", bg: "#5C2C0E", label: "Excelso", style: "wordmark" },
  { id: "jcokitchen", name: "J.CO Donuts & Coffee", category: "member", bg: "#A6192E", label: "J.CO", style: "wordmark" },
  { id: "dunkin", name: "Dunkin'", category: "member", bg: "#FF6FA1", fg: "#5C2C0E", label: "Dunkin'", style: "wordmark" },
  { id: "krispy-kreme", name: "Krispy Kreme", category: "member", bg: "#0F7A3B", label: "Krispy Kreme", style: "wordmark" },
  { id: "chatime", name: "Chatime", category: "member", bg: "#5B2A86", label: "Chatime", style: "wordmark" },
  { id: "kokumi", name: "Kokumi", category: "member", bg: "#FF6FA1", label: "Kokumi", style: "wordmark" },
  { id: "menantea", name: "Menantea", category: "member", bg: "#F58220", label: "Menantea", style: "wordmark" },
  { id: "haus", name: "Haus!", category: "member", bg: "#A6192E", label: "Haus!", style: "wordmark" },
  { id: "xing-fu-tang", name: "Xing Fu Tang", category: "member", bg: "#E30613", label: "Xing Fu Tang", style: "wordmark" },
  { id: "the-alley", name: "The Alley", category: "member", bg: "#1F3F1A", label: "The Alley", style: "wordmark" },
  { id: "tigertea", name: "Tiger Sugar", category: "member", bg: "#FFCD00", fg: "#000000", label: "Tiger Sugar", style: "wordmark" },

  /* ---------- F&B: fast food & casual ---------- */
  { id: "mcd", name: "McDonald's", category: "member", bg: "#DA291C", fg: "#FFC72C", label: "M", sub: "McDonald's", style: "block" },
  { id: "kfc", name: "KFC", category: "member", bg: "#E4002B", label: "KFC", style: "wordmark" },
  { id: "burger-king", name: "Burger King", category: "member", bg: "#F5A623", label: "BK", sub: "Burger King", style: "wordmark" },
  { id: "wendys", name: "Wendy's", category: "member", bg: "#E30613", label: "Wendy's", style: "wordmark" },
  { id: "ayam-geprek-bensu", name: "Geprek Bensu", category: "member", bg: "#E30613", label: "Geprek Bensu", style: "wordmark" },
  { id: "richeese", name: "Richeese Factory", category: "member", bg: "#FFCD00", fg: "#000000", label: "Richeese", style: "wordmark" },
  { id: "pizza-hut", name: "Pizza Hut", category: "member", bg: "#EE3124", label: "Pizza Hut", style: "wordmark" },
  { id: "dominos", name: "Domino's Pizza", category: "member", bg: "#0078AE", fg: "#E31837", label: "Domino's", style: "wordmark" },
  { id: "papa-rons", name: "Papa Ron's Pizza", category: "member", bg: "#A6192E", label: "Papa Ron's", style: "wordmark" },
  { id: "hokben", name: "HokBen", category: "member", bg: "#E30613", label: "HokBen", style: "wordmark" },
  { id: "yoshinoya", name: "Yoshinoya", category: "member", bg: "#F58220", label: "Yoshinoya", style: "wordmark" },
  { id: "solaria", name: "Solaria", category: "member", bg: "#7E2D2A", label: "Solaria", style: "wordmark" },
  { id: "es-teler-77", name: "Es Teler 77", category: "member", bg: "#E30613", label: "Es Teler 77", style: "wordmark" },
  { id: "bakmi-gm", name: "Bakmi GM", category: "member", bg: "#FFCD00", fg: "#000000", label: "Bakmi GM", style: "wordmark" },
  { id: "ta-wan", name: "Ta Wan", category: "member", bg: "#A6192E", label: "Ta Wan", style: "wordmark" },
  { id: "imperial-kitchen", name: "Imperial Kitchen & Dimsum", category: "member", bg: "#A6192E", label: "Imperial Kitchen", style: "wordmark" },
  { id: "shaburi", name: "Shaburi", category: "member", bg: "#A6192E", label: "Shaburi", style: "wordmark" },
  { id: "kintan", name: "Kintan Buffet", category: "member", bg: "#1A1A1A", label: "Kintan", style: "wordmark" },
  { id: "ichiban-sushi", name: "Ichiban Sushi", category: "member", bg: "#A6192E", label: "Ichiban Sushi", style: "wordmark" },
  { id: "sushi-tei", name: "Sushi Tei", category: "member", bg: "#0F4D2E", label: "Sushi Tei", style: "wordmark" },
  { id: "genki-sushi", name: "Genki Sushi", category: "member", bg: "#E30613", label: "Genki Sushi", style: "wordmark" },
  { id: "marugame", name: "Marugame Udon", category: "member", bg: "#FFCD00", fg: "#000000", label: "Marugame Udon", style: "wordmark" },
  { id: "tamoya", name: "Tamoya Udon", category: "member", bg: "#000000", label: "Tamoya Udon", style: "wordmark" },
  { id: "ramen-ya", name: "Ramen Ya", category: "member", bg: "#1A1A1A", label: "Ramen Ya", style: "wordmark" },
  { id: "ippudo", name: "Ippudo", category: "member", bg: "#A6192E", label: "IPPUDO", style: "wordmark" },
  { id: "marrybrown", name: "Marrybrown", category: "member", bg: "#FFCD00", fg: "#A6192E", label: "Marrybrown", style: "wordmark" },
  { id: "subway", name: "Subway", category: "member", bg: "#0F7A3B", fg: "#FFCD00", label: "SUBWAY", style: "wordmark" },
  { id: "texas-chicken", name: "Texas Chicken", category: "member", bg: "#FFCD00", fg: "#A6192E", label: "Texas Chicken", style: "wordmark" },
  { id: "popeyes", name: "Popeyes", category: "member", bg: "#F58220", label: "Popeyes", style: "wordmark" },
  { id: "carls-jr", name: "Carl's Jr.", category: "member", bg: "#FFCD00", fg: "#A6192E", label: "Carl's Jr.", style: "wordmark" },
  { id: "wingstop", name: "Wingstop", category: "member", bg: "#000000", fg: "#F58220", label: "Wingstop", style: "wordmark" },
  { id: "applebees", name: "Applebee's", category: "member", bg: "#0F7A3B", label: "Applebee's", style: "wordmark" },
  { id: "tony-romas", name: "Tony Roma's", category: "member", bg: "#A6192E", label: "Tony Roma's", style: "wordmark" },
  { id: "outback", name: "Outback Steakhouse", category: "member", bg: "#5C2C0E", label: "Outback", style: "wordmark" },
  { id: "platinum-grill", name: "Platinum Grill", category: "member", bg: "#1A1A1A", label: "Platinum Grill", style: "wordmark" },
  { id: "warung-leko", name: "Warung Leko", category: "member", bg: "#5C2C0E", label: "Warung Leko", style: "wordmark" },
  { id: "abuba-steak", name: "Abuba Steak", category: "member", bg: "#5C2C0E", label: "Abuba Steak", style: "wordmark" },
  { id: "bebek-bengil", name: "Bebek Bengil", category: "member", bg: "#5C2C0E", label: "Bebek Bengil", style: "wordmark" },

  /* ---------- Bioskop & hiburan ---------- */
  { id: "cgv", name: "CGV Cinemas", category: "member", bg: "#E30613", label: "CGV", style: "wordmark" },
  { id: "xxi", name: "Cinema XXI", category: "member", bg: "#0F2E60", label: "XXI", style: "wordmark" },
  { id: "cinepolis", name: "Cinepolis", category: "member", bg: "#0F4D8A", label: "Cinepolis", style: "wordmark" },
  { id: "playstation", name: "PlayStation", category: "member", bg: "#003791", label: "PlayStation", style: "wordmark" },
  { id: "timezone", name: "Timezone", category: "member", bg: "#FFCD00", fg: "#000000", label: "Timezone", style: "wordmark" },
  { id: "amazone", name: "Amazone", category: "member", bg: "#F58220", label: "Amazone", style: "wordmark" },
  { id: "fun-world", name: "Fun World", category: "member", bg: "#E30613", label: "Fun World", style: "wordmark" },
  { id: "trans-studio", name: "Trans Studio", category: "member", bg: "#003F87", label: "Trans Studio", style: "wordmark" },
  { id: "dufan", name: "Dufan / Ancol", category: "member", bg: "#E30613", label: "Dufan", style: "wordmark" },
  { id: "waterbom", name: "Waterbom", category: "member", bg: "#00B7C7", label: "Waterbom", style: "wordmark" },
  { id: "jatim-park", name: "Jatim Park", category: "member", bg: "#0F7A3B", label: "Jatim Park", style: "wordmark" },

  /* ---------- Buku & alat tulis ---------- */
  { id: "gramedia", name: "Gramedia", category: "member", bg: "#005BAA", label: "Gramedia", style: "wordmark" },
  { id: "periplus", name: "Periplus", category: "member", bg: "#003366", label: "Periplus", style: "wordmark" },
  { id: "books-and-beyond", name: "Books & Beyond", category: "member", bg: "#1A6B3F", label: "Books & Beyond", style: "wordmark" },
  { id: "kinokuniya", name: "Kinokuniya", category: "member", bg: "#A6192E", label: "Kinokuniya", style: "wordmark" },
  { id: "togamas", name: "Toga Mas", category: "member", bg: "#E30613", label: "Toga Mas", style: "wordmark" },
  { id: "office-1", name: "Office 1 Superstore", category: "member", bg: "#003F87", label: "Office 1", style: "wordmark" },

  /* ---------- Gym & fitness ---------- */
  { id: "gold-gym", name: "Gold's Gym", category: "member", bg: "#000000", fg: "#FFD700", label: "Gold's Gym", style: "wordmark" },
  { id: "celebrity-fitness", name: "Celebrity Fitness", category: "member", bg: "#E30613", label: "Celebrity Fitness", style: "wordmark" },
  { id: "fitnessfirst", name: "Fitness First", category: "member", bg: "#000000", label: "Fitness First", style: "wordmark" },
  { id: "anytime-fitness", name: "Anytime Fitness", category: "member", bg: "#0F4D8A", label: "Anytime Fitness", style: "wordmark" },
  { id: "fit-hub", name: "FIT HUB", category: "member", bg: "#000000", fg: "#FFCD00", label: "FIT HUB", style: "wordmark" },

  /* ---------- Aviation & travel ---------- */
  { id: "garuda", name: "Garuda Indonesia", category: "member", bg: "#0072BC", label: "Garuda Indonesia", style: "wordmark" },
  { id: "lionair", name: "Lion Air", category: "member", bg: "#E30613", label: "Lion Air", style: "wordmark" },
  { id: "batik-air", name: "Batik Air", category: "member", bg: "#003F87", label: "Batik Air", style: "wordmark" },
  { id: "wings-air", name: "Wings Air", category: "member", bg: "#003F87", label: "Wings Air", style: "wordmark" },
  { id: "citilink", name: "Citilink", category: "member", bg: "#00A859", label: "Citilink", style: "wordmark" },
  { id: "airasia", name: "AirAsia", category: "member", bg: "#E2231A", label: "AirAsia", style: "wordmark" },
  { id: "super-air-jet", name: "Super Air Jet", category: "member", bg: "#E30613", label: "Super Air Jet", style: "wordmark" },
  { id: "trans-nusa", name: "TransNusa", category: "member", bg: "#A6192E", label: "TransNusa", style: "wordmark" },
  { id: "pelita-air", name: "Pelita Air", category: "member", bg: "#0F4D8A", label: "Pelita Air", style: "wordmark" },
  { id: "singapore-airlines", name: "Singapore Airlines", category: "member", bg: "#1A4A8C", label: "Singapore Airlines", style: "wordmark" },
  { id: "krisflyer", name: "KrisFlyer", category: "member", bg: "#1A4A8C", label: "KrisFlyer", style: "wordmark" },
  { id: "enrich", name: "Malaysia Airlines Enrich", category: "member", bg: "#005EB8", label: "Enrich", sub: "Malaysia Airlines", style: "wordmark" },
  { id: "asia-miles", name: "Asia Miles", category: "member", bg: "#1A1A1A", label: "Asia Miles", style: "wordmark" },
  { id: "qatar-privilege", name: "Qatar Privilege Club", category: "member", bg: "#660033", label: "Privilege Club", sub: "Qatar Airways", style: "wordmark" },
  { id: "emirates-skywards", name: "Emirates Skywards", category: "member", bg: "#D71921", label: "Skywards", sub: "Emirates", style: "wordmark" },
  { id: "ana-mileage", name: "ANA Mileage Club", category: "member", bg: "#005BAC", label: "ANA Mileage", style: "wordmark" },
  { id: "jal-mileage", name: "JAL Mileage Bank", category: "member", bg: "#A6192E", label: "JAL Mileage", style: "wordmark" },
  { id: "korean-air-skypass", name: "Korean Air SKYPASS", category: "member", bg: "#0F4D8A", label: "SKYPASS", sub: "Korean Air", style: "wordmark" },

  /* ---------- Transportasi darat ---------- */
  { id: "transjakarta", name: "Transjakarta", category: "member", bg: "#E30613", label: "Transjakarta", style: "wordmark" },
  { id: "mrtjkt", name: "MRT Jakarta", category: "member", bg: "#00529C", label: "MRT Jakarta", style: "wordmark" },
  { id: "lrtjkt", name: "LRT Jakarta", category: "member", bg: "#0F7A3B", label: "LRT Jakarta", style: "wordmark" },
  { id: "kai", name: "KAI Access", category: "member", bg: "#F58220", label: "KAI", style: "wordmark" },
  { id: "krl", name: "KRL Commuter Line", category: "member", bg: "#F58220", label: "KRL", sub: "Commuter Line", style: "wordmark" },
  { id: "damri", name: "DAMRI", category: "member", bg: "#E30613", label: "DAMRI", style: "wordmark" },
  { id: "bluebird", name: "Blue Bird", category: "member", bg: "#0072BC", label: "Blue Bird", style: "wordmark" },

  /* ---------- E-money / dompet digital ---------- */
  { id: "gopay", name: "GoPay", category: "member", bg: "#00AEEF", label: "GoPay", style: "wordmark" },
  { id: "ovo", name: "OVO", category: "member", bg: "#5C2A82", label: "OVO", style: "wordmark" },
  { id: "dana", name: "DANA", category: "member", bg: "#118EEA", label: "DANA", style: "wordmark" },
  { id: "shopeepay", name: "ShopeePay", category: "member", bg: "#F5641A", label: "ShopeePay", style: "wordmark" },
  { id: "linkaja", name: "LinkAja", category: "member", bg: "#E30613", label: "LinkAja", style: "wordmark" },
  { id: "flazz", name: "BCA Flazz", category: "member", bg: "#0060A8", label: "Flazz", sub: "BCA", style: "wordmark" },
  { id: "emoney-mandiri", name: "e-Money Mandiri", category: "member", bg: "#003D79", label: "e-Money", sub: "Mandiri", style: "wordmark" },
  { id: "tapcash", name: "BNI TapCash", category: "member", bg: "#F26522", label: "TapCash", sub: "BNI", style: "wordmark" },
  { id: "brizzi", name: "BRI Brizzi", category: "member", bg: "#00529C", label: "Brizzi", sub: "BRI", style: "wordmark" },
  { id: "jak-lingko", name: "Jak Lingko", category: "member", bg: "#E30613", label: "Jak Lingko", style: "wordmark" },

  /* ---------- E-commerce & marketplace ---------- */
  { id: "tokopedia", name: "Tokopedia", category: "member", bg: "#03AC0E", label: "Tokopedia", style: "wordmark" },
  { id: "shopee", name: "Shopee", category: "member", bg: "#F5641A", label: "Shopee", style: "wordmark" },
  { id: "lazada", name: "Lazada", category: "member", bg: "#0F156D", label: "Lazada", style: "wordmark" },
  { id: "bukalapak", name: "Bukalapak", category: "member", bg: "#E31E52", label: "Bukalapak", style: "wordmark" },
  { id: "blibli", name: "Blibli", category: "member", bg: "#0095DA", label: "blibli", style: "wordmark" },
  { id: "tiktok-shop", name: "TikTok Shop", category: "member", bg: "#000000", label: "TikTok Shop", style: "wordmark" },
  { id: "zalora", name: "Zalora", category: "member", bg: "#000000", label: "ZALORA", style: "wordmark" },

  /* ---------- Hotel & lifestyle membership ---------- */
  { id: "marriott-bonvoy", name: "Marriott Bonvoy", category: "member", bg: "#1A1A1A", label: "Marriott Bonvoy", style: "wordmark" },
  { id: "accor-all", name: "ALL — Accor Live Limitless", category: "member", bg: "#003F87", label: "ALL", sub: "Accor Live Limitless", style: "wordmark" },
  { id: "ihg-onerewards", name: "IHG One Rewards", category: "member", bg: "#0F2E60", label: "IHG One", sub: "Rewards", style: "wordmark" },
  { id: "hilton-honors", name: "Hilton Honors", category: "member", bg: "#0F2E60", label: "Hilton Honors", style: "wordmark" },
  { id: "wyndham-rewards", name: "Wyndham Rewards", category: "member", bg: "#003C71", label: "Wyndham Rewards", style: "wordmark" },
  { id: "archipelago", name: "Archipelago", category: "member", bg: "#5C2C0E", label: "Archipelago", style: "wordmark" },
  { id: "santika", name: "Santika Indonesia Hotels", category: "member", bg: "#A6192E", label: "Santika", style: "wordmark" },
  { id: "tiket-elite", name: "Tiket Elite", category: "member", bg: "#003E7E", label: "Tiket Elite", style: "wordmark" },
  { id: "traveloka-priority", name: "Traveloka Priority", category: "member", bg: "#0095DA", label: "Traveloka Priority", style: "wordmark" },

  /* ---------- Lain-lain / komunitas ---------- */
  { id: "guardianid", name: "Guardian ID", category: "member", bg: "#00529C", label: "Guardian", style: "wordmark" },
  { id: "ace-rewards", name: "ACE Rewards", category: "member", bg: "#E1251B", label: "ACE Rewards", style: "wordmark" },
  { id: "map-club", name: "MAP Club", category: "member", bg: "#A6192E", label: "MAP Club", style: "wordmark" },
  { id: "map", name: "MAP", category: "member", bg: "#B30000", label: "MAP", sub: "Mitra Adiperkasa", style: "wordmark" },
];

export const ALL_CATALOG: CatalogCard[] = [...BANKS, ...MEMBERS].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export function findCatalog(id: string): CatalogCard | undefined {
  return ALL_CATALOG.find((c) => c.id === id);
}
