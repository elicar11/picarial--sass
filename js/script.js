document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const links = [...header.querySelectorAll('.header__link')];
    const burger = header.querySelector('.header__menu');
    const searchForm = header.querySelector('.header__search-form');
    const searchBtn = header.querySelector('.header__search');
    const searchInput = header.querySelector('.header__search-input');

    // Accueil (href="#") + liens qui pointent vers une section existante
    const homeLink = links.find((link) => !link.hash);
    const sections = links
        .filter((link) => link.hash)
        .map((link) => ({ link, target: document.querySelector(link.hash) }))
        .filter(({ target }) => target);


    /* ---------- Menu burger & recherche (un seul panneau ouvert à la fois) ---------- */

    function setMenu(open) {
        header.classList.toggle('header--open', open);
        burger.setAttribute('aria-expanded', open);
        burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');

        if (open) setSearch(false);
    }

    function setSearch(open) {
        header.classList.toggle('header--search-open', open);
        searchBtn.setAttribute('aria-expanded', open);
        searchBtn.setAttribute('aria-label', open ? 'Fermer la recherche' : 'Ouvrir la recherche');

        if (open) {
            setMenu(false);
            // preventScroll : évite un saut de page (header sticky + scroll-padding-top)
            searchInput.focus({ preventScroll: true });
        } else {
            searchInput.blur();
        }
    }

    burger.addEventListener('click', () => setMenu(!header.classList.contains('header--open')));

    searchBtn.addEventListener('click', () => {
        const isOpen = header.classList.contains('header--search-open');

        // Champ ouvert et rempli : la loupe lance la recherche, sinon elle ouvre / ferme le champ
        if (isOpen && searchInput.value.trim()) {
            searchForm.requestSubmit();
        } else {
            setSearch(!isOpen);
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = searchInput.value.trim();

        // TODO : brancher ici la vraie recherche (filtrer les sections, appel API, etc.)
        if (query) console.log('Recherche :', query);
    });

    // Fermeture : clic à l'extérieur, touche Échap, retour en mode desktop (> 992px)
    document.addEventListener('click', ({ target }) => {
        if (!header.contains(target)) setMenu(false);
        if (!searchForm.contains(target)) setSearch(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setMenu(false);
            setSearch(false);
        }
    });

    window.matchMedia('(min-width: 993px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });


    /* ---------- Lien actif : clic + scrollspy ---------- */

    const setActive = (activeLink) => {
        links.forEach((link) => link.classList.toggle('header__link--active', link === activeLink));
    };

    // Pendant le défilement déclenché par un clic, on met le scrollspy en pause
    // (sinon le lien actif saute d'une section à l'autre en chemin)
    let clickScrolling = false;
    let resumeTimer;

    const pauseScrollspy = () => {
        clickScrolling = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => (clickScrolling = false), 150);
    };

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            setActive(link);
            setMenu(false);
            pauseScrollspy();

            // Accueil : remonte en haut de la page
            if (link === homeLink) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    const updateActiveLink = () => {
        const offset = header.offsetHeight + 120;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        // Dernière section dont le haut est passé sous le header (en bas de page : Contact)
        const passed = sections.filter(({ target }) => target.getBoundingClientRect().top <= offset);
        const current = atBottom ? sections.at(-1) : passed.at(-1);

        setActive(current ? current.link : homeLink);
    };


    /* ---------- Scroll : ombre du header + scrollspy ---------- */

    const onScroll = () => {
        header.classList.toggle('header--scrolled', window.scrollY > 10);

        if (clickScrolling) pauseScrollspy();
        else updateActiveLink();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // état initial (page rechargée au milieu du scroll)
});