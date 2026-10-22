const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor(){ this.dataset={}; this.children=[]; this.hidden=false; this.listeners={}; this.classList={toggle(){}}; }
  addEventListener(name, handler){ this.listeners[name]=handler; }
  replaceChildren(...children){this.children=children;}
  append(...children){this.children.push(...children);}
  setAttribute(){}
  focus(){this.focused=true;}
  querySelector(){return this.children[0];}
  contains(button){return this.children.includes(button);}
  closest(){return this;}
}
const ids = new Map();
const document = {
  documentElement:{lang:'en'},
  getElementById(id){if(!ids.has(id))ids.set(id,new Element()); return ids.get(id);},
  querySelectorAll(){return [];},
  createElement(){return new Element();},
  addEventListener(){}
};
const context = vm.createContext({document});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../script.js'),'utf8')+'\nthis.demo = new MoodtripDemo();',context);
const d=context.demo;
function choose(action){const b=d.choices.children.find(b=>b.dataset.chatAction===action);assert.ok(b,`Button ${action}`);d.choices.listeners.click({target:b});}
for(const lang of ['en','zh-CN']){
 document.documentElement.lang=lang;
 for(const [mood,minutes] of [['calm',75],['happy',90],['stressed',55],['curious',85]]){
  d.restart.listeners.click();
  assert.equal(d.result.hidden,true);
  assert.equal(d.messages.children.length,1);
  assert.equal(d.choices.children.length,4);
  choose(mood);
  assert.equal(d.result.hidden,true);
  assert.equal(d.messages.children.length,3);
  assert.equal(d.currentMood,mood);
  choose('show');
  assert.equal(d.result.hidden,false);
  assert.equal(d.messages.children.length,5);
  assert.equal(d.duration.textContent,`${minutes} ${lang==='en'?'min':'分钟'}`);
  assert.equal(d.choices.children.length,0);
  d.render();
  assert.equal(d.messages.children.length,5,'Rerender must not duplicate messages');
 }
}
document.documentElement.lang='en'; d.render();
assert.equal(d.result.hidden,false,'Switching language must retain result');
assert.equal(d.duration.textContent,'85 min');
d.restart.listeners.click(); assert.equal(d.result.hidden,true);
console.log('PASS: all four conversations in EN/ZH, confirmation gating, route mapping, reset, stable rerender, language continuity.');
