Návod na sputenie

1. Nainštalovanie systémov:

   - 1.0 vsCode https://code.visualstudio.com/download
   - 1.1 pgAdmin https://www.pgadmin.org/download/
   - 1.2 windows subsystem for linux/ ubuntu https://learn.microsoft.com/en-us/windows/wsl/install
   - 1.3 NodeJS https://nodejs.org/en/download/package-manager ,nodejs instalujeme cez terminal wsl - ubuntu
   - 1.4 Github Desktop https://desktop.github.com/download/

2. Stiahnutie, instalacia a spustenie projektu

   - 2.1 Stiahnutie repozitára z https://github.com/mjuhas537/amcef prostrednictvom github desktop
   - 2.2 Otvorenie projektu skrz github Desktop vo VScode
   - 2.3 spustenie pgAdmin, vytvorenie a nastavenie servra podľa parametrov v data-source.ts
     - 2.4 Vo VScode spustime príkazovy riadok ubuntu s nasledujúcimi príkazmi
     - 2.4.1 stiahnutie a instalacia knizniic: npm i
     - 2.4.2 vytvorenie tabuliek v databaze: npm migrate
     - 2.4.3 spustenie projektu: npm run start
   - 2.5 otvorenie weboveho prehliadaca s url adresou: http://localhost:3000/intro

3. Návod na obsluhu
   - 3.1 úvodna stranka zobrazuje zoznam vsetkých úloh
   - 3.2 pre dalsi krok je nutna registrácia a nasledny login
   - 3.3 po prihlaseni, uzivatelovi je ponuknutý formular pre vytvorenie úlohy, a zozonam úloh v ktorých disponuje ako autor alebo spolupracovnik

Dokumentácia API

    http://localhost:3000/intro
    endpoint : GET úvodna stranka, zobrazenie sablony intro.ejs

    http://localhost:3000/login
    endpoint : GET formular pre prihlasenie, zobrazenie sablony login.ejs
    endpoint : POST prihlasenie, autentifikacia uzivatela

    http://localhost:3000/registration
    endpoint : GET formular pre registraciu, zobrazenie sablony registration.ejs
    endpoint : POST registracia uzivatela, vytvorenie zaznamu v tabulke user so zasifrovanym heslom

    http://localhost:3000/table
    endpoint : GET - zabezpeceny endpoint len pre prihlasenych, zobrazenie zoznamu pridelených/vytvorených uloh prihlaseného uzivatela, obsahuje formular pre vytvorenie a editaciu uloh, zobrazenie sablony table.ejs

    http://localhost:3000/updateTask
    endpoint : POST - zabezpeceny endpoint len pre prihlasenych, upravenie existujuceho zaznamu v tabulke uloh

    http://localhost:3000/createTask
    endpoint : POST - zabezpeceny endpoint len pre prihlasenych, vytvorenie noveho zaznamu v tabulke uloh

    http://localhost:3000/logout
    endpoint : GET - odhlasenie uzivatela
