from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "social-cards"
W, H = 1448, 1086
FOREST, IVORY, COPPER = "#09150F", "#F3F0E6", "#B66D24"
LIGHT, INK, OLIVE = "#D39A57", "#111B25", "#33472E"
SAGE, BORDER = "#647067", "#C6CCC6"
FONT = r"C:\Windows\Fonts\arial.ttf"
BOLD = r"C:\Windows\Fonts\arialbd.ttf"
SERIF = r"C:\Windows\Fonts\bahnschrift.ttf"
SERIF_BOLD = r"C:\Windows\Fonts\bahnschrift.ttf"

def ft(size, bold=False, serif=False):
    p = BOLD if bold else SERIF if serif else FONT
    return ImageFont.truetype(p, size)

def wrap(draw, text, face, width):
    out, line = [], ""
    for word in text.split():
        candidate = (line + " " + word).strip()
        if draw.textbbox((0,0), candidate, font=face)[2] <= width:
            line = candidate
        else:
            if line: out.append(line)
            line = word
    if line: out.append(line)
    return out

def para(draw, xy, text, face, color, width, gap=8):
    x,y=xy
    for line in wrap(draw,text,face,width):
        draw.text((x,y),line,font=face,fill=color)
        y += face.size + gap
    return y

def pill(draw, box, fill, outline=None, radius=18, width=1):
    draw.rounded_rectangle(box,radius=radius,fill=fill,outline=outline,width=width)

def label(draw, x, y, text, color=LIGHT):
    draw.text((x,y),text.upper(),font=ft(17,True),fill=color)

def footer(im, page):
    d=ImageDraw.Draw(im)
    d.line((66,1000,150,1000),fill=COPPER,width=4)
    d.text((66,1019),"DOCUMENT Q&A  /  PORTFOLIO PROJECT",font=ft(15,True),fill="#B9C4BA")
    d.text((1320,1019),page,font=ft(15,True),fill=LIGHT)

def frame(page,title,sub):
    im=Image.new("RGBA",(W,H),FOREST)
    d=ImageDraw.Draw(im)
    label(d,68,59,"DOCUMENT Q&A ASSISTANT")
    d.line((68,100,140,100),fill=COPPER,width=4)
    d.text((68,126),title,font=ft(48,True,True),fill=IVORY)
    para(d,(70,195),sub,ft(23), "#C7D1C7",1160,8)

    footer(im,page)
    return im

def node(d,box,title,desc,accent=COPPER):
    x1,y1,x2,y2=box
    pill(d,box,IVORY,outline="#DCE0D7",radius=18,width=2)
    d.rounded_rectangle((x1,y1,x1+8,y2),radius=4,fill=accent)
    d.text((x1+24,y1+15),title,font=ft(23,True),fill=INK)
    para(d,(x1+24,y1+51),desc,ft(16),SAGE,x2-x1-42,4)

def arrow(d,a,b,color=LIGHT):
    d.line((a,b),fill=color,width=4)
    x,y=b
    ang=math.atan2(y-a[1],x-a[0])
    p2=(x-14*math.cos(ang-.5),y-14*math.sin(ang-.5))
    p3=(x-14*math.cos(ang+.5),y-14*math.sin(ang+.5))
    d.polygon([b,p2,p3],fill=color)

def cover():
    im=Image.new("RGBA",(W,H),FOREST)
    d=ImageDraw.Draw(im)
    label(d,68,59,"PORTFOLIO  /  APPLIED AI")
    pill(d,(66,95,370,146),None,COPPER,25,2)
    d.text((87,110),"KNOWLEDGE ASSISTANT",font=ft(15,True),fill=IVORY)

    d.text((66,197),"Document Q&A",font=ft(112,True,True),fill=IVORY)
    d.text((70,335),"Answers from your",font=ft(42,True),fill=IVORY)
    d.text((70,391),"knowledge base",font=ft(42,True),fill=IVORY)
    para(d,(72,465),"A document assistant combining PDF ingestion, semantic retrieval, and Telegram conversations.",ft(23),"#C7D1C7",760,8)
    pill(d,(900,210,1377,570),"#10251A","#34513C",26,2)
    label(d,936,242,"QUESTION  →  CONTEXT  →  ANSWER")
    node(d,(936,303,1138,397),"PDF","Guides and policies")
    node(d,(1158,303,1340,397),"Chroma","Search")
    arrow(d,(1142,350),(1152,350))
    node(d,(1048,443,1248,537),"Gemini","Answer generation")
    arrow(d,(1250,399),(1215,435))
    arrow(d,(1048,440),(1048,403))
    pill(d,(66,628,1382,900),IVORY,radius=24)
    cols=[("01","React Admin","Manage categories and documents"),
          ("02","FastAPI service","Coordinates files, users, and questions"),
          ("03","Telegram Bot","Conversational access")]
    for i,(n,t,desc) in enumerate(cols):
        x=104+i*420
        d.text((x,674),n,font=ft(25,True),fill=COPPER)
        d.text((x,721),t,font=ft(30,True,True),fill=INK)
        para(d,(x,773),desc,ft(17),SAGE,300,5)
        if i<2: d.line((x+354,672,x+354,849),fill=BORDER,width=2)
    d.line((66,948,160,948),fill=COPPER,width=4)
    d.text((66,968),"React  ·  FastAPI  ·  Chroma  ·  Gemini  ·  Telegram",font=ft(18),fill="#C7D1C7")
    footer(im,"00")
    im.convert("RGB").save(OUT/"cover.png",quality=95)

def insight1():
    im=frame("01","From PDF to a question","A preparation pipeline turns documents into searchable context.")
    d=ImageDraw.Draw(im)
    xs=[68,350,632,914,1196]
    vals=[("PDF","Source PDF"),("Text","Text extraction"),("Chunks","Chunking"),("Vectors","Vector indexing"),("Top 5","Retrieval")]
    for i,(x,(a,b)) in enumerate(zip(xs,vals)):
        node(d,(x,374,x+194,524),a,b)
        if i<4: arrow(d,(x+201,449),(xs[i+1]-12,449))
    pill(d,(68,605,1380,850),"#10251A","#34513C",22,2)
    label(d,106,643,"HOW IT WORKS")
    para(d,(106,695),"Search is scoped to a topic and subtopic. Relevant text chunks are retrieved before the language model generates an answer.",ft(23),IVORY,1190,10)
    im.convert("RGB").save(OUT/"insight-01.png",quality=95)

def insight2():
    im=frame("02","One admin console, one chat channel","The admin console manages the knowledge base; Telegram provides a simple question-and-answer channel.")
    d=ImageDraw.Draw(im)
    node(d,(70,365,405,510),"React Admin","Categories, PDFs, and text chunks")
    node(d,(555,365,890,510),"FastAPI service","Authentication and REST operations")
    node(d,(1040,365,1375,510),"Telegram","Guided topics and questions")
    arrow(d,(410,437),(548,437)); arrow(d,(897,437),(1033,437))
    node(d,(180,652,510,790),"SQL + MongoDB","Metadata and user accounts",OLIVE)
    node(d,(560,652,890,790),"Redis","Conversation state",OLIVE)
    node(d,(970,652,1300,790),"Chroma","Vector search index",OLIVE)
    arrow(d,(650,518),(390,644)); arrow(d,(720,518),(720,644)); arrow(d,(800,518),(1135,644))
    d.text((72,858),"The architecture separates content management, chat, and data storage.",font=ft(21),fill="#C7D1C7")
    im.convert("RGB").save(OUT/"insight-02.png",quality=95)

def insight3():
    im=frame("03","Retrieval narrows the context","Each query is scoped to a selected topic and subtopic; retrieval returns up to five relevant chunks.")
    d=ImageDraw.Draw(im)
    pill(d,(68,352,865,840),IVORY,radius=24)
    label(d,106,386,"QUESTION  /  SELECTED TOPIC",COPPER)
    d.text((106,430),"What is the process?",font=ft(29,True,True),fill=INK)
    d.line((106,490,820,490),fill=BORDER,width=2)
    for i,w in enumerate((646,580,518,454,378),1):
        y=524+(i-1)*49
        pill(d,(106,y,106+w,y+32),"#E2E6D8",radius=8)
        d.text((122,y+5),"Retrieved text chunk  0"+str(i),font=ft(15,True),fill=OLIVE)
    pill(d,(919,352,1380,840),"#10251A","#34513C",24,2)
    label(d,960,389,"ANSWER")
    d.text((960,454),"Gemini",font=ft(40,True,True),fill=IVORY)
    para(d,(960,520),"Uses the retrieved context to compose an answer and sends it through Telegram.",ft(21),"#C7D1C7",360,10)
    d.line((960,682,1300,682),fill=COPPER,width=3)
    para(d,(960,705),"The Telegram message does not display citations to the retrieved source chunks.",ft(16),"#C7D1C7",360,6)
    im.convert("RGB").save(OUT/"insight-03.png",quality=95)

if __name__=="__main__":
    OUT.mkdir(parents=True,exist_ok=True)
    for render in (cover,insight1,insight2,insight3):
        render()






