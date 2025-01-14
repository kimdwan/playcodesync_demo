from collections.abc import Iterable
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

# 유저와 관련된 모델 
class Galeo(AbstractUser):
    bnvs_code = models.CharField(max_length=100,null=True,unique=True)
    phone_number = models.CharField(max_length=20,null=True)
    gender = models.CharField(max_length=5,null=True)
    society = models.CharField(max_length=20,null=True)
    introduc = models.TextField(null=True)

    def __str__(self):
        return self.username
    
class Bnvs_Code(models.Model):
    code = models.CharField(max_length=100,primary_key=True)
    Group = models.CharField(max_length=100,null=False)
    create_at = models.TimeField(auto_now_add=True)

    def __str__(self):
        return self.Group
    
class UserAccept(models.Model):
    username = models.ForeignKey(Galeo,models.CASCADE)
    token = models.CharField(primary_key=True,max_length=100)
    accept1 = models.CharField(max_length=10)
    accept2 = models.CharField(max_length=10)
    subaccept = models.CharField(max_length=10)
    time = models.TimeField()
    created_at = models.TimeField(auto_now_add=True)
    class_number = models.IntegerField(default=0)

    class Meta:
        ordering = ["class_number","created_at"]

    def __str__(self):
        return str(self.username)


# 교재 내용과 관련된 모델들 
class Grade(models.Model):
    grade = models.CharField(max_length=100,primary_key=True)
    class_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    class Meta:
        ordering = ['class_number','created_at']

    def __str__(self):
        return self.grade


class Subject(models.Model):
    grade = models.ForeignKey(Grade,models.CASCADE)
    subject = models.CharField(max_length=100,unique=True,null=False)
    origin_subject = models.CharField(max_length=50,primary_key=True) 
    class_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    
    class Meta:
        ordering =["class_number","created_at"]

    def save(self, *args, **kwargs):
        self.origin_subject = "".join(self.subject.split(" "))
        super(Subject, self).save(*args, **kwargs)

    def __str__(self):
        return self.origin_subject


class Chapter(models.Model):
    origin_subject = models.ForeignKey(Subject,models.CASCADE)
    chapter_Number = models.IntegerField(null=False)
    chapter = models.CharField(max_length=100,primary_key=True)
    class_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    class Meta:
        ordering = ['class_number','created_at']

    def __str__(self):
        return self.chapter
    
class Topic(models.Model):
    origin_subject = models.ForeignKey(Subject,models.CASCADE)
    chapter = models.ForeignKey(Chapter,models.CASCADE)
    topic_Number = models.IntegerField(null=False)
    topic = models.CharField(max_length=300,primary_key=True)
    class_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    class Meta: 
        ordering = ["class_number",'created_at']

    def __str__(self):
        return self.topic

class Contents(models.Model):
    origin_subject = models.ForeignKey(Subject,models.CASCADE)
    chapter = models.ForeignKey(Chapter,models.CASCADE)
    topic=models.ForeignKey(Topic,models.CASCADE)
    Contents_Number = models.IntegerField(null=False)
    Contents = models.TextField(null=False)
    class_number = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    class Meta:
        ordering = ["class_number",'created_at']

    def __str__(self):
        return str(self.topic)
    
# 유저의 학습내용과 관련이 있는 코드 
class UserCheckPoint(models.Model):
    username = models.ForeignKey(Galeo, models.CASCADE)
    filename = models.CharField(max_length=100, primary_key=True)
    subject = models.ForeignKey(Subject, models.CASCADE)
    chapter = models.ForeignKey(Chapter, models.CASCADE)
    topic = models.ForeignKey(Topic, models.CASCADE)
    time = models.TimeField(auto_now_add=True)
    timeMonth = models.DateField(null=True)  # DateField로 변경
    time_bool = models.CharField(max_length=30, null=False)
    class_number = models.IntegerField(default=0)

    class Meta:
        ordering = ["class_number", "time"]

    def save(self, *args, **kwargs):
        current_time = datetime.now().date()  # 현재 날짜만 가져와서 저장
        self.timeMonth = current_time
        super(UserCheckPoint, self).save(*args, **kwargs)

    def __str__(self):
        return self.filename
    

class UserCheckData(models.Model):
    username = models.ForeignKey(Galeo,models.CASCADE)
    filename = models.CharField(max_length=100,primary_key=True)
    subject = models.ForeignKey(Subject,models.CASCADE)
    chapter = models.ForeignKey(Chapter,models.CASCADE)
    topic = models.ForeignKey(Topic,models.CASCADE)
    time = models.TimeField(auto_now_add=True)
    message_box = models.JSONField(null=False)
    class_number = models.IntegerField(default=0)

    class Meta:
        ordering = ["class_number","time"]

    def __str__(self) :
        return self.filename

class UserTodayData(models.Model):
    username = models.ForeignKey(Galeo, models.CASCADE)
    filename = models.CharField(max_length=100, primary_key=True)
    date = models.DateField(null=True)
    time = models.TimeField(null=True)
    message_box = models.JSONField()
    class_number = models.IntegerField(default=0)
    currenttime = models.TimeField(auto_now_add=True)

    class Meta:
        ordering = ["class_number", "time"]

    def save(self, *args, **kwargs):
        datetimes = datetime.now()
        self.date = datetimes.date()
        self.time = datetimes.time()
        super(UserTodayData, self).save(*args, **kwargs)

    def __str__(self):
        return self.filename

class UserRecordTime(models.Model):
    username = models.ForeignKey(Galeo,models.CASCADE)
    timeMonth = models.DateField()
    appendTime = models.JSONField(null=False)
    time = models.TimeField(auto_now_add=True)
    class_number = models.IntegerField(default=0)

    class Meta:
        ordering = ["class_number","time"]
    
    def __str__(self):
        return str(self.username)