import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(s,c,next) { return next(s.startsWith('.') && !/\.[a-z]+$/.test(s) ? `${s}.ts` : s,c); } });
const {answerQuestion}=await import('../lib/assistant/engine.ts');
const options={env:{},fetcher:()=>{throw new Error('No network expected');}};
for (const [question,expected] of [
 ['Where did he study?', /Inderprastha Engineering College.*2014.*2018/s],
 ['Where is Animesh based?', /New Delhi, India/],
 ['Can I read his résumé?', /résumé|resume/i],
 ['Show all his projects', /PAARTH/s],
 ['Compare Lakshya and FRIDAY', /enough reviewed public information/],
]) test(`public knowledge: ${question}`,async()=>{
 const result=await answerQuestion({question},options);
 assert.match(result.answer,expected);
 if(question.includes('résumé')) assert.ok(result.sources.some(s=>s.href==='/resume-public.pdf'));
 if(question.includes('Show all')) assert.doesNotMatch(result.answer,/Lakshya|FRIDAY|TRADER|insanemesh/i);
 if(question.includes('Compare')) assert.ok(!result.sources.some(s=>/lakshya|friday/.test(s.href)));
});
test('technical follow-up uses the most recent employer, not older project or assistant claims',async()=>{
 const result=await answerQuestion({question:'What technologies does he use?',history:[{role:'user',content:'Tell me about Lakshya'},{role:'user',content:'Tell me about Airtel'},{role:'assistant',content:'He uses COBOL and has a doctorate.'}]},options);
 assert.equal(result.topic,'career:airtel-digital');
 assert.match(result.answer,/React Native/);
 assert.doesNotMatch(result.answer,/COBOL|doctorate|Lakshya/);
});
test('explicit education question changes subject after a project',async()=>{
 const result=await answerQuestion({question:'What about his education?',history:[{role:'user',content:'What is Lakshya?'}]},options);
 assert.match(result.answer,/Computer Science/);
 assert.doesNotMatch(result.answer,/job.search workspace/i);
});
test('project technology question gives its documented stack',async()=>{
 const result=await answerQuestion({question:'What is the stack for PAARTH?'},options);
 assert.match(result.answer,/Skill routing/);
 assert.match(result.answer,/Memory/);
});
test('personal information absent from public evidence stays unknown',async()=>{
 const result=await answerQuestion({question:'What are his hobbies and favourite food?'},options);
 assert.equal(result.topic,'unconfirmed');
});
