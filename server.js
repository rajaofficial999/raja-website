const express=require("express");
const session=require("express-session");
const bcrypt=require("bcryptjs");
const Database=require("better-sqlite3");
const path=require("path");
require("dotenv").config();

const app=express();
const PORT=Number(process.env.PORT||3000);
const db=new Database(path.join(__dirname,"data.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,last_seen TEXT);
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,event TEXT NOT NULL,meta TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
`);
const env=process.env;
const adminEmail=(env.ADMIN_EMAIL||"admin@rajanexus.local").toLowerCase();
if(!db.prepare("SELECT 1 FROM users WHERE email=?").get(adminEmail))db.prepare("INSERT INTO users(email,password_hash) VALUES(?,?)").run(adminEmail,bcrypt.hashSync(env.ADMIN_PASSWORD||"ChangeMe123!",12));
function setting(k,d){const r=db.prepare("SELECT value FROM settings WHERE key=?").get(k);return r?r.value:d}
app.disable("x-powered-by");app.use(express.json({limit:"100kb"}));app.use(express.urlencoded({extended:true}));
app.use(session({secret:env.SESSION_SECRET||"change-me-in-production",resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:"lax",secure:env.NODE_ENV==="production",maxAge:1000*60*60*24*7}}));
app.use(express.static(path.join(__dirname,"public")));
function auth(req,res,next){if(req.session.user)return next();res.status(401).json({error:"Login required"})}
function admin(req,res,next){if(req.session.user?.email===adminEmail)return next();res.status(403).json({error:"Admin only"})}
function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
app.get("/health",(req,res)=>res.json({ok:true,name:"RAJA NEXUS",time:new Date().toISOString()}));
app.post("/api/register",(req,res)=>{const email=String(req.body?.email||"").trim().toLowerCase(),password=String(req.body?.password||"");if(!validEmail(email)||password.length<6)return res.status(400).json({error:"Valid email and password (6+ chars) required"});try{const hash=bcrypt.hashSync(password,12);const info=db.prepare("INSERT INTO users(email,password_hash) VALUES(?,?)").run(email,hash);req.session.user={id:info.lastInsertRowid,email};res.json({ok:true,user:{email}})}catch(e){res.status(409).json({error:"Email already registered"})}});
app.post("/api/login",(req,res)=>{const email=String(req.body?.email||"").trim().toLowerCase(),password=String(req.body?.password||"");const u=db.prepare("SELECT * FROM users WHERE email=?").get(email);if(!u||!bcrypt.compareSync(password,u.password_hash))return res.status(401).json({error:"Invalid login"});db.prepare("UPDATE users SET last_seen=CURRENT_TIMESTAMP WHERE id=?").run(u.id);req.session.user={id:u.id,email:u.email};res.json({ok:true,user:{email:u.email}})});
app.post("/api/logout",(req,res)=>req.session.destroy(()=>res.json({ok:true})));app.get("/api/me",(req,res)=>res.json({user:req.session.user||null}));
app.post("/api/event",(req,res)=>{const e=String(req.body?.event||"").slice(0,80);if(!e)return res.status(400).json({error:"event required"});db.prepare("INSERT INTO events(user_id,event,meta) VALUES(?,?,?)").run(req.session.user?.id||null,e,JSON.stringify(req.body?.meta||{}));if(req.session.user)db.prepare("UPDATE users SET last_seen=CURRENT_TIMESTAMP WHERE id=?").run(req.session.user.id);res.json({ok:true})});
app.get("/api/stats",admin,(req,res)=>{const users=db.prepare("SELECT COUNT(*) n FROM users").get().n,events=db.prepare("SELECT COUNT(*) n FROM events").get().n,active=db.prepare("SELECT COUNT(*) n FROM users WHERE last_seen>=datetime('now','-15 minutes')").get().n,top=db.prepare("SELECT event,COUNT(*) n FROM events GROUP BY event ORDER BY n DESC LIMIT 10").all();res.json({users,events,active,top})});
app.get("/api/social",(req,res)=>res.json({telegram:setting("telegram",env.TELEGRAM_URL||"https://t.me/"),instagram:setting("instagram",env.INSTAGRAM_URL||"https://www.instagram.com/"),facebook:setting("facebook",env.FACEBOOK_URL||"https://www.facebook.com/"),x:setting("x",env.X_URL||"https://x.com/")}));
app.post("/api/admin/social",admin,(req,res)=>{for(const k of ["telegram","instagram","facebook","x"])if(typeof req.body?.[k]==="string"&&req.body[k].length<500)db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(k,req.body[k]);res.json({ok:true})});
app.get("/api/games",(req,res)=>res.json([{name:"Reaction Test",slug:"reaction"},{name:"Aim Clicker",slug:"aim"},{name:"Number Rush",slug:"numbers"}]));
app.get("/nexus",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`RAJA NEXUS running on http://localhost:${PORT}`));
