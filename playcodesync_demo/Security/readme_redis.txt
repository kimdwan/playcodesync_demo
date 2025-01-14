# 레디스 관련 문서 

1. redis로 cache데이터를 적절하게 수집 저장 할 수 있다면 개이득 
2. redis는 postgresql 처럼 관계형 데이터 베이스가 아닌 단순 key value
이다 따라서 빠른 저장이 가능하다. 

# lsb-release를 설치하고 gpg 문서를 가져온다 
sudo apt install lsb-release curl gpg

# 자동으로 업로드 해주는 snap을 이용해서 redis를 설치한다. 
sudo snap install redis

# snap 서비스를 확인하기 위해서 
sudo snap services -> 현재 운영중인 snap services 확인 가능 

# redis server에 연결하는 방법  
- snap 폴더 안에 redis가 있으니 지우지 않도록 한다. 
- 우분투 환경에서 -> redis.cli (sudo snap alias redis.cli redis-cli)
- 일반 터미널  -> redis-cli 

# 보통 redis는 port 6379 사용 중 
# 명령어 
1. set key value -> key에 value를 저장 
2. get key -> key값 보여줌 

# 파이썬에서 레디스 사용하기 
1. pip install redis -> 레디스 설치 
2. 장고에서 python 함수로 사용할 수 있게 하려면 pip install django-redis 
3. 파이썬 명령어로 redis 사용 가능 


