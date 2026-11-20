"""
Prepara os ativos públicos do site a partir dos arquivos originais da Metodaria.

O PDF completo NUNCA é copiado para o projeto: o script só renderiza as páginas
listadas em PAGINAS_AMOSTRA e grava imagens em public/amostra/.

Uso (na raiz do projeto):
    python scripts/preparar-ativos.py \
        --pdf "C:/caminho/Guia_Gestao_de_Trafego_Metodaria.pdf" \
        --capa "C:/caminho/capa-vertical.png" \
        --icone "C:/caminho/10_favicon_512.png" \
        --fonte "C:/caminho/Montserrat[wght].ttf"

Requisitos: pip install pymupdf pillow
Ao mudar PAGINAS_AMOSTRA, atualize também src/content/guia.ts (amostra).
"""

from __future__ import annotations

import argparse
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
PAGINAS_AMOSTRA = [2, 37]  # numeração do PDF (1 = capa)
DPI_AMOSTRA = 170

FUNDO = (8, 8, 8)
TEXTO = (245, 245, 245)
TEXTO_2 = (168, 168, 168)
ARCO = (34, 35, 38)


def renderizar_amostra(pdf: Path) -> None:
    destino = RAIZ / "public" / "amostra"
    destino.mkdir(parents=True, exist_ok=True)
    with pymupdf.open(pdf) as doc:
        for numero in PAGINAS_AMOSTRA:
            pagina = doc[numero - 1]
            pix = pagina.get_pixmap(dpi=DPI_AMOSTRA, alpha=False)
            arquivo = destino / f"pagina-{numero:02d}.png"
            img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            img.save(arquivo, optimize=True)
            print(f"amostra: {arquivo.relative_to(RAIZ)} ({pix.width}x{pix.height})")


def copiar_capa(capa: Path) -> Image.Image:
    destino = RAIZ / "public" / "capa"
    destino.mkdir(parents=True, exist_ok=True)
    img = Image.open(capa).convert("RGB")
    arquivo = destino / "guia-trafego-pago.png"
    img.save(arquivo, optimize=True)
    print(f"capa: {arquivo.relative_to(RAIZ)} ({img.width}x{img.height})")
    return img


def gerar_icones(icone: Path) -> None:
    app = RAIZ / "src" / "app"
    img = Image.open(icone).convert("RGB")
    img.resize((512, 512), Image.LANCZOS).save(app / "icon.png", optimize=True)
    img.resize((180, 180), Image.LANCZOS).save(app / "apple-icon.png", optimize=True)
    print("ícones: src/app/icon.png, src/app/apple-icon.png")


def fonte(caminho: Path, tamanho: int, peso: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(caminho), tamanho)
    try:
        f.set_variation_by_axes([peso])
    except OSError:
        pass
    return f


def gerar_open_graph(capa: Image.Image, caminho_fonte: Path) -> None:
    largura, altura = 1200, 630
    og = Image.new("RGB", (largura, altura), FUNDO)
    desenho = ImageDraw.Draw(og)

    # Arco largo, como o da capa, cortado pela borda.
    desenho.arc((520, 250, 1640, 1370), start=180, end=300, fill=ARCO, width=70)

    # Capa com sombra suave.
    alt_capa = 530
    larg_capa = round(capa.width * alt_capa / capa.height)
    capa_r = capa.resize((larg_capa, alt_capa), Image.LANCZOS)
    x_capa, y_capa = largura - larg_capa - 90, (altura - alt_capa) // 2
    sombra = Image.new("L", (largura, altura), 0)
    ImageDraw.Draw(sombra).rectangle(
        (x_capa + 14, y_capa + 24, x_capa + larg_capa + 14, y_capa + alt_capa + 24), fill=150
    )
    sombra = sombra.filter(ImageFilter.GaussianBlur(26))
    og.paste(Image.new("RGB", (largura, altura), (0, 0, 0)), (0, 0), sombra)
    og.paste(capa_r, (x_capa, y_capa))

    desenho = ImageDraw.Draw(og)
    margem = 72
    desenho.text((margem, 70), "METODARIA", font=fonte(caminho_fonte, 24, 800), fill=TEXTO)
    desenho.line((margem, 112, x_capa - 56, 112), fill=(60, 60, 60), width=1)

    titulo = fonte(caminho_fonte, 62, 800)
    desenho.text((margem, 190), "Antes de", font=titulo, fill=TEXTO)
    desenho.text((margem, 262), "impulsionar,", font=titulo, fill=TEXTO)
    desenho.text((margem, 334), "tenha um plano.", font=titulo, fill=TEXTO)

    apoio = fonte(caminho_fonte, 26, 500)
    desenho.text((margem, 452), "Guia de Tráfego Pago em PDF", font=apoio, fill=TEXTO)
    desenho.text(
        (margem, 492), "53 páginas · exercícios e checklists", font=apoio, fill=TEXTO_2
    )

    arquivo = RAIZ / "src" / "app" / "opengraph-image.png"
    og.save(arquivo, optimize=True)
    (RAIZ / "src" / "app" / "opengraph-image.alt.txt").write_text(
        "Capa do Guia de Tráfego Pago da Metodaria ao lado da frase "
        "Antes de impulsionar, tenha um plano.",
        encoding="utf-8",
    )
    print(f"open graph: {arquivo.relative_to(RAIZ)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--capa", type=Path, required=True)
    parser.add_argument("--icone", type=Path, required=True)
    parser.add_argument("--fonte", type=Path, required=True)
    args = parser.parse_args()

    renderizar_amostra(args.pdf)
    capa = copiar_capa(args.capa)
    gerar_icones(args.icone)
    gerar_open_graph(capa, args.fonte)


if __name__ == "__main__":
    main()
