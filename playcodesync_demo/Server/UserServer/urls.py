from django.urls import path,include
from . import views 

app_name = "UserServer"

urlpatterns = [
    path('',views.MainPage.as_view(),name="MainPage"),
    path("update/",views.UserUpdatePage.as_view(),name="UpdatePage"),
    path('<str:origin_subject>/<str:chapter_number>/<str:topic_number>/',include('Server.CodeTutorServer.urls',namespace="CodeTutorServer")),
]

# db와 관련이 있음 

urlpatterns += [
    path('api/', include('Database.urls.UserApiUrls',namespace="UserApi"))
]

