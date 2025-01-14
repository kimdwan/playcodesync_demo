from Database import models 
from django.forms import ModelForm
from django import forms
from django.core.exceptions import ValidationError

class UserForm(ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = models.Galeo
        fields = ["password1", "password2"]

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get('password2')
        if not (password1 and password2):
            raise ValidationError("둘다 적어주셔야 합니다.")
        if password1 != password2:
            raise ValidationError("비밀번호를 다시 확인해주세요.")
        return password2
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user