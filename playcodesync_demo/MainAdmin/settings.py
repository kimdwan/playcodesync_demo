from pathlib import Path
import os 
from dotenv import load_dotenv
import mimetypes

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(os.environ.get("DEBUG"))

if DEBUG:
    mimetypes.add_type("application/javascript", ".js", True)

ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS').split(" ")

# 기본 설정들 
INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]


#서버 관련 
INSTALLED_APPS += [
    'Server.DoorServer.apps.DoorserverConfig',
    'Server.UserServer.apps.UserserverConfig',
    'Server.CodeTutorServer.apps.CodetutorserverConfig',
]


#DB 관련 
INSTALLED_APPS += [
    "rest_framework",
    'django_filters',
    'Database.apps.DatabaseConfig',
]

#BD 관련 
INSTALLED_APPS += [
    'Backend.apps.BackendConfig',
]




MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'MainAdmin.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,"Frontend","templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'MainAdmin.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
"""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'bnvs',
        'USER': 'bnvs_db',
        'PASSWORD': os.environ.get("DATABASE_PASSWORD"),
        'HOST': os.environ.get("DATABASE_HOST"),
        'PORT': os.environ.get("DATABASE_PORT"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'ko-kr'  # 한국어 로케일로 변경

TIME_ZONE = 'Asia/Seoul'  # 한국 시간대로 변경

USE_I18N = True

USE_L10N = True  

STATIC_URL = "Frontend/static/"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR,STATIC_URL)
]

STATIC_ROOT = os.path.join(BASE_DIR,"..","Nginx")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL=os.environ.get("AUTH_USER_MODEL")

LOGIN_URL = os.environ.get('LOGIN_URL')

LOGIN_REDIRECT_URL = os.environ.get('LOGIN_REDIRECT_URL')

LOGOUT_REDIRECT_URL = os.environ.get('LOGOUT_REDIRECT_URL')

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

ASGI_APPLICATION = "MainAdmin.asgi.application"

# 배포환경은 따로 고려한다. (radius고려)
"""
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
"""

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": os.environ.get("REDIS_HOST").split(" ").append(os.environ.get('REDIS_PORT')) 
        },
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://127.0.0.1:{os.environ.get('REDIS_PORT')}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

#비동기 설정 
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = 'true'
