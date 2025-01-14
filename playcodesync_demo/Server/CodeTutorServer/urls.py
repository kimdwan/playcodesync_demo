from django.urls import path,include
from . import views

app_name = "CodeTutor"

urlpatterns = [
    path('',views.MainPage.as_view(),name="MainPage")
]

# db와 관련된 api 
urlpatterns += [
    path('api/',include("Database.urls.CodeTutorApiUrls",namespace="CodeTutorApi"))
]

# bd와 관련된 api 
urlpatterns += [
    path('backend/',include('Backend.functions.CodeEditor.urls',namespace="CodeTutorBD"))
]