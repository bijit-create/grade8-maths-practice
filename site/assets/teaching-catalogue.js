/* Student 2: bounded active teaching routes, 16 Nov 2026.
   A content catalogue, not a diagnosis of the learner. Domain grounds are in CANVAS.md.
   The readiness rule checks authored decision coverage; it is a revisable convention,
   not a validated mastery threshold. Unavailable prerequisites remain unknown. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TeachingCatalogue=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const sourceIds=['DI-content-analysis','KLI-2012','CLT-2019','Student2-Activity-2026-11-15'];
const req=(target,basis='mathematical necessity')=>({target,basis,gate:'teach'});
function target(id,sets,name,kind,page,decisions,requires,scope){return {id,sets,name,kind,type:kind,page,decisions,requires,prerequisites:requires,cognitiveActions:decisions,scope,sources:sourceIds.slice(),evidence:{requiredDecisions:decisions.slice(),decisions:decisions.slice(),independent:Math.max(2,decisions.length),delayed:Math.max(2,decisions.length),requiresDelayed:true,range:[scope],criteria:'Provisional coverage of authored decisions; neither a mastery threshold nor evidence beyond the stated range.'}};}
const targets=[
 target('KI-GE-21',['q1-make','ki-ge-21'],'Make and recognise quadrilaterals','Concept','quadrilaterals-1.html',['construct','classify','boundary'],[], 'Closed simple four-sided shapes, including concave shapes and nonexamples; construction and recognition both require evidence.'),
 target('KI-ME-40',['ki-me-40'],'Draw and recognise diagonals','Concept','quadrilaterals-3.html',['draw','classify','count'],[req('KI-GE-21')],'Diagonals of convex and concave quadrilaterals, distinguishing sides, reversed names and outside diagonals.'),
 target('KI-GE-23',['ki-ge-23'],'Use the total of four angles','Principle','quadrilaterals-4.html',['combine','apply','check'],[req('KI-GE-21'),req('KI-GE-22','instructional route'),req('KI-GE-66','instructional route')],'Connect two triangle angle totals to the quadrilateral total and use the relationship on valid and invalid angle sets.'),
 target('SK-GE-08',['sk-ge-08'],'Find a missing angle','Skill','quadrilaterals-5.html',['calculate'],[req('KI-GE-21'),req('KI-GE-23')],'Calculate a fourth interior angle from three given angles with the rule retrieved; formula formation and explanation are not separately assessed here.'),
 target('SK-GE-11',['sk-ge-11'],'Use an angle beside another angle','Skill','quadrilaterals-6.html',['select','calculate','integrate'],[req('KI-GE-24'),req('KI-GE-11'),req('KI-GE-23'),req('SK-GE-08')],'Identify an interior angle and use a linear pair, including integration with a missing fourth angle.'),
 target('SK-GE-09',['sk-ge-09'],'Find angles written with a letter','Skill','quadrilaterals-7.html',['form','solve','substitute','check'],[req('KI-GE-23'),req('KI-AG-47','instructional route'),req('KI-AG-11'),req('KI-AG-20')],'Form the angle-sum equation, solve and substitute; a final answer alone does not establish every intermediate decision.'),
 target('KI-AG-01',['ki-ag-01'],'Use a letter for a number','Concept','equations-1.html',['substitute','interpret','distinguish'],[],'Letters as numbers, zero and noninteger possibilities, repeated letters, and quantities in context.'),
 target('KI-AG-03',['ki-ag-03'],'Read and make expressions','Concept','equations-1.html',['classify','evaluate','construct','compare'],[req('KI-AG-01')],'Expression structure, multiplication notation, substitution, constructing and comparing expressions.'),
 target('KI-AG-04',['ki-ag-04'],'Read terms with their signs','Concept','equations-2.html',['identify','construct','compare','evaluate'],[req('KI-AG-01'),req('KI-AG-03')],'Terms of simple sums of products, including negative terms; multiplication does not split a term.'),
 target('KI-AG-06',['ki-ag-06'],'Read coefficients and constant terms','Concept','equations-2.html',['identify','distinguish','construct'],[req('KI-AG-04')],'Signed coefficients including 1 and −1, constants, and expressions without a constant term.')
];
/* Prerequisite pages are not invented. Their names and statements come from the
   existing graph; a plan must supply instruction/evidence before relying on them. */
const prerequisiteNames={
 'KI-GE-22':'The angles of a triangle total 180°',
 'KI-GE-66':'A suitable diagonal splits a quadrilateral into two triangles',
 'KI-GE-24':'An exterior angle of a polygon',
 'KI-GE-11':'Adjacent angles on a straight line total 180°',
 'KI-AG-47':'Form an equation from a relationship',
 'KI-AG-11':'Combine like terms',
 'KI-AG-20':'Undo operations while keeping both sides equal'
};
const termsTarget=targets.find(t=>t.id==='KI-AG-04');termsTarget.evidence.decisions=['identify','construct','compare'];termsTarget.evidence.requiredDecisions=termsTarget.evidence.decisions.slice();termsTarget.evidence.independent=3;termsTarget.evidence.delayed=3;
const bySet={},byId={};targets.forEach(t=>{byId[t.id]=t;t.sets.forEach(s=>bySet[s]=t);});
function get(key){return bySet[key]||byId[key]||null;}
/* Coverage is conservative: one task is credited only with its visible decision.
   Other decisions in a complete answer remain unobserved unless explicitly recorded. */
function decisionFor(set,kind,part){
 const k=String(kind||'');const t=get(set);if(!t)return 'unmapped';
 if(set==='q1-make')return /five|line|cross|open|curve/.test(k)?'boundary':'construct';
 if(t.id==='KI-GE-21')return /open|cross|curve|line/.test(k)?'boundary':'classify';
 if(t.id==='KI-ME-40')return k==='howmany'?'count':k==='which'?'classify':'draw';
 if(t.id==='KI-GE-23')return /poss|check/.test(k)?'check':/tri|split|join/.test(k)?'combine':'apply';
 if(t.id==='SK-GE-08')return /equation|sum|choose/.test(k)?'form':/check/.test(k)?'check':'calculate';
 if(t.id==='SK-GE-11')return /which/.test(k)?'select':/two/.test(k)?'integrate':'calculate';
 if(t.id==='SK-GE-09')return k==='equation'?'form':k==='check'?'check':k==='angle'?'substitute':'solve';
 if(t.id==='KI-AG-01')return /^S3|^S7|^S5/.test(k)?'interpret':/^S2|^S4[bc]|^S6/.test(k)?'distinguish':'substitute';
 if(t.id==='KI-AG-03'&&/^T3/.test(k)&&Number(part)===1)return 'evaluate';
 if(t.id==='KI-AG-04'&&/^U5/.test(k)&&Number(part)>1)return 'evaluate';
 if(t.id==='KI-AG-01'&&((k==='S3'&&Number(part)>1)||(k==='S7'&&Number(part)===3)))return 'substitute';
 if(t.id==='KI-AG-03')return /^T1/.test(k)?'classify':/^T3|^T5/.test(k)?'compare':/^T4|^T6/.test(k)?'construct':'evaluate';
 if(t.id==='KI-AG-04')return /^U4/.test(k)?'construct':/^U5/.test(k)?'compare':'identify';
 if(t.id==='KI-AG-06')return /^V5/.test(k)?'construct':/^V4/.test(k)?'distinguish':'identify';
 return 'unmapped';
}
const choice=(id,target,decision,prompt,options,correct,why)=>({id,target,decision,prompt,options,correct,why});
const number=(id,target,decision,prompt,correct,why)=>({id,target,decision,prompt,correct,why});
function lesson(lines,check){return {lines,check};}
const routes={};
function route(key,probes,whole){routes[key]={id:key,probes,whole};}
const signed=choice('signed-term','KI-AG-04','identify','Which are the terms of 9 − 3x?',['9 and −3x','9 and 3x','−9 and 3x'],0,'The expression is 9 + (−3x). The sign stays with its term.');
signed.lesson=lesson(['7 − 2y = 7 + (−2y).','Its terms are 7 and −2y.','Written in the other order, the same sum is −2y + 7.'],choice('signed-fresh','KI-AG-04','identify','Which are the terms of 11 − 4a?',['11 and 4a','11 and −4a','−11 and 4a'],1,'11 − 4a = 11 + (−4a).'));
const product=choice('one-product','KI-AG-04','identify','How many terms does 3 × x + 7 have?',['1','2','3'],1,'3 × x is one product. The two terms are 3 × x and 7.');
product.lesson=lesson(['4 × a means four times a. It is one term.','4 × a + 2 has two terms: 4 × a and 2.'],choice('product-fresh','KI-AG-04','identify','How many terms does 5 × y − 8 have?',['3','2','1'],1,'The terms are 5 × y and −8.'));
const signValue=number('signed-value','KI-AG-04','compare','When x = 2, what is 9 − 3x?',3,'9 − 3 × 2 = 9 − 6 = 3.');
signValue.lesson=lesson(['When x = 2, 10 − 4x = 10 − 4 × 2.','10 − 8 = 2.','Reordering the signed terms gives −8 + 10 = 2 as well.'],number('signed-value-fresh','KI-AG-04','compare','When y = 3, what is 8 − 2y?',2,'8 − 2 × 3 = 8 − 6 = 2.'));
route('terms',[signed,signValue],lesson(['In 12 − 2y, the terms are 12 and −2y.','Moving the whole signed term gives −2y + 12.','2y − 12 has different signs. At y = 2 the first expression is 8; the second is −8.'],choice('terms-whole','KI-AG-04','compare','Which has the same value as 10 − 3a for every a?',['3a − 10','−3a + 10','3a + 10'],1,'10 − 3a and −3a + 10 add the same signed terms.')));
route('products',[product,signValue],lesson(['6xy means 6 × x × y. Multiplication keeps these factors in one term.','6x + y has two terms, 6x and y.'],choice('products-whole','KI-AG-04','identify','How many terms does 2ab + 3 have?',['1','2','3'],1,'2ab is one product; 3 is the other term.')));
const coeff=choice('coefficient-role','KI-AG-06','identify','In 4x + 9, which number multiplies x?',['4','9','13'],0,'4x means 4 × x.');
coeff.lesson=lesson(['In 6y + 2, 6 multiplies y. Its coefficient is 6.','The term 2 has no letter. It is the constant term.'],number('coefficient-fresh','KI-AG-06','identify','What is the coefficient of a in 7a + 3?',7,'7a means 7 × a.'));
route('coefficients',[coeff,signed],lesson(['In 8 − x, the term containing x is −x = −1 × x.','Its coefficient is −1. The constant term is 8.'],number('coefficient-whole','KI-AG-06','identify','What is the coefficient of y in 5 − y?',-1,'−y means −1 × y.')));
const letter=number('letter-value','KI-AG-01','substitute','If n = 4, what is n + 3?',7,'Replace n with 4: 4 + 3 = 7.');
letter.lesson=lesson(['In a + 5, a stands for a number.','When a = 2, a + 5 = 2 + 5 = 7.','When a = 0, a + 5 = 0 + 5 = 5.'],number('letter-fresh','KI-AG-01','substitute','If b = 6, what is b + 2?',8,'b + 2 = 6 + 2 = 8.'));
const multiply=choice('multiply-notation','KI-AG-03','evaluate','Which means the same as 3x?',['3 + x','3 × x','the digits 3 and x joined'],1,'A number beside a letter means multiplication.');
multiply.lesson=lesson(['4y means 4 × y.','When y = 3, 4y = 4 × 3 = 12.'],number('multiply-fresh','KI-AG-03','evaluate','If a = 2, what is 5a?',10,'5a = 5 × 2 = 10.'));
route('letters',[letter,multiply],lesson(['In x + x, both letters stand for the same number.','If x = 3, x + x = 3 + 3 = 6.','Different letters can stand for the same number or for different numbers.'],number('letters-whole','KI-AG-01','substitute','If y = 5, what is y + y + 2?',12,'5 + 5 + 2 = 12.')));
route('expressions',[multiply,letter],lesson(['3x + 2 tells us to multiply x by 3, then add 2.','When x = 4: 3x + 2 = 3 × 4 + 2 = 14.','3(x + 2) is different: add 2 first, then multiply.'],number('expression-whole','KI-AG-03','evaluate','If y = 3, what is 2y + 5?',11,'2 × 3 + 5 = 6 + 5 = 11.')));
const quad=choice('closed-four','KI-GE-21','classify','A shape has four straight sides, but the last side stops before reaching the first side. Is it a quadrilateral?',['Yes','No'],1,'A quadrilateral must be closed.');
quad.lesson=lesson(['A quadrilateral has four straight sides joined into a closed shape.','The sides meet at four corners. Sides do not cross.','A corner can point inward; the shape can still be a quadrilateral.'],choice('closed-four-fresh','KI-GE-21','boundary','A closed shape has five straight sides and five corners. Is it a quadrilateral?',['Yes','No'],1,'It has five sides, so it is not a quadrilateral.'));
const corner=choice('four-corners','KI-GE-21','boundary','A, B and C lie on one straight side. Does B make an extra corner?',['Yes','No'],1,'The direction does not change at B, so it is not an extra corner.');
corner.lesson=lesson(['A corner is where two sides meet and change direction.','Putting an extra point along a straight side does not make an extra corner.'],choice('corner-fresh','KI-GE-21','boundary','A triangle has a dot halfway along one side. Does the dot make it a quadrilateral?',['Yes','No'],1,'The triangle still has three straight sides and three corners.'));
route('quadrilateral',[quad,corner],lesson(['Join four corners in order, then join the last corner back to the first.','Check four straight sides, no crossings, and no three chosen corners in one straight line.'],choice('quad-whole','KI-GE-21','boundary','A closed shape has four straight sides with no crossings. One corner points inward. Can it be a quadrilateral?',['Yes','No'],0,'A concave quadrilateral has a corner that points inward.')));
const adjacency=choice('adjacency','KI-ME-40','classify','ABCD names a quadrilateral in order. Which pair of vertices is not joined by a side?',['A and B','A and C','A and D'],1,'AB, BC, CD and DA are the sides. A and C are not next to each other.');
adjacency.lesson=lesson(['In quadrilateral ABCD, the sides join A–B, B–C, C–D and D–A.','A and C are not next to each other, so AC is a diagonal.','The other diagonal is BD.'],choice('adjacency-fresh','KI-ME-40','classify','PQRS names a quadrilateral in order. Which is a diagonal?',['PQ','RS','PR'],2,'P and R are not next to each other.'));
const segment=choice('segment-order','KI-ME-40','count','Are AC and CA two different line segments?',['Yes','No'],1,'They have the same two endpoints and are the same line segment.');
segment.lesson=lesson(['A segment joining A to C also joins C to A.','Changing the order of its name does not make another segment.'],choice('segment-fresh','KI-ME-40','count','BD is drawn. If you draw DB, have you drawn a different diagonal?',['Yes','No'],1,'BD and DB are the same diagonal.'));
route('diagonals',[adjacency,segment],lesson(['A diagonal joins vertices that are not next to each other.','In a quadrilateral whose corner points inward, one diagonal can lie outside the shape.','Where the segment lies does not change which vertices it joins.'],choice('diagonal-whole','KI-ME-40','classify','A segment joins two non-neighbouring vertices of a quadrilateral and lies outside it. Is it a diagonal?',['Yes','No'],0,'It joins two vertices that are not next to each other.')));
const triangle=number('triangle-total','KI-GE-22','recall','What is the total of the three interior angles of a triangle, in degrees?',180,'The three interior angles of a triangle total 180°.');
triangle.lesson=lesson(['The three interior angles of a triangle total 180°.','For example, 50° + 60° + 70° = 180°.'],number('triangle-fresh','KI-GE-22','apply','Two angles of a triangle are 40° and 60°. How many degrees is the third?',80,'180 − (40 + 60) = 80.'));
const quadTotal=number('quad-total','KI-GE-23','apply','What is the total of the four interior angles of a quadrilateral, in degrees?',360,'The four interior angles total 360°.');
quadTotal.lesson=lesson(['A diagonal lying inside a quadrilateral splits it into two triangles.','Each triangle has an angle total of 180°.','Together their angles make the four interior angles: 180° + 180° = 360°.'],number('quad-total-fresh','KI-GE-23','combine','Two triangles together make a quadrilateral. What is 180 + 180?',360,'180 + 180 = 360.'));
route('angle-total',[triangle,quadTotal],lesson(['A diagonal inside the shape makes two triangles.','Their angle totals combine to give 180° + 180° = 360°.','To check a proposed set of four angles, add all four.'],choice('total-whole','KI-GE-23','check','Could 80°, 100°, 90° and 100° be the four interior angles of a quadrilateral?',['Yes','No'],1,'They total 370°, not 360°.')));
const subtraction=number('missing-subtract','SK-GE-08','calculate','What is 360 − 270?',90,'270 + 90 = 360.');
subtraction.lesson=lesson(['Three angles total 250°. The whole is 360°.','The missing part is 360° − 250° = 110°.','Check: 250° + 110° = 360°.'],number('subtract-fresh','SK-GE-08','calculate','What is 360 − 280?',80,'280 + 80 = 360.'));
route('missing-angle',[quadTotal,subtraction],lesson(['Three interior angles are 80°, 100° and 70°.','Their sum is 250°.','The fourth angle is 360° − 250° = 110°.'],number('missing-whole','SK-GE-08','calculate','Three angles of a quadrilateral are 70°, 90° and 120°. How many degrees is the fourth?',80,'70 + 90 + 120 = 280; 360 − 280 = 80.')));
const straight=number('straight-total','KI-GE-11','recall','Two adjacent angles together make a straight angle. How many degrees do they total?',180,'Angles that together make a straight angle total 180°.');
straight.lesson=lesson(['A straight angle is 180°.','If a ray splits it into 50° and another angle, that other angle is 180° − 50° = 130°.'],number('straight-fresh','KI-GE-11','apply','A straight angle is split into 65° and another angle. How many degrees is the other angle?',115,'180 − 65 = 115.'));
const inside=choice('inside-choice','KI-GE-24','distinguish','A side of a quadrilateral is extended. Which angle belongs in the sum of its four interior angles?',['The angle inside the quadrilateral','The angle outside beside it'],0,'The four interior angles are inside the quadrilateral at its vertices.');
inside.lesson=lesson(['An interior angle is between two sides, inside the shape.','Extending a side makes an exterior angle beside it.','The interior and this exterior angle total 180°.'],choice('inside-fresh','KI-GE-24','distinguish','An exterior angle is 60°. Is the adjacent interior angle also 60°?',['Yes','No; it is 120°'],1,'180 − 60 = 120.'));
route('angle-beside',[inside,straight],lesson(['An exterior angle beside an interior angle is 70°.','The interior angle is 180° − 70° = 110°.','Use 110°, the interior angle, when adding the quadrilateral’s angles.'],number('beside-whole','SK-GE-11','calculate','An exterior angle beside an interior angle is 85°. How many degrees is the interior angle?',95,'180 − 85 = 95.')));
const equation=number('undo-operation','KI-AG-20','solve','In 2x + 6 = 20, what is x?',7,'Take 6 from both sides: 2x = 14. Divide both sides by 2: x = 7.');
equation.lesson=lesson(['3y + 4 = 19.','Take 4 from both sides: 3y = 15.','Divide both sides by 3: y = 5.','Check: 3 × 5 + 4 = 19.'],number('equation-fresh','KI-AG-20','solve','In 2a + 8 = 24, what is a?',8,'2a = 16, so a = 8.'));
route('angle-equation',[quadTotal,equation],lesson(['A quadrilateral has angles x°, 2x°, 3x° and 4x°.','x + 2x + 3x + 4x = 360, so 10x = 360 and x = 36.','The angle 2x° is 72°, not 36°.','Check: 36 + 72 + 108 + 144 = 360.'],number('equation-whole','SK-GE-09','substitute','If x = 30, how many degrees is an angle written as 2x + 10°?',70,'2 × 30 + 10 = 70.')));
const defaultRoutes={'KI-GE-21':'quadrilateral','KI-ME-40':'diagonals','KI-GE-23':'angle-total','SK-GE-08':'missing-angle','SK-GE-11':'angle-beside','SK-GE-09':'angle-equation','KI-AG-01':'letters','KI-AG-03':'expressions','KI-AG-04':'terms','KI-AG-06':'coefficients'};
quadTotal.lesson.figure='two-triangles';
function routeFor(set,kind,tag){const t=get(set);if(!t)return null;if(t.id==='KI-AG-04'&&/product|splits|U1x|U3/.test(String(kind)+' '+String(tag)))return routes.products;return routes[defaultRoutes[t.id]];}
return {version:'2026-11-16.1',targets,bySet,get,decisionFor,prerequisiteNames,routes,routeFor};
});
