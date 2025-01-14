# 리눅스 환경에서 postgresql 설치하기 ubuntu 22.04,20.04 모두 사용가능 

# postgresql를 레파지토리를 받아옵니다. -> 위치는 자유롭게 지정해도 되나 잊을 수 있으니 메뉴얼을 따르세요.
# 이게 제일 중요 
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# 받아온 키로 인증서를 받아옵니다. 
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# sudo를 업데이트 합니다. 
sudo apt-get update

# postgresql을 설치합니다. - 데이터 베이스 설치 
sudo apt-get -y install postgresql

# postgresql 앱을 들어가는 작업이라고 생각하면 된다. 
sudo -i -u postgres
exit로 나간다 

# 사용자 전환 후 다루는 법 
psql -> 서버 접속 
\q -> 나가기 
created "이름" -> playcodesync라는 데이터 베이스 생성
psql -d "이름" -> 데이터베이스 접속 
 \conninfo -> 현제 내가 위치한 데이터 베이스 
\password "이름" -> 내가 사용하고자 하는 이름의 비밀번호를 지정한다. 
psql -U postgres -d bnvs -> 내가 들어가고 싶은 데이터 베이스로 들감 

# 장고에서 사용하기 위해서 리눅스에서 설정해야 하는것 
sudo -u postgres createdb bnvs -O bnvs_db -> bnvs폴더 만들고 안에 bnvs_db라는 사용자를 만든다. 
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bnvs TO bnvs_db;" -> 모든 권한 부여 
sudo -u postgres psql -c "\l" -> 권한이 잘 들어갔는지 확인 하기 

-> 안된다면 삭제 db 삭제후 다시 설정 
sudo -u postgres dropdb bnvs


# 리눅스 환경에서 pgadmin 설치 -> postgresql을 ui 적으로 관리할 수 있게 해준다. 
(sudo apt install curl을 우선해준다.)

# pgadmin의 키를 설정 위치는 일단 지정해준대로 해주는걸 권장 (나중에 보안을 위해서 옮길수는 있으나 db를 정말 잘알아야 한다.)
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg

# pgadmin 설치에 필요한 요소를 다운로드 해준다.
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

# pgadmin 설치 최신버전 
sudo apt install pgadmin4 

# pgadmin을 desktop에서 사용할 수 있게 해주는 명령어 - 한개의 컴퓨터에서만 pgadmin을 사용하게 하려면 이걸 사용
sudo apt install pgadmin4-desktop

# pgadmin을 web에서 사용할 수 있게 해주는 명령어 - 브라우저에서 여러 사용자가 사용할 수 있게 하려면 이걸 사용 
sudo apt install pgadmin4-web 
 
-> 일단 desktop으로 운영하고 숙달 후 데이터베이스 관리자가 많아질것 같으면 web으로 전환하자 

# 웹에서 사용할때 필요한 이메일주소와 비밀번호 설정 
sudo /usr/pgadmin4/bin/setup-web.sh

이메일: naxtto@naver.com
비밀번호: bnvs0720bnvssqladmin

# 모든 작업을 마치고 안에 database를 다루려면 

\c bnvs bnvs_db -> 데이터 베이스 안에 들어가기 
\dt -> 현재 보유한 테이블 모두 보기 가능 
postgresql문으로 탐색 저장 가능 

# 주의점 
1. postgres와 장고가 동일선상에서 통화가 가능하니 꼭 둘을 같은 상태로 만들어 놓고 migrations 등등을 한다.
2. 

