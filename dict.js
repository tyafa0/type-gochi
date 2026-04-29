// ローマ字入力パターン辞書
export const romajiDict = {
    // ア行
    "あ": ["a"], "い": ["i"], "う": ["u", "wu", "whu"], "え": ["e"], "お": ["o"],
    // カ行
    "か": ["ka", "ca"], "き": ["ki"], "く": ["ku", "cu", "qu"], "け": ["ke"], "こ": ["ko", "co"],
    // サ行
    "さ": ["sa"], "し": ["shi", "si", "ci"], "す": ["su"], "せ": ["se", "ce"], "そ": ["so"],
    // タ行
    "た": ["ta"], "ち": ["chi", "ti"], "つ": ["tsu", "tu"], "て": ["te"], "と": ["to"],
    // ナ行
    "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
    // ハ行
    "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
    // マ行
    "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
    // ヤ行
    "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
    // ラ行
    "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
    // ワ行
    "わ": ["wa"], "を": ["wo"], "ん": ["nn", "n", "xn"],
    
    // 濁音・半濁音
    "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
    "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
    "だ": ["da"], "ぢ": ["di"], "づ": ["du"], "で": ["de"], "ど": ["do"],
    "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
    "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],

    // 拗音（キャ行〜ピャ行）
    "きゃ": ["kya", "kixya", "kilya"], "きゅ": ["kyu", "kixyu", "kilyu"], "きょ": ["kyo", "kixyo", "kilyo"],
    "しゃ": ["sha", "sya", "sixya", "silya"], "しゅ": ["shu", "syu", "sixyu", "silyu"], "しょ": ["sho", "syo", "sixyo", "silyo"],
    "ちゃ": ["cha", "tya", "cya", "chixya", "tixya"], "ちゅ": ["chu", "tyu", "cyu", "chixyu", "tixyu"], "ちょ": ["cho", "tyo", "cyo", "chixyo", "tixyo"],
    "にゃ": ["nya", "nixya", "nilya"], "にゅ": ["nyu", "nixyu", "nilyu"], "にょ": ["nyo", "nixyo", "nilyo"],
    "ひゃ": ["hya", "hixya", "hilya"], "ひゅ": ["hyu", "hixyu", "hilyu"], "ひょ": ["hyo", "hixyo", "hilyo"],
    "みゃ": ["mya", "mixya", "milya"], "みゅ": ["myu", "mixyu", "milyu"], "みょ": ["myo", "mixyo", "milyo"],
    "りゃ": ["rya", "rixya", "rilya"], "りゅ": ["ryu", "rixyu", "rilyu"], "りょ": ["ryo", "rixyo", "rilyo"],
    
    "ぎゃ": ["gya", "gixya", "gilya"], "ぎゅ": ["gyu", "gixyu", "gilyu"], "ぎょ": ["gyo", "gixyo", "gilyo"],
    "じゃ": ["ja", "jya", "zya", "jixya", "zixya", "jilya", "zilya"], "じゅ": ["ju", "jyu", "zyu", "jixyu", "zixyu", "jilyu", "zilyu"], "じょ": ["jo", "jyo", "zyo", "jixyo", "zixyo", "jilyo", "zilyo"],
    "ぢゃ": ["dya", "dixya", "dilya"], "ぢゅ": ["dyu", "dixyu", "dilyu"], "ぢょ": ["dyo", "dixyo", "dilyo"],
    "びゃ": ["bya", "bixya", "bilya"], "びゅ": ["byu", "bixyu", "bilyu"], "びょ": ["byo", "bixyo", "bilyo"],
    "ぴゃ": ["pya", "pixya", "pilya"], "ぴゅ": ["pyu", "pixyu", "pilyu"], "ぴょ": ["pyo", "pixyo", "pilyo"],

    // 小文字単体（必要に応じて）
    "ぁ": ["xa", "la"], "ぃ": ["xi", "li"], "ぅ": ["xu", "lu"], "ぇ": ["xe", "le"], "ぉ": ["xo", "lo"],
    "ゃ": ["xya", "lya"], "ゅ": ["xyu", "lyu"], "ょ": ["xyo", "lyo"], "っ": ["xtu", "ltu", "xtsu", "ltsu"]
};