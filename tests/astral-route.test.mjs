import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
registerHooks({resolve(s,c,n){return n(s.startsWith('.')&&!/\.[a-z]+$/.test(s)?`${s}.ts`:s,c)}});
const {POST}=await import('../app/api/astral/route.ts');
const req=(question,origin)=>new Request('http://localhost/api/astral',{method:'POST',headers:{'content-type':'application/json',...(origin?{origin}:{})},body:JSON.stringify({question})});
test('manual fallback maps interests and leaves unclear requests unclassified',async()=>{
 process.env.PROOF_AI_ENABLED='false';
 for(const [question,perspective] of [['I am recruiting for a lead role','hiring'],['Show architecture and performance','engineering'],['I want PAARTH and AI workflows','ai'],['hello','null']]){
 const r=await POST(req(question));assert.equal(r.status,200);const result=await r.json();assert.equal(String(result.perspective),perspective);assert.equal(result.mode,'local');
 }
});
test('rejects invalid inputs and cross-origin requests',async()=>{
 assert.equal((await POST(req('x','https://other.test'))).status,403);
 assert.equal((await POST(new Request('http://localhost/api/astral',{method:'POST',headers:{'content-type':'text/plain'},body:'{}'}))).status,415);
 for(const q of ['',null,42,'x'.repeat(601)])assert.equal((await POST(req(q))).status,400);
});
test('unknown model IDs, malformed output and unavailable provider retain authored fallback',async()=>{
 const original=global.fetch;process.env.PROOF_AI_ENABLED='true';process.env.PROOF_GROQ_FREE_PLAN_CONFIRMED='true';process.env.GROQ_API_KEY='test-only';
 try{for(const result of ['{"perspective":"evil"}','bad json']){global.fetch=async()=>Response.json({choices:[{message:{content:result}}]});assert.deepEqual(await (await POST(req('architecture'))).json(),{perspective:'engineering',mode:'local'})}
 global.fetch=async()=>{throw new Error('offline')};assert.equal((await (await POST(req('career'))).json()).mode,'local');
 global.fetch=async()=>Response.json({choices:[{message:{content:'{"perspective":"ai"}'}}]});assert.deepEqual(await (await POST(req('model orchestration'))).json(),{perspective:'ai',mode:'ai'});
 }finally{global.fetch=original;delete process.env.GROQ_API_KEY;process.env.PROOF_AI_ENABLED='false'}
});
