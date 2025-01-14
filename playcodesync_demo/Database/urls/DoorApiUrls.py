from ..ApiViews import DoorApiViews
from django.urls import path,include
from rest_framework.routers import DefaultRouter

app_name = "DoorApi"

urlpatterns = []

router = DefaultRouter()
router.register('check/doorserver/obedia',DoorApiViews.CheckAgree,basename="check")

urlpatterns += router.urls

