"""
Capturas da página em larguras de referência.

Uso (com o servidor rodando):
    npm run build && npx next start -p 3100
    python tests/capturas.py --url http://localhost:3100 --out tests/artifacts

Usa o Edge ou o Chrome instalados (channel), sem baixar navegador.
"""

import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright

LARGURAS = [(360, 780), (390, 844), (768, 1024), (1440, 900)]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:3100")
    parser.add_argument("--out", default="tests/artifacts")
    parser.add_argument("--channel", default="msedge")
    parser.add_argument("--path", default="/")
    args = parser.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel=args.channel, headless=True)
        for largura, altura in LARGURAS:
            # 1) primeira dobra com animações concluídas
            ctx = browser.new_context(viewport={"width": largura, "height": altura}, device_scale_factor=1)
            page = ctx.new_page()
            page.goto(args.url + args.path, wait_until="networkidle")
            page.wait_for_timeout(1400)
            page.screenshot(path=str(out / f"dobra-{largura}.png"))
            overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            print(f"{largura}px: rolagem horizontal = {overflow}px")
            ctx.close()

            # 2) página inteira sem animações (reduced motion mostra todo o conteúdo)
            ctx = browser.new_context(
                viewport={"width": largura, "height": altura}, device_scale_factor=1, reduced_motion="reduce"
            )
            page = ctx.new_page()
            page.goto(args.url + args.path, wait_until="networkidle")
            # rola até o fim para carregar as imagens com loading="lazy"
            page.evaluate(
                """async () => {
                    for (let y = 0; y < document.body.scrollHeight; y += 600) {
                        window.scrollTo(0, y);
                        await new Promise((r) => setTimeout(r, 60));
                    }
                    window.scrollTo(0, 0);
                }"""
            )
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(500)
            page.screenshot(path=str(out / f"pagina-{largura}.png"), full_page=True)
            ctx.close()
        browser.close()


if __name__ == "__main__":
    main()
