from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

out='FluentSpring_C6_Class_Explanation.docx'
doc=Document()
sec=doc.sections[0]
sec.top_margin=Inches(.65);sec.bottom_margin=Inches(.65);sec.left_margin=Inches(.78);sec.right_margin=Inches(.78)
styles=doc.styles
styles['Normal'].font.name='Aptos';styles['Normal'].font.size=Pt(10.5);styles['Normal'].font.color.rgb=RGBColor(49,70,60)
for s,size,color in [('Title',30,'173A35'),('Heading 1',20,'173A35'),('Heading 2',14,'607E49'),('Heading 3',11,'244B43')]:
 st=styles[s];st.font.name='Aptos Display';st.font.size=Pt(size);st.font.bold=True;st.font.color.rgb=RGBColor.from_string(color)

def shade(cell,fill):
 tcPr=cell._tc.get_or_add_tcPr(); shd=OxmlElement('w:shd');shd.set(qn('w:fill'),fill);tcPr.append(shd)
def set_cell_text(cell,text,bold=False,color='244B43'):
 cell.text='';p=cell.paragraphs[0];p.paragraph_format.space_after=Pt(3);r=p.add_run(text);r.bold=bold;r.font.size=Pt(9.5);r.font.color.rgb=RGBColor.from_string(color)
def bullet(text): doc.add_paragraph(text,style='List Bullet')
def para(text): doc.add_paragraph(text)

p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.paragraph_format.space_after=Pt(4)
r=p.add_run('FLUENTSPRING  /  C6 SPEAKING LAB');r.bold=True;r.font.size=Pt(10);r.font.color.rgb=RGBColor.from_string('718B55')
p=doc.add_paragraph(style='Title');p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run('First Hello')
p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;r=p.add_run('Introducing Yourself and Others');r.bold=True;r.font.size=Pt(16);r.font.color.rgb=RGBColor.from_string('244B43')
p=doc.add_paragraph();p.alignment=WD_ALIGN_PARAGRAPH.CENTER;p.add_run('A 15-minute interactive English lesson for A1–A2 learners').italic=True

t=doc.add_table(rows=1,cols=3);t.autofit=False
for c,w in zip(t.columns,[2.25,2.25,2.25]):c.width=Inches(w)
for i,(label,value) in enumerate([('AUDIENCE','University English learners'),('SETTING','Bangladeshi campus club fair'),('MAIN OUTCOME','Greet · introduce · invite')]):
 cell=t.rows[0].cells[i];shade(cell,'E9EEDF');cell.text='';p=cell.paragraphs[0];p.alignment=WD_ALIGN_PARAGRAPH.CENTER;r=p.add_run(label+'\n');r.bold=True;r.font.size=Pt(8);r.font.color.rgb=RGBColor.from_string('718B55');r=p.add_run(value);r.font.size=Pt(10);r.font.color.rgb=RGBColor.from_string('173A35')

doc.add_heading('The lesson at a glance: six stages',level=1)
para('Learners arrive at a university club fair and help a new student, Nila, feel welcome. After a short warm-up and a phrase toolkit, the main activity is a fifteen-minute role-play in four timed rounds: greeting Nila, finding common ground, introducing their friend Rafi, and inviting Nila to join them. The lesson closes with an exit ticket.')

t=doc.add_table(rows=1,cols=3);t.style='Light Shading Accent 1'
for cell,text in zip(t.rows[0].cells,['Time','Lesson stage','What learners do / evidence']):set_cell_text(cell,text,True,'FFFFFF');shade(cell,'244B43')
rows=[('2 min','Stage 1 · Warm-up','Choose a welcoming opener at the club fair and explain why it works.'),('2 min','Stage 2 · Delivery','Notice the four moves and identify the phrase that introduces another person.'),('6 min','Stage 3 · Guided practice','Rounds 1–2 of the role-play: criteria, starters and a model line support each line.'),('9 min','Stage 4 · Main task','Rounds 3–4: introduce Rafi and invite Nila with less support.'),('1 min','Stage 5 · Review','Three quick decisions about the conversation, with a reason for each answer.'),('2 min','Stage 6 · Feedback','Role-play report plus exit-ticket score and next steps.')]
for row in rows:
 cells=t.add_row().cells
 for cell,text in zip(cells,row):set_cell_text(cell,text)

doc.add_heading('Learning outcomes',level=1)
para('By the end of the lesson, learners can:')
for text in ['Open a brief interaction with a context-appropriate greeting and introduce themselves.','Add one personal or shared-context detail to help the other person respond.','Introduce another person by name and relationship, then ask an open follow-up question.','Choose language that is welcoming, respects people’s choices, and avoids assumptions.']:bullet(text)

doc.add_heading('Language learners practise',level=1)
for title,example in [('Open','“Hi, I’m Tania.”'),('Connect','“I’m studying business.”'),('Introduce','“Nila, this is my friend Rafi.”'),('Invite','“What are you interested in?”')]:
 p=doc.add_paragraph();p.paragraph_format.space_after=Pt(3);r=p.add_run(title+'  ');r.bold=True;r.font.color.rgb=RGBColor.from_string('607E49');p.add_run(example)

doc.add_heading('How engagement and assessment work',level=1)
for text in ['The main practice is a fifteen-minute role-play driven by a visible countdown timer and four timed rounds.','Each round states three role-play criteria before the learner writes, so the target is visible, not a guessing game.','Nila and Rafi answer each line in dialogue, so learners see the conversation respond to their choices.','Every round is scored on its three criteria; missed criteria produce a specific fix rather than a grade alone.','The closing role-play report shows 12 points of evidence, the learner\u2019s own lines, and two next steps.','The exit ticket adds two selected-response checks and a short written introduction as a second source of evidence.']:bullet(text)

doc.add_heading('Context, inclusion, and responsible technology',level=1)
para('The setting is a university club fair, with familiar campus activities, student societies, a library study group, and a cultural evening as practice contexts. Learners may greet someone in Bangla before switching to English for practice; language choice should include people, not test their background. The lesson reminds learners to use a person’s stated name and pronouns, avoid assumptions, and give both people space to speak.')
para('The assessment feedback is a small, rule-based teaching aid that runs in the browser. It is not a generative AI model or a substitute for teacher judgement. No learner response is uploaded or saved. Speech uses browser/device text-to-speech when available; text interaction remains usable without speech. The speaking voice depends on installed system voices.')

doc.add_heading('How to run the lesson',level=1)
para('Open index.html in a current browser, or run “node server.js” from the project folder and visit http://127.0.0.1:4173. Start the 15-minute timer when the class begins. “More practice” is an optional extension and is not included in the core 15-minute timing.')

doc.add_heading('Suggested teacher introduction',level=1)
para('“Today we’ll practise making a new person feel welcome. Imagine we are at a university club fair. You do not need perfect English: start with a greeting, share one small detail, introduce someone by name, and ask a question that gives the other person a choice to join in.”')

footer=sec.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.CENTER;r=footer.add_run('FluentSpring · C6 Introducing Yourself and Others · Class explanation');r.font.size=Pt(8);r.font.color.rgb=RGBColor.from_string('7A887C')
doc.save(out)
# Reopen to verify deliverable content.
check=Document(out)
text='\n'.join(p.text for p in check.paragraphs)+'\n'+'\n'.join(c.text for table in check.tables for row in table.rows for c in row.cells)
for required in ['First Hello','Learning outcomes','Exit ticket','Bangla','not a generative AI model','15-minute']:
 assert required.lower() in text.lower(),f'Missing expected guide content: {required}'
print(f'Created and verified {out}: {len(check.paragraphs)} paragraphs, {len(check.tables)} tables')
