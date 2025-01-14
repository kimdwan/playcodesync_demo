from ..models import Grade,Subject,Topic,UserRecordTime,UserTodayData,Galeo
from rest_framework import serializers

class GradeSerailizers(serializers.ModelSerializer):

    class Meta:
        model = Grade
        fields = ["grade"]

class SubjectSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Subject
        fields = ["grade",'subject',"origin_subject"]

class TopicSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Topic
        fields = "__all__"

class UserRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserRecordTime
        fields = ["username","timeMonth","appendTime"]


class UserRecentSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserTodayData
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Galeo
        fields = ["first_name","last_name","email","gender","phone_number","society","introduc"]