from rest_framework import viewsets, status
from rest_framework.response import Response
from ..serializers import UserSz
from ..models import Grade,Subject,UserRecordTime,Galeo,UserCheckData,Topic,UserTodayData,Chapter,Topic,Bnvs_Code
from datetime import datetime,timedelta
import calendar
from django.core.cache import cache
from rest_framework import status
import json


class GradeViewSets(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = UserSz.GradeSerailizers

    def list(self, request, *args, **kwargs):
        queryset = Grade.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"output":serializer.data,'status':status.HTTP_200_OK})
    
class SubjectViewSets(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = UserSz.SubjectSerializers
    
    def list(self, request, *args, **kwargs):
        queryset = Subject.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'output':serializer.data,"status":status.HTTP_200_OK})
    


class UserRecordViewSets(viewsets.ModelViewSet):
    serializer_class = UserSz.UserRecordSerializer

    def list(self, request, *args, **kwargs):
        username = kwargs.get("username")
        username_instance = Galeo.objects.get(username=username)
        queryset = UserRecordTime.objects.filter(username=username_instance)
        current = datetime.now()
        currentDate = current.date()
        redis_name = f"{currentDate}_{username}_getdatas"
        cached = cache.get(redis_name)

        
        if cached:
            return Response({"output":json.loads(cached)},status.HTTP_202_ACCEPTED)

        else:
            want_name = [{"month":currentDate.strftime("%Y-%m-%d"),"time":["00-00-00"]}]
            seven_days_ago = currentDate - timedelta(days=7)
            for query in queryset:
                timeMonth = query.timeMonth
                if timeMonth > seven_days_ago and  timeMonth <= currentDate:

                    want_name.append({"month":timeMonth.strftime("%Y-%m-%d"),"time":query.appendTime})
            cache.set(redis_name,json.dumps(want_name),30)

            return Response({"output":want_name},status.HTTP_201_CREATED)
      

class UserTotalViewSets(viewsets.ModelViewSet):
    serializer_class = UserSz.TopicSerializers

    def list(self, request, *args, **kwargs):
        username = kwargs.get("username")
        username_instance = Galeo.objects.get(username=username)
        redis_name = f"{username}_total_subject_redis"
        
        cached = cache.get(redis_name)
       
        if cached:
            return Response({"output":json.loads(cached)},status.HTTP_202_ACCEPTED)
        
        else:
            topics = Topic.objects.all()
            serializer = self.serializer_class(topics,many=True)
            end_model_instance = UserCheckData.objects.filter(username=username_instance)
            if len(end_model_instance) > 0:
                end_list = []
                for ends in end_model_instance:
                    dic = {
                        "subject": str(ends.subject),  # Subject 객체를 문자열로 변환
                        "chapter": str(ends.chapter),  # Chapter 객체를 문자열로 변환
                        "topic": str(ends.topic)       # Topic 객체를 문자열로 변환
                    }
                    end_list.append(dic)
            else:
                end_list = []
            datas = {"total":serializer.data,"user":end_list}
            cache.set(redis_name,json.dumps(datas),30)

            return Response({"output":datas},status.HTTP_201_CREATED)
    
class UserRecentData(viewsets.ModelViewSet):
    serializer_class = UserSz.UserRecentSerializer

    def list(self, request, *args, **kwargs):
        username = kwargs.get("username")
        username_instance = Galeo.objects.get(username=username)
        recentData = UserTodayData.objects.filter(username=username_instance)
        redis_name = f"{username}_recent_datas_redis"
        cached = cache.get(redis_name)

        if cached:
            return Response({"output":json.loads(cached)},status.HTTP_202_ACCEPTED)
        else:
            times = datetime.now()
            nowdate = times.date()
            want_datas = recentData.order_by('-date')
            want_data = list(map(lambda x: x.filename, want_datas))
            if len(want_data) == 0:
                want_data.append(f"{username}_{nowdate.strftime(r'%Y%m%d')}_첫시간 이군요 오늘부터 코드 입문해봐요._ _ _ _")
            
            cache.set(redis_name,json.dumps(want_data[0]),30)

            return Response({"output":want_data[0]},status.HTTP_201_CREATED)

class updateUser(viewsets.ModelViewSet):
    serializer_class = UserSz.UserSerializer

    def create(self, request, *args, **kwargs):
        username = kwargs.get("username")
        try:
            user_instance = Galeo.objects.get(username=username)
            datas = request.data

            user_instance.first_name = datas.get('first_name', user_instance.first_name)
            user_instance.last_name = datas.get('last_name', user_instance.last_name)
            user_instance.gender = datas.get('gender', user_instance.gender)
            user_instance.society = datas.get('society', user_instance.society)
            user_instance.introduc = datas.get('introduc', user_instance.introduc)
            user_instance.phone_number = datas.get('phone_number', user_instance.phone_number)

            user_instance.save()
            return Response({'output': "수정 완료"}, status=status.HTTP_202_ACCEPTED)
        except Galeo.DoesNotExist:
            return Response({"output": "사용자를 찾을 수 없습니다"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"output": "오류 발생: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)


class recentApi(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        datas = request.data
        subject_name = datas["subject"]
        try:
            subject_instance = Subject.objects.get(origin_subject=subject_name)
            chapter_name = datas["chapter"]
            topic_name = datas["topic"]
            if chapter_name != " ":
                chapter_instance = Chapter.objects.get(origin_subject=subject_instance,chapter=chapter_name)
                topic_instance = Topic.objects.get(chapter=chapter_instance,topic=topic_name)
                return Response({'chapter_number':chapter_instance.chapter_Number,"topic_number":topic_instance.topic_Number},status.HTTP_202_ACCEPTED)
            else:
                return Response({"chapter_number":1, "topic_number":1},status.HTTP_201_CREATED)
        except:
            return Response({"chapter_number":1, "topic_number":1},status.HTTP_201_CREATED)

class monthTotalApi(viewsets.ModelViewSet):
    serializer_class = UserSz.UserRecordSerializer

    def list(self, request, *args, **kwargs):
        now = datetime.now()
        username = kwargs.get("username")

        redis_name = f"{username}_record_month_total"

        if cache.get(redis_name):
            return Response({"output":json.loads(cache.get(redis_name))},status.HTTP_202_ACCEPTED)

        else:
            user_instance = Galeo.objects.get(username=username)

            current_Year = now.year
            current_Month = now.month

            first_day_month = datetime(current_Year,current_Month,1)
            last_day_month = datetime(current_Year,current_Month, calendar.monthrange(current_Year,current_Month)[1])

            user_total_instance = UserRecordTime.objects.filter(
                username = user_instance,
                timeMonth__month = current_Month
            )  
            
            time_serialize = self.serializer_class(user_total_instance,many=True)
            dataDic = {"userDatas": time_serialize.data,"last_day":last_day_month.isoformat()[:-9]}
            cache.set(redis_name,json.dumps(dataDic),300)

            return Response({"output":dataDic},status.HTTP_201_CREATED)

class userInGroup(viewsets.ModelViewSet):
    serializer_class = UserSz.UserRecordSerializer


    def makeTime(self,dic):
        data_keys = dic.keys()
        datas_box = {}
        for key in data_keys:
            user_dic = dic[key]
            total_hour = 0
            total_min = 0
            for small_dic in user_dic:
                hour = int(small_dic[:2])
                min = int(small_dic[5:7])
                sec = int(small_dic[10:12])
                if sec > 60:
                    sec //= 60
                    total_min += sec
                if min >= 60:
                    new_hour = min // 60
                    total_min += (min % 60)
                    total_hour += new_hour
                elif min < 60:
                    total_min += min
            
            datas_box[key] = {"hour":total_hour,"min":total_min}
        return datas_box

    def list(self, request, *args, **kwargs):
        username = kwargs.get("username")
        username_inst = Galeo.objects.get(username=username)

        try:
            username_instance = Bnvs_Code.objects.get(code=username_inst.bnvs_code)
            group = username_instance.Group
            redis_username = f"{username}_mean_redis"
            redis_groupname = f"{group}_mean_redis"

            if cache.get(redis_username):
                if cache.get(redis_groupname):
                    output = {"user":json.loads(cache.get(redis_username)),"min":json.loads(cache.get(redis_groupname))}
                    return Response(output , status.HTTP_200_OK)
                
            else:
                # 해당 그룹에 속한 모든 Bnvs_Code 가져오기
                group_codes = Bnvs_Code.objects.filter(Group=group).values_list('code', flat=True)

                # 해당 코드에 속한 Galeo 인스턴스 가져오기
                galeo_instances = Galeo.objects.filter(bnvs_code__in=group_codes)

                # 해당 Galeo 인스턴스에 속한 UserRecordTime 객체 가져오기
                user_records = UserRecordTime.objects.filter(username__in=galeo_instances)
                user_mine = UserRecordTime.objects.filter(username=username_inst)

                # 시리얼라이저를 사용하여 데이터 직렬화

                total_dics = {}
                user_dics = {}

                for total_serial in user_records:
                    username_key = total_serial.username.username
                    if username_key in total_dics:
                        total_dics[username_key].extend(total_serial.appendTime)
                    else:
                        total_dics[username_key] = total_serial.appendTime

                for user_serial in user_mine:
                    username_key = total_serial.username.username
                    if username_key in user_dics:
                        user_dics[username_key].extend(user_serial.appendTime)
                    else:
                        user_dics[username_key] = user_serial.appendTime
                
                total = self.makeTime(total_dics)
                user = self.makeTime(user_dics)
                total_key = total.keys()
                total_datas = list(map(lambda x: total[x]["min"],total_key))
                total_mean = sum(total_datas) / len(total_datas)
                
                cache.set(redis_username,json.dumps(user),600)
                cache.set(redis_groupname,json.dumps(total_mean),600)

                output = {"user":user,"min":total_mean}

                return Response(output,status.HTTP_200_OK)

        except Bnvs_Code.DoesNotExist:
            # username_instance가 없는 경우의 처리
            return Response({'error': 'User not found'}, status=404)   
