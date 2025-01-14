from django.urls import path,include
from rest_framework.routers import DefaultRouter
from ..ApiViews.UserApiViews import GradeViewSets,SubjectViewSets,UserRecordViewSets,UserTotalViewSets,UserRecentData,updateUser,recentApi,monthTotalApi,userInGroup

app_name = 'UserApi'

urlpatterns = []

router = DefaultRouter()
router.register('grade/user/obedia',GradeViewSets,basename='grade')
router.register('subject/user/obedia',SubjectViewSets,basename='subject')
router.register('get/point/userserver/obedia',UserRecordViewSets,basename='getpoint')
router.register("total/userserver/obedia",UserTotalViewSets,basename="usertotal")
router.register("recent/userserver/obedia",UserRecentData,basename="userrecent")
router.register('update/userserver/obedia',updateUser,basename="update")
router.register("recentcheckpoint/userserver/obedia",recentApi,basename="recentApi")
router.register("monthcheckpoint/userserver/obedia",monthTotalApi,basename="monthCheckApi")
router.register("groupuser/userserver/obedia",userInGroup,basename="userGroup")

urlpatterns += router.urls
