# Seminário de Tecnologia de Alimentos: Whey Protein Concentrado (Grupo 1)

Centro Universitário Augusto Motta · Nutrição · Módulo 4 (Qualidade na Produção de Refeições) · Prof. Caio Leonor
Integrantes: Bruna, Thiago, Gabriel, Renan e Pedro · Envio no AVA: 26/10 a 30/10 · Apresentação: 05/11

## Arquivos para usar

| Arquivo | Para quê |
|---|---|
| `Dossie_Pesquisa_Whey_Protein_Concentrado.pdf` | Toda a pesquisa (22 páginas), para mandar no grupo. Segue os 6 tópicos pedidos pelo professor. Também traz perguntas prováveis, divisão das falas, glossário e referências. |
| `Apresentacao_Whey_Protein_Concentrado.pptx` | Slides (17) com anotações do apresentador. O slide 6 tem um quadro para colocar a **foto do rótulo**. |
| `Apresentacao_Whey_Protein_Concentrado.pdf` | Os mesmos slides em PDF, prontos para ver ou enviar. |
| `fluxograma_whey_concentrado.png` | Fluxograma completo em imagem. |

## Antes de entregar (checklist)

1. **Fotografar o rótulo** de um whey concentrado e colocar a foto no slide 6 do PPTX.
2. Conferir os números do rótulo no slide 6 (exemplo usado: Growth WPC 80%, porção de 30 g). Se o produto for outro, trocar os números.
3. Completar o nome dos autores dos estudos de repositório (UFMG, FPS, UFV), no padrão ABNT.
4. Ensaiar para caber em **10 minutos**, com cerca de 2 minutos por pessoa (sugestão na seção 7 do dossiê).

## Como gerar de novo (para quem mexer no código)

Os arquivos são gerados a partir de `src/dossie.html` e `src/slides.html`:

```bash
NODE_PATH=$(npm root -g) node seminario-whey-protein/src/build.mjs
```

Precisa de: Node com Playwright (Chromium), `pdfunite` (poppler) e Python com `python-pptx` e `Pillow`.
