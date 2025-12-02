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
    <title>Wind JS + Leaflet Example</title>
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
    // 지도 초기화
    const map = L.map('map').setView([37.5665, 126.9780], 4); // 서울 기준

    // 타일 레이어
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 바람 데이터 불러오기
    fetch('/data/windy/wind.json')
        .then(res => res.json())
        .then(windData => {
            const velocityLayer = L.velocityLayer({
                displayValues: true,
                displayOptions: {
                    velocityType: 'Global Wind',
                    position: 'bottomleft',
                    emptyString: 'No wind data',
                    angleConvention: 'bearingCW',
                    speedUnit: 'm/s'
                },
                data: windData,
                maxVelocity: 15,
                velocityScale: 0.005, // 입자 이동 속도 스케일
                particleAge: 60       // 입자 생존 시간
            });
            velocityLayer.addTo(map);
        })
        .catch(err => console.error('wind data load error:', err));
</script>
</body>
</html>
