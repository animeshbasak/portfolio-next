import test from 'node:test'
import assert from 'node:assert/strict'
import {poseAt,poses,progressFromAnchors} from '../components/portfolio/scene/poses.ts'
test('all six reading positions reach their authored scene',()=>{poses.forEach((p,i)=>assert.deepEqual(poseAt(i),p))})
test('only the work to studio connection enters the event field',()=>{assert.ok(poseAt(2.5).dive>.8);assert.equal(poseAt(1.5).dive,0);assert.equal(poseAt(3.5).dive,0)})
test('reverse traversal is deterministic and all transforms finite',()=>{const p=[0,.5,1,2.2,2.6,3,4,5];assert.deepEqual(p.map(poseAt),p.slice().reverse().map(poseAt).reverse());for(const x of p)for(const v of Object.values(poseAt(x)))assert.ok(Number.isFinite(v))})
test('content anchors adapt to varying section sizes',()=>{assert.equal(progressFromAnchors(150,[0,100,300,400,500,600]),1.25);assert.equal(progressFromAnchors(-20,[0,100]),0);assert.equal(progressFromAnchors(900,[0,100]),1)})
