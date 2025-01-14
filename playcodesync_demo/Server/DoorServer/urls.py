from django.urls import path,include
from . import views
from django.contrib.auth.views import LoginView,LogoutView

app_name="DoorServer"

urlpatterns = [
    path('',views.MainPage.as_view(),name='MainPage'),
    path("login/",views.LoginPage.as_view(),name='LoginPage'),
    path('logout/', LogoutView.as_view(next_page='DoorServer:LoginPage'), name='LogoutPage'),
    path('signupinit/',views.SignUpInitPage.as_view(),name='SignUpPageInit'),
    path("signupinit/<str:uuid>/",views.SignInPage.as_view(),name='SignInPage'),
    path('<str:username>/',include("Server.UserServer.urls",namespace="UserServer")),
]

#api키 관련 
urlpatterns += [
    path('signupinit/api/',include('Database.urls.DoorApiUrls',namespace="DoorApi"))
]

