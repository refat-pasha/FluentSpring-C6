from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.dml import MSO_THEME_COLOR
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls
from pptx.enum.text import MSO_AUTO_SIZE

OUT='FluentSpring_C6_Class_Presentation.pptx'
prs=Presentation();prs.slide_width=Inches(13.333);prs.slide_height=Inches(7.5)
C={'forest':'173A35','forest2':'244B43','leaf':'78964F','lime':'D0E18E','paper':'F7F5ED','white':'FFFEF8','muted':'64766D','line':'DCE2D5','orange':'CD855D','soft':'E9EDDF','gold':'E9DDAF'}
def rgb(v):return RGBColor.from_string(C.get(v,v))
def rect(slide,x,y,w,h,fill, radius=False,line=None):
 sh=slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h));sh.fill.solid();sh.fill.fore_color.rgb=rgb(fill);sh.line.fill.background() if not line else None
 if line:sh.line.color.rgb=rgb(line)
 if radius:
  try:sh.adjustments[0]=.08
  except:pass
 return sh
def text(slide,x,y,w,h,txt,size=18,color='forest',bold=False,font='Aptos',align=PP_ALIGN.LEFT,valign=MSO_ANCHOR.TOP,italic=False,margin=.03):
 box=slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h));tf=box.text_frame;tf.clear();tf.word_wrap=True;tf.margin_left=Inches(margin);tf.margin_right=Inches(margin);tf.margin_top=Inches(margin);tf.margin_bottom=Inches(margin);tf.vertical_anchor=valign
 for i,line in enumerate(txt.split('\n')):
  p=tf.paragraphs[0] if i==0 else tf.add_paragraph();p.alignment=align;p.space_after=Pt(5);run=p.add_run();run.text=line;run.font.name=font;run.font.size=Pt(size);run.font.bold=bold;run.font.italic=italic;run.font.color.rgb=rgb(color)
 return box
def base(title,kicker='FLUENTSPRING · C6 SPEAKING LAB',dark=False,num=None):
 s=prs.slides.add_slide(prs.slide_layouts[6]);bg=C['forest'] if dark else C['paper'];s.background.fill.solid();s.background.fill.fore_color.rgb=rgb(bg)
 text(s,.55,.25,8,.3,kicker,10,'lime' if dark else 'leaf',True)
 if num:text(s,12.15,.23,.6,.35,f'{num:02}',12,'lime' if dark else 'leaf',True,align=PP_ALIGN.RIGHT)
 text(s,.55,.62,12.1,.65,title,30,'white' if dark else 'forest',True,'Aptos Display')
 rect(s,.57,7.12,12.2,.015,'lime' if dark else 'line')
 text(s,.6,7.18,11,.2,'FIRST HELLO  /  INTRODUCING YOURSELF AND OTHERS',8,'lime' if dark else 'muted')
 return s
def bullet_block(s,x,y,w,title,body,accent='leaf'):
 rect(s,x,y,.08,1.12,accent);text(s,x+.22,y,w-.25,.32,title,17,'forest',True);text(s,x+.22,y+.36,w-.28,.73,body,13,'muted')
def pill(s,x,y,w,label,fill='soft',color='forest'):
 rect(s,x,y,w,.42,fill,True);text(s,x+.08,y+.05,w-.16,.28,label,11,color,True,align=PP_ALIGN.CENTER,valign=MSO_ANCHOR.MIDDLE)
# Cover
s=prs.slides.add_slide(prs.slide_layouts[6]);s.background.fill.solid();s.background.fill.fore_color.rgb=rgb('forest')
rect(s,9.1,0,4.24,7.5,'forest2');rect(s,9.55,.9,2.5,2.5,'leaf',True);rect(s,10.05,1.4,1.5,1.5,'lime',True)
text(s,.8,.65,7,.3,'FLUENTSPRING  /  C6',12,'lime',True)
text(s,.8,1.65,8.2,1.65,'First\nHello',52,'white',True,'Aptos Display')
text(s,.82,4.03,7.6,.5,'Introducing Yourself and Others',25,'lime',True)
text(s,.82,4.78,7.35,.85,'A lively 15-minute English lesson set at a university campus club fair in Bangladesh.',17,'white')
pill(s,.85,6.08,2.05,'SPEAK TO CONNECT','leaf','white');pill(s,3.05,6.08,2.05,'LISTEN TO INCLUDE','forest2','white')
text(s,9.35,4.15,3.35,.65,'HI, I’M NILA!',25,'white',True,'Aptos Display',PP_ALIGN.CENTER)
text(s,9.65,5.0,2.75,.7,'A new face.\nA small brave hello.',15,'lime',False,align=PP_ALIGN.CENTER)
text(s,.85,7.14,8,.2,'CLASS PRESENTATION · FALL 2026',9,'lime',True)
# objectives
s=base('Today, we make room for a hello.',num=2)
text(s,.65,1.55,5.2,.55,'By the end, learners can…',22,'forest',True,'Aptos Display')
items=[('01','Start','Open a short conversation and say who you are.'),('02','Connect','Share one detail that gives the other person something to respond to.'),('03','Include','Introduce a friend by name and invite both people to speak.'),('04','Choose','Use a friendly question and respect people’s choices.')]
for i,(n,h,b) in enumerate(items):
 x=.7+(i%2)*6.1;y=2.35+(i//2)*1.8;rect(s,x,y,5.65,1.45,'white',True);text(s,x+.2,y+.14,.55,.4,n,18,'leaf',True,'Aptos Display');text(s,x+.9,y+.12,4.4,.35,h,17,'forest',True);text(s,x+.9,y+.53,4.4,.7,b,13,'muted')
# context
s=base('A campus club fair. A real reason to speak.',num=3)
rect(s,.65,1.55,5.55,4.95,'soft',True)
text(s,1,1.95,4.9,.4,'WELCOME TO THE CLUB FAIR',17,'forest',True,align=PP_ALIGN.CENTER)
rect(s,1.18,2.75,4.5,.11,'orange');rect(s,1.55,2.87,.22,1.05,'orange');rect(s,5.1,2.87,.22,1.05,'orange')
rect(s,1.38,4.2,1.15,1.52,'leaf',True);rect(s,4.33,4.14,1.15,1.58,'orange',True);rect(s,2.76,3.8,1.25,1.92,'forest2',True)
text(s,.9,5.92,5.1,.33,'DEBATE  ·  PHOTOGRAPHY  ·  CULTURAL CLUB',10,'forest',True,align=PP_ALIGN.CENTER)
bullet_block(s,6.8,1.85,5.5,'Context is more than local names','Campus societies, a crowded fair, a shared map, peer introductions, and language choice shape this scene.')
bullet_block(s,6.8,3.3,5.5,'A familiar social moment','A new student wants to join in but doesn’t know anyone yet.')
bullet_block(s,6.8,4.75,5.5,'The learner’s mission','Help Nila feel welcome—without pressure, assumptions, or perfect-English expectations.','orange')
# timeline
s=base('Six stages, built around 15 minutes of role-play.',num=4)
mins=[('2 min','Warm-up'),('2 min','Delivery'),('6 min','Guided practice'),('9 min','Main task'),('1 min','Review'),('2 min','Feedback')]
rect(s,.55,2.94,12.2,.06,'line')
for i,(m,t) in enumerate(mins):
 x=.42+i*2.08;accent='orange' if i in (2,3) else 'leaf'
 rect(s,x+.62,2.62,.64,.64,accent,True);text(s,x+.69,2.79,.5,.24,str(i+1),13,'white',True,align=PP_ALIGN.CENTER)
 text(s,x,3.48,1.9,.35,m,16,'leaf',True,align=PP_ALIGN.CENTER)
 text(s,x-.06,3.92,2.0,.8,t,15,'forest',True,align=PP_ALIGN.CENTER)
text(s,.7,5.55,12,.5,'Stages 3–4 are the 15-minute role-play:  4 rounds · 12 criteria points · one report',15,'forest2',True,align=PP_ALIGN.CENTER)

# language
s=base('Four moves make an introduction feel easy.',num=5)
phrases=[('OPEN','“Hi, I’m Tania.”','Say your name.'),('CONNECT','“I’m studying business.”','Offer one small detail.'),('INTRODUCE','“Nila, this is my friend Rafi.”','Name the relationship.'),('INVITE','“What are you interested in?”','Give them a way in.')]
for i,(h,q,d) in enumerate(phrases):
 x=.7+i*3.15;rect(s,x,1.85,2.8,3.25,'white',True);text(s,x+.2,2.12,2.35,.35,f'0{i+1}  /  {h}',11,'leaf',True);text(s,x+.2,2.85,2.4,1.05,q,20,'forest',True,'Aptos Display');text(s,x+.2,4.25,2.4,.5,d,13,'muted')
text(s,.85,5.65,11.4,.7,'In Bangladesh, a learner may greet someone in Bangla and switch to English for practice. Let language include people; don’t use it to test their background.',15,'forest2',False,align=PP_ALIGN.CENTER)
# activities
s=base('Learners do the talking—not just the reading.',num=6)
bullet_block(s,.8,1.72,5.6,'Rounds 1–2 · greet and connect','Learners greet Nila, say their name, share a detail and ask a question back.')
bullet_block(s,.8,3.2,5.6,'Scored as they go','Each round states three criteria, then scores the learner’s line and names the fix.')
bullet_block(s,6.8,1.72,5.6,'Round 3 · bring a friend in','Rafi arrives with tea. Learners introduce both people and give them something to say.','orange')
bullet_block(s,6.8,3.2,5.6,'Round 4 · invite and close','Invite Nila to the first meeting, close warmly, and produce a 12-point role-play report.')
rect(s,1.0,5.25,11.2,.8,'forest',True);text(s,1.25,5.46,10.7,.4,'15 minutes · 4 rounds · 12 criteria points · one visible report',18,'white',True,align=PP_ALIGN.CENTER)
# assessment
s=base('How do we know they learned?',num=7)
text(s,.8,1.52,11.4,.55,'The exit ticket gathers evidence, not just participation.',21,'forest',True,'Aptos Display')
for i,(num,title,desc) in enumerate([('1','Choose','Select the most welcoming opener.'),('2','Introduce','Choose a respectful way to introduce a friend.'),('3','Write','Create a greeting and open follow-up question.')]):
 x=.8+i*4.15;rect(s,x,2.55,3.7,2.12,'white',True);text(s,x+.2,2.8,.55,.6,num,28,'leaf',True,'Aptos Display');text(s,x+.9,2.82,2.4,.35,title,17,'forest',True);text(s,x+.9,3.35,2.45,.95,desc,13,'muted')
rect(s,.8,5.15,11.75,.95,'soft',True);text(s,1.05,5.37,11.2,.55,'Role-play report (12 points) + exit-ticket score and next step',17,'forest2',True,align=PP_ALIGN.CENTER)
# feedback/ai
s=base('Responsible AI: be honest about what this does.',dark=True,num=8)
bullet_block(s,.8,1.7,5.7,'Current feedback is rule-based','The page looks for greetings, self-introduction phrases, names, and an invitation or question.','lime')
bullet_block(s,.8,3.35,5.7,'It is not generative AI','No external AI service is connected. Feedback is a transparent classroom aid, not a teacher replacement.','lime')
bullet_block(s,6.9,1.7,5.45,'Privacy by design','Learner answers stay in the browser and are not uploaded or saved.','orange')
bullet_block(s,6.9,3.35,5.45,'Speech is optional','Browser text-to-speech depends on available installed voices. Text interaction still works without audio.','orange')
text(s,1.0,5.6,11,.5,'If a course rubric requires an actual AI model, add an approved service only with teacher permission, privacy safeguards, and clear disclosure.',13,'lime',True,align=PP_ALIGN.CENTER)
# demo
s=base('A short sample: put the four moves together.',num=9)
dialog=[('TANIA','Hi, I’m Tania. I’m studying business.'),('NILA','Nice to meet you, Tania! What brought you to the fair?'),('TANIA','My friend Rafi invited me. Oh—Nila, this is Rafi.'),('RAFI','Hi, Nila. What are you interested in?')]
for i,(who,line) in enumerate(dialog):
 y=1.55+i*1.06;isA=who in ['TANIA','RAFI'];rect(s,1.0 if isA else 4.25,y,8.0,.76,'soft' if isA else 'white',True);text(s,1.22 if isA else 4.48,y+.08,1.3,.22,who,10,'leaf' if isA else 'orange',True);text(s,1.22 if isA else 4.48,y+.34,7.1,.31,line,15,'forest')
text(s,1.0,6.1,11,.35,'Notice: names · relationship · a shared detail · an open question',13,'forest2',True,align=PP_ALIGN.CENTER)
# technical
s=base('A real, runnable classroom project.',num=10)
files=[('index.html','Lesson structure & activities'),('lesson.ts','Typed interaction, practice & feedback logic'),('lesson.js','Compiled browser script'),('lesson.css','Responsive, large-print visuals'),('server.js','Simple local Node server'),('lesson-test.js','Smoke tests for lesson interactions')]
for i,(a,b) in enumerate(files):
 y=1.53+i*.73;rect(s,.85,y,3.0,.48,'soft',True);text(s,1.0,y+.07,2.72,.3,a,13,'forest',True);text(s,4.15,y+.08,7.9,.3,b,14,'muted')
rect(s,.9,6.1,11.4,.62,'forest',True);text(s,1.12,6.23,11,.28,'Run:  node server.js   →   open http://127.0.0.1:4173',15,'white',True,align=PP_ALIGN.CENTER)
# close
s=prs.slides.add_slide(prs.slide_layouts[6]);s.background.fill.solid();s.background.fill.fore_color.rgb=rgb('forest')
text(s,.9,1.0,11.4,.3,'FLUENTSPRING  /  C6',12,'lime',True,align=PP_ALIGN.CENTER)
text(s,1.0,2.0,11.3,1.2,'A first hello can open\na much bigger world.',38,'white',True,'Aptos Display',PP_ALIGN.CENTER)
text(s,1.1,4.65,11.1,.65,'Speak to connect.  Listen to include.',22,'lime',False,align=PP_ALIGN.CENTER)
text(s,2.0,6.5,9.3,.35,'QUESTIONS & CLASS DISCUSSION',12,'white',True,align=PP_ALIGN.CENTER)
prs.core_properties.title='FluentSpring C6 — First Hello';prs.core_properties.subject='15-minute ELT lesson presentation';prs.core_properties.author='FluentSpring English Practice Lab'
prs.save(OUT)
# Reopen and verify slide count and required language.
check=Presentation(OUT);assert len(check.slides)==11,len(check.slides)
alltext='\n'.join(sh.text for sl in check.slides for sh in sl.shapes if sh.has_text_frame)
for phrase in ['First','15 minutes','Bangladesh','Exit ticket','rule-based','lesson-test.js']:
 assert phrase.lower() in alltext.lower(),phrase
print(f'Created {OUT}: {len(check.slides)} slides; slide text verified.')
