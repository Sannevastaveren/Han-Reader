Software Guidebook
==================

## Context
De readable Reader is een webapp die speciaal bedoelt is voor slechtziende/dyslecten.
Voor deze doelgroep is er geen goed app omdat je nooit genoeg dingen kunt aanpassen.
Zoals de kleur van het font of de font groote of de achtergrond etc.

Dus daarom maken wij een webapp waarbij zij een boek kunnen importeren en deze kunnen lezen.
Daarbij kunnen ze font-groote, font, font-spacing, line-height aanpassen maar zijn er thema's die gekozen kunnen worden voor lettertype kleur en achtergrondkleur.

#### Doelgroep
**Slechtziende**: mensen met een zeer slecht zicht, om het boek voor hen zichtbaar te maken kan het lettertype zeer groot gemaakt worden,
achtergrond en tekst kleur veranderd worden voor meer contrast

**Kleurenblinde**: mensen die bepaalde kleuren niet of anders zien, om het boek voor hen zichtbaar te maken kan de achtergrond en
tekst kleur veranderd worden.

**Dyslecten**: mensen die woorden door elkaar kunnen halen en slechter kunnen lezen. Om het boek better leesbaar te maken voor deze groep,
is het mogelijk om de line-heigt, font-spacing en font-groote aan te passen, voor meer distinctie tussen woorden en zinnen.

**Helpers** van de gebruiker: mensen die kunnen inloggen op een account van een van de bovenstaande doelgroepen en
vervolgens de instellingen vanaf afstand kunnen veranderen of klaarzetten voor de gebruiker

![ContainerDiagram](./C4%20diagrams/C4_diagrams_context.png)

## Functional Overview
Epub is een veel gebruikt format voor e-Books, dit soort bestand kan worden ingeladen in de app en kan volledig gepersonaliseerd worden na de gebruikers voorkeur.
De achtergrond kleur, tekst kleur, font, font grootte, regel afstand en letter afstand kunnen veranderd worden. Ook kunnen alinea's voorgelezen worden door middel van text to speech (in 11 verschillende talen!). Door deze volledige personalisatie geeft de app ook deze mensen een kans om te genieten van lezen. Er kan ook gekozen worden om door het boek te scrollen, of te bladeren.

Er is gebruik gemaakt van markeren, maar bij nader inzien voegde de functionaliteit niet veel toe. De functionaliteit botste met de text to speech manier en daarom is de functionaliteit verwijderd (commit: https://github.com/HANICA-DWA/sep2020-project-serval/commit/b4fcdffa4f52aee40e18164c80aea520f1e0ffac).

Voor voorbeelden en een handleiding: zie de README.md in de hoofdmap `sep2020-project-serval`.

## Quality Attributes
De core qualities van deze app zijn **Security, Usability**. Deze zijn belangrijk om een app te maken die makkelijk en veilig door mensen met oog problemen, of andere lees beperkingen te gebruiken is.

**Usability** word bereikt doormiddel van personalisatie van het boek(kleur, tekst kleur, font, font grootte, regel afstand en letter afstand).

**Security** is ook belangrijk en hiervoor maken we gebruik van Google login om de user makkelijk maar ook secure te laten inloggen zonder problemen waardoor alleen zijn/haar boeken zichtbaar zijn en niemand anders hiervan gebruik kan maken zonder zijn/haar toestemming. 

## Constraints
**Tijd:** Er zijn 8 weken voor het project

**Bestaande systemen:** Er wordt gebruik gemaakt van Epubjs voor het inlezen en renderen van epub bestanden wat gelimiteerde opties geeft voor personalisatie

**Team grote:** Er zijn 4 mensen in ons team

**Database communicatie:** Gaat altijd via mongoose of mongo en voor de database word mongoDB gebruikt

**API communicatie:** Gaat altijd via HTTP requests naar de API

**Standaard message format:** Is JSON

## Principles
- DRY (don’t repeat yourself)
- Code van applicatie volledig in het Engels
- Components zijn stateless
- State management via React Redux
- Database is een NoSQL database
- De UI is groot

## Software Architecture

![ContainerDiagram](./C4%20diagrams/C4_diagrams_container.png)
In het container diagram is het overzicht van de applicaties te zien.
De gebruiker maakt gebruik van de readablereaderAPP.
De readablereaderAPP maakt requests naar de readablereaderAPI, en de readablereaderAPI haalt data op uit de database of slaat data op in de database.


![ComponentDiagram](./C4%20diagrams/C4_diagrams_component_APP.png)
In het component diagram is het overzicht van de readablereaderAPP te zien.
De readablereaderAPP maakt gebruik van index.js, index.js initialiseert de store en roept App.js vervolgens aan. App.js zorgt ervoor dat alle pages zichtbaar worden en controleert of de gebruiker geauthenticeerd is om bepaalde pagina's te zien. App.js routes alle pagina's, die pagina's vallen onder het mapje page components. Er zijn verschillende page components: about, book, bookshelf, home, login, settings en upload (te vinden in pageComponents). De page components maken gebruik van components.jsx (te vinden in het mapje components). De page components roepen verschillende actions aan, die vervolgens objecten dispatchen naar de reducers. Page components dispatchen zelf ook objecten naar de reducers. Een aantal actions gaan ook naar de readablereaderAPI.

![ComponentDiagram](./C4%20diagrams/C4_diagrams_component_API.png)

In het dit component diagram is het overzicht van de readablereaderAPI te zien,
Hierin zijn 3 routes: books, users en rest (te vinden in het mapje routes). De rest route creëert de books en users routes. Vervolgens schrijven of lezen de books en users routes naar de books en users database (te vinden in het database mapje). De books en users database connecten het de data met de database.

## Infrastructure Architecture

In het project hebben we ons niet verdiept in de infrastructuur. De applicatie draait op localhost:3000 en de server op localhost:3001.

## Deployment
In de Readme.md van het project staat een installation guide en hoe de tests gerund kunnen worden.
Onze applicatie wordt gedraaid op een enkele server en in de afbeelding hieronder staat beschreven hoe de structuur eruit ziet.

![DeploymentDiagram](./C4%20diagrams/deployment_diagram.png)
De single page application word opgestart in de web browser van de klant, deze applicatie heeft contact met de API die data ophaalt uit de database.
De database en API zijn in een linux omgeving ontwikkeld. 

#### Deployment strategy
Om ervoor te zorgen dat er weinig downtime is en er altijd een stabiele versie online staat worden nieuwe features in aparte branches gemaakt,
zodra deze af zijn worden deze gemerged met een test branche. Als alles goed werkt en stabiel is in de test branche kan deze naar de main verplaatst worden,
en gebruikt worden door de user. Hierdoor kun je makkelijk een rollback uitvoeren naar de vorige stabiele versie in de main branche.


## Operation and Support

Er worden geen logfiles aangemaakt. 
Problemen kunnen worden gedetecteerd door de integratie, unit en e2e tests te runnen.
Hoe tests gerund kunnen worden staat beschreven in de installatie guide in de Readme hierin staat ook beschreven hoe de software gestart kan worden.


## Code

### React Redux

Onze applicatie werkt met React Redux. Redux is een library die ervoor zorgt dat je de state van je applicatie gemakkelijk kan bijhouden. Zo kan je informatie in de Redux state opslaan en die overal op de applicatie gebruiken tot de pagina wordt ververst.

De state kan bijvoorbeeld een lijst van boeken opslaan zodat de app de boeken niet onnodig opnieuw hoeft op te halen. Ook variabelen slaan wij soms op in de state. Wanneer de state veranderd rendered de pagina opnieuw. Zo kunnen state variabelen goed gebruikt worden om bijvoorbeeld bij te houden of het programma een loader moet laten zien.

### Eigen components

Hier onder volgt een schema over onze eigen components en hoe ze werken. (framework7 components dus niet meegenomen).

| Component | Attributes/Props | Beschrijving |
|-|-|-|
| BookList | `books`: [Object], `loading`: Boolean | Krijgt als attribuut de array van objecten `books` mee, gesorteerd op laatst geopend of geupload. Met een map() functie wordt deze array omgezet naar een array van HTML, die informatie zoals de cover van het boek (wanneer beschikbaar), titel en schrijver. Elk item uit `books` wordt omgezet naar een listitem met een link naar het bijbehorende boek. Ook wordt er op positie 0 een listitem aangemaakt met een link naar de uploadpagina. Verder wordt `loading` meegegeven zodat de pagina geen verkeerde responses geeft terwijl de boeken nog aan het laden zijn. |
| PreferencesSwipe | `dispatch`: [Method], `rendition`: [Object], `preferences`: [Object], `confirmedPreferences`: [Object] | PreferencesSwipe krijgt een aantal objecten, dispatch triggert een state verandering, rendition is het object dat de epubfile weergeeft, preferences is een object dat de voorkeuren zoals lettertype, lettergrootte die verandert worden, confirmedPreferences is een object dat de preferences opslaat op het moment dat er op OK wordt geklikt. Op die manier kan je door op CANCEL te klikken, één staat terug. In de preferencesSwipe kun je de lettergrootte, thema's, lettertype, regelafstand en letterafstand aanpassen.
| PreloaderModal | `show`: Boolean, `title`: String | Een loader alert die je pas weg gaat als het laden klaar is. `show` zorgt voor een animatie en `title` is de text die boven de leader staat. |
| DialogAlert | `show`: Boolean, `title`: String, `text`: String | Een alert die waarbij je op OK moet drukken om verder te gaan. `show` zorgt een animatie. `title` en `text` bepalen de text in de alert. |
| TabbarBottom | *geen props* | De navigatie tabbar onderaan het scherm, of in de hoek als de gebruiker in landscape mode zit.
| TabbarPopup | *geen props* | De popup die opent wanneer de gebruiker op de tabbar geclickt heeft. Bevat links naar onze 5 hoofdpagina's en een terug knop.
|Navigation|*geen props*|Pijltjes om naar volgende of vorige bladzijde te gaan dit word gedaan met de ingebouwde functie van rendition van epubjs, vervolgens word het pagina nummer, totaal aantal pagina's, hoofstuk nummer en het epubCFI van de pagina opgehaald en verstuurd naar de database als laatste locatie|
|Book|*geen props*| De pagina waarop het boek te lezen is. Eerst word de laatst geopende pagina's epubcfi opgehaald vanuit de database vervolgens word het boek ingeladen en gerenderd naar het scherm |
| TopbarButton | `className: String, onClick: Function, childs: [String], iconColor: String`| Dit is een button die in de bar staat boven het boek lezen. Deze button bevat een icon waar de childs en iconColor voor is. |

### Gebruik session

Hier onder volgt een schema over hoe de session storage gebruikt wordt in onze applicatie.

| Pagina | Session variabelen | Gebruik |
|-|-|-|
| login | username | username wordt gevuld nadat de gebruiker heeft ingelogd. |
| bookshelf | username | username wordt gebruikt om de boeken van de huidige gebruiker uit de database te halen. |
| logout | username, bookID | Deze pagina leegt de session. |
| book | bookID | bookID wordt gevult wanneer de gebruiker op de book pagina komt, zodat hij gebruikt kan worden om het boek terug te halen wanneer de gebruiker (bijv. via de tabbar) weg klikt. |

### Websocket communicatie

Het is mogelijk om met twee of meer users tegelijk ingelogd te zijn op 1 account. 
Voor iedere user word een websocket connectie met de username van het account aangemaakt zodra de user in de boekenkast is en nog geen websocket connectie bestaat doormiddel van 
het dispatchen van een websocketAction
(dit word gecheckt door te kijken of de ws variabele in de login state op false staat, 
zodra er een connectie is gemaakt word deze op true gezet en als deze op een manier gesloten word gaat deze weer op false). 
Doormiddel van het matchen van de username kunnen de websockets elkaar herkennen. 
Als 1 persoon een verandering maakt in de preferences dan zal deze een bericht sturen naar andere websockets met dezelfde username zodat deze de nieuwe preferences ophalen.
Deze implementatie gaat ervan uit dat de username uniek is.

De websocket Server initialisatie word gedaan in index.js in readablereaderAPI.
Aan de client side word de websocket aangemaakt en bericthen ontvangen en doorgestuurd naar de reducers in Actions/websocketActions.js

### Login met google

Het is mogelijk om te inloggen met google. Dit wordt gedaan door in te loggen en daarna het deel voor de `@` als username te gebruiken. Wanneer je account gemaakt is met google dan staat er in de Database `google: true`. Wanneer je probeert in te loggen met een google account waarvan de naam al in de db staat wordt krijg je de keuze om een eigen username in te vullen.

## Data

Hieronder volgt een schema voor onze data opslag

![Database schema](./database_diagram.png)

De collections `uploads.files` en `uploads.chunks` zijn gemaakt door `multer-gridfs-storage`. Deze libray splits een bestand op in chunks die staan dan in `uploads.chunks`. Deze chunks worden gelinkt aan een bestand via `files_id` waardoor een file dus weet welke chunks bij hem horen. Vervolgens in `books` linken we naar het bestand met `fileId` en `filename`.

Tijdens het uploaden van een boek wordt onderandere metadata geupload naar `books`. Daarnaast ook de `filename` en `fileId` van de cover foto. Deze wordt namelijk geupload op dezelfde manier als een epub.

## Decision Log
### Framework 7:
Er is voor framework 7 gekozen omdat dit framework al bekend was bij een teamlid die het dus makkelijk kon implementeren en uitleggen. Het is geschikt voor React met de speciale Framework-7-react library en bevat veel premade assets zoals een login pagina en andere functionaliteiten. Aangezien deze app uiteindelijk bedoeld is voor IPad en telefoon is het ook fijn dat deze library zich aanpast naar het besturingssysteem.

### MongoDB:
Er is voor mongoDB gekozen als database omdat dit een populaire veel gebruikte noSQL database is die al bekend was bij het team. NoSQL databases zijn sneller, simpler, flexibeler en goedkoper en daarom een goede keuze voor dit project. Ook zijn ze zeer geschikt voor grote data en aangezien er boeken in moeten worden opgeslagen lijkt dit een goede keuze.

### Epubjs:
Er is gekozen voor Epubjs om epubs (alleen van het format .epub) in te lezen en te renderen op het scherm omdat dit de basis library is waar de meeste anderen op gebaseerd zijn. Met deze library is veel personalisatie mogelijk wat nodig is voor de app om geschikt te zijn voor mensen met lees problemen. Ook is het makkelijk te implementeren met enkele regels code.
Verder bevat epubjs een ingebouwde navigatie waarde, (epubCFI). Hierin word opgeslagen in welk hoofdstuk je bent en het hoeveelste woord er gedisplayed is ongeveer. Daardoor is makkelijk een precieze locatie te renderen in het boek

### Jest:
Er is gekozen voor Jest omdat dit aangeraden is.

### multer-gridfs-storage
Er is gekozen voor multer-gridfs-storage is gebaseerd op gridfs. Gridsfs gebruiken we omdat het om kan gaan met elk bestandstype. Waardoor we dus niks hoeven aan te passen wanneer we willen gaan werken met andere formats dan .epub. We gebruiken de multer variant omdat multer gemakkelijk form data kan gebruiken wat nodig is om een bestand op te sturen.

### speak-tts
Er is gekozen voor speak-tts omdat deze vrij makkelijk te implementeren was en kan draaien in Chrome, opera en Safari. Ook ondersteunt deze library ios en android devices. Wel maakt deze speak-tts gebruik van browser Speech Synthesis, en is dus niet altijd te gebruiken op elke versie van de browser. Kijk hier voor de browser support (https://caniuse.com/speech-synthesis). 

### node-language-detect
Er is gekozen voor node-language-detect omdat het een hele simpele language detector is, hij kan 51 talen detecten en geeft scores voor betrouwbaarheid terug. De overlap van talen tussen speak-tts en node-language-detect is wel vrij klein, 11 talen.

### bcryptjs:
Deze libraby wordt gebruikt voor het versleutelen van de wachtwoorden. Er is gekozen voor bcrypt omdat dit aangeraden is. De versie 'bcryptjs' is lichter en werkt met minder dependencies.
