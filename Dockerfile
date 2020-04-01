FROM node:12-alpine AS assets
WORKDIR /app/assets
COPY ./assets /app/assets
RUN npm install && npm build

FROM elixir:latest
ARG MIX_ENV=prod
ARG DATABASE_URL=postgres://postgres:postgres@localhost/team_mission_dev
ARG SECRET_KEY_BASE=secret
ENV MIX_HOME=/root/.mix
WORKDIR /app
COPY . /app
COPY --from=assets /app/assets/build /app/assets/build
RUN apt-get update
RUN mix local.hex --force
RUN mix local.rebar --force
RUN mix deps.get
RUN mix deps.compile

CMD mix phx.server


