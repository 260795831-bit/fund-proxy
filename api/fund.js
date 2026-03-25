export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const codes = (req.query.codes || "").split(",").filter(Boolean);
  const type = req.query.type || "fund";

  try {
    if (type === "index") {
      const r = await fetch(
        "https://hq.sinajs.cn/list=s_sh000001,s_sz399001,s_sz399006",
        { headers: { Referer: "https://finance.sina.com.cn/" } }
      );
      const text = await r.text();
      const names = ["上证指数", "深证成指", "创业板指"];
      const indices = [];
      text.trim().split("\n").forEach((line, i) => {
        const m = line.match(/"([^"]+)"/);
        if (!m) return;
        const p = m[1].split(",");
        if (p.length < 4) return;
        const chg = parseFloat(p[3]) || 0;
        indices.push({
          name: names[i],
          value: p[1],
          chg,
          chgStr: (chg >= 0 ? "+" : "") + chg.toFixed(2) + "%"
        });
      });
      return res.json({ ok: true, indices });
    }

    const results = await Promise.all(
      codes.map(async (code) => {
        const r = await fetch(
          `https://fundgz.1234567.com.cn/js/${code}.js`,
          { headers: { Referer: "https://fund.eastmoney.com/" } }
        );
        const t = await r.text();
        const s = t.indexOf("("), e = t.lastIndexOf(")");
        if (s < 0 || e <= s) return { code, error: "parse fail" };
        const d = JSON.parse(t.slice(s + 1, e));
        return {
          code,
          name: d.name,
          estNV: parseFloat(d.gsz),
          estChg: parseFloat(d.gszzl),
          time: d.gztime,
          prevNV: parseFloat(d.dwjz),
        };
      })
    );
    res.json({ ok: true, funds: results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
