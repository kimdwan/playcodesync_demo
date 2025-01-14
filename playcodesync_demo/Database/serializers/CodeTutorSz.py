from rest_framework import serializers
from ..models import Chapter,Topic,Contents,UserCheckPoint,UserCheckData,UserTodayData


class ChapterSerializer(serializers.ModelSerializer):
    numbers = serializers.SerializerMethodField()
    
    class Meta:
        model = Chapter
        fields = ["origin_subject","chapter","numbers"]
        
    def get_numbers(self,obj):
        return obj.chapter_Number

class TopicSerializer(serializers.ModelSerializer):
    numbers = serializers.SerializerMethodField()
    
    class Meta:
        model = Topic
        fields = ["origin_subject","chapter","topic","numbers"]
        
    def get_numbers(self,obj):
        return obj.topic_Number
        

class ContentsSerializer(serializers.ModelSerializer):
    contents = serializers.SerializerMethodField()
    numbers = serializers.SerializerMethodField()
    
    class Meta:
        model = Contents
        fields = ["origin_subject", "topic", "numbers", "contents","chapter"]
    
    def get_contents(self, obj):
        return obj.Contents

    def get_numbers(self, obj):
        return obj.Contents_Number

class UserPointSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserCheckPoint
        fields = "__all__"

class UserDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCheckData
        fields = "__all__"


class UserHistoringSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserTodayData
        fields = "__all__"