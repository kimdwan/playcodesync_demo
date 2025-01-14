FROM python:3.10

RUN mkdir -p /app/backend/django_backend/

WORKDIR /app/backend/django_backend/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    zlib1g-dev \
    libjpeg-dev \
    libc6-dev \    
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --upgrade pip \
 && pip install -r requirements.txt