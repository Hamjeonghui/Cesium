<%--
  Created by IntelliJ IDEA.
  User: wizai
  Date: 2024-12-06
  Time: 오전 11:24
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>leaflet-velovity</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-velocity/dist/leaflet-velocity.min.js"></script>

    <style>
        html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
<div id="map"></div>

<script>
    // 남한전역 랜덤 값 생성 함수
    function generateKoreaWideWindData(step = 0.5) {
        const latStart = 33.0;
        const latEnd = 38.5;
        const lonStart = 124.5;
        const lonEnd = 131.5;

        const data = [];

        for (let lat = latStart; lat <= latEnd; lat += step) {
            for (let lon = lonStart; lon <= lonEnd; lon += step) {
                const ws = +(Math.random() * 10 + 1).toFixed(1);  // 1~11 m/s
                const wd = Math.floor(Math.random() * 360);       // 0~359 도
                data.push({ lat: +lat.toFixed(2), lon: +lon.toFixed(2), ws, wd });
            }
        }

        return data;
    }

    // 예시 사용
    const data = generateKoreaWideWindData(); // ← 전국 격자 샘플

    /**
     * 좌표 기반 바람 데이터 -> GRIB2 스타일 JSON 변환
     * @param {Array} points - { lat, lon, ws, wd } 형식의 배열
     * @returns {Array} GRIB2 스타일 [{header, data}, {header, data}]
     */
    function convertPointsToWindData(points) {
        // 위도/경도 정렬
        const uniqueLats = [...new Set(points.map(p => p.lat))].sort((a, b) => b - a); // 북→남
        const uniqueLons = [...new Set(points.map(p => p.lon))].sort((a, b) => a - b); // 서→동
        const nx = uniqueLons.length;
        const ny = uniqueLats.length;

        const latIdx = Object.fromEntries(uniqueLats.map((v, i) => [v, i]));
        const lonIdx = Object.fromEntries(uniqueLons.map((v, i) => [v, i]));

        // 빈 그리드 생성
        const uGrid = Array(ny * nx).fill(0);
        const vGrid = Array(ny * nx).fill(0);

        // 포인트 데이터를 격자에 할당
        points.forEach(({ lat, lon, ws, wd }) => {
            const i = latIdx[lat];
            const j = lonIdx[lon];
            const idx = i * nx + j;

            // 풍향(wd) → 수학각도(rad) 변환 (북쪽 기준, 시계방향)
            const rad = (270 - wd) * Math.PI / 180;
            const u = ws * Math.cos(rad);
            const v = ws * Math.sin(rad);

            uGrid[idx] = parseFloat(u.toFixed(2));
            vGrid[idx] = parseFloat(v.toFixed(2));
        });

        // 헤더 정보 공통 부분
        const baseHeader = {
            nx, // 그리드의 x방향 점 개수 (경도 방향 개수)
            ny, // 그리드의 y방향 점 개수 (위도 방향 개수)

            lo1: Math.min(...uniqueLons), // 시작 경도 (서쪽 끝 지점)
            la1: Math.max(...uniqueLats), // 시작 위도 (북쪽 끝 지점) ← Y축은 위에서 아래로 (북→남)

            lo2: Math.max(...uniqueLons), // 끝 경도 (동쪽 끝 지점)
            la2: Math.min(...uniqueLats), // 끝 위도 (남쪽 끝 지점)

            dx: nx > 1 ? +(uniqueLons[1] - uniqueLons[0]).toFixed(3) : 0.1, // 경도 간격 (도 단위)
            dy: ny > 1 ? +(uniqueLats[0] - uniqueLats[1]).toFixed(3) : 0.1, // 위도 간격 (도 단위)

            parameterCategory: 2, // GRIB2 기준: 2 = Momentum (풍속 관련)
            parameterUnit: 'm.s-1', // 단위: 미터/초 (풍속 단위)

            forecastTime: 0, // 예측 시간 (0 = 분석 시점 데이터)
            refTime: new Date().toISOString(), // 기준 시각 (예측 시작 기준 시점, ISO8601 형식)

            scanMode: 0 // 데이터 스캔 방향 (0 = 위에서 아래, 왼→오 방향 기준)
        };


        // 최종 변환 결과
        const result = [
            {
                header: {
                    ...baseHeader,                 // 공통 메타데이터 (nx, ny, 좌표, 단위 등)
                    parameterNumber: 2,           // GRIB2 기준: 2 = U 성분 (동서 방향 풍속)
                    parameterNumberName: 'U-component_of_wind' // 설명용(필수는 아님)
                },
                data: uGrid // u 성분 값 배열 (nx * ny 크기, 행 우선 1D 배열)
            },
            {
                header: {
                    ...baseHeader,
                    parameterNumber: 3,           // GRIB2 기준: 3 = V 성분 (남북 방향 풍속)
                    parameterNumberName: 'V-component_of_wind'
                },
                data: vGrid // v 성분 값 배열 (nx * ny 크기)
            }
        ];


        return result;
    }

    console.log(JSON.stringify(convertPointsToWindData(data)))

    //=================================================================================

    // 지도 초기화
    const map = L.map('map').setView([37.5665, 126.9780], 7); // 서울 기준

    // 타일 레이어
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const velocityLayer = L.velocityLayer({
        data: convertPointsToWindData(data),
        displayValues: true,
        maxVelocity: 15,
        velocityScale: 0.01,  // 입자 이동 속도 스케일
        particleAge: 60,      // 입자 생존 시간
        opacity: 0.95,        // 불투명도
        lineWidth: 1.5,         // 선 두께
        particleMultiplier: 0.02, // = 1/50 (쫀쫀하게!)
        displayOptions: {
            velocityType: 'Global Wind',
            position: 'bottomleft',
            emptyString: 'No wind data',
            angleConvention: 'bearingCW',
            speedUnit: 'm/s'
        },
        // 풍향별 색상 자동 매핑됨
        colorScale: [
            "#e0f3f8", // 0~2 m/s
            "#abd9e9", // 2~4 m/s
            "#74add1", // 4~6m/s
            "#4575b4", // 6~8m/s
            "#ffffbf", // 8~10 m/s
            "#fee090", // 10~12 m/s
            "#fdae61", // 12~14 m/s
            "#f46d43", // 14~16 m/s
            "#d73027", // 16~18 m/s
            "#a50026"  // 18~20 m/s
        ],
        minVelocity: 0, //최소풍향
        maxVelocity: 20 //최대풍향
    });
    velocityLayer.addTo(map);

</script>
</body>
</html>
