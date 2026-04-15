# ============================================================
#  CityPulse — Unified Multi-Service Dockerfile
#  Uses node:20-bookworm (has both Node.js AND Python 3.11)
#
#  Usage:
#    docker build -t citypulse .
#    docker run -p 5173:80 -p 5000:5000 -p 8000:8000 -p 8001:8001 \
#      --add-host=host.docker.internal:host-gateway \
#      -v ./ml-service/saved_models:/app/ml-service/saved_models \
#      citypulse
# ============================================================

FROM node:20-bookworm

# Python 3 + pip + nginx + supervisor are available in bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-pip \
    python3-venv \
    python3-dev \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── 1. Build React Frontend ────────────────────────────────
COPY client/package.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# ─── 2. Install Express Backend ─────────────────────────────
COPY server/package.json ./server/
RUN cd server && npm install
COPY server/ ./server/
RUN mkdir -p /app/server/uploads

# ─── 3. Install Python ML Service ───────────────────────────
COPY ml-service/requirements.docker.txt ./ml-service/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages \
    -r ml-service/requirements.txt
COPY ml-service/ ./ml-service/
RUN mkdir -p /app/ml-service/saved_models

# ─── 4. Install Python Agent Service ────────────────────────
COPY agent/requirements.txt ./agent/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages \
    -r agent/requirements.txt
COPY agent/ ./agent/

# ─── Nginx Config ───────────────────────────────────────────
RUN rm -f /etc/nginx/sites-enabled/default
RUN printf 'server {\n\
    listen 80;\n\
    root /app/client/dist;\n\
    index index.html;\n\
    location / { try_files $uri $uri/ /index.html; }\n\
    location /api/ {\n\
    proxy_pass http://127.0.0.1:5000;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection "upgrade";\n\
    proxy_set_header Host $host;\n\
    }\n\
    location /socket.io/ {\n\
    proxy_pass http://127.0.0.1:5000;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection "upgrade";\n\
    }\n\
    location /uploads/ { proxy_pass http://127.0.0.1:5000; }\n\
    }\n' > /etc/nginx/sites-enabled/citypulse

# ─── Supervisord Config ────────────────────────────────────
RUN printf '[supervisord]\n\
    nodaemon=true\n\
    logfile=/var/log/supervisord.log\n\
    \n\
    [program:nginx]\n\
    command=nginx -g "daemon off;"\n\
    autostart=true\n\
    autorestart=true\n\
    stdout_logfile=/dev/stdout\n\
    stdout_logfile_maxbytes=0\n\
    stderr_logfile=/dev/stderr\n\
    stderr_logfile_maxbytes=0\n\
    \n\
    [program:express]\n\
    command=node /app/server/server.js\n\
    directory=/app/server\n\
    autostart=true\n\
    autorestart=true\n\
    environment=MONGO_URI="mongodb://host.docker.internal:27017/citypulse",PORT="5000",ML_SERVICE_URL="http://127.0.0.1:8000",AGENT_URL="http://127.0.0.1:8001"\n\
    stdout_logfile=/dev/stdout\n\
    stdout_logfile_maxbytes=0\n\
    stderr_logfile=/dev/stderr\n\
    stderr_logfile_maxbytes=0\n\
    \n\
    [program:ml_service]\n\
    command=python3 -m uvicorn main:app --host 0.0.0.0 --port 8000\n\
    directory=/app/ml-service\n\
    autostart=true\n\
    autorestart=true\n\
    stdout_logfile=/dev/stdout\n\
    stdout_logfile_maxbytes=0\n\
    stderr_logfile=/dev/stderr\n\
    stderr_logfile_maxbytes=0\n\
    \n\
    [program:agent]\n\
    command=python3 -m uvicorn main:app --host 0.0.0.0 --port 8001\n\
    directory=/app/agent\n\
    autostart=true\n\
    autorestart=true\n\
    environment=API_URL="http://127.0.0.1:5000/api",ML_URL="http://127.0.0.1:8000"\n\
    stdout_logfile=/dev/stdout\n\
    stdout_logfile_maxbytes=0\n\
    stderr_logfile=/dev/stderr\n\
    stderr_logfile_maxbytes=0\n' > /etc/supervisor/conf.d/citypulse.conf

EXPOSE 80 5000 8000 8001

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
