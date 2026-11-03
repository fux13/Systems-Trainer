'use strict';
window.KA350_DATA={
 lessons:[
  {title:'1. Architektur',text:'Das primäre elektrische System arbeitet mit 28 VDC. Als Quellen dienen Batterie, zwei Starter-Generatoren und am Boden externe Gleichstromversorgung.'},
  {title:'2. Batterie',text:'Die versiegelte Blei-Säure-Batterie hat 42 Ah. Sie unterstützt den Start und bildet bei Generatorausfällen die verbleibende Quelle.'},
  {title:'3. Starter-Generatoren',text:'Jeder Starter-Generator ist für 300 A ausgelegt. Die Darstellung der Lastverteilung im Trainer ist didaktisch vereinfacht.'},
  {title:'4. Bus Ties',text:'Bei verfügbarer Generator- oder externer Leistung können die Generatorbusse mit dem Center Bus verbunden werden. Bei Battery-only bleiben die Generator Bus Ties in NORM offen.'}
 ],
 questions:[
  {q:'Wie hoch ist die Nennspannung des primären Systems?',a:['14 VDC','28 VDC','115 VAC'],correct:1,why:'Das primäre Bordnetz ist ein 28-VDC-System.'},
  {q:'Welche Quellen gehören zum DC-System?',a:['Batterie, zwei Starter-Generatoren und externe Leistung','Zwei Batterien und ein Generator','Nur externe Leistung'],correct:0,why:'Das System nutzt eine Batterie, zwei Starter-Generatoren und optional externe Gleichstromversorgung.'},
  {q:'Was geschieht in NORM bei Battery-only?',a:['Die Generatorbusse werden automatisch zugeschaltet','Die Generator Bus Ties bleiben offen','Die Batterie wird vollständig isoliert'],correct:1,why:'Die Generatorbusse bleiben isoliert, um unnötige Batterielast zu vermeiden.'},
  {q:'Welche Nennstromstärke ist für jeden Starter-Generator angegeben?',a:['150 A','250 A','300 A'],correct:2,why:'Jeder Starter-Generator ist mit 300 A bewertet.'},
  {q:'Was bewirkt der BUS SENSE TEST im Prototyp?',a:['Triebwerksstart','Öffnen der Generator Ties und des Battery Tie','Nur Avionikabschaltung'],correct:1,why:'Der Testzustand öffnet die Generator Ties und den Battery Tie.'}
 ],
 scenarios:[
  {title:'L DC GENERATOR · R LOAD erhöht',text:'Im Reiseflug erscheint L DC GENERATOR. Der rechte Loadmeter steigt deutlich.',a:['Linker Generator ist offline','Battery Tie ist offen','Externe Leistung ist aktiv'],correct:0,why:'Der linke Generator speist nicht mehr; die verbleibende Quelle übernimmt zusätzliche Last.'},
  {title:'L-R GEN TIE OPEN · Center Bus 0 V',text:'Beide Generatoren zeigen Spannung, der Center Bus ist jedoch spannungslos.',a:['Beide Generator Ties sind offen','Beide Generatoren liefern Überspannung','Die Batterie ist überladen'],correct:0,why:'Mit offenen Generator Ties ist der Center Bus von den Generatorbussen getrennt.'},
  {title:'BATTERY TIE OPEN',text:'Center-Bus-Spannung ist normal. BATTERY TIE OPEN leuchtet.',a:['Battery Tie ist geöffnet','Linker Generator ist ausgefallen','Avionics Master ist ON'],correct:0,why:'Die Meldung zeigt den geöffneten Battery Tie an.'}
 ]
};
