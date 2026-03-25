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
.tag
