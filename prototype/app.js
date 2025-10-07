// Simple SPA to mimic Figma professor screens (standalone)
console.log('[prototype] app.js loaded');
const app = document.getElementById('app');

const state = {
  user: { name: 'Professor' },
  classes: [
    { id: 'hci', name: 'HCI' },
    { id: 'db', name: 'Database' }
  ],
  quizzes: {
    // seed example
    hci: [{ id: 'seed1', name: 'Untitled', classId: 'hci', questions: [{text:'Q1',type:'tf',time:10,choices:['True','False']}], createdAt: Date.now()-86400000 }],
    db:  [{ id: 'seed2', name: 'mb', classId: 'db', questions: [{text:'Q1',type:'mc',time:10,choices:['A','B']}], createdAt: Date.now()-172800000 }]
  },
  quizStates: { seed1: 'completed', seed2: 'draft' },
  quizResults: { seed1: { averageScore: 84, totalStudents: 23, mostMissed: 1 } }
};

function saveState(){ localStorage.setItem('qa_state', JSON.stringify(state)) }
function loadState(){
  const raw = localStorage.getItem('qa_state');
  if(raw) try{ Object.assign(state, JSON.parse(raw)) } catch(e){}
}

function el(tag, props={}, children=[]){
  const e = document.createElement(tag);
  for(const k in props){
    if(k === 'class') e.className = props[k];
    else if(k === 'style') e.setAttribute('style', props[k]);
    else if(k.indexOf('on') === 0) e.addEventListener(k.slice(2).toLowerCase(), props[k]);
    else e.setAttribute(k, props[k]);
  }
  if(!Array.isArray(children)) children = [children];
  children.forEach(c => e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c));
  return e;
}

function route(){
  const hash=location.hash.replace('#','');
  const parts=hash.split('/');
  const page=parts[0]||'welcome';
  if(page==='welcome')return renderWelcome();
  if(page==='login')return renderWelcome();
  if(page==='classes')return renderClasses();
  if(page==='create')return renderCreateQuiz(parts[1]);
  if(page==='manage')return renderQuizManager(parts[1]);
  if(page==='report')return renderQuizReport(parts[1]);
  return renderWelcome();
}

/* ------------------- Welcome / Login ------------------- */
function renderWelcome(){
  app.innerHTML='';
  const page = el('div',{class:'page'},[
    el('div',{class:'topbar'},[
      el('div',{class:'brand'},['QuizPro', el('small',{},'Professor Dashboard')])
    ]),
    el('div',{class:'card login-box'},[
      el('h3',{class:'h1',style:'font-size:24px'},'Welcome'),
      el('p',{class:'small'},'Please log in'),
      el('div',{class:'field'},[
        el('label',{},'Username'),
        el('input',{type:'text',class:'input',id:'username'})
      ]),
      el('div',{class:'field'},[
        el('label',{},'Password'),
        el('input',{type:'password',class:'input',id:'password'})
      ]),
      el('div',{class:'footer'},[
        el('button',{class:'btn',onClick:()=>{
          state.user = { name: (document.getElementById('username').value || 'Professor') };
          saveState(); location.hash = '#classes';
        }},'Log in')
      ])
    ])
  ]);
  app.appendChild(page);
}

/* ------------------- Classes (Dashboard) ------------------- */
function renderClasses() {
  loadState();
  app.innerHTML = '';

  const page = el('div',{class:'page'});
  // Topbar
  page.appendChild(el('div',{class:'topbar'},[
    el('div',{class:'brand'},['QuizPro', el('small',{},'Professor Dashboard')])
  ]));

  // Header + stats
  page.appendChild(el('div',{},[
    el('h1',{class:'h1'},'Your Classes'),
    el('div',{class:'stats'},[
      el('div',{class:'stat'},[ el('div',{class:'small'},'Total Classes'), el('div',{class:'k'}, state.classes.length) ]),
      el('div',{class:'stat'},[
        el('div',{class:'small'},'Total Quizzes'),
        el('div',{class:'k'}, Object.values(state.quizzes).flat().length || 0 )
      ])
    ])
  ]));

  // Grid of class cards
  const grid = el('div',{class:'grid'});

  state.classes.forEach(cls=>{
    const quizzes = state.quizzes[cls.id] || [];

    const card = el('div',{class:'card'});
    card.appendChild(el('h2',{},cls.name));
    card.appendChild(el('div',{class:'sub'},`Total Quizzes: ${quizzes.length}`));

    const list = el('div',{class:'quiz-list'});
    if(quizzes.length === 0){
      list.appendChild(el('div',{class:'small',style:'text-align:center;padding:20px 0'},'No quizzes yet'));
    } else {
      quizzes.forEach((q,i)=>{
        const status = state.quizStates[q.id] || 'draft';
        const row = el('div',{class:'quiz-row'});

        // left: index, title, status badge
        const left = el('div',{class:'quiz-meta'},[
          el('span',{class:'idx'}, i+1),
          el('span',{class:'title'}, q.name),
          badge(status)
        ]);

        // right: actions
        const right = el('div',{class:'row-actions'});
        if(status === 'draft'){
          right.appendChild(el('button',{class:'btn-ghost',onClick:(e)=>{e.stopPropagation();location.hash='#create/'+cls.id}},'✎ Edit'));
          right.appendChild(el('button',{class:'btn',onClick:(e)=>{e.stopPropagation();state.quizStates[q.id]='published';saveState();renderClasses();}},'Publish'));
        } else if(status === 'published'){
          right.appendChild(el('button',{class:'btn',onClick:(e)=>{e.stopPropagation();location.hash='#manage/'+q.id}},'View Live'));
        } else { // completed
          right.appendChild(el('button',{class:'btn btn-success',onClick:(e)=>{e.stopPropagation();location.hash='#report/'+q.id}},'View Report'));
        }

        row.appendChild(left);
        row.appendChild(right);

        row.addEventListener('click', ()=>{
          if(status==='draft') location.hash='#create/'+cls.id;
          else if(status==='published') location.hash='#manage/'+q.id;
          else location.hash='#report/'+q.id;
        });

        list.appendChild(row);
      });
    }
    card.appendChild(list);

    // create quiz button
    card.appendChild(el('div',{class:'create-area'},[
      el('button',{class:'btn-soft',onClick:()=>{ location.hash = '#create/'+cls.id }},'+ Create Quiz')
    ]));

    grid.appendChild(card);
  });

  // Add floating action button
  const fab = el('button', {
    style: `
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      &:hover {
        transform: translateY(-2px);
      }
    `,
    onClick: () => {
      if (state.classes.length > 0) {
        location.hash = '#create/' + state.classes[0].id;
      }
    }
  }, ['N']);
  
  page.appendChild(grid);
  page.appendChild(fab);
  app.appendChild(page);

  function badge(status){
    const map = {
      draft:   { text:'Draft', color:'var(--muted)' },
      published:{ text:'Published', color:'var(--muted)' },
      completed:{ text:'Completed', color:'var(--success)' }
    };
    const s = map[status] || map.draft;
    return el('span',{class:'badge',style:`color:${s.color}`},[
      el('span',{class:'badge-dot'}),
      s.text
    ]);
  }
}

/* ------------------- Create Quiz ------------------- */
function renderCreateQuiz(classId){
  loadState();
  app.innerHTML='';
  const cls = state.classes.find(x=>x.id===classId)||{name:'Class'};

  const page = el('div',{class:'page'},[
    el('div',{class:'topbar'},[
      el('div',{class:'brand'},['QuizPro', el('small',{},'Create Quiz')]),
      el('button',{class:'avatar',onClick:()=>location.hash='#classes'}, '←')
    ])
  ]);

  const card = el('div',{class:'card'});
  card.appendChild(el('h2',{},'Creating Quiz for ' + cls.name));
  const nameRow = el('div',{class:'field'},[
    el('label',{},'Quiz Name'),
    el('input',{type:'text',class:'input',id:'quizname',placeholder:'e.g., Midterm Review'})
  ]);
  card.appendChild(nameRow);

  const list = el('div',{class:'quiz-list',id:'questions'});
  card.appendChild(list);

  function addQuestion(defaults){
    const q = { text: defaults?.text || '', type: defaults?.type || 'mc', time: defaults?.time || 10, choices: defaults?.choices || ['','',''] };
    const idx = list.children.length + 1;

    const item = el('div',{class:'card',style:'padding:16px;border:1px solid var(--line);box-shadow:none;margin-bottom:10px'});
    const row = el('div',{class:'field'});
    row.appendChild(el('strong',{},'Q'+idx+'.'));
    row.appendChild(el('input',{class:'input',type:'text',value:q.text,placeholder:'Enter your question',onInput:(e)=>q.text=e.target.value}));
    const select = el('select',{onChange:(e)=>{q.type=e.target.value;updateChoices();},class:'input',style:'max-width:200px;margin-top:8px'},[
      el('option',{value:'mc'},'Multiple Choice'),
      el('option',{value:'tf'},'True/False'),
      el('option',{value:'cb'},'Checkbox')
    ]);
    select.value = q.type;
    row.appendChild(select);

    const time = el('div',{class:'field'},[
      el('label',{},'Time (sec)'),
      el('input',{type:'number',min:'1',value:q.time,class:'input',style:'max-width:90px',onInput:(e)=>q.time=parseInt(e.target.value||'10',10)})
    ]);
    item.appendChild(row);
    item.appendChild(time);

    const choicesBox = el('div',{class:'field'});
    item.appendChild(choicesBox);

    const controls = el('div',{class:'footer'},[
      el('button',{class:'btn-ghost',onClick:()=>{ if(q.type==='tf') return; choicesBox.style.display = choicesBox.style.display==='none'?'block':'none'; }},'Toggle Choices'),
      el('button',{class:'btn-ghost',onClick:()=>{ item.remove(); refreshIdx(); }},'Delete')
    ]);
    item.appendChild(controls);

    function refreshIdx(){ Array.from(list.children).forEach((it,i)=>{ const s=it.querySelector('strong'); if(s) s.textContent='Q'+(i+1)+'.'; }); }

    function updateChoices(){
      choicesBox.innerHTML='';
      if(q.type==='tf'){
        q.choices = ['True','False'];
        const wrap = el('div',{},[
          el('div',{},'Options: True / False (fixed)')
        ]);
        choicesBox.appendChild(wrap);
        choicesBox.style.display='block';
      }else{
        const inputType = q.type==='mc' ? 'radio' : 'checkbox';
        if(q.choices.length<2) q.choices=['','',''];
        q.choices.forEach((val,i)=>{
          const line = el('div',{style:'display:flex;gap:8px;align-items:center;margin-bottom:6px'},[
            el('input',{type:inputType,disabled:true}),
            el('input',{class:'input',type:'text',value:val,placeholder:'Option '+(i+1),onInput:(e)=>q.choices[i]=e.target.value})
          ]);
          // +/- controls on last row
          if(i===q.choices.length-1){
            if(q.choices.length<6){
              line.appendChild(el('button',{class:'btn-ghost',onClick:()=>{q.choices.push('');updateChoices();}},'+'));
            }
            if(q.choices.length>2){
              line.appendChild(el('button',{class:'btn-ghost',onClick:()=>{q.choices.pop();updateChoices();}},'–'));
            }
          }
          choicesBox.appendChild(line);
        });
        choicesBox.style.display='block';
      }
    }
    updateChoices();
    list.appendChild(item);
  }

  addQuestion();
  card.appendChild(el('div',{class:'footer'},[
    el('button',{class:'btn-ghost',onClick:()=>addQuestion()},'Add Question'),
    el('button',{class:'btn',onClick:()=>saveQuiz(classId)},'Save Quiz')
  ]));

  page.appendChild(card);
  app.appendChild(page);

  function saveQuiz(cid){
    try{
      const qname = (document.getElementById('quizname')?.value || 'Untitled').trim();
      const qs = Array.from(list.children).map((box, index)=>{
        const text = box.querySelector('input[type=text]')?.value.trim() || '';
        const type = box.querySelector('select')?.value || 'mc';
        const time = parseInt(box.querySelector('input[type=number]')?.value || '10',10);
        if(!text) throw new Error(`Question ${index+1} text cannot be empty`);

        const question = { text, type, time, choices: [] };
        if(type==='tf'){
          question.choices = ['True','False'];
        } else {
          const choiceInputs = Array.from(box.querySelectorAll('.input[type=text]')).slice(1);
          const opts = choiceInputs.map(i=>i.value.trim()).filter(Boolean);
          if(opts.length < 2) throw new Error(`Question ${index+1} must have at least 2 options`);
          question.choices = opts;
        }
        return question;
      });

      if(qs.length===0) throw new Error('Quiz must have at least one question');

      const quizId = 'quiz_'+Date.now();
      const quiz = { id: quizId, name: qname, classId: cid, questions: qs, createdAt: Date.now() };

      if(!state.quizzes[cid]) state.quizzes[cid]=[];
      state.quizzes[cid].push(quiz);
      state.quizStates[quizId]='draft';
      saveState();
      alert('Quiz saved successfully!');
      location.hash='#classes';
    }catch(err){
      alert('Failed to save quiz: '+err.message);
      console.error(err);
    }
  }
}

/* ------------------- Quiz Manager ------------------- */
function renderQuizManager(quizId){
  loadState();
  let quiz;
  for(const cid in state.quizzes){
    const hit = state.quizzes[cid].find(q=>q.id===quizId);
    if(hit){ quiz = hit; break; }
  }
  if(!quiz) return renderClasses();

  app.innerHTML='';
  const page = el('div',{class:'page'});
  page.appendChild(el('div',{class:'topbar'},[
    el('div',{class:'brand'},['QuizPro', el('small',{},'Live Quiz')]),
    el('button',{class:'avatar',onClick:()=>location.hash='#classes'}, '←')
  ]));

  const card = el('div',{class:'card'});
  card.appendChild(el('h2',{},'Quiz: '+quiz.name));
  const statusMap = { draft:'Draft – Not yet published', published:'Published – Awaiting responses', completed:'Completed – View results' };
  card.appendChild(el('div',{class:'sub'}, statusMap[state.quizStates[quiz.id] || 'draft'] ));
  card.appendChild(el('div',{class:'sub'}, `Questions: ${quiz.questions.length} • Created: ${new Date(quiz.createdAt).toLocaleDateString()}`));

  const actions = el('div',{class:'footer'});
  const st = state.quizStates[quiz.id];
  if(st==='draft'){
    actions.appendChild(el('button',{class:'btn-ghost',onClick:()=>location.hash='#create/'+quiz.classId},'Edit Quiz'));
    actions.appendChild(el('button',{class:'btn',onClick:()=>{state.quizStates[quiz.id]='published';saveState();renderQuizManager(quizId);}},'Publish Quiz'));
  } else if(st==='published'){
    actions.appendChild(el('div',{class:'sub',style:'margin-right:auto'},['Access Code: ', quiz.id.slice(-6).toUpperCase()]));
    actions.appendChild(el('button',{class:'btn',onClick:()=>{
      state.quizStates[quiz.id]='completed';
      state.quizResults[quiz.id]={ averageScore: Math.round(Math.random()*40+60), totalStudents: Math.round(Math.random()*20+10), mostMissed: Math.floor(Math.random()*quiz.questions.length)+1 };
      saveState(); location.hash='#report/'+quiz.id;
    }},'Simulate Quiz Completion'));
  } else {
    actions.appendChild(el('button',{class:'btn btn-success',onClick:()=>location.hash='#report/'+quiz.id},'View Report'));
  }
  card.appendChild(actions);
  page.appendChild(card);
  app.appendChild(page);
}

function renderQuizReport(quizId){
  loadState();
  let quiz;
  for(const cid in state.quizzes){
    const hit = state.quizzes[cid].find(q=>q.id===quizId);
    if(hit){ quiz=hit; break; }
  }
  app.innerHTML='';
  const page = el('div',{class:'page'});
  page.appendChild(el('div',{class:'topbar'},[
    el('div',{class:'brand'},['QuizPro', el('small',{},'Report')]),
    el('button',{class:'avatar',onClick:()=>location.hash='#classes'}, '←')
  ]));

  const card = el('div',{class:'card'});
  card.appendChild(el('h2',{},'Quiz Report: '+(quiz?.name||'')));

  if(!quiz || !state.quizResults[quiz.id]){
    card.appendChild(el('div',{class:'sub'},'No quiz results found.'));
  }else{
    const r = state.quizResults[quiz.id];
    card.appendChild(el('div',{},[
      el('p',{},'1. Average Score: '+r.averageScore+'%'),
      el('p',{},'2. Most Missed: Q'+r.mostMissed+' ('+(Math.round(Math.random()*30+10))+'% correct)'),
      el('p',{},'3. Students: '+r.totalStudents)
    ]));
    card.appendChild(el('div',{class:'footer'},[
      el('button',{class:'btn',onClick:()=>exportReport(quiz)},'Export Report')
    ]));
  }
  page.appendChild(card);
  app.appendChild(page);
}

function exportReport(quiz){
  const content = `Quiz Report - ${quiz.name}\nQuestions: ${quiz.questions.length}\nGenerated: ${new Date().toLocaleString()}`;
  const blob = new Blob([content],{type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${quiz.name.replace(/\s+/g,'_')}_report.txt`;
  document.body.appendChild(a); a.click(); a.remove();
}

window.addEventListener('hashchange', route);
try{ loadState(); route(); }catch(err){ console.error('[prototype] startup error', err); }
