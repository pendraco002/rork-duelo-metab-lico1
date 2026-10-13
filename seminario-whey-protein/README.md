# Seminário de Tecnologia de Alimentos: Whey Protein Concentrado (Grupo 1)

Centro Universitário Augusto Motta · Nutrição · Módulo 4 (Qualidade na Produção de Refeições) · Prof. Caio Leonor
Integrantes: Bruna, Thiago, Gabriel, Renan e Pedro · Envio no AVA: 26/10 a 30/10 · Apresentação: 05/11

## Arquivos para usar

| Arquivo | Para quê |
|---|---|
| `Dossie_Pesquisa_Whey_Protein_Concentrado.pdf` | Toda a pesquisa (22 páginas), para mandar no grupo. Segue os 6 tópicos pedidos pelo professor. Também traz perguntas prováveis, divisão das falas, glossário e referências. |
| `Apresentacao_Whey_Protein_Concentrado.pdf` | **Slides (21)** em PDF, prontos para apresentar e enviar no AVA. |
| `Apresentacao_Whey_Protein_Concentrado.pptx` | Os mesmos slides em PowerPoint, com o **roteiro de fala** de cada pessoa nas anotações. |
| `fluxograma_whey_concentrado.png` | Fluxograma completo em imagem. |

## Antes de entregar (checklist)

1. Conferir os números do rótulo nos slides 8 e 9 com a embalagem real (exemplo usado: Growth WPC 80%, porção de 30 g). Se o produto for outro, trocar os números.
2. Se quiserem, colocar também a foto do rótulo no slide 8 do PPTX (Inserir > Imagem).
3. Completar o nome dos autores dos estudos de repositório (UFMG, FPS, UFV), no padrão ABNT.
4. Ensaiar para caber em **10 minutos**, com cerca de 2 minutos por pessoa (sugestão na seção 7 do dossiê).

## Como gerar de novo (para quem mexer no código)

Os arquivos são gerados a partir de `src/dossie.html` e `src/slides.html`:

```bash
NODE_PATH=$(npm root -g) node seminario-whey-protein/src/build.mjs
```

Precisa de: Node com Playwright (Chromium), `pdfunite` (poppler) e Python com `python-pptx` e `Pillow`.

Identidade visual dos slides: creme de leite, tinta, azul cobalto e verde-amarelo "soro" (a cor real do soro, pela riboflavina). Fontes Inter Tight, Instrument Serif e JetBrains Mono (licença OFL, em `src/fonts/`).
