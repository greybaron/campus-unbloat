# campus.unbloat.app

CampusUnbloat is the go-to home for any[^1] BA student. It combines both CampusDual and Studentenwerk data into a modern and fast webapp.
This is the frontend and main repository.

[^1]: The only supported mensa provider is Studentenwerk Leipzig, other mensa providers are TBD.

> This project was inspired by the poor condition of campus dual

- wise words by [Simon Nikolaidis](https://github.com/MaRcR11/ba-schedule/commit/882bd3a7d247984c7dded7b2e3b9f8e1bbab54ce).

## Components

**This repo**: SvelteKit-based very cool app.io.dev.sh

🦀 [campus-api](https://github.com/greybaron/campus-api): Adapter API for NetWeaver-based CampusDual

🦀 [mensa-api](https://github.com/greybaron/mensa-api): Adapter API for Studentenwerk Leipzig Mensae

## docker-compose.yml

```yml
services:
  unbloat-frontend:
    image: docker.io/flschmidt/campusunbloat-webapp
    environment:
      - CD_API_URL=http://unbloat-api-campus:8080
      - MENSA_API_URL=http://unbloat-api-mensa:9090

      # Impressum data
      - PUBLIC_IMPRESS_FULLNAME= # your full name
      - PUBLIC_IMPRESS_STRASSE_HAUSNR= # your street and house number
      #- PUBLIC_IMPRESS_ADDRZUSATZ= Optional Adresszusatz
      - PUBLIC_IMPRESS_ORT_PLZ=placeholder_city_zip # your city and zip code
      - PUBLIC_IMPRESS_TELEFON=placeholder_phone # your phone number
      - PUBLIC_IMPRESS_EMAIL=placeholder_email # your email address
    ports:
      - '3000:3000'
    networks:
      - eduroam

  unbloat-api-campus:
    image: docker.io/flschmidt/campusunbloat-api-campus
    environment:
      - JWT_SECRET= # your JWT secret. The longer the better
      - AES_KEY= # your AES key. Has to be 32 bytes or longer (only the first 32 bytes will be used)
    networks:
      - eduroam

  unbloat-api-mensa:
    image: docker.io/flschmidt/campusunbloat-api-mensa
    volumes:
      - mensa_volume:/app/data # used for caching mensa data, technically optional
    networks:
      - eduroam

networks:
  eduroam:
volumes:
  mensa_volume:
```

## Developing

1. Build both APIs

- have a working Rust toolchain (see [here](https://rustup.rs))
- both:
  - install SSL development files (e.g. `libssl-dev` on Debian)
- api-mensa:
  - install SQLite3 development files (e.g. `libsqlite3-dev` on Debian)
- api-campus:
  - install the provided CA (inside that repo (trust me)) unless `GEANT OV RSA CA 4` is already installed
- run `cargo run` in each root

2. Clone this repo

- `npm i`
- `# CD_API_URL=http://localhost:8080 MENSA_API_URL=http://localhost:9090 npm run dev`
  - these environment variables will likely be fine, but adapt them if necessary

## Building

`Dockerfiles` exist in each repo, and workflows exist which demonstrate what needs to be done
