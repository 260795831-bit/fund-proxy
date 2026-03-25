export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'PingFang SC',sans-serif;background:#f5f5f7;color:#1d1d1f;font-size:14px}
.hd{background:#fff;border-bottom:1px solid #e5e5e5;padding:13px 20px;display:flex;align-items:center;justify-content:space-between}
.hd h1{font-size:16px;font-weight:600}
.upd{font-size:12px;color:#999}
.wrap{max-width:900px;margin:16px auto;padding:0 14px}
.sum{background:#fff;border-radius:14px;padding:18px 20px;margin-bottom:14px;display:grid;grid-template-columns:repeat(4,1fr)}
.si{padding:0 12px;border-right:1px solid #f0f0f0}.si:first-child{padding-left:0}.si:last-child{border-right:none}
.sl{font-size:11px;color:#999;margin-bottom:5px}.sv{font-size:19px;font-weight:700}.ss{font-size:11px;margin-top:3px}
.mkt{background:#fff;border-radius:14px;padding:16px 20px;margin-bottom:14px}
.mkt-title{font-size:13px;font-weight:600;color:#555;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}
.mkt-date{font-size:11px;color:#bbb;font-weight:400}
.index-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
.idx{background:#f8f8f8;border-radius:10px;padding:10px 12px}
.idx-name{font-size:11px;color:#888;margin-bottom:4px}
.idx-val{font-size:17px;font-weight:700}
.idx-pct{font-size:12px;font-weight:500;margin-top:2px}
.sector-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.sec{display:flex;align-items:center;justify-content:space-between;background:#f8f8f8;border-radius:9px;padding:9px 12px}
.sec-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.sec-name{font-size:13px;color:#333}
.sec-pct{font-size:13px;font-weight:600}
.sec-bar-wrap{height:3px;background:#f0f0f0;border-radius:3px;margin-top:6px}
.sec-bar{height:3px;border-radius:3px}
.fc{background:#fff;border-radius:14px;padding:16px 20px;margin-bottom:12px}
.ft{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.fn{font-size:14px;font-weight:600;line-height:1.4;max-width:300px}
.fm{display:flex;align-items:center;gap:6px;margin-top:4px}
.ftp{font-size:11px;padding:2px 6px;border-radius:4px}
.fcd{font-size:11px;color:#bbb}
.nb{text-align:right}
.ne{font-size:22px;font-weight:700}
.nr{display:flex;align-items:center;justify-content:flex-end;gap:5px;margin-top:2px}
.nc{font-size:13px;font-weight:600}
.nbg{font-size:10px;background:#f0f0f0;color:#888;border-radius:3px;padding:1px 5px}
.nh{font-size:11px;color:#bbb;margin-top:2px}
.mets{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.met{background:#f8f8f8;border-radius:9px;padding:9px 11px}
.ml{font-size:11px;color:#999;margin-bottom:3px}.mv{font-size:13px;font-weight:600}
.pbw{height:4px;background:#f0f0f0;border-radius:4px;margin-top:12px}
.pb{height:4px;border-radius:4px}
.up{color:#e03a3a}.dn{color:#1aab60}
.disc{font-size:11px;color:#ccc;text-align:center;padding:4px 0 20px}
</style>
</head>
<body>
<div class="hd">
  <h1>我的基金持仓</h1>
  <span class="upd" id="updTime">—</span>
</div>
<div class="wrap">
  <div class="sum" id="sum"></div>
  <div class="mkt">
    <div class="mkt-title">市场行情<span class="mkt-date" id="mktDate"></span></div>
    <div class="index-grid" id="indexGrid"></div>
    <div style="font-size:11px;color:#999;margin-bottom:8px">相关行业板块</div>
    <div class="sector-grid" id="sectorGrid"></div>
  </div>
  <div id="list"></div>
  <div class="disc">数据由 Claude 搜索更新 · 估值仅供参考</div>
</div>
<script>
const UP='#e03a3a', DN='#1aab60';
const fmtP=v=>(v>=0?'+':'')+v.toFixed(2)+'%';
const fmtM=v=>(v>=0?'+¥':'-¥')+Math.abs(v).toFixed(2);
const clr=v=>v>0?UP:v<0?DN:'#999';
const TS={index:{bg:'#e8f0fe',color:'#1a56db'},mix:{bg:'#fef3e2',color:'#c47600'},etf:{bg:'#e4f9f0',color:'#0e7f53'}};

// 基金持仓（份额 = 成本 / 成本净值，固定不变）
const FUNDS=[
  {name:'天弘中证电网设备主题指数A', code:'025832', type:'指数基金', tc:'index', cost:7742.26, profit:273.13, costNav:1.2412, lastNav:1.2850, shares:6237.72},
  {name:'中航机遇领航混合A',         code:'018956', type:'混合型',   tc:'mix',  cost:2999.90, profit:-77.52, costNav:3.7174, lastNav:3.6212, shares:806.99},
  {name:'华夏中证电网设备ETF联接A',  code:'025856', type:'ETF联接',  tc:'etf',  cost:2800.00, profit:-181.33,costNav:1.3667, lastNav:1.2782, shares:1317.08},
  {name:'永赢科技智选混合A',         code:'016699', type:'混合型',   tc:'mix',  cost:1521.30, profit:39.35,  costNav:3.8928, lastNav:3.7972, shares:390.77},
];

// ══ 由 Claude 每次更新此区域 ══
const DATA={
  updTime:'—',
  indices:[
    {name:'上证指数', val:'—', pct:0},
    {name:'深证成指', val:'—', pct:0},
    {name:'创业板指', val:'—', pct:0},
  ],
  sectors:[
    {name:'电网设备', pct:0, note:''},
    {name:'国防军工', pct:0, note:''},
    {name:'科技TMT',  pct:0, note:''},
  ],
  gz:{
    '025832':{estNav:1.2850, estPct:0, gzTime:'—'},
    '018956':{estNav:3.6212, estPct:0, gzTime:'—'},
    '025856':{estNav:1.2782, estPct:0, gzTime:'—'},
    '016699':{estNav:3.7972, estPct:0, gzTime:'—'},
  }
};
// ══════════════════════════════

document.getElementById('updTime').textContent=DATA.updTime;
document.getElementById('mktDate').textContent=DATA.updTime;

function renderSum(){
  // 总成本、总持有收益固定
  const totalCost=FUNDS.reduce((s,f)=>s+f.cost,0);
  const totalProfit=FUNDS.reduce((s,f)=>s+f.profit,0);
  // 今日估算总市值 = sum(份额 × 估算净值)
  const totalEst=FUNDS.reduce((s,f)=>s+f.shares*(DATA.gz[f.code]?.estNav||f.lastNav),0);
  // 今日盈亏 = 估算总市值 - (总成本 + 总持有收益) = 估算总市值 - 昨日总市值
  const lastTotal=FUNDS.reduce((s,f)=>s+f.shares*f.lastNav,0);
  const todayPnl=totalEst-lastTotal;
  const todayPct=todayPnl/lastTotal*100;
  const profitPct=totalProfit/totalCost*100;
  document.getElementById('sum').innerHTML=
    '<div class="si"><div class="sl">总市值</div><div class="sv">¥'+totalEst.toFixed(2)+'</div><div class="ss" style="color:#999">持仓4只</div></div>'+
    '<div class="si"><div class="sl">总成本</div><div class="sv">¥'+totalCost.toFixed(2)+'</div><div class="ss" style="color:#999">累计投入</div></div>'+
    '<div class="si"><div class="sl">持有收益</div><div class="sv" style="color:'+clr(totalProfit)+'">'+fmtM(totalProfit)+'</div><div class="ss" style="color:'+clr(totalProfit)+'">'+fmtP(profitPct)+'</div></div>'+
    '<div class="si"><div class="sl">今日估算盈亏</div><div class="sv" style="color:'+clr(todayPnl)+'">'+fmtM(todayPnl)+'</div><div class="ss" style="color:'+clr(todayPnl)+'">'+fmtP(todayPct)+'</div></div>';
}

function renderMkt(){
  document.getElementById('indexGrid').innerHTML=DATA.indices.map(i=>
    '<div class="idx"><div class="idx-name">'+i.name+'</div><div class="idx-val" style="color:'+clr(i.pct)+'">'+i.val+'</div><div class="idx-pct" style="color:'+clr(i.pct)+'">'+fmtP(i.pct)+'</div></div>'
  ).join('');
  const maxAbs=Math.max(...DATA.sectors.map(s=>Math.abs(s.pct)),1);
  document.getElementById('sectorGrid').innerHTML=DATA.sectors.map(s=>
    '<div class="sec"><div style="flex:1">'+
    '<div style="display:flex;align-items:center;justify-content:space-between">'+
    '<div style="display:flex;align-items:center;gap:8px">'+
    '<div class="sec-dot" style="background:'+clr(s.pct)+'"></div>'+
    '<span class="sec-name">'+s.name+'</span>'+
    (s.note?'<span style="font-size:10px;color:#bbb">'+s.note+'</span>':'')+
    '</div><span class="sec-pct" style="color:'+clr(s.pct)+'">'+fmtP(s.pct)+'</span></div>'+
    '<div class="sec-bar-wrap"><div class="sec-bar" style="width:'+(Math.abs(s.pct)/maxAbs*100).toFixed(0)+'%;background:'+clr(s.pct)+'"></div></div>'+
    '</div></div>'
  ).join('');
}

function renderFunds(){
  const maxCost=Math.max(...FUNDS.map(f=>f.cost));
  document.getElementById('list').innerHTML=FUNDS.map(f=>{
    const g=DATA.gz[f.code]||{estNav:f.lastNav,estPct:0,gzTime:'—'};
    const estAmt=f.shares*g.estNav;
    const dayPnl=f.shares*(g.estNav-f.lastNav);  // 当日盈亏 = 份额×(估算净值-昨日净值)
    const ts=TS[f.tc];
    return '<div class="fc">'+
      '<div class="ft"><div>'+
      '<div class="fn">'+f.name+'</div>'+
      '<div class="fm"><span class="ftp" style="background:'+ts.bg+';color:'+ts.color+'">'+f.type+'</span>'+
      '<span class="fcd">'+f.code+'</span></div></div>'+
      '<div class="nb">'+
      '<div class="ne" style="color:'+clr(g.estPct)+'">¥'+g.estNav.toFixed(4)+'</div>'+
      '<div class="nr"><span class="nc" style="color:'+clr(g.estPct)+'">'+fmtP(g.estPct)+'</span><span class="nbg">估算</span></div>'+
      '<div class="nh">昨收 ¥'+f.lastNav.toFixed(4)+'　'+g.gzTime+'</div>'+
      '</div></div>'+
      '<div class="mets">'+
      '<div class="met"><div class="ml">估算市值</div><div class="mv">¥'+estAmt.toFixed(2)+'</div></div>'+
      '<div class="met"><div class="ml">当日盈亏</div><div class="mv" style="color:'+clr(dayPnl)+'">'+fmtM(dayPnl)+'</div></div>'+
      '<div class="met"><div class="ml">持有收益</div><div class="mv" style="color:'+clr(f.profit)+'">'+fmtM(f.profit)+'</div></div>'+
      '<div class="met"><div class="ml">持有份额</div><div class="mv">'+f.shares.toFixed(2)+'</div></div>'+
      '<div class="met"><div class="ml">成本净值</div><div class="mv">¥'+f.costNav.toFixed(4)+'</div></div>'+
      '<div class="met"><div class="ml">仓位占比</div><div class="mv">'+(f.cost/FUNDS.reduce((s,x)=>s+x.cost,0)*100).toFixed(1)+'%</div></div>'+
      '</div>'+
      '<div style="font-size:11px;color:#bbb;margin-top:10px;margin-bottom:3px">仓位 '+(f.cost/maxCost*100).toFixed(1)+'%</div>'+
      '<div class="pbw"><div class="pb" style="width:'+(f.cost/maxCost*100).toFixed(1)+'%;background:'+(f.profit>=0?UP:DN)+'"></div></div>'+
      '</div>';
  }).join('');
}

renderSum(); renderMkt(); renderFunds();
</script>
</body>
</html>`);
}
