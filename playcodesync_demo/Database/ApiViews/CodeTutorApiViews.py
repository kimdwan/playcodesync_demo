from rest_framework import viewsets, status
from rest_framework.response import Response
from ..serializers import CodeTutorSz
from ..models import Galeo,Subject,Chapter,Topic,Contents,UserCheckPoint,UserCheckData,UserTodayData,UserRecordTime
from django.core.cache import cache
from rest_framework.views import APIView
from django.forms.models import model_to_dict
import json
from datetime import datetime
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.views import APIView


class ChapterViewSets(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.ChapterSerializer
    
    def list(self, request, *args, **kwargs):
        origin_subject = kwargs.get("origin_subject")
        origin_subject_instance = Subject.objects.get(origin_subject=origin_subject)
        queryset = Chapter.objects.filter(origin_subject=origin_subject_instance)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"output": serializer.data, 'status': status.HTTP_200_OK})
    
    
class TopicViewSets(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.TopicSerializer

    def list(self, request, *args, **kwargs):
        origin_subject = kwargs.get('origin_subject')
        origin_subject_instance = Subject.objects.get(origin_subject=origin_subject)
        queryset = Topic.objects.filter(origin_subject=origin_subject_instance)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"output": serializer.data, 'status': status.HTTP_200_OK})

    def create(self, request, *args, **kwargs):
        datas = request.data
        chapter = datas["chapter"]
        if cache.get(chapter):
            output = json.loads(cache.get(chapter))
            return Response({"output": output}, status=status.HTTP_202_ACCEPTED)
        else:
            chapter_instance = Chapter.objects.get(chapter=chapter)
            topic_instance = Topic.objects.filter(chapter=chapter_instance)
            serializer = CodeTutorSz.TopicSerializer(topic_instance, many=True)
            serialized_data = serializer.data  
            cache.set(chapter, json.dumps(serialized_data), 6400)
            return Response({'output': serialized_data}, status=status.HTTP_201_CREATED)    

class ContentsViewSets(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.ContentsSerializer
    
    def list(self,request,*args,**kwargs):
        origin_subject = kwargs.get('origin_subject')
        origin_subject_instance = Subject.objects.get(origin_subject=origin_subject)
        queryset = Contents.objects.filter(origin_subject=origin_subject_instance)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"output": serializer.data, 'status': status.HTTP_200_OK})

    def create(self,request,*args,**kwargs):
        chapter = request.data["chapter"]
        chapter_instance = Chapter.objects.get(chapter=chapter)
        queryset = Contents.objects.filter(chapter=chapter_instance)
        for query in queryset:
            cache_key = f"{query.topic}_{query.Contents_Number}"
            cache.set(cache_key, query.Contents, 1600)  
        serializer = self.get_serializer(queryset,many=True)
        return Response({"output":serializer.data,"status":status.HTTP_200_OK})
    

class TopicContentsViewsets(viewsets.ViewSet):
    def create(self, request,*args,**kwargs):
        topic = request.data["topic"]
        user = kwargs.get('username')
        url_name = f'{user}_{topic}_{user}'

        if cache.get(url_name):
            data = {"datas": json.loads(cache.get(url_name))}
            return Response(data,status=status.HTTP_200_OK)
        else:
            topic_instance = Topic.objects.get(topic=topic)
            get_data = Contents.objects.get(topic=topic_instance)
            data = {"contents":get_data.Contents,"numbers":get_data.Contents_Number}
            cache.set(url_name,json.dumps(data),1600)
            return Response({"datas":data},status=status.HTTP_200_OK)

class ChapterContentsViewsets(viewsets.ViewSet):
    
    def create(self, request, *args, **kwargs):
        username = kwargs.get('username')
        datas = request.data
        chapter = datas["chapter"][:-5]
        number = int(datas["numbers"]) + 1
        urlname = f"{username}_{chapter}_{number}_{username}"
        chapter_instanse = Chapter.objects.get(chapter=chapter)

        if cache.get(urlname):
            cache_data = json.loads(cache.get(urlname))
            return Response({"datas":cache_data},status=status.HTTP_200_OK)
        
        else:
            queryset = Contents.objects.get(chapter=chapter_instanse,Contents_Number=number)
            topics = model_to_dict(queryset.topic)
            dic = {"topic":topics['topic'],"contents":queryset.Contents,"numbers":queryset.Contents_Number}
            cache.set(urlname,json.dumps(dic),1200)
            return Response({"datas":dic},status.HTTP_200_OK)

class UserCheckViewSets(viewsets.ViewSet):

    def create(self, request, *args, **kwargs):
        try:
            username = kwargs.get('username')
            datas = request.data
            subject = kwargs.get('origin_subject')
            chapter = datas['chapter'][:-5]
            topic = datas['topic']
            boolean = datas['boolean']  
            current_time = datetime.now()
            current_month_day = current_time.strftime(r'%Y%m%d')

            filename = f"{username}_{current_month_day}_{subject}_{chapter}_{topic}_{boolean}"

            username_instance = Galeo.objects.get(username=username)
            subject_instance = Subject.objects.get(origin_subject=subject)
            chapter_instance = Chapter.objects.get(chapter=chapter)
            topic_instance = Topic.objects.get(topic=topic)
            usercheck_instance = UserCheckPoint(
                username=username_instance,
                filename=filename,
                subject=subject_instance,
                chapter=chapter_instance,
                topic=topic_instance,
                time=current_time,
                time_bool=boolean
            )
            usercheck_instance.save()

            return Response({"output": "저장 성공"}, status=status.HTTP_201_CREATED)

        except Galeo.DoesNotExist:
            return Response({"output": "해당 사용자가 존재하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)
        except (Subject.DoesNotExist, Chapter.DoesNotExist, Topic.DoesNotExist) as e:
            return Response({"output": f"필요한 객체가 존재하지 않습니다: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"output": f"에러 발생: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDataViewSets(viewsets.ModelViewSet):
    queryset = UserCheckData.objects.all()
    serializer_class = CodeTutorSz.UserDataSerializer

    def create(self, request, *args, **kwargs):
        username = kwargs.get('username')
        username_instance = Galeo.objects.get(username=username)
        subject = kwargs.get('origin_subject')
        subject_instance = Subject.objects.get(origin_subject = subject)
        datas = request.data
        chapter = datas['chapter'][:-5]
        chapter_instance = Chapter.objects.get(chapter=chapter)
        topic = datas['topic']
        topic_instance = Topic.objects.get(topic=topic)
        message_box = datas['message_box']
        current_date = datetime.now()
        currents = current_date.strftime(r'%Y%m%d')
        filename = f"{username}_{currents}_{subject}_{chapter}_{topic}_end"

        userdatas_instance = UserCheckData(
            username = username_instance,
            filename = filename,
            subject = subject_instance,
            chapter = chapter_instance,
            topic = topic_instance,
            time = current_date ,
            message_box = message_box,
        )
        userdatas_instance.save()

        
        return Response({"output":"큰 데이터도 저장 완료"},status.HTTP_200_OK)


# 유저의 정보를 받아주는 뷰셋
class getUserData(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.UserPointSerializer

    def list(self, request, *args, **kwargs):
        username = kwargs.get('username')
        username_instance = Galeo.objects.get(username=username)
        time = datetime.now().date()
        queryset = UserCheckPoint.objects.filter(username=username_instance,timeMonth=time)
        redis_folder_name = f"{username}_useruserget_{len(queryset)}_{time}"
        if cache.get(redis_folder_name):
            data = json.loads(cache.get(redis_folder_name))
            return Response({"output": data}, status.HTTP_202_ACCEPTED)
        else:
            delet_item = []
            for query in queryset:
                if query.time_bool == "end":
                    chapter = query.chapter
                    topic = query.topic
                    chapter_instance = Chapter.objects.get(chapter=chapter)
                    topic_instance = Topic.objects.get(topic=topic)
                    delete_instance = UserCheckPoint.objects.filter(username=username_instance, chapter=chapter_instance, topic=topic_instance, time_bool="start",timeMonth=time)
                    delet_item.extend(delete_instance)
            # 새로운 QuerySet을 생성하여 필터링된 객체를 제외하고 가져옵니다.
            queryset = queryset.exclude(filename__in=[item.filename for item in delet_item])
            serializer = self.serializer_class(queryset, many=True)
            datas = serializer.data
            cache.set(redis_folder_name, json.dumps(datas), 3600)
            return Response({"output": datas}, status.HTTP_201_CREATED)

# 기록물을 가져오는 함수 
class UserGetHistory(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.UserCheckData

    def create(self, request, *args, **kwargs):
        username = kwargs.get('username')
        username_instance = Galeo.objects.get(username=username)
        filename = request.data.get("filename")

        cached_data = cache.get(filename)
        if cached_data:
            datas = json.loads(cached_data)
            # 캐시에 데이터가 있는 경우 캐시에서 반환
            return Response({'output': datas}, status.HTTP_200_OK)
        else:
            try:
                # 데이터베이스에서 데이터 조회
                queryset = UserCheckData.objects.get(username=username_instance, filename=filename)
                serialized_data = {
                    "message_box": queryset.message_box,
                    "date":datetime.now().date().strftime('%Y-%m-%d'),
                    "time": queryset.time.strftime('%H:%M:%S')  # 시간을 문자열로 변환
                }
                
                # 캐시에 데이터 저장 (유효기간 24시간)
                cache.set(filename, json.dumps(serialized_data), 86400)
                return Response({'output': serialized_data}, status.HTTP_200_OK)

            except UserCheckData.DoesNotExist:
                # 해당 기록물이 없을 경우 에러 응답
                return Response({'error': 'Record not found'}, status.HTTP_404_NOT_FOUND)


class UserHistoringData(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.UserHistoringSerializer

    def create(self, request, *args, **kwargs):
        username = kwargs.get('username')
        origin_subject = kwargs.get('origin_subject')

        datas = request.data
        chapter = datas["chapter"][:-5]
        topic = datas["topic"]
        current_time = datetime.now()
        month = current_time.strftime(r'%Y%m%d')
        boolean = datas["boolean"]
        mainMessage = datas["message_box"]
        filename = f"{username}_{month}_{origin_subject}_{chapter}_{topic}_{boolean}"
        redis_name = f"{filename}_redis_dic"
        # 인스턴스 
        username_instance = Galeo.objects.get(username=username)
        try:
            cache.set(redis_name,json.dumps([{"ai-chat":mainMessage}]),86400)
            # 기존 데이터가 있는지 확인
            existing_data = UserTodayData.objects.filter(username=username_instance, filename=filename).exists()
            if not existing_data:
                history_instance = UserTodayData(
                    username=username_instance,
                    filename=filename,
                    message_box=[{"ai-chat":mainMessage}],
                )
                history_instance.save()

                return Response({"output": filename}, status.HTTP_201_CREATED)
            else:
                return Response({"output": filename}, status.HTTP_202_ACCEPTED)
        except:
            return Response({"output": filename}, status.HTTP_202_ACCEPTED)

class historingDatas(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.UserHistoringSerializer

    def create(self, request, *args, **kwargs):
        datas = request.data
        filename = datas["filename"]
        redis_name = f"{filename}_redis_dic"
        times = datetime.now()

        if cache.get(redis_name):
            datas = json.loads(cache.get(redis_name))
            user_data_instance = UserTodayData.objects.get(filename=filename)
            user_data_instance.message_box = datas
            user_data_instance.save()
            return Response({"output":datas,"date":times.date(),"time":times.time()},status.HTTP_202_ACCEPTED)
        
        else:
            model_instance = UserTodayData.objects.get(filename=filename)
            messageBox = model_instance.message_box
            cache.set(redis_name,json.dumps(messageBox),86400)
            return Response({"output":messageBox,"date":times.date(),"time":times.time()},status.HTTP_201_CREATED)

class UsergetTimeValues(viewsets.ModelViewSet):
    
    def create(self, request, *args, **kwargs):
        username = kwargs.get('username')
        username_instance = Galeo.objects.get(username=username)
        timeValue = datetime.now()
        date = timeValue.date()
        datas = request.data["time"]

        try:
            time_instance = UserRecordTime.objects.get(username=username_instance,timeMonth=date)
            time_instance.appendTime.append(datas)
            time_instance.save()
            print("저장 완료")
            return Response({"output":"저장완료"})
        except:
            time_instance = UserRecordTime(
                username = username_instance,
                appendTime = [datas],
                timeMonth =  date
            )
            time_instance.save()
            print("새거 저장")
            return Response({"output":"저장완료"})

class initialChapterTopic(viewsets.ModelViewSet):
    serializer_class = CodeTutorSz.ContentsSerializer
    def list(self, request, *args, **kwargs):
        print("안녕")
        # 이름들 가져오기 
        subject_name = kwargs.get('origin_subject')
        chapter_number = kwargs.get("chapter_number")
        topic_number = kwargs.get("topic_number")

        # 인스턴스 가져오기 
        subject_instance = Subject.objects.get(origin_subject = subject_name)
        chapter_instance = Chapter.objects.get(origin_subject=subject_instance,chapter_Number=int(chapter_number))
        topic_instance = Topic.objects.get(chapter=chapter_instance,topic_Number= int(topic_number))

        # 원하는 데이터 
        chapter_full = Topic.objects.filter(chapter=chapter_instance)
        want_contents = Contents.objects.get(origin_subject=subject_instance,chapter=chapter_instance,topic=topic_instance)

        # 정리 
        serializer_data = self.serializer_class(want_contents)
        total_number = len(chapter_full)

        return Response({"contents":serializer_data.data,"totalNumber":total_number,"currentNumber":topic_number},status.HTTP_202_ACCEPTED)
        
    
