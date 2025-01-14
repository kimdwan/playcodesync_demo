from rest_framework import viewsets,status
from django.core.cache import cache
from rest_framework.response import Response 
from datetime import datetime
from ..models import Galeo
import uuid
import json

class CheckAgree(viewsets.ViewSet):
    def create(self,request,*args,**kwargs):
        datas = request.data
        outputs = datas['output']
        for output in outputs[:2]:
            if output == "no":
                return Response({'output':"필수 동의에 체크해주셔야 합니다."},status.HTTP_204_NO_CONTENT)
        outputs.append(datetime.now().isoformat())
        random_token = uuid.uuid4()
        cache.set(random_token,json.dumps(outputs),6000)
        return Response({"output":random_token},status.HTTP_200_OK)







