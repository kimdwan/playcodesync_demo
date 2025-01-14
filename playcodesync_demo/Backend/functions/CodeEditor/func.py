import re
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
import json
from django.template.loader import render_to_string
import openai
from django.conf import settings
import subprocess
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def execute(request, *args, **kwargs):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            code = data.get('code')
            user_input = data.get('input', None)  # 받은 input 값을 가져옵니다.

            # 받은 input 값이 있으면 모든 input() 호출을 입력값으로 대체합니다.
            if user_input is not None:
                # input() 호출을 식별하고 대체하는 정규 표현식
                input_pattern = r"input\(.*?\)"
                code = re.sub(input_pattern, f"'{user_input}'", code)

            result = subprocess.check_output(['python3', '-c', code], stderr=subprocess.STDOUT, timeout=5, universal_newlines=True)
            return JsonResponse({'output': result, 'error': None})
        except json.JSONDecodeError:
            return JsonResponse({'output': None, 'error': 'Invalid JSON'})
        except subprocess.CalledProcessError as e:
            return JsonResponse({'output': e.output, 'error': 'Execution Error'})
        except subprocess.TimeoutExpired:
            return JsonResponse({'output': None, 'error': 'Timeout'})
    else:
        return JsonResponse({'output': None, 'error': 'Invalid Method'})
