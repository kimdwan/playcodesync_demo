from typing import Any
from django import http
from django.http import HttpResponse
from django.shortcuts import render
from django.views import generic 
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login 
from django.http import HttpResponse
from django.conf import settings
from Database import models
from django.core.cache import cache
from Database import models 
import json
from datetime import datetime
from . import forms

class MainPage (generic.FormView):
    template_name = "DoorServer/MainPage.html"
    form_class = AuthenticationForm
    success_url = "/"

    def form_valid(self, form):
        login(self.request,form.get_user())
        return super().form_valid(form)

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            context['username'] = self.request.user.username
        else:
            context["username"] = "default_username"
        return context

class LoginPage(generic.FormView):
    template_name = "DoorServer/LoginPage.html"
    form_class = AuthenticationForm
    success_url = "/"

    def form_valid(self, form):
        login(self.request,form.get_user())
        return super().form_valid(form)
    
class SignUpInitPage(generic.TemplateView):
    template_name = 'DoorServer/SignUpPageIntro.html'
    
    
class SignInPage(generic.FormView):
    template_name = "DoorServer/SignUpPage.html"
    form_class = forms.SignForms
    success_url = "/login/"

    def dispatch(self, request, *args: Any, **kwargs: Any):
        self.uuid = kwargs.get('uuid')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form: Any):
        user = form.save()
        username = form.cleaned_data.get('username')
        cache_data = json.loads(cache.get(self.uuid))
        username = models.Galeo.objects.get(username=username)
        time_str = cache_data[3]  # '2023-11-05T03:02:59.981237' 형식의 문자열
        time_format = '%Y-%m-%dT%H:%M:%S.%f' if '.' in time_str else '%Y-%m-%dT%H:%M:%S'
        time_obj = datetime.strptime(time_str, time_format)
        
        accept_instance = models.UserAccept(
            username=username,
            token=self.uuid,
            accept1=cache_data[0],
            accept2=cache_data[1],
            subaccept=cache_data[2],
            time=time_obj,  # datetime 객체로 변환한 값 사용
        )
        accept_instance.save()
        return super().form_valid(form)
    
    

