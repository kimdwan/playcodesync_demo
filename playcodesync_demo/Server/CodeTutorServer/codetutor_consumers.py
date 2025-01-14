from channels.generic.websocket import AsyncWebsocketConsumer
from Backend.functions.ChatGpt import prod
from Database.models import UserTodayData
from django.core.cache import cache
from django.forms.models import model_to_dict
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json

sub = ""
chatgpt = None
class CodeTutorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 그룹에 추가
        await self.channel_layer.group_add("chat", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # 그룹에서 제거
        await self.channel_layer.group_discard("chat", self.channel_name)

    # 이 메서드는 그룹으로부터 메시지를 받을 때 호출됩니다.
    async def receive(self, text_data):
        global sub
        global chatgpt

        data = json.loads(text_data)
        message = data['message']
        name = message["name"]
        filename =  message["filename"]
        if sub != message['sub']: 
            sub = message['sub']
            if sub == "파이썬일반":
                chatgpt = prod.exBot()
            elif sub == "파이썬기초":
                chatgpt=prod.tutorBot()
        if chatgpt: 
            pass 
        
        chat_ipt = chatgpt.version1(message)

        # 웹소켓으로 메시지 받았을 때 처리할 내용
        await self.send(text_data=json.dumps({
            'message': chat_ipt,
            "name" : "ai-chat",
            "filename" : filename
        }))    
        
        redis_name = f"{filename}_redis_dic"

        
        cached = await self.get_cache(redis_name)
        user_chat = {name:message["message"]}
        ai_chat = {"ai-chat":chat_ipt["output"][0]}
        for i in [user_chat,ai_chat]:
            cached.append(i)
        await self.set_cache(redis_name,cached)
        
    @database_sync_to_async
    def get_cache(self,key):
        return json.loads(cache.get(key) or "[]")
        
    @database_sync_to_async
    def set_cache(self,key,value):
        cache.set(key,json.dumps(value),timeout=86400)
        

