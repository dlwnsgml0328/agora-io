# how to start

### 1.노드 모듈 설치
```
$ yarn
```

### 2.환경 변수 복사하기

```
# copy config template to agora-classroom-sdk project
$ cp .env.example .env
```

### 3. 환경 변수에 맞는 아고라 콘솔 만들기

```
REACT_APP_APP_ID=
REACT_APP_CHANNEL=test_eazel
REACT_APP_TOKEN=

REACT_APP_LIVE_CHANNEL=test_eazel
REACT_APP_LIVE_TOKEN=

REACT_APP_LIVE_ID=
REACT_APP_LIVE_TEACHER=
REACT_APP_LIVE_STU1=
REACT_APP_LIVE_STU2=

REACT_APP_RTM_ID=
REACT_APP_USER_A=
REACT_APP_USER_B=
REACT_APP_USER_C=
```

### 1. REACT_APP_APP_ID

- RTC (Real Time Communication)
- stage: Testing

### 2. REACT_APP_LIVE_ID

- Interactive Live Streaming
- stage: Live

- REACT_APP_LIVE_TEACHER : teacher
- REACT_APP_LIVE_STU1 : stu1
- REACT_APP_LIVE_STU2 : stu2


### 3. REACT_APP_RTM_ID

- RTM (Real Time Messaging)
- stage: Live

- REACT_APP_USER_A : 0328
- REACT_APP_USER_B : 1796
- REACT_APP_USER_C : 9170