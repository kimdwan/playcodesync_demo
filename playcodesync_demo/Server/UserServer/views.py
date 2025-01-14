from typing import Any
from django.shortcuts import render
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin 
from Database import models
from django.core.cache import cache
from . import forms
from django.urls import reverse_lazy
import json

class MainPage(LoginRequiredMixin,generic.TemplateView):
    template_name = "UserServer/MainPage.html" 
    
    def to_json(self):
        # 이 메서드는 JSON 직렬화 가능한 데이터로 변환하는 예시입니다.
        return {
            'username': self.request.user.username,
            # 다른 필요한 데이터를 추가할 수 있습니다.
        }

    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        context["username"] = self.request.user.username

        if cache.get(f'username_{context["username"]}'):
            item = cache.get(f'username_{context["username"]}')
            context.update(item)
        else:
            data = self.to_json()  # to_json() 메서드의 반환 값을 변수에 할당 
            grad_list = models.Grade.objects.get(grade="고등")
            subject_list = models.Subject.objects.filter(origin_subject="파이썬일반")
            data["grade"] = grad_list
            context["grade"] = grad_list
            data['subject'] = subject_list
            context["subject"] = subject_list
            cache.set(f'username_{context["username"]}', data, 3600)

        return context

class UserUpdatePage(LoginRequiredMixin, generic.FormView):
    form_class = forms.UserForm
    template_name = "UserServer/UserUpdate.html"
    success_url = reverse_lazy("DoorServer:LoginPage")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        phoneNumber = self.request.user.phone_number
        if phoneNumber:
            context["firstNumber"] = phoneNumber[:3]
            context['middleNumber'] = phoneNumber[3:7]
            context["lastNumber"] = phoneNumber[7:]
            return context
        else:
            context["firstNumber"] = "000"
            context['middleNumber'] = "0000"
            context["lastNumber"] = "0000"
            return context

    def form_valid(self, form):
        # 폼 데이터가 유효하면 이 메서드가 호출됩니다.
        user = self.request.user
        user.set_password(form.cleaned_data['password1'])
        user.save()
        return super().form_valid(form)
