"""
ASGI config for ArticHub project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import auction

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ArticHub.settings")
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(URLRouter(auction.routing.websocket_urlpatterns)),
    }
)

application = get_asgi_application()
