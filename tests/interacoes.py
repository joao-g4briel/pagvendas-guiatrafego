"""
Testes de interação da página (Playwright, Python).

Uso, com o build de produção rodando:
    npx next start -p 3100
    python tests/interacoes.py --url http://localhost:3100

Os testes da página rodam como visitante que já fechou o vídeo de entrada (localStorage);
os de `entrada*` cobrem a primeira visita.

Para o cenário de vendas fechadas, rode outra instância com checkout inválido e passe --closed:
    NEXT_PUBLIC_CHECKOUT_URL=desativado npx next dev -p 3200
    python tests/interacoes.py --url http://localhost:3200 --closed

Nenhuma compra é feita: a navegação para o checkout é interceptada e respondida localmente.
"""

import argparse
import sys

from playwright.sync_api import Page, expect, sync_playwright

CHECKOUT = "https://pay.cakto.com.br/3953vai"
CHAVE_AULA = "mtd_aula_liberada"
resultados: list[tuple[bool, str]] = []


def check(ok: bool, nome: str) -> None:
    resultados.append((ok, nome))
    print(("OK   " if ok else "FALHA") + "  " + nome)


def ja_liberou(ctx) -> None:
    """Visitante que já fechou o vídeo de entrada: a página abre sem ele."""
    ctx.add_init_script(f"try {{ localStorage.setItem('{CHAVE_AULA}', '1') }} catch (e) {{}}")


def coletar_erros(page: Page, erros: list[str]) -> None:
    # O script do Vercel Web Analytics só existe na Vercel; fora dela, o 404 dele é esperado.
    def no_console(m) -> None:
        vercel = "/_vercel/insights/" in (m.location or {}).get("url", "") or "/_vercel/insights/" in m.text
        if m.type == "error" and not vercel:
            erros.append(m.text)

    page.on("console", no_console)
    page.on("pageerror", lambda e: erros.append(str(e)))


def desktop(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    ja_liberou(ctx)
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
        {"header", "hero", "preview", "offer", "final", "menu"}.issubset(set(locais)),
        f"CTAs presentes em cabeçalho, menu, hero, prévia, oferta e final ({', '.join(locais)})",
    )
    previas = page.get_by_role("link", name="Ver uma prévia").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    check(len(previas) >= 1 and all(h == "#previa" for h in previas), f"“Ver uma prévia” leva à seção #previa ({len(previas)} links), não ao checkout")
    navs = page.locator("nav[aria-label=Principal] a").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    check(navs == ["/#conteudo", "/#previa", "/#duvidas"], f"navegação do cabeçalho: {navs}")

    # H1 único
    check(page.locator("h1").count() == 1, "a página tem um único H1")

    # Inclinação da capa com ponteiro preciso
    capa = page.locator("[data-tilt-zone] img").first
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    page.wait_for_timeout(1200)
    antes = capa.evaluate("el => getComputedStyle(el.closest('[style*=perspective]')).transform")
    page.mouse.move(300, 300)
    page.mouse.move(1300, 200, steps=8)
    page.wait_for_timeout(700)
    depois = capa.evaluate("el => getComputedStyle(el.closest('[style*=perspective]')).transform")
    check(antes != depois, "tablet inclina com o ponteiro no desktop")

    # FAQ
    primeira = page.locator("#duvidas button[aria-expanded]").first
    check(primeira.get_attribute("aria-expanded") == "true", "primeira dúvida começa aberta")
    faq = page.locator("#duvidas button[aria-expanded]").nth(1)
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
    sumario = page.locator("#conteudo button[aria-expanded]").first
    sumario.scroll_into_view_if_needed()
    sumario.click()
    page.wait_for_timeout(450)
    check(page.get_by_text("Fundamentos e economia do anúncio").is_visible() and page.get_by_text("Glossário de consulta rápida").is_visible(), "sumário completo abre com módulos e anexos")

    # Lightbox
    miniatura = page.locator("#previa button[aria-label^='Ampliar']").first
    miniatura.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    miniatura.click()
    dialog = page.locator("dialog.lightbox")
    expect(dialog).to_have_attribute("open", "")
    check("1 de 2" in page.locator("#lightbox-title").inner_text(), "lightbox abre na página 1 de 2")
    page.keyboard.press("ArrowRight")
    check("2 de 2" in page.locator("#lightbox-title").inner_text(), "seta direita avança")
    page.keyboard.press("ArrowLeft")
    page.keyboard.press("ArrowLeft")
    check("2 de 2" in page.locator("#lightbox-title").inner_text(), "seta esquerda volta e circula")
    for _ in range(6):
        page.keyboard.press("Tab")
    dentro = page.evaluate("document.activeElement.closest('dialog.lightbox') !== null")
    check(dentro, "Tab mantém o foco dentro do lightbox")
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    check(dialog.get_attribute("open") is None, "Escape fecha o lightbox")
    foco = page.evaluate("document.activeElement.getAttribute('aria-label')")
    check(bool(foco) and foco.startswith("Ampliar página 2:"), f"foco volta à miniatura que abriu o lightbox ({foco})")

    # Contagem gratuita do clique no Vercel Web Analytics (visualização virtual), sem navegar
    page.evaluate(
        """() => {
          window.__va = [];
          window.va = (...args) => window.__va.push(args);
          document.addEventListener('click', (e) => {
            if (e.target.closest('a[data-checkout-cta=hero]')) e.preventDefault();
          }, { capture: true, once: true });
        }"""
    )
    page.locator("a[data-checkout-cta=hero]").click()
    contados = page.evaluate("window.__va.filter((c) => c[0] === 'pageview').map((c) => c[1].path)")
    check(contados == ["/clique-comprar/hero"], f"clique no hero conta /clique-comprar/hero no Vercel Analytics ({contados})")

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
    ja_liberou(ctx)
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
    fab = page.get_by_role("button", name="Ver a aula grátis")
    check(fab.is_visible() and page.locator(".aula-gate").count() == 0,
          "quem já fechou o vídeo não o vê abrir sozinho, só o botão “Ver a aula grátis”")
    fb = fab.bounding_box()
    check(fb is not None and abs(844 - (fb["y"] + fb["height"]) - 16) <= 2, "sem a barra, o botão fica a 16 px do rodapé")
    page.evaluate("document.getElementById('conteudo').scrollIntoView({behavior: 'instant'})")
    page.wait_for_timeout(700)
    check(barra.count() == 1 and barra.is_visible(), "barra móvel aparece depois do hero")
    if barra.count():
        box = page.locator("a[data-checkout-cta=mobile_bar]").locator("xpath=ancestor::div[contains(@class,'fixed')]").bounding_box()
        check(box is not None and abs(box["y"] + box["height"] - 844) < 2, "barra fixa no rodapé da tela")
        check(barra.get_attribute("href") == CHECKOUT, "barra móvel usa a mesma URL de checkout")
        # Botão "Ver a aula grátis" (quem já liberou) sobe acima da barra enquanto ela aparece
        page.wait_for_timeout(500)
        fab = page.get_by_role("button", name="Ver a aula grátis").bounding_box()
        check(fab is not None and box is not None and fab["y"] + fab["height"] <= box["y"] - 4,
              "“Ver a aula grátis” fica acima da barra de compra no celular")
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
    check(t1 == t2, "tablet não se move no celular")

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
    ja_liberou(ctx)
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
    check(t == t2, "redução de movimento: tablet não inclina")
    browser.close()


def entrada(p, url: str) -> None:
    """Primeira visita num notebook de 768 px de altura: vídeo por cima da página, botões ativos desde o início."""
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 1366, "height": 657})
    ctx.add_init_script("window.__fbq = []; window.fbq = (...args) => window.__fbq.push(args);")
    ctx.add_init_script("window.__push = 0; const push = history.pushState.bind(history);"
                        " history.pushState = (...a) => { window.__push++; return push(...a); };")
    page = ctx.new_page()
    erros: list[str] = []
    coletar_erros(page, erros)
    page.goto(url, wait_until="load")
    gate = page.locator(".aula-gate")
    video = page.locator(".aula-gate video")
    fechar_x = page.get_by_role("button", name="Fechar o vídeo e ver a página")
    ver_pagina = page.get_by_role("button", name="Ver a página completa")
    compra = page.locator(".aula-gate a[data-checkout-cta=aula]")

    def eventos() -> list[str]:
        return page.evaluate("window.__fbq.filter((e) => e[0] === 'trackCustom').map((e) => e[1])")

    expect(gate).to_be_visible()
    historico = page.evaluate("history.length")
    check(gate.get_attribute("role") == "dialog" and gate.get_attribute("aria-modal") == "true", "vídeo de entrada abre como diálogo modal")
    check(page.get_by_role("heading", name="Antes de continuar: veja como criar sua primeira campanha.").is_visible(), "título do vídeo de entrada")
    page.wait_for_function("!document.querySelector('.aula-gate video').paused", timeout=15000)
    estado = video.evaluate("v => ({muted: v.muted, controls: v.controls, src: v.currentSrc})")
    check(estado["muted"] and not estado["controls"], f"vídeo começa sozinho, mudo e sem controles nativos ({estado['src'].rsplit('/', 1)[-1]})")
    check(page.evaluate("document.documentElement.style.overflow") == "hidden", "rolagem da página travada com o vídeo aberto")
    caixa = page.locator(".aula-box").bounding_box()
    sem_rolagem = gate.evaluate("g => g.scrollHeight <= g.clientHeight")
    check(caixa["y"] >= 0 and caixa["y"] + caixa["height"] <= 657 and sem_rolagem,
          f"vídeo e botões cabem em 1366×657 sem rolagem ({round(caixa['y'] + caixa['height'])} px)")

    # Sem temporizador: tudo ativo assim que a página abre
    rotulo = compra.inner_text().strip() if compra.count() else ""
    check(compra.count() == 1 and compra.get_attribute("href") == CHECKOUT and "Quero o guia por R$" in rotulo and "13,90" in rotulo,
          f"botão de compra já ativo ao entrar: “{rotulo}” com o link da Cakto")
    check("btn-primary" in (compra.get_attribute("class") or ""), "botão de compra com o estilo do botão principal")
    check(ver_pagina.is_enabled() and fechar_x.is_visible(), "“Ver a página completa” e X ativos ao entrar")
    check("aparece em" not in gate.inner_text() and "Ver a página em" not in gate.inner_text(), "sem contagem regressiva")
    for _ in range(4):
        page.keyboard.press("Tab")
    check(page.evaluate("document.activeElement.closest('.aula-gate') !== null"), "Tab mantém o foco dentro do vídeo de entrada")

    # Clique no vídeo pausa; o botão central continua
    video.click()
    play = page.get_by_role("button", name="Continuar o vídeo")
    expect(play).to_be_visible()
    play.click()
    page.wait_for_function("!document.querySelector('.aula-gate video').paused")
    # o botão some no evento "play", que chega logo depois de `paused` virar false
    expect(play).to_have_count(0)
    check(True, "clique no vídeo pausa e o botão central continua")

    # Som: liga e volta para 0:00
    page.wait_for_timeout(1500)
    page.get_by_role("button", name="Toque para ativar o som").click()
    page.wait_for_timeout(300)
    som = video.evaluate("v => ({muted: v.muted, t: v.currentTime})")
    check(not som["muted"] and som["t"] < 1.5, f"“Toque para ativar o som” liga o som e volta ao início ({som['t']:.1f} s)")
    check(page.get_by_role("button", name="Toque para ativar o som").count() == 0, "botão de som some depois de usado")

    # Clique em comprar: conta no Vercel (/clique-comprar/aula) e no Meta, sem navegar
    page.evaluate(
        """() => {
          window.__va = [];
          window.va = (...args) => window.__va.push(args);
          document.addEventListener('click', (e) => {
            if (e.target.closest('a[data-checkout-cta=aula]')) e.preventDefault();
          }, { capture: true, once: true });
        }"""
    )
    compra.click()
    contados = page.evaluate("window.__va.filter((c) => c[0] === 'pageview').map((c) => c[1].path)")
    check(contados == ["/clique-comprar/aula"], f"clique no botão do vídeo conta /clique-comprar/aula ({contados})")
    check(eventos() == ["AulaSomAtivado", "AulaCliqueCompra"], f"eventos do Meta Pixel: {eventos()}")

    check(page.evaluate("history.length") == historico and page.evaluate("window.__push") == 0,
          "histórico e botão voltar intocados (nenhum pushState)")
    page.keyboard.press("Escape")
    expect(gate).to_be_hidden()
    check(page.evaluate("document.documentElement.style.overflow") == "", "Esc fecha e destrava a rolagem")
    check(video.evaluate("v => v.paused"), "fechar pausa o vídeo")
    check(page.evaluate(f"localStorage.getItem('{CHAVE_AULA}')") == "1", f"fechar salva a visita no localStorage ({CHAVE_AULA})")
    fab = page.get_by_role("button", name="Ver a aula grátis")
    check(fab.is_visible(), "aparece o botão “Ver a aula grátis”")

    # Reabre e fecha pelo X e por "Ver a página completa"
    fab.click()
    expect(gate).to_be_visible()
    check(not video.evaluate("v => v.paused"), "“Ver a aula grátis” reabre e retoma o vídeo")
    fechar_x.click()
    expect(gate).to_be_hidden()
    page.wait_for_timeout(100)
    check(page.evaluate("document.activeElement.textContent.trim()") == "Ver a aula grátis", "X fecha e o foco volta ao botão que reabriu")
    fab.click()
    expect(gate).to_be_visible()
    ver_pagina.click()
    expect(gate).to_be_hidden()
    check(True, "“Ver a página completa” fecha o vídeo")

    # Quem volta não vê o vídeo abrir sozinho
    page.reload(wait_until="load")
    page.wait_for_timeout(500)
    check(page.locator(".aula-gate").count() == 0 and page.get_by_role("button", name="Ver a aula grátis").is_visible(),
          "ao voltar: o vídeo não abre sozinho, fica o botão “Ver a aula grátis”")
    check(not erros, f"sem erros no console ({len(erros)})" + ("" if not erros else ": " + erros[0][:120]))

    page.evaluate("localStorage.clear()")
    page.goto(url.rstrip("/") + "/termos", wait_until="load")
    check(page.locator(".aula-gate").count() == 0, "termos: sem vídeo de entrada")
    browser.close()


def entrada_celular(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 360, "height": 640}, is_mobile=True, has_touch=True, device_scale_factor=2)
    page = ctx.new_page()
    page.goto(url, wait_until="load")
    page.wait_for_function("!document.querySelector('.aula-gate video').paused", timeout=15000)
    caixa = page.locator(".aula-box").bounding_box()
    check(caixa["y"] >= 0 and caixa["y"] + caixa["height"] <= 640, f"celular 360×640: tudo cabe na tela ({round(caixa['y'] + caixa['height'])} px)")
    larguras = page.evaluate(
        "() => [...document.querySelector('.aula-gate a[data-checkout-cta=aula]').parentElement.children]"
        ".map((e) => Math.round(e.getBoundingClientRect().width))"
    )
    check(len(larguras) == 2 and all(abs(w - round(caixa["width"])) <= 1 for w in larguras), f"celular: botões empilhados em largura total {larguras}")
    som = page.get_by_role("button", name="Toque para ativar o som")
    fonte = som.evaluate("b => parseFloat(getComputedStyle(b).fontSize)")
    check(fonte <= 13.5, f"celular: botão de som menor ({fonte}px)")
    som.tap()
    page.wait_for_timeout(300)
    check(not page.locator(".aula-gate video").evaluate("v => v.muted"), "celular: toque ativa o som")
    browser.close()


def entrada_sem_piscar(p, url: str) -> None:
    """Antes da hidratação (JavaScript da página bloqueado): o vídeo já aparece para quem chega e fica oculto para quem já o fechou."""
    browser = p.chromium.launch(channel="msedge", headless=True)
    for liberado in (False, True):
        ctx = browser.new_context(viewport={"width": 1366, "height": 657})
        if liberado:
            ja_liberou(ctx)
        # bloqueia só o JavaScript (o CSS do Next 16 fica na mesma pasta)
        ctx.route("**/_next/static/**", lambda route: route.abort() if route.request.resource_type == "script" else route.continue_())
        page = ctx.new_page()
        page.goto(url, wait_until="load")
        visivel = page.locator(".aula-gate").is_visible()
        if liberado:
            check(not visivel, "antes da hidratação: quem já fechou o vídeo não o vê piscar")
        else:
            check(visivel, "antes da hidratação: primeira visita já abre com o vídeo (a página não aparece antes)")
        ctx.close()
    ctx = browser.new_context(viewport={"width": 1366, "height": 657}, java_script_enabled=False)
    page = ctx.new_page()
    page.goto(url, wait_until="load")
    check(not page.locator(".aula-gate").is_visible(), "sem JavaScript: página aberta, sem um vídeo que não tocaria nem fecharia")
    browser.close()


def entrada_reduzida(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 1366, "height": 657}, reduced_motion="reduce")
    page = ctx.new_page()
    page.goto(url, wait_until="load")
    animacoes = page.evaluate("[...document.querySelectorAll('.aula-box, .aula-som')].map((e) => getComputedStyle(e).animationName)")
    check(animacoes == ["none", "none"], f"redução de movimento: vídeo de entrada sem entrada nem pulso ({animacoes})")
    browser.close()


def fechado(p, url: str) -> None:
    browser = p.chromium.launch(channel="msedge", headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    ja_liberou(ctx)
    page = ctx.new_page()
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
            entrada(p, args.url)
            entrada_celular(p, args.url)
            entrada_sem_piscar(p, args.url)
            entrada_reduzida(p, args.url)
    falhas = [n for ok, n in resultados if not ok]
    print(f"\n{len(resultados) - len(falhas)}/{len(resultados)} verificações passaram")
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    main()
