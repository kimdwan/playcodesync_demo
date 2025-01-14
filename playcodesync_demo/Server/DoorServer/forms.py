from Database import models
from django.contrib.auth.forms import AuthenticationForm
from django.forms import ModelForm
from django import forms
from django.core.exceptions import ValidationError


class SignForms(ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)


    class Meta:
        model = models.Galeo
        fields = ["username", 'email',"bnvs_code"]

    def clean_bnvs_code(self):
        bnvs_code = self.cleaned_data.get("bnvs_code")
        try:
            bnvs_code_box = models.Bnvs_Code.objects.get(code=bnvs_code)
            
        except models.Bnvs_Code.DoesNotExist:
            raise ValidationError("Invalid BNVS Code")
        return bnvs_code

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        user.bnvs_code = self.cleaned_data['bnvs_code']
        if commit:
            user.save()
        return user


