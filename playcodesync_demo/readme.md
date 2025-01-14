
# postgresql과 접속이 안되는 이유 
sudo apt install libpq-dev
- 서버문제 postgres와 접속을 해야하는데 header가 없기 때문에 이걸 설치해주어야 한다.

- 권한 문제 메인 컴퓨터에서 해당 유저에게 권한을 줘야 한다. 

# 로그인과 관련된서 
1. 메인이 되는 urls에 
path('',include('django.contrib.auth.urls'))을 추가 
2. templates에 registraion에 login.html, 등으로 이름을 지정해야 하나 urls.py에 
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='myapp/login.html'), name='login'),
    # ... other patterns
]

auth_views를 임포트해서 auth_views를 내가 컨트롤 할 수있다. 

3. 장고에서 로그인 만큼은 forms를 사용하는게 좋을것 같다 그래야 middleware에서 이를 처리하기 훨씬 간편하기 때문이다.
4. forms.py에서 필수가 아니더라도 forms에서 필수로 지정할 수 있다. 
예시: class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
여기서 usercreationform은 create할때 쓰이는 form을 말한다.

# 편리한 기능 
1. word wap을 이용하면 자동으로 줄바꿈해준다. 

# 배운점
1. 자바 스크립트 -> 참조에 따라서 원하는 결과를 못얻을 수도 있다. 
2. if DEBUG:
    import mimetypes
    mimetypes.add_type("application/javascript", ".js", True)
    -> 이걸로 mimetypes를 바꿀수도 있다.
3. redis-server가 돌아가야 websocket 도 사용가능하다

# docker - ubuntu 환경에서 설치 
1. sudo apt install gnome-terminal 
-> 도커가 작동하려면 이걸 깔아야 한다. 

2. sudo apt remove docker-desktop
-> 데스크 탑에 있는 기존의 도커를 지운다. 

3. rm -r $HOME/.docker/desktop
sudo rm /usr/local/bin/com.docker.cli
sudo apt purge docker-desktop
-> 도커의 데스크탑 버전을 다시 설정한다. 

sudo apt-get install ./docker-desktop-<version>-<arch>.deb
-> 이 파일을 환경에 가져와서 실행시키면 된다. 

4. docker run 서버 
-> docker는 열린 상태에서 명령어를 주입할 수 없다 따라서 | 파이프를 활용하는 등을 이용해서 docker
를 원활히 실행할 수 있게 해주어야 한다. 

5. docker에서는 포워딩을 통해서 외부에서 내부로 접속이 가능하고 연결 포트는 한개당 한개야 

6. docker inspect "container명"
-> 이를 이용해서 해당 컨테이터에 설정을 볼 수 있다.
-> 안에 "ENV"에 환경들이 있다.

7. docker에서 안에 컨테이너를 수정하고 싶을때
-> os.environ.get()을 사용해서 안에 문자를 바꾸어 준다.
-> docker run -e "바꾸고 싶은 환경"
-> 이걸로 원하는 환경변수를 변경가능하다.

# dockerfile 구상 

1. os 환경 구축 
2. repo를 업데이트 또는 구축 (저장소)
3. install dependencies using apt -> 의존성 apt를 설치 ->  this img에 관련된 의존성 앱 
4. install python dependencies using apt -> 호환을 위한 apt 설치 
5. 본인의 파일 카피 하여 저장 
6. django면 장고 등 명령어 실행 

# dockerfile 실행 
1. docker built -> 만든 dockerfile을 이용해서 이미지 구상 
2. docker push -> build한 이미지를 배포 

# docker container에 대해서 
1. docker container는 안에서 이름으로 서로 교환된다. 

# docker server관리에 대해서 
1. ansible을 활용하면 docker를 원활히 관리할 수 있다. 

# docker-compose에 대해서 
1. redis, db, python등은 docker hub에서 이미 build 되어 있음으로 image로 지정해도 된다. 
2. 내가 만든 앱을 따로 docker-compose로 지정하려면 image대신 build로 만든다. 
3. docker.io라는 registry는 docker hub에서 제공하는 것으로 설정하지 않으면 기본으로 여기서 가져온다고 생각하면된다.

# docker registry에 대해서 
1. docker image는 registry:user:image로 구성되어 있는데 registry는 공개인 docker.io로 되어있는데 aws에서 제공하는 elasticnet은 private registry이다. 

# docker cpu , memory  제한 
1. docker에서 한개의 페이지에 너무 많은 양이 가지 않도록 docker --cpu 로 제한을 줄 수 있다.(포인트는 퍼센테이지기반) 
예시: docker run --cpus=.5 ubuntu(이미지 이름) 

2. docker에서 memory 제한도 할 수 있다. 
예시: docker run --memory=100. ubuntu

# docker에 환경에 대해서 
1. docker는 다운로드는 virtualbox에서 이루어지나 결국 hyperv에서 저장된다. 


# django 
1. 장고에서는 settings.py에 os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = 'true' 이걸 해 놓아야 비동기 식으로 읽을수가 있다.
2. 장고에서 from channels.db import database_sync_to_async를 임포트하고 @database_sync_to_async를 데코레이터 
하여서 비동기식으로 작성할 수 있다.


# 환경변수 

SECRET_KEY ='django-insecure-qso!nhr1-3h1+steh3%&e6+q)(z^drey45$_ye962gmggg@sx@'

DEBUG =1

DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

DATABASE_PASSWORD="bnvs0720bnvssql"

DATABASE_HOST=localhost

DATABASE_PORT=5432

AUTH_USER_MODEL="Database.Galeo"

LOGIN_URL = 'DoorServer:LoginPage'

LOGIN_REDIRECT_URL = 'DoorServer:MainPage'

LOGOUT_REDIRECT_URL = 'DoorServer:LoginPage'

REDIS_HOST=redis 127.0.0.1 [::1]

REDIS_PORT=6379

# wsl2 우분투 22.04 세팅

aiohttp==3.8.6
aioredis==2.0.1
aiosignal==1.3.1
asgiref==3.7.2
async-timeout==4.0.3
attrs==23.1.0
autobahn==23.6.2
Automat==22.10.0
blinker==1.4
certifi==2023.7.22
cffi==1.16.0
channels==4.0.0
channels-redis==4.1.0
charset-normalizer==3.3.1
colorama==0.4.6
constantly==15.1.0
cryptography==41.0.5
daphne==4.0.0
distro==1.7.0
Django==4.1
django-filter==23.3
django-redis==5.4.0
django-rest-framework==0.1.0
djangorestframework==3.14.0
frozenlist==1.4.0
httplib2==0.20.2
hyperlink==21.0.0
idna==3.4
importlib-metadata==4.6.4
incremental==22.10.0
jeepney==0.7.1
keyring==23.5.0
launchpadlib==1.10.16
lazr.restfulclient==0.14.4
lazr.uri==1.0.6
Markdown==3.5
more-itertools==8.10.0
msgpack==1.0.7
multidict==6.0.4
oauthlib==3.2.0
openai==0.28.1
pyasn1==0.5.0
pyasn1-modules==0.3.0
pycparser==2.21
PyJWT==2.3.0
pyOpenSSL==23.2.0
pyparsing==2.4.7
python-dotenv==1.0.0
pytz==2023.3.post1
redis==5.0.1
requests==2.31.0
SecretStorage==3.3.1
service-identity==23.1.0
six==1.16.0
sqlparse==0.4.4
tqdm==4.66.1
Twisted==23.8.0
txaio==23.1.1
typing_extensions==4.8.0
tzdata==2023.3
urllib3==2.0.7
wadllib==1.3.6
yarl==1.9.2
zipp==1.0.0
zope.interface==6.1



-> docker에도 이를 반영해서 처리해야 한다.
# netifaces 오류시 하는 법
sudo apt-get update
sudo apt-get install build-essential python3-dev libffi-dev
-> 이들을 설치한다

# postgres 의존성 문제 
sudo apt-get install libpq-dev
-> 설치