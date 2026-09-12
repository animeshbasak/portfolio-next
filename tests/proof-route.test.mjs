import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) return next(`${specifier}.ts`, context);
  return next(specifier, context);
} });
const { POST } = await import('../app/api/proof/route.ts');
const body={question:'Explain the private cache system',requirements:{deadlineMs:150,maxAgeSeconds:null},scenario:{cacheAgeSeconds:45,responseMs:800}};
const req=(input,extra={})=>new Request('http://localhost/api/proof',{method:'POST',headers:{'content-type':'application/json',...extra},body:JSON.stringify(input)});
test('the HTTP route recomputes results and returns no-store evidence',async()=>{
  const response=await POST(req(body,{'x-forwarded-for':'192.0.2.1'}));
  assert.equal(response.status,200);
  assert.equal(response.headers.get('cache-control'),'no-store');
  const data=await response.json();
  assert.equal(data.mode,'scope');
  assert.equal(data.result.verdict,'neither');
});
test('the route rejects cross-origin, invalid JSON, forged fields and large bodies',async()=>{
  assert.equal((await POST(req(body,{origin:'https://other.invalid'}))).status,403);
  assert.equal((await POST(req(body,{'content-type':'text/plain'}))).status,415);
  assert.equal((await POST(req({...body,result:{verdict:'both'}},{'x-forwarded-for':'192.0.2.2'}))).status,400);
  assert.equal((await POST(req({...body,question:'x'.repeat(5000)},{'x-forwarded-for':'192.0.2.2'}))).status,400);
  assert.equal((await POST(new Request('http://localhost/api/proof',{method:'POST',headers:{'content-type':'application/json'},body:'{'}))).status,400);
});
test('the route stops a visitor after eight bounded requests',async()=>{
  for(let i=0;i<8;i++) assert.equal((await POST(req(body,{'x-forwarded-for':'192.0.2.3'}))).status,200);
  const limited=await POST(req(body,{'x-forwarded-for':'192.0.2.3'}));
  assert.equal(limited.status,429);
  assert.equal(limited.headers.get('retry-after'),'60');
});
