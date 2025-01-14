from django.urls import path,include 
from . import func

app_name = "CodeTutorBD"

urlpatterns = [
    path("code/codetutor/caceres/",func.execute,name="code")
]