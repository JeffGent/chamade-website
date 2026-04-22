# VGIK-portaal — hoe zet je dit online?

## Wat krijg je

Een map `VGIK_portaal/` met:
- **`index.html`** — de portal-pagina (zelfstandig bestand, meertalig NL/FR/EN, alle CSS en JS zit erin, geen externe dependencies)
- **`fiches/`** — alle 35 PDF-fiches (15 originele Liantis + 20 door Claude gegenereerd)

Upload deze volledige map naar je webhosting en klaar.

## Meertaligheid

De pagina schakelt tussen **Nederlands · Frans · Engels** via de knoppen bovenaan de header. Alle UI-teksten, H-zinnen, P-zinnen, EHBO-instructies en veiligheidsadviezen zijn vertaald. De FR H-zinnen zijn de officiële EU-teksten zoals geleverd in het Liantis Traject C-template.

Voor andere talen (Pools, Roemeens, Arabisch, Spaans, ...): werknemers kunnen de ingebouwde vertaalfunctie van hun browser gebruiken (rechtsklik → "Vertaal deze pagina"). Dit werkt in Chrome, Edge, Safari en Firefox met redelijke tot goede kwaliteit. Geef dit mee in de communicatie richting het team.

## Aanbevolen: host op `chamade.be/agentia`

### Stappen

1. **FTP/SFTP in** naar de webhosting van chamade.be (of vraag dit aan de beheerder van je site).
2. Maak een nieuwe map aan in de document root: `/agentia/`
3. Upload de volledige inhoud van `VGIK_portaal/` naar die map, zodat je krijgt:
   ```
   chamade.be/agentia/index.html
   chamade.be/agentia/fiches/VGIK Mikro - Quat Extra 27012026.pdf
   chamade.be/agentia/fiches/VGIK Pep Active 04032026.pdf
   ...
   ```
4. Test de URL in je browser: **https://chamade.be/agentia/**
5. Kopieer die URL.

### Link in manual.chamade.be plaatsen

In manual.chamade.be, voeg één nieuw item toe onder House Keeping (of een eigen categorie "Veiligheid"):

**Titel:** Chemische producten — veiligheidsinfo
**Inhoud:**

> Alle informatie over de schoonmaak- en onderhoudsproducten die je in Chamade Hotel gebruikt: gevaren, bescherming, EHBO, opslag.
>
> 👉 **Raadpleeg hier: https://chamade.be/agentia/**
>
> Bekijk deze pagina minstens 1× volledig. Bij elk nieuw product dat je in je taken gebruikt, lees je de fiche vóór het eerste gebruik.
>
> Vragen? Contacteer de housekeeping-verantwoordelijke.

Zet het op "gelezen en begrepen" aantikbaar. Daarmee heb je in één item al je verplichtingen rond *informatie* en *opleiding* van werknemers gedekt (Codex Boek VI, Titel 1).

## Alternatief 1: host op GitHub Pages (gratis)

Als je al een GitHub-account gebruikt (jeffgent.github.io staat in mijn netwerkconfig):

1. Maak een nieuwe repository, bv. `chamade-agentia`
2. Upload de inhoud van `VGIK_portaal/` erin
3. Activeer GitHub Pages (Settings → Pages → Source: main branch)
4. Je krijgt een URL zoals `https://jeffgent.github.io/chamade-agentia/`
5. Link in manual.chamade.be

## Alternatief 2: direct als één item in manual.chamade.be

Als manual.chamade.be rich HTML kan tonen in een item, kan je ook de inhoud van `index.html` rechtstreeks plakken in een item. Nadeel: de PDF-downloadlinks werken dan niet tenzij je de fiches elders host.

## Onderhoud

Bij het toevoegen/verwijderen van een product:
1. Update de Chemikmo-Excel (of laat Liantis dat doen).
2. Laat een nieuwe portal genereren (of doe een kleine handmatige aanpassing aan `index.html`).
3. Upload het aangepaste bestand opnieuw.

Jaarlijks bijwerken is voldoende — de wet eist geen realtime actualisering, enkel "regelmatig".

## Veiligheid / privacy

De portal bevat geen persoonsgegevens en geen bedrijfsgevoelige info behalve de productinventaris. Je kan hem gerust publiek zetten. Wil je het toch afschermen, zet een eenvoudig wachtwoord op de `/agentia/` map via de `.htaccess` van je hosting.
