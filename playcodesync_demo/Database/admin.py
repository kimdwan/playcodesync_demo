from django.contrib import admin
from . import models 

modelList = [models.Galeo,models.Bnvs_Code,models.UserAccept,models.Grade,models.Subject,models.Chapter,models.Topic,models.Contents,models.UserCheckPoint,models.UserCheckData,models.UserTodayData,models.UserRecordTime]

for mod in modelList:
    admin.site.register(mod)


# Register your models here.
