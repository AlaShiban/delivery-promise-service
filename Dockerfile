FROM node:20-bullseye

ENV DD_AGENT_MAJOR_VERSION=7
ENV DD_INSTALL_ONLY=true
ENV DD_API_KEY=placeholder

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN bash -c "$(curl -L https://install.datadoghq.com/scripts/install_script_agent7.sh)"

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY services ./services
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3000
CMD ["./start.sh"]
