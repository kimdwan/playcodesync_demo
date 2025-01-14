import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
from channels.auth import AuthMiddlewareStack  # 수정된 부분
from Server.CodeTutorServer import codetutor_consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MainAdmin.settings')


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack( 
            URLRouter(
                [
                    path("ws/<str:username>/<str:origin_subject>/", codetutor_consumers.CodeTutorConsumer.as_asgi()),
                ]
            )
        )
    }
)


