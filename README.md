# hianime-api

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**A RESTful API that utilizes web scraping to fetch anime content from hianime.to**

[Documentation](#documentation) • [Installation](#installation) • [API Endpoints](#api-endpoints) • [Development](#development)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Important Notice](#important-notice)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Deploy on Render](#deploy-on-render)
- [Documentation](#documentation)
  - [Anime Home Page](#1-get-anime-home-page)
  - [Anime List Page](#2-get-anime-list-page)
  - [Anime Details](#3-get-anime-detailed-info)
  - [Search Results](#4-get-search-results)
  - [Search Suggestions](#5-get-search-suggestions)
  - [Anime Episodes](#6-get-anime-episodes)
  - [Episode Servers](#7-get-anime-episode-servers)
  - [Streaming Links](#8-get-anime-episode-streaming-links)
- [Development](#development)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)
- [Support](#support)
- [Star History](#star-history)

---

## Overview

hianime-api is a comprehensive RESTful API that provides endpoints to retrieve anime details, episodes, and streaming links by scraping content from hianime.to. Built with modern web technologies, it offers a robust solution for anime content aggregation.

## Important Notice

> **⚠️ Disclaimer**

1. There was previously a hosted version of this API for showcasing purposes only, and it was misused; since then, there have been no other hosted versions. **It is recommended to deploy your own instance for personal use** by customizing the API as you need it to be.

2. This API is just an **unofficial API for [hianimez.to](https://hianimez.to)** and is in no other way officially related to the same.

3. The content that this API provides is not mine, nor is it hosted by me. These belong to their respective owners. This API just demonstrates how to build an API that scrapes websites and uses their content.

---

## Installation

### Prerequisites

Make sure you have Bun.js installed on your system.

**Install Bun.js:**

```bash
https://bun.sh/docs/installation
```

### Local Setup

**Step 1:** Clone the repository

```bash
git clone https://github.com/ryanwtf88/hianime-api.git
```

**Step 2:** Navigate to the project directory

```bash
cd hianime-api
```

**Step 3:** Install dependencies

```bash
bun install
```

**Step 4:** Start the development server

```bash
bun run dev
```

The server will be running at [http://localhost:3030](http://localhost:3030)

### Deploy on Render

Deploy your own instance of hianime-api on Render with one click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ryanwtf88/hianime-api)

---

## Documentation

All endpoints return JSON responses. The examples below use the Fetch API, but you can use any HTTP library.

### 1. GET Anime Home Page

Retrieve the home page data including spotlight anime, trending shows, top airing, and more.

**Endpoint:**
```
GET /api/v1/home
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/home');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "spotlight": [...],
    "trending": [...],
    "topAiring": [...],
    "mostPopular": [...],
    "mostFavorite": [...],
    "latestCompleted": [...],
    "latestEpisode": [...],
    "newAdded": [...],
    "topUpcoming": [...],
    "top10": {
      "today": [...],
      "week": [...],
      "month": [...]
    },
    "genres": [...]
  }
}
```

---

### 2. GET Anime List Page

Retrieve anime lists based on various categories and filters.

**Endpoint:**
```
GET /api/v1/animes/{query}/{category}?page={page}
```

**Valid Queries:**

| Query | Has Category | Category Options |
|-------|--------------|------------------|
| `top-airing` | No | - |
| `most-popular` | No | - |
| `most-favorite` | No | - |
| `completed` | No | - |
| `recently-added` | No | - |
| `recently-updated` | No | - |
| `top-upcoming` | No | - |
| `genre` | Yes | all genres |
| `az-list` | Yes | 0-9, all, a-z |
| `subbed-anime` | No | - |
| `dubbed-anime` | No | - |
| `movie` | No | - |
| `tv` | No | - |
| `ova` | No | - |
| `ona` | No | - |
| `special` | No | - |
| `events` | No | - |

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/az-list/0-9?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 1,
      "currentPage": 1,
      "hasNextPage": false
    },
    "response": [
      {
        "title": "0 Years Old Child Starting Dash Story Season 2",
        "alternativeTitle": "0-saiji Start Dash Monogatari Season 2",
        "id": "0-years-old-child-starting-dash-story-season-2-19479",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 12,
          "dub": 0,
          "eps": 12
        },
        "type": "TV",
        "duration": "4m"
      }
    ]
  }
}
```

---

### 3. GET Anime Detailed Info

Retrieve comprehensive information about a specific anime.

**Endpoint:**
```
GET /api/v1/anime/{animeId}
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/anime/attack-on-titan-112');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "title": "Attack on Titan",
    "alternativeTitle": "Shingeki no Kyojin",
    "japanese": "進撃の巨人",
    "id": "attack-on-titan-112",
    "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
    "rating": "R",
    "type": "TV",
    "episodes": {
      "sub": 25,
      "dub": 25,
      "eps": 25
    },
    "synopsis": "...",
    "synonyms": "AoT",
    "aired": {
      "from": "Apr 7, 2013",
      "to": "Sep 29, 2013"
    },
    "premiered": "Spring 2013",
    "duration": "24m",
    "status": "Finished Airing",
    "MAL_score": "8.52",
    "genres": [...],
    "studios": "Wit Studio",
    "producers": [...],
    "moreSeasons": [...],
    "related": [...],
    "mostPopular": [...],
    "recommended": [...]
  }
}
```

---

### 4. GET Search Results

Search for anime by keyword with pagination support.

**Endpoint:**
```
GET /api/v1/search?keyword={query}&page={page}
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/search?keyword=titan&page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 1,
      "currentPage": 1,
      "hasNextPage": false
    },
    "response": [
      {
        "title": "Attack on Titan: The Last Attack",
        "alternativeTitle": "Shingeki no Kyojin Movie: Kanketsu-hen - The Last Attack",
        "id": "attack-on-titan-the-last-attack-19391?ref=search",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 1,
          "dub": 1,
          "eps": 1
        },
        "type": "Movie",
        "duration": "144m"
      }
    ]
  }
}
```

---

### 5. GET Search Suggestions

Get autocomplete suggestions while searching for anime.

**Endpoint:**
```
GET /api/v1/search/suggestion?keyword={query}
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/search/suggestion?keyword=clannad');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": [
    {
      "title": "Clannad: The Movie",
      "alternativeTitle": "Clannad Movie",
      "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
      "id": "clannad-the-movie-2553",
      "aired": "Sep 15, 2007",
      "type": "Movie",
      "duration": "1h 33m"
    }
  ]
}
```

---

### 6. GET Anime Episodes

Retrieve the episode list for a specific anime.

**Endpoint:**
```
GET /api/v1/episodes/{animeId}
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/episodes/steins-gate-3');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": [
    {
      "title": "Turning Point",
      "alternativeTitle": "Hajimari to Owari no Prologue",
      "id": "/watch/steinsgate-3?ep=213",
      "isFiller": false
    }
  ]
}
```

---

### 7. GET Anime Episode Servers

Get available streaming servers for a specific episode.

**Endpoint:**
```
GET /api/v1/servers?id={id}
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/servers?id=steinsgate-3::ep=213');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "episode": 1,
    "sub": [
      {
        "index": 6,
        "type": "sub",
        "id": "1287321",
        "name": "HD-3"
      }
    ],
    "dub": [
      {
        "index": 6,
        "type": "dub",
        "id": "1287289",
        "name": "HD-3"
      }
    ]
  }
}
```

---

### 8. GET Anime Episode Streaming Links

Retrieve streaming links and metadata for a specific episode.

**Endpoint:**
```
GET /api/v1/stream?id={id}&server={server}&type={dub|sub}
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/stream?server=HD-2&type=dub&id=steinsgate-3::ep=214');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "streamingLink": {
      "id": "54874",
      "type": "dub",
      "link": {
        "file": "https://ec.netmagcdn.com:2228/hls-playback/...",
        "type": "hls"
      },
      "tracks": [
        {
          "file": "https://s.megastatics.com/thumbnails/.../thumbnails.vtt",
          "kind": "thumbnails"
        }
      ],
      "intro": {
        "start": 75,
        "end": 165
      },
      "outro": {
        "start": 1330,
        "end": 1419
      },
      "server": "HD-2",
      "iframe": "https://megacloud.blog/embed-2/e-1/ggJPRb9r8nPp?k=1"
    },
    "servers": "HD-2"
  }
}
```

---

## Development

Pull requests and stars are always welcome. If you encounter any bug or want to add a new feature to this API, consider creating a new [issue](https://github.com/ryanwtf88/hianime-api/issues). If you wish to contribute to this project, feel free to make a pull request.

### Frontend Reference

Check out [ANIMO](URL) for a frontend implementation example.

---

## Contributors

Thanks to the following people for keeping this project alive and relevant.

[![Contributors](https://contrib.rocks/image?repo=ryanwtf88/hianime-api)](https://github.com/ryanwtf88/hianime-api/graphs/contributors)

---

## Acknowledgments

Special thanks to the following projects for inspiration and reference:

- [consumet.ts](https://github.com/consumet/consumet.ts)
- [api.consumet.org](https://github.com/consumet/api.consumet.org)

---

## Support

If you find this project useful, please consider giving it a star on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/ryanwtf88/hianime-api?style=social)](https://github.com/ryanwtf88/hianime-api/stargazers)

---

## Star History

<div align="center">
  <img src="https://starchart.cc/ryanwtf88/hianime-api.svg?variant=adaptive" alt="Star History Chart" />
</div>

---

<div align="center">

**Made with ❤️ by RY4N**

[Report Bug](https://github.com/ryanwtf88/hianime-api/issues) • [Request Feature](https://github.com/ryanwtf88/hianime-api/issues)

</div>
