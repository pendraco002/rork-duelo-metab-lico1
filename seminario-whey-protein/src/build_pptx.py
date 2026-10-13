"""Monta o PPTX a partir das imagens dos slides (geradas pelo build.mjs).

Cada slide é uma imagem em tela cheia + anotações do apresentador.
No slide do rótulo fica um quadro editável para inserir a foto real.
"""
import json
import os
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Emu, Pt

HERE = os.path.dirname(os.path.abspath(__file__))
TMP = os.path.join(HERE, ".tmp")
OUT = os.path.join(os.path.dirname(HERE), "Apresentacao_Whey_Protein_Concentrado.pptx")

W, H = 1280, 720
SW, SH = Emu(12192000), Emu(6858000)  # 16:9
px = lambda v, total_px, total_emu: Emu(int(v / total_px * total_emu))

NOTES = {
    1: "[Bruna] Apresentar o grupo e o tema: whey protein concentrado (WPC), a proteína do soro do leite que virou suplemento.",
    2: "[Bruna] Roteiro: seguimos os 6 tópicos pedidos — caracterização, composição e rótulo, fluxograma, efeitos do processamento, segurança e conservação, análise crítica.",
    3: "[Bruna] O soro é o líquido que sobra no queijo (~9 L para cada 10 L de leite). Tem pouca proteína, mas de alto valor. O WPC tira água, lactose e minerais até 25–89% de proteína; o WPC80 é o dos suplementos. WPI (≥90%) e WPH (hidrolisado) são variações.",
    4: "[Bruna] Classificação: suplemento alimentar (RDC 243/2018), com notificação obrigatória na ANVISA (RDC 843/2024). Como ingrediente, é produto lácteo (MAPA). Saborizado é ultraprocessado (NOVA). Consumo: 59% dos lares com usuário de suplemento (ABIAD 2020) — dado de suplementos em geral, não só whey.",
    5: "[Thiago] WPC80: ~80% de proteína em base seca, 4–10% de lactose. Por isso 30 g dão ~23 g de proteína, não 24 g. Frações: β-lactoglobulina é a maior. PDCAAS 1,0, rico em leucina; ISSN recomenda 20–40 g de proteína por dose.",
    6: "[Thiago] Separar o que o rótulo diz do que interpretamos. 23 g de proteína em 30 g = 76,7%; ~75% das calorias vêm da proteína; sem lupa porque não passa dos limites. Mostrar alergênicos, 'contém lactose' e as advertências da RDC 243/2018. (Trocar números se o rótulo fotografado for outro.)",
    7: "[Gabriel] Parte A, no laticínio: recepção e resfriamento do soro, clarificação, desnate, pasteurização (PCC), ultrafiltração e diafiltração (concentram a proteína), secagem por atomização, aglomeração, peneira e detector de metais (PCC).",
    8: "[Gabriel] Parte B, na indústria de suplementos: recepção, pesagem, mistura com sabor e aditivos, detector de metais, envase, rotulagem e estoque. Destacar: a gota no spray dryer fica fria enquanto evapora. Variações: WPI, WPH, proteína nativa.",
    9: "[Renan] Efeitos por tipo, sempre dizendo do que dependem. Mensagem principal: desnaturar não é perder valor nutricional; a reação de Maillard é que reduz a lisina disponível.",
    10: "[Renan] Perigos biológicos, químicos e físicos e seus controles. PCCs: pasteurização e detector de metais. Salmonella e Cronobacter não crescem no pó, mas sobrevivem — por isso a higiene da área seca é essencial.",
    11: "[Renan] Conservação: umidade causa empedramento (transição vítrea da lactose); calor acelera Maillard; oxigênio e luz oxidam a gordura. Embalagem com barreira e dicas para o consumidor.",
    12: "[Pedro] Mercado: estudo da UFMG com 88% das marcas com erro de rótulo e uma com proteína 35% abaixo da tolerância; Recife: só 2 de 14 conformes; ANVISA 2025 suspendeu lote com glúten não declarado. Explicar amino spiking.",
    13: "[Pedro] Vantagens e limitações, considerando frequência, contexto, lactose e o debate sobre ultraprocessados — sem classificações simplistas.",
    14: "[Pedro] Posicionamento: nem vilão, nem indispensável. Pode entrar como complemento quando há necessidade real, com nutricionista e produto regularizado.",
    15: "Referências (legislação e estudos brasileiros).",
    16: "Referências (artigos e livros).",
    17: "Agradecer e abrir para perguntas. Respostas prontas na seção 7 do dossiê.",
}

prs = Presentation()
prs.slide_width, prs.slide_height = SW, SH
blank = prs.slide_layouts[6]

slot = json.load(open(os.path.join(TMP, "label_slot.json")))
pngs = sorted(f for f in os.listdir(os.path.join(TMP, "slides")) if f.endswith(".png"))

for i, name in enumerate(pngs, start=1):
    s = prs.slides.add_slide(blank)
    jpg = os.path.join(TMP, "slides", name[:-4] + ".jpg")
    Image.open(os.path.join(TMP, "slides", name)).convert("RGB").resize((1920, 1080), Image.LANCZOS).save(jpg, quality=88, optimize=True)
    s.shapes.add_picture(jpg, 0, 0, SW, SH)
    if i == slot["slide"]:
        box = s.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            px(slot["x"], W, SW), px(slot["y"], H, SH), px(slot["w"], W, SW), px(slot["h"], H, SH),
        )
        box.adjustments[0] = 0.07
        box.fill.solid()
        box.fill.fore_color.rgb = RGBColor(0x2A, 0x0E, 0x6B)
        box.line.color.rgb = RGBColor(0xD8, 0xB4, 0xFE)
        box.line.width = Pt(1.5)
        tf = box.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        lines = [("FOTO DO RÓTULO", True, 16), ("Inserir > Imagem com a foto do produto analisado e apagar este quadro.", False, 11)]
        for j, (txt, bold, size) in enumerate(lines):
            p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
            p.alignment = PP_ALIGN.CENTER
            r = p.add_run()
            r.text = txt
            r.font.bold = bold
            r.font.size = Pt(size)
            r.font.color.rgb = RGBColor(0xF5, 0xF3, 0xFF)
    s.notes_slide.notes_text_frame.text = NOTES.get(i, "")

prs.save(OUT)
print("pptx:", OUT, len(pngs), "slides")
