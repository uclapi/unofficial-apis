# Unofficial UCL APIs

## API Routes

### Module Catalogue

#### GET /modules

Returns all modules in the [UCL Module Catalogue](https://www.ucl.ac.uk/module-catalogue/)

```json
{
  "PORT0007": {
    "url": "https://www.ucl.ac.uk/module-catalogue/modules/20th-century-brazilian-literary-works-into-film/PORT0007",
    "summary": "This module introduces students to twentieth-century Brazilian literature and Brazilian cinema through four novels and their adaptations into film. They...",
    "level": "FHEQ Level 5",
    "teachingTerm": "Term 1",
    "title": "20th Century Brazilian Literary Works into Film",
    "mode": "Face-to-face",
    "faculty": "Faculty of Arts and Humanities",
    "department": "School of European Languages, Culture and Society",
    "credit": "15",
    "moduleCode": "PORT0007"
  },
  ...
}
```

#### GET /modules/{moduleCode}

E.g. `/modules/LAWS0007`

Returns all information about a particular module.

```json
{
  "url": "https://www.ucl.ac.uk/module-catalogue/modules/20th-century-brazilian-literary-works-into-film/PORT0007",
  "summary": "This module introduces students to twentieth-century Brazilian literature and Brazilian cinema through four novels and their adaptations into film. They...",
  "level": "FHEQ Level 5",
  "teachingTerm": "Term 1",
  "title": "20th Century Brazilian Literary Works into Film",
  "mode": "Face-to-face",
  "faculty": "Faculty of Arts and Humanities",
  "department": "School of European Languages, Culture and Society",
  "credit": "15",
  "moduleCode": "PORT0007",
  "restrictions": "N/A",
  "description": "This module introduces students to twentieth-century Brazilian literature and Brazilian cinema through four novels and their adaptations into film. They reflect key themes of Brazilian literature and cinema: the city, the malandro, the backlands of the Northeast, urban violence, immigration, drought, popular culture and religion, going from New Realism and Cinema Novo to today. In addition to providing students with clearer understanding of the history, culture, and socio-economic realities of twentieth-century Brazil, this module seeks to explore how novels are adapted and interpreted for the screen and to address the question of how can studying film adaptation allows us to better understand what it is that literature does, and vice versa.",
  "expectedClassSize": "10",
  "prevYearStudents": "0",
  "moduleLeader": "Dr Ana Claudia Surian Da Silva",
  "assessment": [
    "40% Unseen two-hour written examination",
    "30% One essay (1,500 words)",
    "30% Presentation (15 minutes)"
  ],
  "lastUpdated": "This module description was last updated on 9th August 2019."
}
```

### Student Union

#### GET /societies

Returns all societies listed on the [Student Union website](https://studentsunionucl.org/clubs-and-societies)

```json
[
  {
    "id": "bubble-tea-society",
    "logo": "https://studentsunionucl.org/sites/uclu.org/files/csc-directory-images/52762266_319268132062152_2644011270763708416_n.jpg",
    "name": "Bubble Tea Society",
    "url": "https://studentsunionucl.org/clubs-societies/bubble-tea-society"
  },
  ...
]
```

#### GET /societies/{id}

Returns societies by id, e.g. `/societies/bubble-tea-society`

```json
{
  "category": "Common Interest",
  "description": "Welcome to UCL Bubble Tea Society, the first bubble tea society in London! Join us for fun events including DIY Bubble Tea Workshops, Bubble Tea Crawls, picnics and get togethers, movie nights and much more. Members also get discounts at some of our favorite bubble tea spots in London!",
  "id": "bubble-tea-society",
  "logo": "https://studentsunionucl.org/sites/uclu.org/files/csc-directory-images/52762266_319268132062152_2644011270763708416_n.jpg",
  "name": "Bubble Tea Society",
  "created": "2019-01-28T16:13:00.000Z",
  "updated": "2019-12-03T20:02:00.000Z",
  "president": "Ibuki Yamade",
  "website": "Visit the Bubble Tea Society website",
  "email": "su-bubbletea@ucl.ac.uk",
  "constitution": "https://studentsunionucl.org/sites/uclu.org/files/bubble_tea_30.06.2019.docx",
  "members": 117,
  "price": 5,
  "facebook": "https://www.facebook.com/uclbubbleteasoc/?modal=suggested_action&notif_id=1552247549039672&notif_t=page_user_activity"
}
```

## Development

Run redis locally.

```bash
$ npm i
$ npm run start:dev
```

## Deployment

Deploy with Docker.

### Environment Variables

Specify the following environment variables

| Variable   | Remarks               |
| ---------- | --------------------- |
| PORT       | Defaults to 3000      |
| REDIS_HOST | Defaults to localhost |
| REDIS_PORT | Defaults to 6379      |
| REDIS_TTL  | Defaults to 5 minutes |