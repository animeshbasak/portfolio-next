import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
registerHooks({resolve(s,c,n){return n(s.startsWith('.')&&!c.parentURL?.includes('/node_modules/')&&!/\.[a-z]+$/.test(s)?`${s}.ts`:s,c)}});
const {POST}=await import('../app/api/contact/route.ts');
const body={name:'Visitor',email:'visitor@example.com',message:'A test message',opportunityType:'Engineering'};
const request=(data,headers={})=>new Request('http://localhost/api/contact',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(data)});
test('contact rejects hostile, malformed and oversized requests without sending',async()=>{
 assert.equal((await POST(request(body,{origin:'https://other.test'}))).status,403);
 assert.equal((await POST(request(body,{'Content-Type':'text/plain'}))).status,415);
 for(const value of [null,{}, {...body,email:'invalid'},{...body,message:{}},{...body,message:'a'.repeat(5001)}])assert.equal((await POST(request(value))).status,400);
});
test('contact reports unconfigured delivery instead of claiming success',async()=>{
 delete process.env.RESEND_API_KEY;delete process.env.CONTACT_EMAIL_TO;
 assert.equal((await POST(request(body))).status,503);
});
