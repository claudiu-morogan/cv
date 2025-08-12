// Interactive Terminal CV logic
(function(){
  const outEl = document.getElementById('output');
  const form = document.getElementById('cmd-form');
  const input = document.getElementById('cmd');
  const toggleThemeBtn = document.getElementById('toggle-theme');
  const state = { history:[], histIndex:0, started: Date.now(), autoClear:false };

  function print(text='', {cls='', prompt=false}={}) {
    const line = document.createElement('div');
    line.className = 'line fade-in'+(cls?(' '+cls):'');
    if (prompt) {
      const pre = document.createElement('span');
      pre.className='cmd';
      pre.textContent='claudiu@cv:~$ ';
      line.appendChild(pre);
      line.append(text);
    } else {
      line.textContent = text;
    }
    outEl.appendChild(line);
    outEl.scrollTop = outEl.scrollHeight;
  }
  function printBlock(text){
    text.split(/\n/).forEach(l=>print(l));
  }
  function clear(){ outEl.innerHTML=''; }

  function openUrl(url){ window.open(url, '_blank'); }
  function downloadCV(){ window.open('CV-Claudiu-Morogan.pdf', '_blank'); }

  function searchExp(keyword){
    const data = window.CV_DATA.renderExperience().split('\n\n');
    const results = data.filter(block=> block.toLowerCase().includes(keyword.toLowerCase()));
    return results.length?results.join('\n\n'):`No matches for '${keyword}'.`;
  }

  const commands = {
    help(){ printBlock(window.CV_DATA.help); },
    about(){ printBlock(window.CV_DATA.about); },
    basic(){ printBlock(window.CV_DATA.renderBasic()); },
    skills(){ printBlock(window.CV_DATA.renderSkills()); },
    experience(){ printBlock(window.CV_DATA.renderExperience()); },
    education(){ printBlock(window.CV_DATA.renderEducation()); },
    contact(){
      print('Email: contact@claudiu-morogan.dev');
      print('LinkedIn: https://www.linkedin.com/in/morogan-claudiu/');
      print('GitHub: https://github.com/claudiu-morogan');
    },
    clear(){ clear(); },
    theme(){ toggleTheme(); },
    ascii(){ printBlock(window.CV_DATA.ascii); },
    open(args){
      const dest = args[0];
      if (!dest) return print('Usage: open <linkedin|github|cv>','error');
      if (dest==='linkedin') openUrl('https://www.linkedin.com/in/morogan-claudiu/');
      else if (dest==='github') openUrl('https://github.com/claudiu-morogan');
      else if (dest==='cv') downloadCV();
      else print(`Unknown target: ${dest}`,'error');
    },
    download(args){
      if(args[0]==='cv') downloadCV(); else print("Usage: download cv", 'error');
    },
    goto(args){
      const section = args[0];
      const map = { about:'about', skills:'skills', experience:'experience', education:'education' };
      if(!section || !map[section]) return print('Usage: goto <about|skills|experience|education>','error');
      print(`(scrolling to ${section})`);
      // For potential integration if sections added again
    },
    search(args){
      if(!args.length) return print('Usage: search <keyword>','error');
      printBlock(searchExp(args.join(' ')));
    },
    settings(args){
      if(!args.length){
        print(`autoClear = ${state.autoClear}`);
        return;
      }
      const [key, value] = args;
      if(key==='autoclear'){
        if(value==='on'||value==='true'){ state.autoClear=true; updateAutoClearBtn(); print('autoClear enabled'); }
        else if(value==='off'||value==='false'){ state.autoClear=false; updateAutoClearBtn(); print('autoClear disabled'); }
        else print("Usage: settings autoclear <on|off>",'error');
      } else print('Unknown setting key','error');
    },
    autoclear(args){ // shortcut command
      if(!args.length){ state.autoClear=!state.autoClear; updateAutoClearBtn(); print('autoClear -> '+state.autoClear); return; }
      if(args[0]==='on'){ state.autoClear=true; }
      else if(args[0]==='off'){ state.autoClear=false; }
      else return print('Usage: autoclear [on|off]','error');
      updateAutoClearBtn();
      print('autoClear -> '+state.autoClear);
    }
  };

  function execute(raw){
    const text = raw.trim();
    if(!text) return;
    state.history.push(text); state.histIndex = state.history.length;
    const parts = text.split(/\s+/); const cmd = parts[0].toLowerCase(); const args = parts.slice(1);
  if(cmd in commands){ try { if(state.autoClear && cmd!=='clear'){ clear(); } commands[cmd](args); } catch(e){ print('Command error: '+e.message,'error'); } }
    else { print(`Command not found: ${cmd}. Type 'help' for list.`,'error'); }
  }

  form.addEventListener('submit', e=>{ e.preventDefault(); const val=input.value; print(val,{prompt:true}); input.value=''; execute(val); });
  input.addEventListener('keydown', e=>{
    if(e.key==='ArrowUp'){ e.preventDefault(); if(state.histIndex>0){ state.histIndex--; input.value=state.history[state.histIndex]||''; setTimeout(()=>input.setSelectionRange(input.value.length,input.value.length)); } }
    else if(e.key==='ArrowDown'){ e.preventDefault(); if(state.histIndex < state.history.length){ state.histIndex++; input.value=state.history[state.histIndex]||''; } }
    else if(e.key==='l' && e.ctrlKey){ e.preventDefault(); commands.clear(); }
  });

  function init(){
    printBlock(window.CV_DATA.ascii);
    print('Welcome to the interactive terminal CV. Type "help" to list commands.');
  }

  // Theme toggle
  function toggleTheme(){
    document.body.classList.toggle('light');
    document.body.classList.toggle('dark');
  }
  toggleThemeBtn.addEventListener('click', toggleTheme);
  document.body.classList.add('dark');

  // Matrix rain background
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');
  let width, height, columns, drops;
  const chars = 'アカサタナハマヤラ0123456789$#*+<>={}';
  let lastDraw = 0;
  let frameInterval = 90; // ms between frames (slower for eye comfort)
  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 14);
    drops = Array.from({length: columns}, ()=> Math.floor(Math.random()*height));
  }
  function draw(ts){
    if(ts - lastDraw < frameInterval){ return requestAnimationFrame(draw); }
    lastDraw = ts;
    ctx.fillStyle = document.body.classList.contains('light') ? 'rgba(240,240,240,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = document.body.classList.contains('light')? '#0a7d56' : '#21e07d';
    ctx.font = '14px Fira Code, monospace';
    drops.forEach((y,i)=>{
      if(Math.random() < 0.25) return; // sparsify for comfort
      const text = chars[Math.floor(Math.random()*chars.length)];
      const x = i * 14;
      ctx.fillText(text, x, y);
      if(y > height + Math.random()*400) drops[i] = 0; else drops[i] = y + 14;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);

  // Quick menu buttons
  document.querySelectorAll('.quick-menu [data-cmd]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const c = btn.getAttribute('data-cmd');
      print(c,{prompt:true});
      if(state.autoClear && c!=='clear'){ clear(); }
      execute(c);
      input.focus();
    });
  });
  const autoBtn = document.getElementById('toggle-autoclear');
  function updateAutoClearBtn(){
    if(!autoBtn) return;
    autoBtn.dataset.state = state.autoClear? 'on':'off';
    autoBtn.textContent = 'AC:'+(state.autoClear?'On':'Off');
  }
  if(autoBtn){
    autoBtn.addEventListener('click', ()=>{ state.autoClear=!state.autoClear; updateAutoClearBtn(); print('autoClear -> '+state.autoClear); input.focus(); });
    updateAutoClearBtn();
  }

  init();
})();
