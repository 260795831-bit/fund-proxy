export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>我的基金持仓</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F5F5F7;font-family:-apple-system,"PingFang SC",sans-serif;color:#1a1a1a;min-height:100vh}
.header{background:#fff;padding:14px 16px;border-bottom:.5px solid #e5e5e5;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.header h1{font-size:17px;font-weight:500}
.hdr-r{display:flex;align-items:center;gap:8px}
#upd{font-size:11px;color:#aaa}
#btn{font-size:11px;padding:4px 12px;border-radius:20px;border:.5px solid #ddd;background:#fff;color:#333;cursor:pointer}
#btn:disabled{color:#aaa;background:#f5f5f5;cursor:default}
.card{background:#fff;margin:10px 12px;border-radius:12px;padding:16px}
.sum-grid{display:grid;grid-template-columns:auto 1fr 1fr 1fr}
.st{padding-left:12px;border-left:.5px solid #eee}
.sl{font-size:11px;color:#888;margin-bottom:4px}
.sv{font-size:14px;font-weight:600;line-height:1.2}
.ss{font-size:11px;margin-top:2px;color:#aaa}
.sec-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.sec-ttl{font-size:14px;font-weight:500}
.sec-dt{font-size:11px;color:#aaa}
.ix-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.ix-box{background:#F8F8F8;border-radius:8px;padding:10px}
.ix-nm{font-size:11px;color:#888;margin-bottom:4px}
.ix-vl{font-size:15px;font-weight:600}
.ix-ch{font-size:11px;margin-top:2px}
.fh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.fn{font-size:15px;font-weight:500;margin-bottom:5px}
.fm{display:flex;gap:6px;align-items:center}
.tag{font-size:11px;padding:2px 7px;border-radius:4px;font-weight:500}
.ti{background:#EBF3FF;color:#1A5FB4}
.tm{background:#FFF3E0;color:#B45309}
.fc{font-size:11px;color:#bbb}
.ft{font-size:10px;color:#bbb;margin-left:4px}
.fv{text-align:right}
.nvm{font-size:20px;font-weight:700}
.nvc{font-size:12px;margin-top:2px}
.nvp{font-size:11px;color:#bbb;margin-top:1px}
.dg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px}
.db{background:#F8F8F8;border-radius:8px;padding:9px 10px}
.dl{font-size:11px;color:#888;margin-bottom:3px}
.dv{font-size:13px;font-weight:500}
.wr{display:flex;align-items:center;gap:8px}
.wl{font-size:11px;color:#aaa;white-space:nowrap}
.wb{flex:1;height:3px;border-radius:2px;background:#eee;overflow:hidden}
.wf{height:100%;border-radius:2px}
.footer{padding:10px 16px 28px;font-size:11px;color:#bbb;text-align:center}
.err{margin:10px 12px;padding:14px;background:#FFF3E0;border-radius:12px;font-size:13px;color:#B45309}
.loading{text-align:center;padding:60px 20px;color:#aaa;font-size:14px}
.red{color:#E53935}.green{color:#00897B}
</style>
</head>
<body>
<div class="header">
  <h1>我的基金持仓</h1>
  <div class="hdr-r">
    <span id="upd">加载中…</span>
    <button id="btn" onclick="doLoad()">刷新</button>
  </div>
</div>
<div id="app"><div class="loading">正在获取实时数据…</div></div>
<script>
var RED='#E53935',GRN='#00897B';
var FUNDS=[
  {code:'001071',name:'天弘中证电网设备主题指数A',type:'指数基金',total:8015.39,profit:273.13,cost:1.2412,prev:1.2850},
  {code:'014073',name:'中航机遇领航混合A',type:'混合型',total:2922.38,profit:-77.52,cost:3.7174,prev:3.6212},
  {code:'017554',name:'华夏中证电网设备主题ETF联接A',type:'指数基金',total:2618.67,profit:-181.33,cost:1.3667,prev:1.2782},
  {code:'016699',name:'永赢科技智选混合A',type:'混合型',total:1560.65,profit:39.35,cost:3.8928,prev:3.7972}
];
var timer=null;
function f2(n){return Number(n).toFixed(2);}
function f4(n){return Number(n).toFixed(4);}
function fp(n){return(n>=0?'+':'')+f2(n)+'%';}
function fm(n){return(n>=0?'+':'-')+'¥'+f2(Math.abs(n));}
function cs(n){return n>=0?'red':'green';}
function cc(n){return n>=0?RED:GRN;}
function pad(n){return('0'+n).slice(-2);}
function doLoad(){
  var btn=document.getElementById('btn');
  btn.disabled=true;btn.textContent='获取中…';
  clearTimeout(timer);
  var codes=FUNDS.map(function(f){return f.code;}).join(',');
  Promise.all([
    fetch('/api/fund?codes='+codes).then(function(r){return r.json();}),
    fetch('/api/fund?type=index').then(function(r){return r.json();})
  ]).then(function(res){
    render(res[0].funds||[],res[1].indices||[]);
    var now=new Date();
    document.getElementById('upd').textContent=pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds())+' 更新';
    timer=setTimeout(doLoad,60000);
  }).catch(function(e){
    document.getElementById('app').innerHTML='<div class="err">获取失败：'+e.message+'</div>';
  }).finally(function(){btn.disabled=false;btn.textContent='刷新';});
}
function render(liveFunds,indices){
  var tc=0,tp=0,te=0,td=0;
  var rows=FUNDS.map(function(f){
    var ld=liveFunds.find(function(x){return x.code===f.code;})||{};
    var nv=ld.estNV||f.prev,chg=ld.estChg!=null?ld.estChg:0,t=ld.time||'';
    var sh=(f.total-f.profit)/f.cost,et=sh*nv,dp=sh*(nv-f.prev);
    tc+=f.total-f.profit;tp+=f.profit;te+=et;td+=dp;
    return{f:f,nv:nv,chg:chg,t:t,sh:sh,et:et,dp:dp};
  });
  var now=new Date(),ds=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate());
  var h='<div class="card"><div class="sum-grid">';
  h+='<div><div class="sl">总市值</div><div class="sv">¥'+f2(te)+'</div><div class="ss">持仓'+FUNDS.length+'只</div></div>';
  h+='<div class="st"><div class="sl">总成本</div><div class="sv">¥'+f2(tc)+'</div><div class="ss">累计投入</div></div>';
  h+='<div class="st"><div class="sl">持有收益</div><div class="sv '+cs(tp)+'">'+fm(tp)+'</div><div class="ss '+cs(tp)+'">'+fp(tp/tc*100)+'</div></div>';
  h+='<div class="st"><div class="sl">今日估算盈亏</div><div class="sv '+cs(td)+'">'+fm(td)+'</div><div class="ss '+cs(td)+'">'+fp(td/tc*100)+'</div></div>';
  h+='</div></div>';
  if(indices.length){
    h+='<div class="card"><div class="sec-hdr"><span class="sec-ttl">市场行情</span><span class="sec-dt">'+ds+' · 实时</span></div><div class="ix-grid">';
    indices.forEach(function(ix){
      h+='<div class="ix-box"><div class="ix-nm">'+ix.name+'</div><div class="ix-vl '+cs(ix.chg)+'">'+ix.value+'</div><div class="ix-ch '+cs(ix.chg)+'">'+ix.chgStr+'</div></div>';
    });
    h+='</div></div>';
  }
  rows.forEach(function(r){
    var f=r.f,pos=r.dp>=0,pp=f.profit>=0,w=f2(r.et/te*100),tag=f.type==='指数基金'?'ti':'tm';
    h+='<div class="card"><div class="fh"><div><div class="fn">'+f.name+'</div>';
    h+='<div class="fm"><span class="tag '+tag+'">'+f.type+'</span><span class="fc">'+f.code+'</span>'+(r.t?'<span class="ft">'+r.t+'</span>':'')+'</div>';
    h+='</div><div class="fv"><div class="nvm '+cs(r.dp)+'">¥'+f4(r.nv)+'</div>';
    h+='<div class="nvc '+cs(r.dp)+'">'+fp(r.chg)+' 估算</div><div class="nvp">昨收 ¥'+f4(f.prev)+'</div></div></div>';
    h+='<div class="dg">';
    h+='<div class="db"><div class="dl">估算市值</div><div class="dv">¥'+f2(r.et)+'</div></div>';
    h+='<div class="db"><div class="dl">当日盈亏</div><div class="dv '+cs(r.dp)+'">'+fm(r.dp)+'</div></div>';
    h+='<div class="db"><div class="dl">持有收益</div><div class="dv '+cs(f.profit)+'">'+fm(f.profit)+'</div></div>';
    h+='<div class="db"><div class="dl">持有份额</div><div class="dv">'+f2(r.sh)+'</div></div>';
    h+='<div class="db"><div class="dl">成本净值</div><div class="dv">¥'+f4(f.cost)+'</div></div>';
    h+='<div class="db"><div class="dl">累计收益率</div><div class="dv '+cs(f.profit)+'">'+fp(f.profit/(f.total-f.profit)*100)+'</div></div>';
    h+='</div><div class="wr"><span class="wl">仓位 '+w+'%</span>';
    h+='<div class="wb"><div class="wf" style="width:'+w+'%;background:'+cc(r.dp)+'"></div></div></div></div>';
  });
  h+='<div class="footer">数据来源：天天基金 · 新浪财经 · 每60秒自动刷新 · 仅供参考</div>';
  document.getElementById('app').innerHTML=h;
}
doLoad();
</script>
</body>
</html>`);
}
