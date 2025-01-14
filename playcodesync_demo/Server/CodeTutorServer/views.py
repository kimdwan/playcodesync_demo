from typing import Any
from django.shortcuts import render
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.cache import cache
from Database import models 

class MainPage(LoginRequiredMixin,generic.TemplateView):
    template_name = "CodeTutorServer/MainPage.html"

    def to_json(self):
        return {
            "username":self.request.user.username
        }
    
    def get_context_data(self, **kwargs: Any):
        context = super().get_context_data(**kwargs)
        origin_subject_name = kwargs.get('origin_subject')
        context["username"] = self.request.user.username

        if cache.get(f'codetutor_page_{context["username"]}_{origin_subject_name}'):
            item = cache.get(f'codetutor_page_{context["username"]}_{origin_subject_name}')
            context.update(item)
        
        else:
            data = self.to_json()  # to_json() 메서드의 반환 값을 변수에 할당 
            origin_subject_instance = models.Subject.objects.get(origin_subject=origin_subject_name)
            chapter_list =  models.Chapter.objects.filter(origin_subject=origin_subject_instance)
            topic_list = models.Topic.objects.filter(origin_subject=origin_subject_instance)
            data["chapter"] = chapter_list 
            context["chapter"] = chapter_list  
            data['topic'] = topic_list
            context["topic"] = topic_list
            cache.set(f'codetutor_page_{context["username"]}', data, 600)

        return context
    
