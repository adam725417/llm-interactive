import { missions, worlds } from '../src/content.js'
if(worlds.length!==4) throw new Error('world count')
if(missions.length!==12) throw new Error('mission count')
for(const m of missions){
  if(m.flow.length!==4) throw new Error(`mission ${m.id} flow`)
  if(m.remember.length!==2) throw new Error(`mission ${m.id} remember`)
  if(!m.deep?.terms || m.deep.terms.length < 3) throw new Error(`mission ${m.id} terms`)
  if(m.quiz.length!==2) throw new Error(`mission ${m.id} quiz`)
  if(!m.lab?.type) throw new Error(`mission ${m.id} lab`)
}
console.log('PASS: 4 worlds / 12 lessons / 12 labs / 24 quizzes')
