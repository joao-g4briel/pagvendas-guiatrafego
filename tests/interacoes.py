"""
Testes de interação da página (Playwright, Python).

Uso, com o build de produção rodando:
    npx next start -p 3100
    python tests/interacoes.py --url http://localhost:3100

Para o cenário de vendas fechadas, rode outra instância com checkout inválido e passe --closed:
    NEXT_PUBLIC_CHECKOUT_URL=desativado npx next dev -p 3200
    python tests/interacoes.py --url http://localhost:3200 --closed

Nenhuma compra é feita: a navegação para o checkout é interceptada e respondida localmente.
"""

import argparse
import sys

from playwright.sync_api import Page, expect, sync_playwright

CHECKOUT = "https://pay.cakto.com.br/tsduujj_1343853"
resultados: list[tuple[bool, str]] = []


def check(ok: bool, nome: str) -> None:
    resultados.append((ok, nome))
    print(("OK   " if ok else "FALHA") + "  " + nome)


def coletar_erros(page: Page, erros: list[str]) -> None:
    page.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: erros.append(str(e)))


def desktop(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    erros: list[str] = []
    coletar_erros(page, erros)
    page.goto(url, wait_until="networkidle")

    # CTAs de compra: todos com a mesma URL, links HTML válidos, mesma aba
    ctas = page.locator("a[data-checkout-cta]")
    hrefs = ctas.evaluate_all("els => els.map(e => [e.dataset.checkoutCta, e.getAttribute('href'), e.target])")
    locais = sorted({h[0] for h in hrefs})
    check(all(h[1] == CHECKOUT for h in hrefs), f"{len(hrefs)} links de compra apontam para {CHECKOUT}")
    check(all(not h[2] for h in hrefs), "links de compra abrem na mesma aba (sem target)")
    check(
        {"header", "hero", "offer", "final", "menu"}.issubset(set(locais)),
        f"CTAs presentes em cabeçalho, menu, hero, oferta e final ({', '.join(locais)})",
    )
    previa = page.get_by_role("link", name="Ver uma prévia")
    check(previa.get_attribute("href") == "#previa", "“Ver uma prévia” leva à seção #previa, não ao checkout")
    navs = page.locator("nav[aria-label=Principal] a").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    check(navs == ["/#conteudo", "/#previa", "/#duvidas"], f"navegação do cabeçalho: {navs}")

    # H1 único
    check(page.locator("h1").count() == 1, "a página tem um único H1")

    # Calculadora com o exercício do Anexo B: 200 / 120 / 30 -> CPA 50, ROAS 4
    inputs = page.locator("input[inputmode=decimal]")
    inputs.nth(0).fill("200")
    inputs.nth(1).fill("120")
    inputs.nth(2).fill("30")
    texto = page.locator("dl").first.inner_text().replace(" ", " ")
    check("R$ 80,00" in texto and "R$ 50,00" in texto and "4,00" in texto, "calculadora reproduz o gabarito do Anexo B")
    inputs.nth(1).fill("250")
    check("não sobra margem" in page.locator("[aria-live=polite]").first.inner_text(), "calculadora trata margem negativa")
    inputs.nth(1).fill("78")

    # Inclinação da capa com ponteiro preciso
    capa = page.locator("[data-tilt-zone] img").first
    antes = capa.evaluate("el => getComputedStyle(el.closest('[style*=perspective]')).transform")
    page.mouse.move(300, 300)
    page.mouse.move(1300, 200, steps=8)
    page.wait_for_timeout(700)
    depois = capa.evaluate("el => getComputedStyle(el.closest('[style*=perspective]')).transform")
    check(antes != depois, "capa inclina com o ponteiro no desktop")

    # FAQ
    faq = page.locator("#duvidas button[aria-expanded]").first
    faq.scroll_into_view_if_needed()
    faq.click()
    check(faq.get_attribute("aria-expanded") == "true", "FAQ abre (aria-expanded=true)")
    painel = page.locator("#" + faq.get_attribute("aria-controls"))
    page.wait_for_timeout(450)
    check(painel.bounding_box()["height"] > 20 and painel.get_attribute("inert") is None, "painel do FAQ visível e não inerte")
    faq.press("Enter")
    page.wait_for_timeout(450)
    check(faq.get_attribute("aria-expanded") == "false" and painel.get_attribute("inert") is not None, "FAQ fecha pelo teclado")

    # Sumário
    modulo = page.locator("#conteudo button[aria-expanded]").first
    modulo.scroll_into_view_if_needed()
    modulo.click()
    page.wait_for_timeout(450)
    check(page.get_by_text("Lição 1.3 Quanto você pode pagar por uma venda").is_visible(), "sumário abre o Módulo 01 com as lições")

    # Lightbox
    miniatura = page.locator("#previa button[aria-label^='Ampliar']").first
    miniatura.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    miniatura.click()
    dialog = page.locator("dialog.lightbox")
    expect(dialog).to_have_attribute("open", "")
    check("1 de 4" in page.locator("#lightbox-title").inner_text(), "lightbox abre na página 1 de 4")
    page.keyboard.press("ArrowRight")
    check("2 de 4" in page.locator("#lightbox-title").inner_text(), "seta direita avança")
    page.keyboard.press("ArrowLeft")
    page.keyboard.press("ArrowLeft")
    check("4 de 4" in page.locator("#lightbox-title").inner_text(), "seta esquerda volta e circula")
    for _ in range(6):
        page.keyboard.press("Tab")
    dentro = page.evaluate("document.activeElement.closest('dialog.lightbox') !== null")
    check(dentro, "Tab mantém o foco dentro do lightbox")
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    check(dialog.get_attribute("open") is None, "Escape fecha o lightbox")
    foco = page.evaluate("document.activeElement.getAttribute('aria-label')")
    check(bool(foco) and foco.startswith("Ampliar página 2:"), f"foco volta à miniatura que abriu o lightbox ({foco})")

    # Clique no CTA: mesma aba, URL exata, sem compra real (resposta local)
    page.route("https://pay.cakto.com.br/**", lambda route: route.fulfill(status=200, body="checkout interceptado"))
    paginas_antes = len(ctx.pages)
    page.locator("a[data-checkout-cta=offer]").scroll_into_view_if_needed()
    with page.expect_navigation():
        page.locator("a[data-checkout-cta=offer]").click()
    check(page.url == CHECKOUT, f"clique na oferta navega para o checkout na mesma aba ({page.url})")
    check(len(ctx.pages) == paginas_antes, "nenhuma aba nova foi aberta")

    check(not erros, f"sem erros no console ({len(erros)})" + ("" if not erros else ": " + erros[0][:120]))
    browser.close()


def mobile(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
    page = ctx.new_page()
    erros: list[str] = []
    coletar_erros(page, erros)
    page.goto(url, wait_until="networkidle")

    # Menu móvel
    toggle = page.get_by_role("button", name="Menu")
    check(toggle.get_attribute("aria-expanded") == "false", "menu começa fechado")
    toggle.click()
    page.wait_for_timeout(350)
    check(page.get_by_role("button", name="Fechar").get_attribute("aria-expanded") == "true", "menu abre")
    ativo = page.evaluate("document.activeElement.textContent")
    check(ativo.strip() == "Conteúdo", f"foco vai para o primeiro link do menu ({ativo.strip()})")
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    ativo = page.evaluate("document.activeElement.getAttribute('aria-controls') !== null")
    check(ativo, "Escape fecha o menu e devolve o foco ao botão")
    page.get_by_role("button", name="Menu").click()
    page.locator("nav[aria-label=Menu] a", has_text="Dúvidas").click()
    page.wait_for_timeout(900)
    check(page.get_by_role("button", name="Menu").get_attribute("aria-expanded") == "false", "clicar num link fecha o menu")

    # Barra de compra
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    page.wait_for_timeout(500)
    barra = page.locator("a[data-checkout-cta=mobile_bar]")
    check(barra.count() == 0, "barra móvel oculta no topo (hero visível)")
    page.evaluate("document.getElementById('conteudo').scrollIntoView({behavior: 'instant'})")
    page.wait_for_timeout(700)
    check(barra.count() == 1 and barra.is_visible(), "barra móvel aparece depois do hero")
    if barra.count():
        box = page.locator("a[data-checkout-cta=mobile_bar]").locator("xpath=ancestor::div[contains(@class,'fixed')]").bounding_box()
        check(box is not None and abs(box["y"] + box["height"] - 844) < 2, "barra fixa no rodapé da tela")
        check(barra.get_attribute("href") == CHECKOUT, "barra móvel usa a mesma URL de checkout")
    page.evaluate("document.getElementById('oferta').scrollIntoView({block: 'center', behavior: 'instant'})")
    page.wait_for_timeout(700)
    check(barra.count() == 0, "barra móvel some com a oferta visível")

    # Sem inclinação no toque
    zona = page.locator("[data-tilt-zone] [style*=perspective]").first
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    t1 = zona.evaluate("el => getComputedStyle(el).transform")
    page.touchscreen.tap(300, 900 - 200)
    page.wait_for_timeout(500)
    t2 = zona.evaluate("el => getComputedStyle(el).transform")
    check(t1 == t2, "capa não se move no celular")

    # Alvos de toque
    pequenos = page.evaluate(
        """() => [...document.querySelectorAll('a, button, input')]
            .filter(e => e.offsetParent !== null && !e.classList.contains('sr-only') && !e.closest('p'))
            .map(e => [e.textContent.trim().slice(0,30) || e.getAttribute('aria-label'), e.getBoundingClientRect().height])
            .filter(([, h]) => h > 0 && h < 40)"""
    )
    check(len(pequenos) == 0, f"alvos de toque com menos de 40 px fora de texto corrido: {pequenos[:6]}")
    check(not erros, f"sem erros no console ({len(erros)})" + ("" if not erros else ": " + erros[0][:120]))
    browser.close()


def reduzido(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    page = ctx.new_page()
    page.goto(url, wait_until="networkidle")
    check(not page.evaluate("document.documentElement.classList.contains('rv')"), "redução de movimento: seções não ficam ocultas")
    anim = page.locator(".hero-in").first.evaluate("el => getComputedStyle(el).animationName")
    check(anim == "none", f"redução de movimento: entrada do hero desligada ({anim})")
    page.mouse.move(300, 300)
    page.mouse.move(1300, 200, steps=8)
    page.wait_for_timeout(600)
    t = page.locator("[data-tilt-zone] [style*=perspective]").first.evaluate("el => getComputedStyle(el).transform")
    page.mouse.move(200, 600, steps=8)
    page.wait_for_timeout(600)
    t2 = page.locator("[data-tilt-zone] [style*=perspective]").first.evaluate("el => getComputedStyle(el).transform")
    check(t == t2, "redução de movimento: capa não inclina")
    browser.close()


def fechado(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(url, wait_until="networkidle")
    check(page.locator("a[data-checkout-cta]").count() == 0, "sem checkout: nenhum link de compra é gerado")
    botao = page.locator("#hero-compra button", has_text="Quero acessar o guia")
    botao.click()
    aviso = page.get_by_role("status").filter(has_text="vendas ainda não foram abertas")
    expect(aviso).to_be_visible()
    check(True, "sem checkout: clique mostra que as vendas ainda não estão abertas")
    check(page.url.startswith(url), "sem checkout: a página não navega nem simula pagamento")
    browser.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:3100")
    parser.add_argument("--closed", action="store_true")
    args = parser.parse_args()
    with sync_playwright() as p:
        if args.closed:
            fechado(p, args.url)
        else:
            desktop(p, args.url)
            mobile(p, args.url)
            reduzido(p, args.url)
    falhas = [n for ok, n in resultados if not ok]
    print(f"\n{len(resultados) - len(falhas)}/{len(resultados)} verificações passaram")
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    main()
