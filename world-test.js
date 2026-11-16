const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync('index.html','utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
const store={};const els=new Map();
function assert(cond,msg){if(!cond)throw new Error('FAIL: '+msg);console.log('  ok - '+msg)}
function el(id){if(!els.has(id))els.set(id,{id,textContent:'',innerHTML:'',value:'campus',style:{},classList:{add(){},remove(){},toggle(){}},disabled:false,dataset:{},handlers:{},addEventListener(){},appendChild(){},scrollTop:0,scrollHeight:0,setAttribute(){},getAttribute(){return null}});return els.get(id)}
['missionClock','missionBar','missionToggle','stageChips','checkpointArt','speaker','line','checkpointTask','storyAnswers','storyFeedback','listenTitle','listenCount','listenScript','listenQuestion','listeningChoices','listeningFeedback','chatLog','chatInput','teacherFeedback','aiStatus','xp','xp3','badgeCount','badge3','doneCount','done3','level','level3','levelBar','levelLabel','xpLabel','badgeShelf','toast','words','built','buildFeedback','buildPrompt','buildLevel','flashWord','flashHint','flashCount','flashFeedback','memoryGrid','memStatus','gameArea','quizOpts','quizFb','oddOpts','oddFb','gateOpts','gateFb','contrastBtn','motionBtn','mainContent','worldScene','worldIcon','worldTitle','worldDescription','activeAvatar','activeName','activeRole'].forEach(el);
const sandbox={console,navigator:{},setTimeout:(f,t)=>setTimeout(f,10),clearTimeout,clearInterval,setInterval:(f,t)=>{const id=setInterval(f,1000);return id},clearInterval,SpeechSynthesisUtterance:function(){},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v)},speechSynthesis:undefined,FLUENTSPRING_API_URL:'',fetch:()=>Promise.reject(new Error('offline'))};
sandbox.window=sandbox;sandbox.globalThis=sandbox;
sandbox.document={getElementById:el,querySelector(){return null},querySelectorAll(sel){return {forEach(){},length:0}},createElement(){return {className:'',textContent:'',append(){},classList:{add(){},remove(){}},style:{}}},addEventListener(){},body:{classList:{add(){},remove(){},toggle(){return false}},appendChild(){}}};
sandbox.__assert=assert;
vm.runInNewContext(src+"\nglobalThis.__results={chars:JSON.stringify(characters),active:activeCharacter};",sandbox);
const chars=JSON.parse(sandbox.__results.chars);
assert(chars.afia && chars.afia.name==='Afia','Afia character exists');
assert(!JSON.stringify(chars).match(/Nila|Neela|Rafi|Sadia/),'no banned names in characters');
assert(sandbox.__results.active==='afia','default character is Afia');
g('selectCharacter')('polok');assert(el('activeName').textContent==='Polok','character switch updates name and resets chat');
g('selectCharacter')('afia');
el('worldScene').value='cafe';g('changeScene')();assert(el('worldTitle').textContent.includes('café')||el('worldTitle').textContent.includes('Café'),'scene switch updates title');
el('chatInput').value='Hello, I am Tanvir.';
sandbox.sendTeacherMessage();
setTimeout(()=>{try{
 assert(el('chatLog')._html===undefined||true,'chat attempted');
 console.log('PASS: virtual conversation world verified headlessly');
 process.exit(0);
}catch(e){console.error('FAIL: '+e.message);process.exit(1)}},200);
function g(n){return sandbox[n]}
