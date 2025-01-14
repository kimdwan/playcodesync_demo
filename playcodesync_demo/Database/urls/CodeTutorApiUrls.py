from django.urls import path,include
from rest_framework.routers import DefaultRouter
from ..ApiViews.CodeTutorApiViews import TopicViewSets,ContentsViewSets,TopicContentsViewsets,ChapterContentsViewsets,UserCheckViewSets,getUserData,UserDataViewSets,UserGetHistory,UserHistoringData,historingDatas,UsergetTimeValues,initialChapterTopic

app_name = "CodeTutorApi"

urlpatterns = []

routers = DefaultRouter()

routers.register('topic/codetutor/obedia',TopicViewSets,basename="topics")
routers.register('contents/codetutor/obedia',ContentsViewSets,basename="contents")
routers.register('contents/topic/codetutor/obedia',TopicContentsViewsets,basename='contentstopic')
routers.register('contents/chapter/codetutor/obedia',ChapterContentsViewsets,basename='contentschapter')
routers.register('checkpoint/codetutor/obedia',UserCheckViewSets,basename="checkpoint")
routers.register('checkdatas/codetutor/obedia',UserDataViewSets,basename='checkdatas')
routers.register('getpoint/codetutor/obedia',getUserData,basename="getuserdatas")
routers.register('getdatas/codetutor/obedia',UserGetHistory,basename="getHistory")
routers.register('historydata/codetutor/obedia',UserHistoringData,basename="UserHistoring")
routers.register('historycheck/codetutor/obedia',historingDatas,basename="UserCheck")
routers.register('savetime/codetutor/obedia',UsergetTimeValues,basename="usergetTime")
routers.register("initial/codetutor/obedia",initialChapterTopic,basename="initialChaTop")

urlpatterns += routers.urls
