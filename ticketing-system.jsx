import { useState, useRef } from "react";

// ─── Utility ─────────────────────────────────────────────────────────────────
const genId = () => "TKT-" + Date.now().toString(36).toUpperCase().slice(-6);
const genUserId = () => "USR-" + Math.random().toString(36).slice(2, 7).toUpperCase();
const now = () => new Date().toISOString().slice(0, 10);

const STATUSES = ["Open", "In Progress", "Pending", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const ROLES = ["Admin", "Agent", "Requester"];

const STATUS_COLOR   = { Open:"#3b82f6","In Progress":"#f59e0b",Pending:"#8b5cf6",Resolved:"#10b981",Closed:"#6b7280" };
const PRIORITY_COLOR = { Low:"#10b981",Medium:"#f59e0b",High:"#ef4444",Critical:"#7c2d12" };
const ROLE_COLOR     = { Admin:"#7c3aed",Agent:"#0891b2",Requester:"#059669" };

// ─── Seed users ───────────────────────────────────────────────────────────────
const SEED_USERS = [
  { userId:"USR-ADMIN", username:"admin",  password:"admin123", name:"Admin User",  role:"Admin",     department:"IT",      email:"admin@company.com",  active:true, createdDate:"2025-01-01" },
  { userId:"USR-AGT01", username:"alice",  password:"alice123", name:"Alice Smith", role:"Agent",     department:"IT",      email:"alice@company.com",  active:true, createdDate:"2025-01-05" },
  { userId:"USR-AGT02", username:"bob",    password:"bob123",   name:"Bob Johnson", role:"Agent",     department:"HR",      email:"bob@company.com",    active:true, createdDate:"2025-01-06" },
  { userId:"USR-REQ01", username:"john",   password:"john123",  name:"John Doe",    role:"Requester", department:"IT",      email:"john@company.com",   active:true, createdDate:"2025-02-01" },
];

// ─── Seed tickets ─────────────────────────────────────────────────────────────
const SEED_TICKETS = [
  { id:"TKT-INIT01", createDate:"2025-03-01", requestBy:"John Doe",   department:"IT",      requestType:"Bug",            description:"Login page throws 500 error on Safari.",             priority:"High",     status:"In Progress", assignedTo:"Alice Smith", updateDate:"2025-03-02", resolveDate:"",         followUpRequired:true,  followUpTeam:"L2 Support", repeatingIssue:false, comments:[{by:"Alice Smith",date:"2025-03-02",text:"Investigating Safari-specific JS error."}], attachments:[], source:"manual" },
  { id:"TKT-INIT02", createDate:"2025-03-05", requestBy:"Sara West",  department:"HR",      requestType:"Service Request",description:"Request for new employee onboarding access.",        priority:"Medium",   status:"Open",        assignedTo:"",            updateDate:"2025-03-05", resolveDate:"",         followUpRequired:false, followUpTeam:"",           repeatingIssue:false, comments:[], attachments:[], source:"email" },
  { id:"TKT-INIT03", createDate:"2025-03-10", requestBy:"Mike Ray",   department:"Finance", requestType:"Incident",       description:"Excel report macro failing after update.",           priority:"Critical", status:"Pending",     assignedTo:"Bob Johnson", updateDate:"2025-03-11", resolveDate:"",         followUpRequired:true,  followUpTeam:"Vendor",     repeatingIssue:true,  comments:[], attachments:[], source:"manual" },
  { id:"TKT-INIT04", createDate:"2025-03-15", requestBy:"Alice Smith",department:"IT",      requestType:"Change Request", description:"Request to upgrade Node.js version to 20 LTS.",      priority:"Low",      status:"Resolved",    assignedTo:"Alice Smith", updateDate:"2025-03-18", resolveDate:"2025-03-18", followUpRequired:false, followUpTeam:"",           repeatingIssue:false, comments:[], attachments:[], source:"manual" },
];

const DEFAULT_MASTER = {
  departments:  ["IT","HR","Finance","Operations","Admin","Marketing"],
  requestTypes: ["Bug","Service Request","Incident","Change Request","Query","Complaint"],
  agents:       ["Alice Smith","Bob Johnson","Carol Lee","David Kim","Eve Patel"],
  followUpTeams:["L1 Support","L2 Support","Management","Vendor","Internal"],
};

// ─── CSV helpers ──────────────────────────────────────────────────────────────
const esc = v => `"${String(v ?? "").replace(/"/g,'""')}"`;

function exportTicketsCSV(tickets) {
  const headers = ["Ticket ID","Create Date","Requested By","Department","Request Type","Description","Priority","Status","Assigned To","Update Date","Resolve Date","Follow Up Required","Follow Up Team","Repeating Issue","Comments Count","Attachments","Source"];
  const rows = tickets.map(t => [
    t.id, t.createDate, t.requestBy, t.department, t.requestType, t.description,
    t.priority, t.status, t.assignedTo||"", t.updateDate, t.resolveDate||"",
    t.followUpRequired?"Yes":"No", t.followUpTeam||"", t.repeatingIssue?"Yes":"No",
    t.comments.length, t.attachments.length, t.source,
  ].map(esc).join(","));
  triggerDownload([headers.map(esc).join(","), ...rows].join("\n"), `tickets_${now()}.csv`);
}

function exportUsersCSV(users) {
  const headers = ["User ID","Username","Name","Role","Department","Email","Active","Created Date"];
  const rows = users.map(u => [u.userId,u.username,u.name,u.role,u.department,u.email,u.active?"Yes":"No",u.createdDate].map(esc).join(","));
  triggerDownload([headers.map(esc).join(","), ...rows].join("\n"), `users_${now()}.csv`);
}

function triggerDownload(csv, filename) {
  const blob = new Blob([csv], { type:"text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [users,   setUsers]   = useState(SEED_USERS);
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [master,  setMaster]  = useState(DEFAULT_MASTER);
  const [session, setSession] = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null), 3200); };
  const login     = (username, password)  => {
    const u = users.find(u => u.username===username && u.password===password && u.active);
    if (u) { setSession(u); return true; }
    return false;
  };

  if (!session) return <LoginScreen login={login} />;

  return (
    <MainApp
      session={session} logout={()=>setSession(null)}
      users={users} setUsers={setUsers}
      tickets={tickets} setTickets={setTickets}
      master={master} setMaster={setMaster}
      showToast={showToast} toast={toast}
    />
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ login }) {
  const [u, setU]   = useState("");
  const [p, setP]   = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const submit = () => { if (!login(u,p)) setErr("Invalid username or password."); };

  return (
    <div style={ls.bg}>
      <div style={ls.card}>
        <div style={ls.brand}><span style={{fontSize:30}}>🎯</span><span style={ls.brandName}>HelpDesk Pro</span></div>
        <h2 style={ls.title}>Sign in to your account</h2>

        <div style={ls.field}>
          <label style={ls.lbl}>Username</label>
          <input style={ls.inp} value={u} onChange={e=>setU(e.target.value)} placeholder="Enter username" onKeyDown={e=>e.key==="Enter"&&submit()} autoFocus />
        </div>
        <div style={ls.field}>
          <label style={ls.lbl}>Password</label>
          <div style={{position:"relative"}}>
            <input style={ls.inp} type={show?"text":"password"} value={p} onChange={e=>setP(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&submit()} />
            <button style={ls.eye} onClick={()=>setShow(s=>!s)}>{show?"🙈":"👁️"}</button>
          </div>
        </div>
        {err && <div style={ls.err}>{err}</div>}
        <button style={ls.btn} onClick={submit}>Sign In →</button>
        <div style={ls.hint}>
          <div style={{fontWeight:600,marginBottom:6,color:"#475569"}}>Demo Credentials</div>
          {[["admin","admin123","Admin"],["alice","alice123","Agent"],["john","john123","Requester"]].map(([u,p,r])=>(
            <div key={u} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #e2e8f0",fontSize:12}}>
              <span><b>{u}</b> / {p}</span><span style={{color:ROLE_COLOR[r]}}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const ls = {
  bg:       {minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"},
  card:     {background:"#fff",borderRadius:16,padding:"40px 38px",width:390,boxShadow:"0 24px 64px rgba(0,0,0,.4)"},
  brand:    {display:"flex",alignItems:"center",gap:10,marginBottom:24},
  brandName:{fontWeight:800,fontSize:22,color:"#0f172a",letterSpacing:"-0.5px"},
  title:    {margin:"0 0 24px",fontSize:20,fontWeight:700,color:"#1e293b"},
  field:    {marginBottom:18},
  lbl:      {display:"block",fontSize:12,fontWeight:600,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"},
  inp:      {width:"100%",border:"1.5px solid #e2e8f0",borderRadius:9,padding:"11px 14px",fontSize:14,outline:"none",boxSizing:"border-box",background:"#f8fafc"},
  eye:      {position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16},
  err:      {background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",color:"#dc2626",fontSize:13,marginBottom:14},
  btn:      {width:"100%",background:"#3b82f6",color:"#fff",border:"none",borderRadius:9,padding:"13px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:20},
  hint:     {background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 16px"},
};

// ─── Main App ─────────────────────────────────────────────────────────────────
function MainApp({ session, logout, users, setUsers, tickets, setTickets, master, setMaster, showToast, toast }) {
  const [view,     setView]    = useState("dashboard");
  const [selected, setSelected]= useState(null);
  const [filters,  setFilters] = useState({status:"",priority:"",dept:"",search:""});

  const isAdmin = session.role==="Admin";
  const isAgent = session.role==="Agent" || isAdmin;

  const visibleTickets = session.role==="Requester"
    ? tickets.filter(t=>t.requestBy===session.name)
    : tickets;

  const filtered = visibleTickets.filter(t=>{
    if(filters.status   && t.status!==filters.status)     return false;
    if(filters.priority && t.priority!==filters.priority) return false;
    if(filters.dept     && t.department!==filters.dept)   return false;
    if(filters.search   && !`${t.id} ${t.requestBy} ${t.description}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:      visibleTickets.length,
    open:       visibleTickets.filter(t=>t.status==="Open").length,
    inProgress: visibleTickets.filter(t=>t.status==="In Progress").length,
    resolved:   visibleTickets.filter(t=>["Resolved","Closed"].includes(t.status)).length,
    critical:   visibleTickets.filter(t=>t.priority==="Critical").length,
  };

  const openTicket = (t) => { setSelected(t); setView("detail"); };
  const saveTicket = (t) => {
    setTickets(prev=>{
      const idx=prev.findIndex(x=>x.id===t.id);
      if(idx>=0){const n=[...prev];n[idx]=t;return n;}
      return [t,...prev];
    });
    showToast("Ticket saved: "+t.id);
    setView("list");
  };

  const navItems = [
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"list",     icon:"🎫",label:"All Tickets"},
    {id:"create",   icon:"✏️", label:"New Ticket"},
    {id:"mail",     icon:"📧",label:"Mail Ticket"},
    ...(isAdmin?[{id:"users", icon:"👥",label:"User Management"}]:[]),
    ...(isAdmin?[{id:"master",icon:"⚙️",label:"Master Config"}]:[]),
  ];

  const titles={dashboard:"Dashboard",list:"Ticket Queue",create:"New Ticket",mail:"Mail Ingestion",detail:"Ticket Detail",master:"Master Config",users:"User Management"};

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <span style={{fontSize:22}}>🎯</span>
          <span style={s.logoTxt}>HelpDesk</span>
        </div>
        <nav style={{flex:1}}>
          {navItems.map(it=>(
            <button key={it.id} style={{...s.navBtn,...(view===it.id?s.navOn:{})}} onClick={()=>setView(it.id)}>
              <span>{it.icon}</span><span style={s.navLbl}>{it.label}</span>
            </button>
          ))}
        </nav>
        <div style={s.uCard}>
          <div style={{...s.uAvatar,background:ROLE_COLOR[session.role]}}>{session.name.slice(0,2).toUpperCase()}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={s.uName}>{session.name}</div>
            <div style={s.uRole}>{session.role}</div>
          </div>
          <button style={s.logoutBtn} title="Logout" onClick={logout}>⏻</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.topbar}>
          <h1 style={s.topTitle}>{titles[view]||""}</h1>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {["list","dashboard"].includes(view)&&(
              <button style={s.btnExport} onClick={()=>{exportTicketsCSV(filtered);showToast("Tickets exported to CSV!");}}>
                ⬇ Export Tickets CSV
              </button>
            )}
            {view==="users"&&isAdmin&&(
              <button style={s.btnExport} onClick={()=>{exportUsersCSV(users);showToast("Users exported to CSV!");}}>
                ⬇ Export Users CSV
              </button>
            )}
          </div>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {view==="dashboard"&&<Dashboard stats={stats} tickets={visibleTickets} openTicket={openTicket} setView={setView} onExport={()=>{exportTicketsCSV(visibleTickets);showToast("Exported!");}} />}
          {view==="list"     &&<TicketList tickets={filtered} filters={filters} setFilters={setFilters} master={master} openTicket={openTicket} setView={setView} />}
          {view==="create"   &&<TicketForm master={master} onSave={saveTicket} onCancel={()=>setView("list")} source="manual" session={session} />}
          {view==="mail"     &&<MailIngest master={master} onSave={saveTicket} onCancel={()=>setView("list")} session={session} />}
          {view==="detail"   &&selected&&<TicketDetail ticket={selected} master={master} onSave={saveTicket} onBack={()=>setView("list")} showToast={showToast} isAgent={isAgent} session={session} onExport={()=>{exportTicketsCSV([selected]);showToast("Exported!");}} />}
          {view==="master"   &&isAdmin&&<MasterConfig master={master} setMaster={setMaster} showToast={showToast} />}
          {view==="users"    &&isAdmin&&<UserManagement users={users} setUsers={setUsers} showToast={showToast} master={master} />}
        </div>
      </main>
      {toast&&<Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ stats, tickets, openTicket, setView, onExport }) {
  const recent = [...tickets].sort((a,b)=>b.createDate.localeCompare(a.createDate)).slice(0,6);
  const cards  = [
    {label:"Total",      value:stats.total,      color:"#3b82f6",icon:"🎫"},
    {label:"Open",       value:stats.open,        color:"#10b981",icon:"📂"},
    {label:"In Progress",value:stats.inProgress,  color:"#f59e0b",icon:"⚡"},
    {label:"Resolved",   value:stats.resolved,    color:"#8b5cf6",icon:"✅"},
    {label:"Critical",   value:stats.critical,    color:"#ef4444",icon:"🔴"},
  ];
  return (
    <div style={s.page}>
      <div style={s.cardRow}>
        {cards.map(c=>(
          <div key={c.label} style={{...s.statCard,borderTop:`3px solid ${c.color}`}}>
            <span style={{fontSize:26}}>{c.icon}</span>
            <div><div style={{...s.statNum,color:c.color}}>{c.value}</div><div style={s.statLbl}>{c.label}</div></div>
          </div>
        ))}
      </div>
      <div style={s.section}>
        <div style={s.secHdr}>
          <span style={s.secTitle}>Recent Tickets</span>
          <div style={{display:"flex",gap:8}}>
            <button style={s.btnExport} onClick={onExport}>⬇ Export CSV</button>
            <button style={s.linkBtn}   onClick={()=>setView("list")}>View All →</button>
          </div>
        </div>
        <table style={s.table}>
          <thead><tr>{["ID","Description","Dept","Priority","Status","Assigned"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {recent.map(t=>(
              <tr key={t.id} style={s.tr} onClick={()=>openTicket(t)}>
                <td style={s.td}><span style={s.tktId}>{t.id}</span></td>
                <td style={s.td}>{t.description.slice(0,42)}{t.description.length>42?"…":""}</td>
                <td style={s.td}>{t.department}</td>
                <td style={s.td}><Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge></td>
                <td style={s.td}><Badge color={STATUS_COLOR[t.status]}>{t.status}</Badge></td>
                <td style={s.td}>{t.assignedTo||<span style={{color:"#9ca3af"}}>Unassigned</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Ticket List ──────────────────────────────────────────────────────────────
function TicketList({ tickets, filters, setFilters, master, openTicket, setView }) {
  return (
    <div style={s.page}>
      <div style={s.filterRow}>
        <input style={s.search} placeholder="🔍 Search ID, requester, description…" value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))} />
        <Select value={filters.status}   onChange={v=>setFilters(f=>({...f,status:v}))}   options={["",...STATUSES]}           placeholder="All Status"   />
        <Select value={filters.priority} onChange={v=>setFilters(f=>({...f,priority:v}))} options={["",...PRIORITIES]}         placeholder="All Priority" />
        <Select value={filters.dept}     onChange={v=>setFilters(f=>({...f,dept:v}))}     options={["",...master.departments]} placeholder="All Dept"     />
        <button style={s.btnPrimary}    onClick={()=>setView("create")}>+ New Ticket</button>
        <button style={s.btnSecondary}  onClick={()=>setView("mail")}>📧 Mail</button>
      </div>
      <div style={{background:"#fff",borderRadius:10,boxShadow:"0 1px 3px rgba(0,0,0,.06)",overflow:"auto"}}>
        <table style={s.table}>
          <thead><tr>{["ID","Created","Requested By","Dept","Type","Description","Priority","Status","Assigned",""].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {tickets.length===0&&<tr><td colSpan={10} style={{...s.td,textAlign:"center",color:"#9ca3af",padding:32}}>No tickets found</td></tr>}
            {tickets.map(t=>(
              <tr key={t.id} style={s.tr}>
                <td style={s.td}><span style={s.tktId}>{t.id}</span></td>
                <td style={s.td}>{t.createDate}</td>
                <td style={s.td}>{t.requestBy}</td>
                <td style={s.td}>{t.department}</td>
                <td style={s.td}>{t.requestType}</td>
                <td style={s.td}>{t.description.slice(0,35)}{t.description.length>35?"…":""}</td>
                <td style={s.td}><Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge></td>
                <td style={s.td}><Badge color={STATUS_COLOR[t.status]}>{t.status}</Badge></td>
                <td style={s.td}>{t.assignedTo||<span style={{color:"#9ca3af"}}>—</span>}</td>
                <td style={s.td}><button style={s.linkBtn} onClick={()=>openTicket(t)}>Open →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{color:"#6b7280",fontSize:13,marginTop:8}}>{tickets.length} ticket(s)</div>
    </div>
  );
}

// ─── Ticket Form ──────────────────────────────────────────────────────────────
function TicketForm({ master, onSave, onCancel, source="manual", session, prefill={} }) {
  const [form,setForm]=useState({
    id:genId(), createDate:now(),
    requestBy:  prefill.requestBy  || session.name,
    department: prefill.department || session.department || master.departments[0],
    requestType:prefill.requestType|| master.requestTypes[0],
    description:prefill.description|| "",
    priority:   prefill.priority   || "Medium",
    status:"Open", assignedTo:"", updateDate:now(), resolveDate:"",
    followUpRequired:false, followUpTeam:"", repeatingIssue:false,
    comments:[], attachments:[], source,
  });
  const [files,setFiles]=useState([]);
  const fRef=useRef();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{
    if(!form.requestBy.trim())   return alert("Requested By is required");
    if(!form.description.trim()) return alert("Description is required");
    onSave({...form,attachments:[...form.attachments,...files]});
  };
  return (
    <div style={s.page}>
      <div style={s.formCard}>
        <div style={s.formGrid}>
          <Field label="Ticket ID"><input style={{...s.input,background:"#f1f5f9",color:"#64748b"}} value={form.id} readOnly /></Field>
          <Field label="Created Date"><input style={s.input} type="date" value={form.createDate} onChange={e=>set("createDate",e.target.value)} /></Field>
          <Field label="Requested By *"><input style={s.input} value={form.requestBy} onChange={e=>set("requestBy",e.target.value)} /></Field>
          <Field label="Department"><select style={s.input} value={form.department} onChange={e=>set("department",e.target.value)}>{master.departments.map(d=><option key={d}>{d}</option>)}</select></Field>
          <Field label="Request Type"><select style={s.input} value={form.requestType} onChange={e=>set("requestType",e.target.value)}>{master.requestTypes.map(r=><option key={r}>{r}</option>)}</select></Field>
          <Field label="Priority"><select style={s.input} value={form.priority} onChange={e=>set("priority",e.target.value)}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></Field>
          <Field label="Assigned To"><select style={s.input} value={form.assignedTo} onChange={e=>set("assignedTo",e.target.value)}><option value="">— Unassigned —</option>{master.agents.map(a=><option key={a}>{a}</option>)}</select></Field>
          <Field label="Follow Up Team"><select style={s.input} value={form.followUpTeam} onChange={e=>set("followUpTeam",e.target.value)}><option value="">— None —</option>{master.followUpTeams.map(t=><option key={t}>{t}</option>)}</select></Field>
        </div>
        <Field label="Description *"><textarea style={{...s.input,minHeight:90}} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe the issue or request…" /></Field>
        <div style={s.checkRow}>
          <label style={s.checkLbl}><input type="checkbox" checked={form.followUpRequired} onChange={e=>set("followUpRequired",e.target.checked)} /> Follow Up Required</label>
          <label style={s.checkLbl}><input type="checkbox" checked={form.repeatingIssue}   onChange={e=>set("repeatingIssue",e.target.checked)}   /> Repeating Issue</label>
        </div>
        <Field label="Attachments">
          <div style={s.uploadBox} onClick={()=>fRef.current.click()}>
            <input ref={fRef} type="file" multiple style={{display:"none"}} onChange={e=>setFiles(pf=>[...pf,...Array.from(e.target.files).map(f=>({name:f.name,size:f.size}))])} />
            <span style={{color:"#6b7280"}}>📎 Click to attach files</span>
          </div>
          {files.length>0&&<div style={s.fileList}>{files.map((f,i)=><span key={i} style={s.fileChip}>📄 {f.name}</span>)}</div>}
        </Field>
        <div style={s.formActions}>
          <button style={s.btnSecondary} onClick={onCancel}>Cancel</button>
          <button style={s.btnPrimary}   onClick={submit}>Create Ticket</button>
        </div>
      </div>
    </div>
  );
}

// ─── Mail Ingest ──────────────────────────────────────────────────────────────
function MailIngest({ master, onSave, onCancel, session }) {
  const [raw,setRaw]=useState("");
  const [parsed,setParsed]=useState(null);
  const parse=()=>{
    const from    = raw.match(/From:\s*(.+)/i);
    const subject = raw.match(/Subject:\s*(.+)/i);
    const body    = raw.replace(/From:.+\n?/i,"").replace(/Subject:.+\n?/i,"").replace(/Date:.+\n?/i,"").trim();
    setParsed({ requestBy:from?from[1].trim():"", description:(subject?subject[1].trim()+"\n\n":"")+body, department:master.departments[0], requestType:master.requestTypes[0], priority:"Medium" });
  };
  if(parsed) return <TicketForm master={master} onSave={onSave} onCancel={()=>setParsed(null)} source="email" prefill={parsed} session={session} />;
  return (
    <div style={s.page}>
      <div style={s.formCard}>
        <p style={{color:"#6b7280",marginBottom:16}}>Paste raw email content. The system will extract sender, subject, and body to pre-fill the ticket form.</p>
        <Field label="Raw Email Content">
          <textarea style={{...s.input,minHeight:200,fontFamily:"monospace",fontSize:13}} value={raw} onChange={e=>setRaw(e.target.value)}
            placeholder={"From: user@example.com\nSubject: Cannot login to portal\nDate: 2025-03-28\n\nHi Support,\nI am unable to login since this morning..."} />
        </Field>
        <div style={s.formActions}>
          <button style={s.btnSecondary} onClick={onCancel}>Cancel</button>
          <button style={s.btnPrimary} onClick={parse} disabled={!raw.trim()}>Parse & Create Ticket →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Detail ────────────────────────────────────────────────────────────
function TicketDetail({ ticket, master, onSave, onBack, showToast, isAgent, session, onExport }) {
  const [t,setT]=useState(ticket);
  const [nc,setNc]=useState("");
  const [files,setFiles]=useState([]);
  const fRef=useRef();
  const set=(k,v)=>setT(prev=>({...prev,[k]:v,updateDate:now()}));
  const addComment=()=>{ if(!nc.trim()) return; set("comments",[...t.comments,{by:session.name,date:now(),text:nc}]); setNc(""); };
  const handleFile=e=>{
    const picked=Array.from(e.target.files).map(f=>({name:f.name,size:f.size}));
    setFiles(pf=>[...pf,...picked]); set("attachments",[...t.attachments,...picked]);
  };
  const resolve=()=>{ setT(prev=>({...prev,status:"Resolved",resolveDate:now(),updateDate:now()})); showToast("Marked Resolved"); };
  return (
    <div style={s.page}>
      <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"center",flexWrap:"wrap"}}>
        <button style={s.btnSecondary} onClick={onBack}>← Back</button>
        <h2 style={{margin:0,fontWeight:700,fontSize:20}}>{t.id}</h2>
        <Badge color={STATUS_COLOR[t.status]}>{t.status}</Badge>
        <Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge>
        <span style={{color:"#6b7280",fontSize:13}}>{t.source==="email"?"📧 Email":"✏️ Manual"}</span>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button style={s.btnExport} onClick={onExport}>⬇ Export CSV</button>
          <button style={s.btnPrimary} onClick={()=>onSave(t)}>💾 Save</button>
          {t.status!=="Resolved"&&t.status!=="Closed"&&isAgent&&(
            <button style={{...s.btnPrimary,background:"#10b981"}} onClick={resolve}>✅ Resolve</button>
          )}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 310px",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={s.detCard}>
            <SecTitle>Request Details</SecTitle>
            <div style={s.formGrid}>
              <Field label="Requested By"><input style={s.input} value={t.requestBy} onChange={e=>set("requestBy",e.target.value)} readOnly={!isAgent} /></Field>
              <Field label="Department"><select style={s.input} value={t.department} onChange={e=>set("department",e.target.value)} disabled={!isAgent}>{master.departments.map(d=><option key={d}>{d}</option>)}</select></Field>
              <Field label="Request Type"><select style={s.input} value={t.requestType} onChange={e=>set("requestType",e.target.value)} disabled={!isAgent}>{master.requestTypes.map(r=><option key={r}>{r}</option>)}</select></Field>
              <Field label="Priority"><select style={s.input} value={t.priority} onChange={e=>set("priority",e.target.value)} disabled={!isAgent}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></Field>
            </div>
            <Field label="Description"><textarea style={{...s.input,minHeight:80}} value={t.description} onChange={e=>set("description",e.target.value)} /></Field>
          </div>

          <div style={s.detCard}>
            <SecTitle>Comments & Activity</SecTitle>
            {t.comments.length===0&&<p style={{color:"#9ca3af",fontSize:13}}>No comments yet.</p>}
            {t.comments.map((c,i)=>(
              <div key={i} style={s.cBubble}>
                <div style={s.cHdr}><b>{c.by}</b> <span style={{color:"#9ca3af",fontSize:12}}>{c.date}</span></div>
                <div style={{fontSize:14}}>{c.text}</div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <textarea style={{...s.input,flex:1,minHeight:60}} value={nc} onChange={e=>setNc(e.target.value)} placeholder="Add comment, response, or update…" />
              <button style={{...s.btnPrimary,alignSelf:"flex-end"}} onClick={addComment}>Post</button>
            </div>
          </div>

          <div style={s.detCard}>
            <SecTitle>Attachments</SecTitle>
            <div style={s.uploadBox} onClick={()=>fRef.current.click()}>
              <input ref={fRef} type="file" multiple style={{display:"none"}} onChange={handleFile} />
              <span style={{color:"#6b7280"}}>📎 Attach response docs, screenshots, evidence…</span>
            </div>
            {t.attachments.length===0&&files.length===0&&<p style={{color:"#9ca3af",fontSize:13,marginTop:8}}>No attachments.</p>}
            <div style={s.fileList}>{t.attachments.map((f,i)=><span key={i} style={s.fileChip}>📄 {f.name}</span>)}</div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={s.detCard}>
            <SecTitle>Assignment & Status</SecTitle>
            <Field label="Status"><select style={s.input} value={t.status} onChange={e=>set("status",e.target.value)} disabled={!isAgent}>{STATUSES.map(st=><option key={st}>{st}</option>)}</select></Field>
            <Field label="Assigned To"><select style={s.input} value={t.assignedTo} onChange={e=>set("assignedTo",e.target.value)} disabled={!isAgent}><option value="">— Unassigned —</option>{master.agents.map(a=><option key={a}>{a}</option>)}</select></Field>
            <Field label="Follow Up Team"><select style={s.input} value={t.followUpTeam} onChange={e=>set("followUpTeam",e.target.value)} disabled={!isAgent}><option value="">— None —</option>{master.followUpTeams.map(ft=><option key={ft}>{ft}</option>)}</select></Field>
          </div>
          <div style={s.detCard}>
            <SecTitle>Dates</SecTitle>
            <Field label="Create Date"><input style={{...s.input,background:"#f1f5f9"}} type="date" value={t.createDate} readOnly /></Field>
            <Field label="Update Date"><input style={{...s.input,background:"#f1f5f9"}} type="date" value={t.updateDate} readOnly /></Field>
            <Field label="Resolve Date"><input style={s.input} type="date" value={t.resolveDate} onChange={e=>set("resolveDate",e.target.value)} /></Field>
          </div>
          <div style={s.detCard}>
            <SecTitle>Flags</SecTitle>
            <label style={s.checkLbl}><input type="checkbox" checked={t.followUpRequired} onChange={e=>set("followUpRequired",e.target.checked)} /> Follow Up Required</label><br/>
            <label style={{...s.checkLbl,marginTop:10}}><input type="checkbox" checked={t.repeatingIssue} onChange={e=>set("repeatingIssue",e.target.checked)} /> Repeating Issue</label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Management ──────────────────────────────────────────────────────────
function UserManagement({ users, setUsers, showToast, master }) {
  const [showForm,setShowForm]=useState(false);
  const [editUser,setEditUser]=useState(null);
  const [search,setSearch]=useState("");
  const filtered=users.filter(u=>`${u.username} ${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()));

  const saveUser=u=>{
    setUsers(prev=>{
      const idx=prev.findIndex(x=>x.userId===u.userId);
      if(idx>=0){const n=[...prev];n[idx]=u;return n;}
      return [...prev,u];
    });
    setShowForm(false); showToast(editUser?"User updated!":"User created: "+u.username);
  };
  const toggle=id=>setUsers(prev=>prev.map(u=>u.userId===id?{...u,active:!u.active}:u));
  const del=id=>{ if(!confirm("Delete this user?")) return; setUsers(prev=>prev.filter(u=>u.userId!==id)); showToast("User deleted."); };

  if(showForm) return <UserForm user={editUser} onSave={saveUser} onCancel={()=>setShowForm(false)} master={master} />;

  return (
    <div style={s.page}>
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
        <input style={s.search} placeholder="🔍 Search users…" value={search} onChange={e=>setSearch(e.target.value)} />
        <button style={s.btnPrimary} onClick={()=>{setEditUser(null);setShowForm(true);}}>+ Add User</button>
      </div>
      <div style={{background:"#fff",borderRadius:10,boxShadow:"0 1px 3px rgba(0,0,0,.06)",overflow:"auto"}}>
        <table style={s.table}>
          <thead><tr>{["User ID","Username","Full Name","Role","Department","Email","Status","Actions"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={8} style={{...s.td,textAlign:"center",color:"#9ca3af",padding:32}}>No users found</td></tr>}
            {filtered.map(u=>(
              <tr key={u.userId} style={s.tr}>
                <td style={s.td}><span style={{...s.tktId,color:"#7c3aed"}}>{u.userId}</span></td>
                <td style={s.td}><b>{u.username}</b></td>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}><Badge color={ROLE_COLOR[u.role]}>{u.role}</Badge></td>
                <td style={s.td}>{u.department}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td} onClick={()=>toggle(u.userId)} style={{...s.td,cursor:"pointer"}}>
                  {u.active?<Badge color="#10b981">✓ Active</Badge>:<Badge color="#6b7280">✗ Inactive</Badge>}
                </td>
                <td style={s.td}>
                  <div style={{display:"flex",gap:8}}>
                    <button style={s.linkBtn} onClick={()=>{setEditUser(u);setShowForm(true);}}>Edit</button>
                    <button style={{...s.linkBtn,color:"#ef4444"}} onClick={()=>del(u.userId)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{color:"#6b7280",fontSize:13,marginTop:8}}>{filtered.length} user(s)</div>
    </div>
  );
}

// ─── User Form ────────────────────────────────────────────────────────────────
function UserForm({ user, onSave, onCancel, master }) {
  const isEdit=!!user;
  const [form,setForm]=useState(user||{userId:genUserId(),username:"",password:"",name:"",role:"Agent",department:master.departments[0],email:"",active:true,createdDate:now()});
  const [showPw,setShowPw]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{
    if(!form.username.trim()) return alert("Username required");
    if(!form.password.trim()) return alert("Password required");
    if(!form.name.trim())     return alert("Full name required");
    if(!form.email.trim())    return alert("Email required");
    onSave(form);
  };
  return (
    <div style={s.page}>
      <div style={s.formCard}>
        <h3 style={{margin:"0 0 20px",fontWeight:700,fontSize:18}}>{isEdit?"✏️ Edit User":"👤 Create New User"}</h3>
        <div style={s.formGrid}>
          <Field label="User ID"><input style={{...s.input,background:"#f1f5f9",color:"#64748b"}} value={form.userId} readOnly /></Field>
          <Field label="Created Date"><input style={{...s.input,background:"#f1f5f9",color:"#64748b"}} value={form.createdDate} readOnly /></Field>
          <Field label="Full Name *"><input style={s.input} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Jane Smith" /></Field>
          <Field label="Username *"><input style={s.input} value={form.username} onChange={e=>set("username",e.target.value)} placeholder="lowercase, no spaces" /></Field>
          <Field label="Password *">
            <div style={{position:"relative"}}>
              <input style={s.input} type={showPw?"text":"password"} value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min 6 characters" />
              <button style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15}} onClick={()=>setShowPw(v=>!v)}>{showPw?"🙈":"👁️"}</button>
            </div>
          </Field>
          <Field label="Email *"><input style={s.input} type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="user@company.com" /></Field>
          <Field label="Role"><select style={s.input} value={form.role} onChange={e=>set("role",e.target.value)}>{ROLES.map(r=><option key={r}>{r}</option>)}</select></Field>
          <Field label="Department"><select style={s.input} value={form.department} onChange={e=>set("department",e.target.value)}>{master.departments.map(d=><option key={d}>{d}</option>)}</select></Field>
        </div>
        <div style={s.checkRow}>
          <label style={s.checkLbl}><input type="checkbox" checked={form.active} onChange={e=>set("active",e.target.checked)} /> Active Account</label>
        </div>
        <div style={s.formActions}>
          <button style={s.btnSecondary} onClick={onCancel}>Cancel</button>
          <button style={s.btnPrimary}   onClick={submit}>{isEdit?"Save Changes":"Create User"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Master Config ────────────────────────────────────────────────────────────
function MasterConfig({ master, setMaster, showToast }) {
  const [local,setLocal]=useState(JSON.parse(JSON.stringify(master)));
  const [tab,setTab]=useState("departments");
  const tabs=[{id:"departments",label:"Departments"},{id:"requestTypes",label:"Request Types"},{id:"agents",label:"Agents"},{id:"followUpTeams",label:"Follow-Up Teams"}];
  const add=key=>{ const v=prompt(`Add new ${key.replace(/([A-Z])/g," $1")} entry:`); if(v&&v.trim()) setLocal(l=>({...l,[key]:[...l[key],v.trim()]})); };
  const rm=(key,i)=>setLocal(l=>({...l,[key]:l[key].filter((_,j)=>j!==i)}));
  return (
    <div style={s.page}>
      <div style={s.formCard}>
        <p style={{color:"#6b7280",marginBottom:16}}>Configure master lists used across all dropdowns.</p>
        <div style={s.tabRow}>{tabs.map(t=><button key={t.id} style={{...s.tabBtn,...(tab===t.id?s.tabOn:{})}} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
        <div style={s.masterList}>
          {local[tab].map((item,i)=>(
            <div key={i} style={s.masterItem}><span>{item}</span><button style={s.delBtn} onClick={()=>rm(tab,i)}>✕</button></div>
          ))}
          <button style={s.addBtn} onClick={()=>add(tab)}>+ Add {tabs.find(t=>t.id===tab)?.label.slice(0,-1)}</button>
        </div>
        <div style={s.formActions}><button style={s.btnPrimary} onClick={()=>{setMaster(local);showToast("Configuration saved!");}}>Save Configuration</button></div>
      </div>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function Field({label,children}){ return <div style={{marginBottom:14}}><label style={s.lbl2}>{label}</label>{children}</div>; }
function SecTitle({children}){ return <div style={s.secTitle2}>{children}</div>; }
function Badge({color,children}){ return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:99,padding:"2px 10px",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>; }
function Select({value,onChange,options,placeholder}){ return <select style={{...s.input,width:"auto",minWidth:128}} value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o||placeholder}</option>)}</select>; }
function Toast({msg,type}){ return <div style={{...s.toast,background:type==="success"?"#10b981":"#ef4444"}}>{type==="success"?"✅":"❌"} {msg}</div>; }

// ─── Styles ───────────────────────────────────────────────────────────────────
const s={
  root:       {display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f1f5f9",color:"#1e293b"},
  sidebar:    {width:220,background:"#0f172a",display:"flex",flexDirection:"column",flexShrink:0},
  logo:       {display:"flex",alignItems:"center",gap:10,padding:"22px 20px 18px",borderBottom:"1px solid #1e293b"},
  logoTxt:    {color:"#f8fafc",fontWeight:800,fontSize:18,letterSpacing:"-0.5px"},
  navBtn:     {display:"flex",alignItems:"center",gap:10,width:"100%",background:"none",border:"none",color:"#94a3b8",padding:"11px 20px",cursor:"pointer",fontSize:14,textAlign:"left"},
  navOn:      {background:"#1e293b",color:"#f8fafc",borderRight:"3px solid #3b82f6"},
  navLbl:     {fontWeight:500},
  uCard:      {display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderTop:"1px solid #1e293b",margin:"6px 8px 8px"},
  uAvatar:    {borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0},
  uName:      {color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
  uRole:      {color:"#64748b",fontSize:11},
  logoutBtn:  {background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:18,padding:"2px 4px",flexShrink:0},
  main:       {flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
  topbar:     {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",background:"#fff",borderBottom:"1px solid #e2e8f0"},
  topTitle:   {margin:0,fontSize:18,fontWeight:700},
  page:       {padding:24,flex:1},
  cardRow:    {display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"},
  statCard:   {background:"#fff",borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,minWidth:130,flex:1,boxShadow:"0 1px 3px rgba(0,0,0,.06)"},
  statNum:    {fontSize:26,fontWeight:800,lineHeight:1},
  statLbl:    {fontSize:12,color:"#64748b",marginTop:2},
  section:    {background:"#fff",borderRadius:10,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,.06)"},
  secHdr:     {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},
  secTitle:   {fontWeight:700,fontSize:15},
  secTitle2:  {fontWeight:700,fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:14,paddingBottom:8,borderBottom:"1px solid #f1f5f9"},
  table:      {width:"100%",borderCollapse:"collapse",fontSize:13},
  th:         {textAlign:"left",padding:"8px 12px",background:"#f8fafc",color:"#64748b",fontWeight:600,fontSize:12,borderBottom:"1px solid #e2e8f0",textTransform:"uppercase",letterSpacing:"0.04em"},
  tr:         {borderBottom:"1px solid #f1f5f9",cursor:"pointer"},
  td:         {padding:"10px 12px",verticalAlign:"middle"},
  tktId:      {fontFamily:"monospace",fontWeight:700,color:"#3b82f6",fontSize:12},
  filterRow:  {display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"},
  search:     {border:"1px solid #e2e8f0",borderRadius:8,padding:"8px 12px",fontSize:13,flex:1,minWidth:200,outline:"none",background:"#fff"},
  formCard:   {background:"#fff",borderRadius:12,padding:28,maxWidth:860,boxShadow:"0 1px 3px rgba(0,0,0,.06)"},
  formGrid:   {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"},
  lbl2:       {display:"block",fontSize:12,fontWeight:600,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em"},
  input:      {width:"100%",border:"1.5px solid #e2e8f0",borderRadius:8,padding:"9px 12px",fontSize:14,outline:"none",background:"#f8fafc",boxSizing:"border-box",fontFamily:"inherit",resize:"vertical"},
  checkRow:   {display:"flex",gap:24,marginBottom:16},
  checkLbl:   {display:"flex",alignItems:"center",gap:7,fontSize:14,cursor:"pointer"},
  uploadBox:  {border:"2px dashed #cbd5e1",borderRadius:8,padding:"16px 20px",cursor:"pointer",textAlign:"center",fontSize:14,background:"#f8fafc"},
  fileList:   {display:"flex",flexWrap:"wrap",gap:8,marginTop:10},
  fileChip:   {background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:99,padding:"3px 12px",fontSize:12,color:"#1d4ed8"},
  formActions:{display:"flex",gap:12,justifyContent:"flex-end",marginTop:24,paddingTop:20,borderTop:"1px solid #f1f5f9"},
  btnPrimary: {background:"#3b82f6",color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:600,cursor:"pointer"},
  btnSecondary:{background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:600,cursor:"pointer"},
  btnExport:  {background:"#f0fdf4",color:"#166534",border:"1px solid #bbf7d0",borderRadius:8,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"},
  linkBtn:    {background:"none",border:"none",color:"#3b82f6",cursor:"pointer",fontSize:13,fontWeight:600,padding:0},
  detCard:    {background:"#fff",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,.06)"},
  cBubble:    {background:"#f8fafc",borderRadius:8,padding:"10px 14px",marginBottom:8,border:"1px solid #e2e8f0"},
  cHdr:       {fontSize:12,marginBottom:4,color:"#64748b"},
  tabRow:     {display:"flex",gap:0,marginBottom:20,borderBottom:"2px solid #e2e8f0"},
  tabBtn:     {background:"none",border:"none",padding:"10px 18px",cursor:"pointer",fontSize:14,color:"#64748b",fontWeight:500},
  tabOn:      {color:"#3b82f6",borderBottom:"2px solid #3b82f6",marginBottom:-2},
  masterList: {display:"flex",flexDirection:"column",gap:8,maxHeight:360,overflowY:"auto"},
  masterItem: {display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 14px",fontSize:14},
  delBtn:     {background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontWeight:700,fontSize:15,padding:"0 4px"},
  addBtn:     {background:"#eff6ff",color:"#3b82f6",border:"1px dashed #93c5fd",borderRadius:8,padding:"10px 16px",cursor:"pointer",fontSize:14,fontWeight:600,marginTop:4},
  toast:      {position:"fixed",bottom:28,right:28,color:"#fff",borderRadius:10,padding:"12px 22px",fontSize:14,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.15)",zIndex:999},
};
