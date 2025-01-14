from django.conf import settings
from django.http import JsonResponse
from django.views import View
import openai
import json

# OpenAI API Key 가져오기
if settings.OPENAI_API_KEY:
    openai.api_key = settings.OPENAI_API_KEY
else:
    raise Exception('OpenAI API Key not found')

# v1은 fewshot, v2는 functioncall로 일단 작업하겠습니다. 
class MainSystem():

    def __init__(self):
        self.messages = []
        self.model = ""
        self.function = []
        self.userprompt = []
        self.n = 0

    # message,num을 받음
    def version1(self,data,temperature=0):
        output_list = []
        num = data['num']
        mes = data['message']
        if self.n > 0:
            message_box = self.userprompt.insert(self.n,mes)
            message = "\n".join(message_box)
        else:
            message = mes
        add_message = {'role':'user','content':message}

        ms_box = self.messages[:]
        # 추가적인 프롬프트 
        try:
            plusText =data["allText"]
            for text in plusText:
                ms_box.append(text)
        except:
            pass
        ms_box.append(add_message)
        for i in range(num):
            response = openai.ChatCompletion.create(
                model = self.model,
                messages = ms_box,
                temperature = temperature)
            res = response.choices[0].message.content
            output_list.append(res)
        
        return {"output":output_list}
    
    def version2(self,data,functions_call,temperature=0):
        output_list = []
        num = data['num']
        mes = data['message']
        message_box = self.userprompt.insert(self.n,mes)
        add_message = "\n".join(message_box)
        ms_box = self.messages.copy()
        ms_box.append(add_message)
        
        for i in range(num):
            response = openai.ChatCompletion.create(
                model = self.model,
                messages = ms_box,
                functions =self.function,
                functions_call = functions_call,
            )

            res = json.loads(response["choices"][0]["message"]['function_call']['arguments'])
            output_list.append(res)

        return {'output':output_list}



        

