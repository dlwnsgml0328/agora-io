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

## token update

현재 사용되고 있는 토큰은 각 콘솔에서 갱신하거나, [아고라 토큰 빌더](https://webdemo.agora.io/token-builder/)를 통해 생성해주고 있다. 토큰을 자동 갱신하기 위해서는 서버와의 연동 및 DB에 저장하는 작업이 필요하기 때문에 프로토타입을 만들 때 까지 토큰을 각 환경에서 갱신한 이후 사용해야 한다.

기본적으로 `XXX_ID` 로 분류되는 `appID` 와 아고라 토큰 빌더에 들어가는 `appCertificate` 또한 변경되지 않는다. 각 기능에 들어가는 토큰은 `uid`(우리가 만든 임시 사용자 이름) 에 맞춰 갱신되며, 24시간 동안 유효하다. 만료시 콘솔창에서 `dynamic keys are expired` 와 같은 에러를 뱉으므로 만료되기 전 또는 만료된 이후 이를 업데이트하면 된다.

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