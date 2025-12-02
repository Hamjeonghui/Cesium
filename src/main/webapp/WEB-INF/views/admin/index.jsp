<%--
  Created by IntelliJ IDEA.
  User: wizai
  Date: 2024-12-06
  Time: 오전 11:24
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>관리자</title>

    <link href="/js/Cesium-1.110/Build/Cesium/Widgets/widgets.css" rel="stylesheet" type="text/css">
    <link href="/css/main.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="/js/jquery-3.7.1/jquery-3.7.1.min.js"></script>
    <script type="text/javascript" src="/js/Cesium-1.110/Build/Cesium/Cesium.js"></script>
</head>
<body>
<div class="legend">
    <span>(kt)</span>
    <div class="legend-item"><div class="color-box" style="background-color: #333333;"></div><span>90</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #FF0000;"></div><span>88</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #FC0019;"></div><span>86</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #F9003F;"></div><span>84</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #F5006B;"></div><span>82</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #EF00A2;"></div><span>80</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #7F00BF;"></div><span>78</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #8700CE;"></div><span>76</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #9200E4;"></div><span>74</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #A000F7;"></div><span>72</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #AD07FF;"></div><span>70</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #B722FF;"></div><span>68</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #C23EFF;"></div><span>66</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #CD61FF;"></div><span>64</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #DA87FF;"></div><span>62</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #E5ACFF;"></div><span>60</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #BF0000;"></div><span>58</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #C80000;"></div><span>56</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #D50000;"></div><span>54</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #E30000;"></div><span>52</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #EE0B0B;"></div><span>50</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #F32121;"></div><span>48</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #F63E3E;"></div><span>46</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #F86060;"></div><span>44</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #FA8585;"></div><span>42</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #FCABAB;"></div><span>40</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #008000;"></div><span>38</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #008E00;"></div><span>36</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #00A400;"></div><span>34</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #00BD00;"></div><span>32</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #00D500;"></div><span>30</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #08E908;"></div><span>28</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #1EF31E;"></div><span>26</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #40F940;"></div><span>24</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #69FC69;"></div><span>22</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #96FE96;"></div><span>20</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #0077B3;"></div><span>18</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #0080C4;"></div><span>16</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #008DDE;"></div><span>14</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #009DF6;"></div><span>12</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #07ABFF;"></div><span>10</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #1FB5FF;"></div><span>8</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #3EC1FF;"></div><span>6</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #61CDFF;"></div><span>4</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #87D9FF;"></div><span>2</span></div>
    <div class="legend-item"><div class="color-box" style="background-color: #ACE5FF;"></div><span>0</span></div>
</div>

<div id="filter-container">
<div class="toggle-button"><img src="/img/toggle-arrow.png"></div>
    <div id="device-filter">
        <strong>장비</strong><br>
        <button type="button" class="check-all" data-option="device" data-value="true">전체 선택</button>
        <button type="button" class="check-all" data-option="device" data-value="false">전체 해제</button><br>
        <label><input type="checkbox" class="filter-device" data-device="amos" checked> AMOS</label><br>
        <label><input type="checkbox" class="filter-device" data-device="llwas" checked> LLWAS</label><br>
        <label><input type="checkbox" class="filter-device" data-device="lidar" checked> LIDAR</label><br>
        <label><input type="checkbox" class="filter-device" data-device="wpr" checked> WINDPROFILER</label>
    </div>

    <!-- ✅ 고도 필터 -->
    <div id="altitude-filter" style="margin-top:10px;">
        <strong>고도</strong><br>
        <button type="button" class="check-all" data-option="alt" data-value="true">전체 선택</button>
        <button type="button" class="check-all" data-option="alt" data-value="false">전체 해제</button><br>
        <label><input type="checkbox" class="filter-alt" data-alt="0" checked> GROUND</label><br>
        <label><input type="checkbox" class="filter-alt" data-alt="300" checked> 300 ft</label><br>
        <label><input type="checkbox" class="filter-alt" data-alt="600" checked> 600 ft</label>
        <label><input type="checkbox" class="filter-alt" data-alt="900" checked> 900 ft</label>
        <label><input type="checkbox" class="filter-alt" data-alt="1200" checked> 1200 ft</label>
        <label><input type="checkbox" class="filter-alt" data-alt="1500" checked> 1500 ft</label>
    </div>

    <div id="arrow-mode-filter" style="margin-top:10px;">
        <strong>화살표</strong><br>
        <label><input type="radio" name="arrowMode" value="0"> 없음</label>
        <label><input type="radio" name="arrowMode" value="1" checked> 풍향</label>
        <label><input type="radio" name="arrowMode" value="2"> 풍향+풍속</label>
    </div>

    <div id="box-filter" style="margin-top:10px;">
        <strong>박스</strong><br>
        <label><input type="radio" name="box" value="0"> 없음</label>
        <label><input type="radio" name="box" value="1" checked> 표출</label>
    </div>

    <div id="model-filter" style="margin-top:10px;">
        <strong>3D 모델</strong><br>
        <button type="button" class="check-all" data-option="model" data-value="true">전체 선택</button>
        <button type="button" class="check-all" data-option="model" data-value="false">전체 해제</button><br>
        <label><input type="checkbox" class="filter-model" data-model="AMOS">AMOS</label>
        <label><input type="checkbox" class="filter-model" data-model="LLWAS">LLWAS</label>
        <label><input type="checkbox" class="filter-model" data-model="LIDAR">LIDAR</label>
        <label><input type="checkbox" class="filter-model" data-model="WPR">windprofiler</label>
    </div>

    <div id="guide-filter" style="margin-top:10px;">
        <strong>가이드 라인</strong><br>
        <label><input type="radio" name="guide" value="0" checked> 없음</label>
        <label><input type="radio" name="guide" value="1"> 표출</label>
    </div>

    <div id="opacity-controls" style="margin-top:10px;">
        <strong>불투명도</strong><br>
        <label id="box-opacity">
            박스:
            <input type="range" class="opacity-control" data-type="box" min="0" max="1" step="0.05" value="0.6">
            <span class="opacity-value">0.6</span>
        </label>
        <br>
        <label id="arrow-opacity">
            화살표:
            <input type="range" class="opacity-control" data-type="arrow" min="0" max="1" step="0.05" value="0.8">
            <span class="opacity-value">0.8</span>
        </label>
    </div>
</div>

<div id="tooltip" class="cesium-tooltip" style="display: none;">
    <div class="tooltip-close">×</div>
    <div id="tooltip-content">content</div>
</div>

    <div id="cesiumContainer"></div>

<script type="module" src="/js/Performance.js"></script>

</body>
</html>
